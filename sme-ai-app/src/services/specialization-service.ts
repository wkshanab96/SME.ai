/**
 * Service for managing engineering specialization folders and authorization memory
 */

interface FolderReference {
  id: string;
  name: string;
  path: string;
  serviceId: string; // The cloud service ID (google-drive, onedrive, etc.)
  lastUsed: string; // ISO date string
}

class SpecializationService {
  private static instance: SpecializationService;
  private _isRememberEnabled: boolean = true;
  private readonly STORAGE_KEY = 'sme-ai-specialization-folders';
  private readonly REMEMBER_PREF_KEY = 'rememberSpecialization';
  
  private constructor() {
    this.loadRememberPreference();
  }
  
  /**
   * Get singleton instance
   */
  public static getInstance(): SpecializationService {
    if (!SpecializationService.instance) {
      SpecializationService.instance = new SpecializationService();
    }
    return SpecializationService.instance;
  }
  
  /**
   * Load remember preference from localStorage
   */
  private loadRememberPreference(): void {
    if (typeof window === 'undefined') return;
    
    try {
      const savedPref = localStorage.getItem(this.REMEMBER_PREF_KEY);
      if (savedPref !== null) {
        this._isRememberEnabled = savedPref === 'true';
      }
    } catch (error) {
      console.error('Failed to load specialization folder preferences:', error);
    }
  }
  
  /**
   * Get if remembering specialization folders is enabled
   */
  public get isRememberEnabled(): boolean {
    return this._isRememberEnabled;
  }
  
  /**
   * Set whether to remember specialization folders
   */
  public setRememberEnabled(enabled: boolean): void {
    this._isRememberEnabled = enabled;
    
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(this.REMEMBER_PREF_KEY, String(enabled));
      
      // If disabling, clear stored folders
      if (!enabled) {
        this.clearStoredFolders();
      }
    } catch (error) {
      console.error('Failed to save specialization folder preferences:', error);
    }
  }
  
  /**
   * Get all remembered folders
   */
  public getStoredFolders(): FolderReference[] {
    if (!this._isRememberEnabled || typeof window === 'undefined') {
      return [];
    }
    
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to retrieve stored specialization folders:', error);
    }
    
    return [];
  }
  
  /**
   * Add a folder to remembered specializations
   */
  public addFolder(folder: Omit<FolderReference, 'lastUsed'>): boolean {
    if (!this._isRememberEnabled || typeof window === 'undefined') {
      return false;
    }
    
    try {
      const folders = this.getStoredFolders();
      
      // Check if folder already exists
      const existingIndex = folders.findIndex(f => f.id === folder.id);
      
      const newFolder: FolderReference = {
        ...folder,
        lastUsed: new Date().toISOString()
      };
      
      // Replace if exists, otherwise add
      if (existingIndex >= 0) {
        folders[existingIndex] = newFolder;
      } else {
        folders.push(newFolder);
      }
      
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(folders));
      return true;
    } catch (error) {
      console.error('Failed to save specialization folder:', error);
      return false;
    }
  }
  
  /**
   * Remove a folder from remembered specializations
   */
  public removeFolder(folderId: string): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    
    try {
      let folders = this.getStoredFolders();
      folders = folders.filter(f => f.id !== folderId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(folders));
      return true;
    } catch (error) {
      console.error('Failed to remove specialization folder:', error);
      return false;
    }
  }
  
  /**
   * Clear all stored folders
   */
  public clearStoredFolders(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }
    
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Failed to clear specialization folders:', error);
      return false;
    }
  }
  
  /**
   * Update the last used timestamp for a folder
   */
  public updateFolderUsage(folderId: string): boolean {
    if (!this._isRememberEnabled || typeof window === 'undefined') {
      return false;
    }
    
    try {
      const folders = this.getStoredFolders();
      const folderIndex = folders.findIndex(f => f.id === folderId);
      
      if (folderIndex >= 0) {
        folders[folderIndex].lastUsed = new Date().toISOString();
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(folders));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Failed to update specialization folder usage:', error);
      return false;
    }
  }
  
  /**
   * Get recently used folders
   */
  public getRecentFolders(limit: number = 5): FolderReference[] {
    const folders = this.getStoredFolders();
    
    // Sort by lastUsed timestamp (newest first) and take the specified limit
    return folders
      .sort((a, b) => new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime())
      .slice(0, limit);
  }
}

export default SpecializationService.getInstance();