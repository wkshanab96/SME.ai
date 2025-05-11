import { doc, collection, setDoc, getDoc, getDocs, query, where, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { ProjectData } from '@/components/projects/ProjectCreationModal';

export interface KnowledgeFile {
  fileId: string;
  projectId: string;
  userId: string;
  fileName: string;
  storagePath: string;
  fileType: string;
  sizeBytes: number;
  uploadedAt: Date;
  indexingStatus: 'pending' | 'parsing' | 'embedding' | 'indexing' | 'completed' | 'failed';
  lastIndexedAt?: Date;
  errorMessage?: string;
  chunkCount?: number;
  downloadUrl?: string;
}

export interface Project {
  projectId: string;
  name: string;
  description?: string;
  instructions?: string;
  ownerUid: string;
  createdAt: Date;
  qdrantIndexName?: string;
  knowledgeFiles?: KnowledgeFile[];
}

// Project Service
export const ProjectService = {
  
  // Create a new project
  async createProject(userId: string, projectData: ProjectData): Promise<Project> {
    try {
      // Create project document in Firestore
      const projectRef = doc(collection(db, 'projects'));
      const projectId = projectRef.id;
      
      // Generate a unique Qdrant index name for this project
      const qdrantIndexName = `proj_${projectId}`;
      
      const projectDoc = {
        projectId,
        name: projectData.name,
        description: projectData.description || '',
        instructions: projectData.instructions || '',
        ownerUid: userId,
        createdAt: serverTimestamp(),
        qdrantIndexName
      };
      
      await setDoc(projectRef, projectDoc);
      
      // Upload files if any
      if (projectData.files && projectData.files.length > 0) {
        await Promise.all(
          projectData.files.map(file => this.uploadKnowledgeFile(userId, projectId, file))
        );
      }
      
      // Return the created project with a JavaScript Date
      return {
        ...projectDoc,
        createdAt: new Date(),
      };
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  },
  
  // Upload a knowledge file for a project
  async uploadKnowledgeFile(userId: string, projectId: string, file: File): Promise<KnowledgeFile> {
    try {
      // Create a reference to the file in Firebase Storage
      const storagePath = `projects/${projectId}/knowledge-files/${file.name}`;
      const storageRef = ref(storage, storagePath);
      
      // Upload the file to Firebase Storage
      await uploadBytes(storageRef, file);
      
      // Get download URL (for future use)
      const downloadUrl = await getDownloadURL(storageRef);
      
      // Create a document in the knowledgeFiles collection
      const fileDoc = doc(collection(db, 'knowledgeFiles'));
      const fileId = fileDoc.id;
      
      const knowledgeFile: Omit<KnowledgeFile, 'fileId'> = {
        projectId,
        userId,
        fileName: file.name,
        storagePath,
        fileType: file.type,
        sizeBytes: file.size,
        uploadedAt: new Date(),
        indexingStatus: 'pending',
        downloadUrl
      };
      
      await setDoc(fileDoc, {
        ...knowledgeFile,
        fileId,
        uploadedAt: serverTimestamp()
      });
      
      return {
        ...knowledgeFile,
        fileId
      };
    } catch (error) {
      console.error('Failed to upload knowledge file:', error);
      throw error;
    }
  },
  
  // Get a project by ID
  async getProject(projectId: string): Promise<Project | null> {
    try {
      const projectDoc = await getDoc(doc(db, 'projects', projectId));
      
      if (!projectDoc.exists()) {
        return null;
      }
      
      const projectData = projectDoc.data();
      
      // Get knowledge files for this project
      const knowledgeFiles = await this.getProjectFiles(projectId);
      
      return {
        ...projectData,
        projectId,
        createdAt: projectData.createdAt?.toDate() || new Date(),
        knowledgeFiles
      } as Project;
    } catch (error) {
      console.error('Failed to get project:', error);
      throw error;
    }
  },
  
  // Get all projects for a user
  async getUserProjects(userId: string): Promise<Project[]> {
    try {
      const projectsQuery = query(
        collection(db, 'projects'),
        where('ownerUid', '==', userId)
      );
      
      const snapshot = await getDocs(projectsQuery);
      
      return Promise.all(
        snapshot.docs.map(async (doc) => {
          const projectData = doc.data();
          const projectId = doc.id;
          
          // Get knowledge files for this project
          const knowledgeFiles = await this.getProjectFiles(projectId);
          
          return {
            ...projectData,
            projectId,
            createdAt: projectData.createdAt?.toDate() || new Date(),
            knowledgeFiles
          } as Project;
        })
      );
    } catch (error) {
      console.error('Failed to get user projects:', error);
      throw error;
    }
  },
  
  // Get files for a project
  async getProjectFiles(projectId: string): Promise<KnowledgeFile[]> {
    try {
      const filesQuery = query(
        collection(db, 'knowledgeFiles'),
        where('projectId', '==', projectId)
      );
      
      const snapshot = await getDocs(filesQuery);
      
      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          fileId: doc.id,
          uploadedAt: data.uploadedAt?.toDate() || new Date(),
          lastIndexedAt: data.lastIndexedAt?.toDate(),
        } as KnowledgeFile;
      });
    } catch (error) {
      console.error('Failed to get project files:', error);
      throw error;
    }
  },
  
  // Delete a knowledge file
  async deleteKnowledgeFile(fileId: string): Promise<void> {
    try {
      // Get the file document
      const fileDoc = await getDoc(doc(db, 'knowledgeFiles', fileId));
      
      if (!fileDoc.exists()) {
        throw new Error('File not found');
      }
      
      const fileData = fileDoc.data();
      const storagePath = fileData.storagePath;
      
      // Delete the file from Storage
      await deleteObject(ref(storage, storagePath));
      
      // Delete the file document from Firestore
      await deleteDoc(doc(db, 'knowledgeFiles', fileId));
    } catch (error) {
      console.error('Failed to delete knowledge file:', error);
      throw error;
    }
  },
  
  // Delete a project and all its files
  async deleteProject(projectId: string): Promise<void> {
    try {
      // Get all files for this project
      const files = await this.getProjectFiles(projectId);
      
      // Delete all files first
      await Promise.all(
        files.map(file => this.deleteKnowledgeFile(file.fileId))
      );
      
      // Delete the project document
      await deleteDoc(doc(db, 'projects', projectId));
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  },
  
  // Update a project
  async updateProject(projectId: string, updates: Partial<Pick<Project, 'name' | 'description' | 'instructions'>>): Promise<void> {
    try {
      await setDoc(
        doc(db, 'projects', projectId),
        updates,
        { merge: true }
      );
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  }
};

export default ProjectService;