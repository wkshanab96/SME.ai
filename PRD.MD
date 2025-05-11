# Product Requirements Document: SME.AI

**Version:** 1.0
**Date:** May 1, 2025
**Author:** AI Assistant (based on user specifications)
**Status:** Draft

**Table of Contents:**

1.  [Introduction & Overview](#1-introduction--overview)
2.  [Goals & Objectives](#2-goals--objectives)
3.  [Target Audience](#3-target-audience)
4.  [Design & Branding Guidelines](#4-design--branding-guidelines)
5.  [Functional Requirements](#5-functional-requirements)
    *   5.1 [Landing Page](#51-landing-page)
    *   5.2 [Authentication (Sign Up & Sign In)](#52-authentication-sign-up--sign-in)
    *   5.3 [Main Application Interface (Chat View)](#53-main-application-interface-chat-view)
    *   5.4 [Left Navigation Panel](#54-left-navigation-panel)
    *   5.5 [Chat Functionality](#55-chat-functionality)
    *   5.6 [Project Management](#56-project-management)
    *   5.7 [Cloud Storage Integration](#57-cloud-storage-integration)
    *   5.8 [AI Assistant Capabilities](#58-ai-assistant-capabilities)
    *   5.9 [Document Generation](#59-document-generation)
    *   5.10 [Attachments & Multimodal Capabilities](#510-attachments--multimodal-capabilities)
    *   5.11 [User Profile & Settings](#511-user-profile--settings)
6.  [AI System Architecture & Logic](#6-ai-system-architecture--logic)
    *   6.1 [Core Strategy: RAG](#61-core-strategy-rag)
    *   6.2 [Vector Databases](#62-vector-databases-qdrant)
    *   6.3 [Query Orchestration & Context Building](#63-query-orchestration--context-building-agent-logic)
    *   6.4 [Data Indexing](#64-data-indexing)
7.  [Database Design (Firestore)](#7-database-design-firestore)
    *   7.1 [Collections](#71-collections)
    *   7.2 [Relationships](#72-relationships)
8.  [Technology Stack](#8-technology-stack)
9.  [Non-Functional Requirements](#9-non-functional-requirements)
    *   9.1 [Performance](#91-performance)
    *   9.2 [Scalability](#92-scalability)
    *   9.3 [Security Requirements](#93-security-requirements)
    *   9.4 [Usability](#94-usability)
    *   9.5 [Reliability](#95-reliability)
    *   9.6 [Error Handling Strategy](#96-error-handling-strategy)
    *   9.7 [Data Retention Policy](#97-data-retention-policy)
10. [Future Considerations / Out of Scope (for V1)](#10-future-considerations--out-of-scope-for-v1)
11. [Open Questions](#11-open-questions)

---

## 1. Introduction & Overview

SME.AI is a specialized AI assistant designed for engineers working in Maintenance, Reliability, Capital Projects, and Operations within process-intensive industries like Chemical, Petrochemical, Oil & Gas, Pulp & Paper, Power Generation, Mining, etc. The application aims to enhance engineering efficiency by providing rapid, context-aware access to technical information, including industry codes & standards, process knowledge, and the user's own project documents stored in the cloud. SME.AI leverages advanced AI, specifically Retrieval-Augmented Generation (RAG), combined with user-specific data to deliver accurate and relevant assistance.

## 2. Goals & Objectives

*   **Improve Engineer Productivity:** Reduce time spent searching for information.
*   **Enhance Decision Making:** Provide quick access to relevant standards, procedures, and project data.
*   **Increase Knowledge Accessibility:** Break down information silos by integrating public/licensed knowledge with private user data.
*   **Support Compliance:** Facilitate easy lookup and verification against relevant codes and standards.
*   **Capture & Retain Knowledge:** Act as a repository for project-specific information and learned insights.
*   **Provide a Seamless User Experience:** Offer an intuitive, modern interface tailored to engineer workflows.
*   **Maintain High Security Standards:** Ensure user data confidentiality, integrity, and availability.

## 3. Target Audience

*   Maintenance Engineers
*   Reliability Engineers
*   Capital Projects Engineers
*   Operations Engineers
*   Process Engineers
*   Process Control / Automation Engineers
*   Engineering Managers
*   (Primarily within Chemical, Petrochemical, Oil & Gas, Pulp & Paper, Power & Energy, Water Treatment, Mining, Food & Beverage, Construction Equipment sectors)

## 4. Design & Branding Guidelines

*   **Overall Style:** Modern, minimalistic, futuristic feel. Clean lines, intuitive layout.
*   **Color Palette:**
    *   Primary: Blue (e.g., `#4F46E5` - Indigo 600)
    *   Secondary: Purple (e.g., `#7C3AED` - Violet 600)
    *   Accent/Neutral: White (`#FFFFFF`), Light Grays (e.g., `#F3F4F6`), Dark Grays/Near Black for Dark Mode (e.g., `#111827`)
*   **Typography:**
    *   Font Family: **Helvetica Neue** (ensure web font availability/licensing)
    *   Headers (H1, H2, etc.): Use **Gradient Text** starting Blue (`#4F46E5`) transitioning to Purple (`#7C3AED`). Font weight typically Medium or Bold.
    *   Paragraphs / Body Text: Helvetica Neue, **Thin** weight. Use appropriate contrast colors (e.g., dark gray on white, light gray on dark).
    *   Input Field Text: **Black** (`#000000`) or very dark gray, **Ultra Thin** weight (or Light/Regular if Ultra Thin impacts readability too much). Placeholder text should be lighter gray.
*   **Layout:** Generally spacious, avoiding clutter. Leverage whitespace effectively.
*   **Animations:** Subtle animations for user feedback (e.g., button clicks, loading states, panel transitions, chat box movement) using the Blue/Purple theme where appropriate (e.g., loading spinners, focus outlines).

## 5. Functional Requirements

### 5.1 Landing Page

*   **Purpose:** Introduce SME.AI, attract sign-ups.
*   **Content:**
    *   Compelling Headline & Value Proposition.
    *   Product Description: What SME.AI does, key features (AI assistance, code lookup, cloud integration, project context).
    *   Target Industries/Audience.
    *   Company Goals & Values (briefly).
    *   Application Pricing Tiers (clear feature comparison).
    *   Call-to-Action (CTA) buttons (e.g., "Sign Up Free", "Request Demo", "Learn More").
    *   Visuals: Screenshots or mockups of the application.
    *   Testimonials (optional, future).
    *   Standard Footer (Copyright, Privacy Policy, Terms of Service links).
*   **Design:** Adhere to branding guidelines (colors, fonts, style).

### 5.2 Authentication (Sign Up & Sign In)

*   **Technology:** Firebase Authentication.
*   **Sign Up Page (Multi-step):**
    *   **Step 1: User Details**
        *   Input Fields: First Name, Last Name, Company, Role (Dropdown or free text?), Business Email, Business Phone Number (optional?), Password, Confirm Password.
        *   Password complexity requirements enforced (e.g., min length, uppercase, lowercase, number, symbol). Visual strength indicator.
        *   Checkbox: "I agree to the Terms of Service and Privacy Policy" (linked). Required.
        *   Button: "Next". Enabled only when all required fields are valid and checkbox is ticked.
    *   **Step 2: Industry Selection**
        *   Display list of industries (checkboxes for multi-select):
            *   Chemical Manufacturer
            *   Pulp, Paper and Forest Products
            *   Power and Energy
            *   Oil and Gas
            *   Water and Wastewater Treatment
            *   Mining
            *   Food and Beverage
            *   Construction Equipment
            *   Other (Optional free text)
        *   Button: "Register" / "Complete Sign Up".
    *   **Logic:**
        *   Validate email format.
        *   Securely hash password using industry-standard algorithms (handled by Firebase Auth).
        *   On successful registration, create user record in Firestore and authenticate the user. Redirect to the main application.
        *   Enforce email verification via link sent to the user's email. User cannot fully access the application until verified.
*   **Sign In Page:**
    *   Input Fields: Business Email, Password.
    *   Link: "Forgot Password?".
    *   Button: "Sign In".
    *   Option: Sign in with Google (or other providers if configured in Firebase).
    *   Implement rate limiting and account lockout mechanisms after multiple failed login attempts.
    *   **Logic:** Authenticate using Firebase Auth. On success, redirect to the main application. Handle incorrect credentials, locked accounts, unverified email states appropriately.
*   **Password Reset:** Standard secure Firebase password reset flow via email with expiring tokens.

### 5.3 Main Application Interface (Chat View)

*   **Layout:** ChatGPT-like interface.
    *   **Left:** Stretchable/Collapsible Navigation Panel.
    *   **Center/Right:** Main Chat Area.
*   **Chat Area:**
    *   Displays conversation history (user prompts and AI responses).
    *   Starts with a welcome message or prompt suggestions.
    *   Chat Input Box at the bottom (initially centered vertically on an empty page, moves down upon first message).

### 5.4 Left Navigation Panel (global)

*   **Style:** Collapsible sidebar. Tree view for nested items.
*   **Sections (Top to Bottom):**
    *   **Projects:**
        *   Collapsible header "Projects".
        *   Action: "+ New Project" (opens pop-up).
        *   Tree view list of user's existing projects by "Project Name". Clicking selects the project and loads its context/chat.
    *   **Chats:**
        *   Collapsible header "Chats".
        *   Tree view list of recent/historical standalone chats (not tied to a specific project). Clicking opens the chat history.
    *   **Cloud Connection:**
        *   Collapsible header "Cloud Connection".
        *   Displays icons/names of connected services (OneDrive, Google Drive, Dropbox).
        *   Action: Button/Link to "Connect New Cloud Account" (initiates OAuth flow).
        *   Action: Button/Link to "Manage Connections" (leads to a settings page or modal for managing folders and disconnecting accounts).
    *   **Bottom Section:**
        *   User Profile (Avatar/Name - clickable to go to Settings).
        *   Settings (Icon/Link).
        *   Logout (Icon/Link).

### 5.5 Chat Functionality

*   **Input Area (Bottom of Chat):**
    *   **Text Input:** Multi-line text area for typing prompts ("Ask anything...").
    *   **Control Buttons/Dropdowns:**
        *   **Button:** "Use the internet" (Toggle: Active/Inactive state visually distinct). **Default: Inactive.**
        *   **Button:** "Use the cloud" (Toggle: Active/Inactive state visually distinct). Requires at least one cloud account connected and configured. **Default: Inactive.**
        *   **Dropdown 1:** "Assistance specialty" - Options: General, Electrical, Mechanical, Process, Process Control, Project Engineering. Default "General".
        *   **Dropdown 2:** "Create a Document" - Options: Word, PowerPoint, Excel. (Triggers specific AI generation flow).
        *   **Dropdown 3/Button:** "Attachment" - Options: Upload Image, Upload Local File, Attach from Cloud (opens file picker for connected clouds).
    *   **Send Button:** Icon (e.g., paper plane).
    *   **Voice Input Button:** Microphone icon (Optional V1.x feature, requires speech-to-text integration).
*   **Chat Interaction:**
    *   User types prompt and hits Send (or Enter).
    *   Input box animates downwards to the bottom of the screen.
    *   A "Thinking..." or animated indicator appears (using Blue/Purple accents).
    *   The AI processes the request (see AI System Architecture).
    *   AI response appears in the chat stream.
    *   User prompts and AI responses are clearly distinguished (e.g., alignment, background color, avatar).
*   **Chat Input Border:** Subtle animation on the border of the text input area when active/focused (e.g., pulsing or flowing gradient with Blue/Purple).
*   **Chat History:** Scrollable display of the current conversation. Ability to copy code snippets or text from responses. Potential for feedback buttons (thumbs up/down) on AI responses to improve future interactions.

### 5.6 Project Management

*   **New Project Creation (+ New Project Pop-Up):**
    *   Triggered from the left panel.
    *   Modal/Pop-up Fields:
        *   Project Name (Required, text input).
        *   Description (Optional, text area).
        *   Instruction (Optional, text area - specific instructions for the AI within this project context, e.g., "Focus on ASME B31.3 compliance", "Always reference document X for specifications").
        *   Knowledge Files (File upload area - drag & drop / browse). Allow multiple file uploads. Show progress indicators.
    *   Button: "Create Project".
    *   **Logic:**
        *   On creation, save project metadata to Firestore (`projects` collection).
        *   Upload Knowledge Files to Firebase Storage (under user/project specific paths).
        *   Trigger asynchronous backend process (e.g., Cloud Function) to index uploaded files into a new, dedicated project-specific index in Qdrant (associate index with project ID). Store file metadata and indexing status in Firestore (`knowledgeFiles` collection). See Error Handling section for indexing failures.
        *   Redirect user to the newly created Project Page view.
*   **Project Page View:**
    *   Accessed by clicking a project name in the left panel or after creating a new project.
    *   **Layout:**
        *   **Top/Center:** Chat interface (similar to main chat, but context is scoped to this project).
        *   **Below Chat:** Chat history specifically for *this project*.
        *   **Right Panel:**
            *   Display: Project Name (editable?).
            *   Display: Description (editable?).
            *   Display: Instruction (editable?).
            *   Display: List of Knowledge Files associated with the project (Name, Status, Upload Date). Allow download/delete. Deleting triggers removal from Storage and Qdrant index.
            *   Action: "+ Add Knowledge Files" button.
    *   **Context:** When chatting within a project, the AI automatically uses the project's instructions and indexed Knowledge Files as primary context, in addition to the selected specialty and other toggles (internet/cloud).

### 5.7 Cloud Storage Integration

*   **Providers:** Google Drive, Microsoft OneDrive, Dropbox.
*   **Connection:**
    *   User initiates connection via the "Cloud Connection" section or dedicated Settings page.
    *   Redirect user through standard OAuth 2.0 authorization flow for each provider, requesting appropriate scopes (e.g., read-only access to files). Clearly explain requested permissions.
    *   Securely store access/refresh tokens associated with the user account using GCP Secret Manager or equivalent secure storage, encrypted at rest. Tokens should be tightly scoped to the user's ID.
    *   Display connected accounts in the left panel and Settings. Allow disconnection (revokes token access and deletes stored tokens).
*   **Folder Selection Mechanism (UX):**
    *   After connecting a cloud account, provide an interface (likely in Settings -> Cloud Connections) for the user to manage access.
    *   Default: No access to files.
    *   Option 1: Allow searching the entire drive (user must explicitly enable this, with clear warnings about scope).
    *   **Option 2 (Preferred):** Provide a modal or dedicated page displaying the user's folder structure from the connected drive (using the provider's API). Allow the user to browse and select specific folders they want SME.AI to be able to search within.
    *   Visually indicate which folders are selected/authorized for searching.
    *   Allow users to add/remove authorized folders at any time.
*   **Usage:**
    *   When the "Use the cloud" toggle is active in the chat input AND the user has connected at least one cloud account AND configured accessible folders/drive access:
        *   The backend uses the user's stored credentials (via Google Cloud Connectors or direct API calls) to search *only within the authorized folders/scope* in the user's connected cloud drives based on the user's prompt.
        *   This retrieved cloud context is added to the prompt sent to the LLM.
        *   Implement robust error handling for API failures or permission issues (see Error Handling section).

### 5.8 AI Assistant Capabilities

*   **Core Engine:** Google Cloud Vertex AI Search and Conversation (RAG Engine) or a custom RAG pipeline using Vertex AI foundational models (Gemini family) and Qdrant.
*   **Knowledge Sources:**
    *   **General Knowledge:** LLM's base training (Gemini 1.5 Pro or latest stable version).
    *   **Internet:** Real-time web search results (if "Use the internet" is active, via Vertex AI Search grounding or similar API).
    *   **Specialized Knowledge:** Curated content (codes, standards, best practices) indexed in agent-specific Qdrant databases (Electrical, Mechanical, etc.). *Requires careful data sourcing, validation, and licensing.*
    *   **Project Knowledge:** User-uploaded "Knowledge Files" indexed in project-specific Qdrant databases.
    *   **Cloud Document Knowledge:** Content retrieved from the user's configured folders within connected cloud storage (if "Use the cloud" is active).
*   **Functionality:**
    *   Answer technical questions based on context.
    *   Explain concepts related to selected specialty.
    *   Interpret and find relevant sections in codes/standards (from indexed data).
    *   Summarize information from provided documents (project or cloud).
    *   Troubleshoot based on symptoms and provided context.
    *   Compare information across different sources (if context allows).
    *   **Multimodal Input:** Analyze and respond to user prompts that include uploaded images (leveraging Gemini 1.5 Pro's capabilities).

### 5.9 Document Generation

*   **Trigger:** Selecting an option from the "Create a Document" dropdown.
*   **Formats:** Word (.docx), PowerPoint (.pptx), Excel (.xlsx).
*   **Logic:**
    *   User provides a prompt (e.g., "Create a PowerPoint presentation outlining the steps for pump alignment based on standard X and my uploaded procedure Y").
    *   The selected document type informs the AI's generation strategy.
    *   The AI uses the relevant context (specialty DB, project files, cloud files, internet) to gather information.
    *   The backend LLM call (Gemini 1.5 Pro) is structured to generate content suitable for the target format (e.g., slide titles and bullet points for PPTX, structured data/tables for XLSX, narrative text/sections for DOCX). Utilize prompt engineering to request structured output (e.g., JSON, Markdown) that can be easily parsed.
    *   Backend service uses libraries (e.g., `python-docx`, `python-pptx`, `openpyxl` on a Python backend service, or equivalent Node.js libraries if using Node.js for this task) to parse the AI's structured output and generate the file in the correct format.
    *   Generated file is made available for download to the user (e.g., via a temporary signed URL from Firebase Storage).

### 5.10 Attachments & Multimodal Capabilities

*   **Trigger:** Using the "Attachment" options.
*   **Types:**
    *   **Image:** Upload image files (jpg, png, webp, etc.).
        *   **AI Model:** Utilize **Gemini 1.5 Pro** (or latest available multimodal model in Vertex AI) to analyze image content as part of the prompt context.
        *   **Cost Implications:** Multimodal queries involving images are typically priced higher than text-only queries. This needs to be factored into usage costs and potential subscription tiers. Clearly communicate potential costs to users if applicable.
        *   **Use Cases:** Understanding diagrams, identifying equipment from photos, interpreting handwritten notes/schematics.
    *   **Local File:** Upload documents directly from the user's computer for *temporary* use in the current chat session or optionally add to the current project's Knowledge Files.
    *   **Cloud:** Browse and select specific files from configured folders in connected Google Drive, OneDrive, or Dropbox accounts to use as context for the immediate query.
*   **Logic:** Attached files/images provide additional context for the immediate AI query. Temporary files might be indexed transiently or passed directly in the prompt if feasible within token limits. Images are processed by the multimodal LLM.

### 5.11 User Profile & Settings

*   **Access:** Via links in the bottom-left panel.
*   **User Profile Page:**
    *   Display/Edit: First Name, Last Name, Company, Role, Phone Number.
    *   Display: Business Email (read-only).
    *   Display: Selected Industry/Industries.
    *   Action: Change Password (requires re-authentication).
*   **Settings Page:**
    *   **Cloud Connections:** Manage connected accounts (Connect new, Disconnect existing, Configure accessible folders - See 5.7).
    *   **Application Preferences:** Theme (Light/Dark mode).
    *   **Notification Settings:** (Future) Email notifications, etc.
    *   **Data Management:**
        *   Export chat history (JSON or CSV format).
        *   View storage usage (Project files).
        *   Option to delete account (triggers data removal process as per policy).
    *   **Subscription & Billing:** (Future) View current plan, manage payment methods, view invoices.
    *   **Security:** View active sessions, enable/disable MFA (if offered via Firebase).
    *   **Help/Support:** Link to documentation/support channels.
    *   **Legal:** Link to Terms of Service / Privacy Policy / Data Processing Agreement.

## 6. AI System Architecture & Logic

### 6.1 Core Strategy: RAG

*   The system primarily relies on Retrieval-Augmented Generation. User prompts are enriched with relevant context retrieved from various sources before being sent to a large language model (LLM) for answer generation.
*   Utilize Google Cloud Vertex AI Search and Conversation, or build a custom pipeline using Vertex AI Agent Builder, LangChain/LlamaIndex, Vertex AI foundational models (Gemini 1.5 Pro family), and Qdrant.

### 6.2 Vector Databases (Qdrant)

*   **Multiple Indexes Required:**
    *   **Agent Specialty Indexes:** Separate Qdrant collections/indexes for each specialty (Electrical, Mechanical, Process, Process Control, Project Engineering). These store vectorized chunks of curated, licensed, or public domain knowledge relevant to that specialty. *Data sourcing, validation, and licensing are critical.* Access control based on user subscription/permissions might be needed.
    *   **Project-Specific Indexes:** A unique Qdrant collection/index created for *each project*. Stores vectorized chunks of the "Knowledge Files" uploaded by the user for that specific project. Ensures strict data isolation between projects, enforced via unique index names tied to project IDs and potentially user IDs in metadata.
    *   **(Optional) Temporary/Session Index:** Might be used for indexing attachments or cloud files transiently for a single query or session, depending on performance and security trade-offs vs. real-time retrieval via Connectors. Must ensure cleanup.

### 6.3 Query Orchestration & Context Building (Agent Logic)

*   **Framework:** Use Vertex AI Agent Builder or frameworks like LangChain/LlamaIndex running on the Node.js backend (or dedicated Python microservices for complex AI tasks).
*   **Workflow per Query:**
    1.  **Receive User Query:** Get text prompt, uploaded images, selected specialty, toggle states (internet, cloud), project context (if applicable).
    2.  **Identify Context Sources:** Based on specialty, project ID, and toggles, determine which knowledge sources are relevant (Specialty DB, Project DB, Cloud Folders, Web).
    3.  **Retrieval Step (Parallel Execution where possible):**
        *   **Vector Search (Specialty):** Query the relevant Agent Specialty index in Qdrant.
        *   **Vector Search (Project):** If in a project context, query the corresponding Project-Specific index in Qdrant.
        *   **Cloud Search:** If "Use cloud" is active, call GCP Connectors or cloud provider APIs to search *authorized folders*. Handle API errors gracefully (see Error Handling).
        *   **Web Search:** If "Use internet" is active, call Vertex AI Search grounding or search API. Handle errors.
    4.  **Context Assembly:** Combine the retrieved text chunks and image data (if any). Rank/filter chunks based on relevance score and apply strategies (e.g., re-ranking) to fit within the LLM's context window (Gemini 1.5 Pro has a large window, but limits still apply). Prioritize project/cloud context if available.
    5.  **Prompt Formulation:** Construct the final prompt for the LLM (Gemini 1.5 Pro), including the original user query (text + images), assembled context, project instructions (if any), and any specific formatting requests.
    6.  **LLM Call:** Send the multimodal prompt to the Vertex AI Gemini 1.5 Pro endpoint. Implement timeouts and retries.
    7.  **Response Processing:** Receive the LLM's generated response. Sanitize output. Format it for display. Include citations/source references where possible (linking back to specific documents/chunks). Handle potential LLM errors or refusals.

### 6.4 Data Indexing

*   **Agent Specialty Data:** Pre-processed and indexed into the respective Qdrant databases. This is an offline/administrative task requiring careful curation, versioning, and handling of licensed content. Re-indexing required when source material is updated.
*   **Project Knowledge Files:**
    *   Triggered asynchronously upon file upload via Cloud Functions or similar.
    *   **Process:** Document parsing (PDF, DOCX, TXT, etc.), text chunking (strategic splitting), embedding generation (Vertex AI Embeddings API), vector upsert into the project's dedicated Qdrant index (including metadata like file ID, chunk ID).
    *   **Status Tracking:** Update `indexingStatus` in Firestore (`knowledgeFiles` collection) throughout the process ('pending', 'parsing', 'embedding', 'indexing', 'completed', 'failed').
    *   **Error Handling:** See section 9.6.

## 7. Database Design (Firestore)

*   Firestore (NoSQL Document Database) is suitable for user profiles, project metadata, chat history, and file tracking.

### 7.1 Collections

*   **`users`:**
    *   `userId` (Document ID, matches Firebase Auth UID)
    *   `firstName` (String)
    *   `lastName` (String)
    *   `company` (String)
    *   `role` (String)
    *   `email` (String, Primary identifier)
    *   `phoneNumber` (String, Optional)
    *   `industries` (Array of Strings)
    *   `createdAt` (Timestamp)
    *   `emailVerified` (Boolean)
    *   `connectedClouds` (Map: e.g., `{ googleDrive: { connected: true, accessTokenHash: "...", refreshTokenEncrypted: "...", authorizedFolders: ["folderId1", "folderId2"], scope: "drive.readonly" }, oneDrive: { ... } }`) // Sensitive tokens should ideally reference Secret Manager secrets
    *   `subscriptionTier` (String, e.g., 'free', 'pro', 'enterprise')
    *   `lastLogin` (Timestamp)
*   **`projects`:**
    *   `projectId` (Document ID, auto-generated)
    *   `name` (String)
    *   `description` (String, Optional)
    *   `instructions` (String, Optional)
    *   `ownerUid` (String, Reference to `users/userId`)
    *   `createdAt` (Timestamp)
    *   `qdrantIndexName` (String, Identifier for the project's vector index, e.g., `proj_<projectId>`)
    *   `memberUids` (Array of Strings, for future collaboration)
*   **`chats`:**
    *   `chatId` (Document ID, auto-generated)
    *   `userId` (String, Reference to `users/userId`)
    *   `projectId` (String, Optional, Reference to `projects/projectId` if part of a project)
    *   `createdAt` (Timestamp)
    *   `lastMessageTimestamp` (Timestamp)
    *   `title` (String, Optional, maybe auto-generated from first prompt)
    *   `messages` (Subcollection): `messages/{messageId}`
        *   `messageId` (Document ID)
        *   `sender` (String: 'user' or 'ai')
        *   `contentType` (String: 'text', 'image_url') // Support for multimodal
        *   `content` (String: text or URL to image in Storage)
        *   `timestamp` (Timestamp)
        *   `specialtyUsed` (String, e.g., 'Electrical')
        *   `contextSourcesUsed` (Array: e.g., ['project', 'cloud:googleDrive', 'internet', 'db:mechanical'])
        *   `llmResponseMetadata` (Map, Optional: token usage, citations, latency)
        *   `feedback` (String, Optional: 'good', 'bad')
*   **`knowledgeFiles`:**
    *   `fileId` (Document ID, auto-generated)
    *   `projectId` (String, Reference to `projects/projectId`)
    *   `userId` (String, Reference to `users/userId` - uploader)
    *   `fileName` (String)
    *   `storagePath` (String, Path in Firebase Storage)
    *   `fileType` (String, e.g., 'pdf', 'docx')
    *   `sizeBytes` (Number)
    *   `uploadedAt` (Timestamp)
    *   `indexingStatus` (String: 'pending', 'parsing', 'embedding', 'indexing', 'completed', 'failed')
    *   `lastIndexedAt` (Timestamp, Optional)
    *   `errorMessage` (String, Optional: Detailed error if 'failed')
    *   `chunkCount` (Number, Optional: After successful indexing)

### 7.2 Relationships

*   One User can have multiple Projects.
*   One User can have multiple Chats.
*   One Project can have multiple Knowledge Files.
*   One Project can have multiple Chats associated with it (or one primary chat log).
*   Chats contain Messages (as a subcollection for scalability).

## 8. Technology Stack

*   **Frontend:** Next.js (React Framework)
*   **Styling:** Tailwind CSS
*   **Backend:** Node.js with Express.js (or potentially Python/FastAPI microservices for AI-heavy tasks) hosted on Cloud Run or GKE.
*   **Authentication:** Firebase Authentication (Email/Password, Google Sign-In, MFA options)
*   **Database (Metadata):** Firebase Firestore
*   **File Storage:** Firebase Storage
*   **Security:** Firebase App Check, GCP Secret Manager (for API keys, OAuth tokens), Firestore Security Rules, Identity Platform/IAM policies.
*   **AI Platform:** Google Cloud Vertex AI
    *   **LLMs:** Vertex AI Foundational Models (Gemini 1.5 Pro family)
    *   **RAG Orchestration:** Vertex AI Search and Conversation / Agent Builder / Custom using LangChain/LlamaIndex.
    *   **Embedding Models:** Vertex AI Embeddings API (e.g., textembedding-gecko)
    *   **Grounding/Search:** Vertex AI Search (optional for web grounding).
*   **Cloud Connectors:** Google Cloud Connectors (for Dropbox, OneDrive) or direct API SDKs (e.g., MS Graph API for OneDrive/SharePoint).
*   **Vector Database:** Qdrant (Self-hosted on GKE or Cloud offering).
*   **Asynchronous Tasks:** Google Cloud Tasks / Cloud Pub/Sub + Cloud Functions (for indexing).
*   **Monitoring & Logging:** Google Cloud Monitoring, Logging.

## 9. Non-Functional Requirements

### 9.1 Performance

*   **Page Load:** Target < 2 seconds for initial load (using Next.js SSR/ISR).
*   **AI Response Latency:** Target < 10 seconds for typical text-based RAG queries. Multimodal or complex queries may take longer; provide user feedback.
*   **UI Responsiveness:** Smooth animations, no UI freezes during backend operations.
*   **Indexing Speed:** Indexing should happen in the background without blocking user interaction. Time depends on file size/complexity, but status should be updated promptly. Target minutes, not hours, for typical engineering documents.
*   **Database Queries:** Optimize Firestore queries using indexing and efficient data structures. Limit query scope.

### 9.2 Scalability

*   **Stateless Backend:** Design backend services (Cloud Run/GKE) to be stateless for horizontal scaling.
*   **Serverless Components:** Utilize Cloud Functions, Cloud Tasks for background processing (indexing).
*   **Database Scaling:** Firestore scales automatically. Qdrant deployment needs to be scalable (Cloud offering or properly configured K8s cluster).
*   **Load Balancing:** Use Google Cloud Load Balancer for backend services.
*   **Rate Limiting:** Implement rate limiting on APIs to prevent abuse and manage costs (LLM APIs, Cloud Storage APIs).

### 9.3 Security Requirements

*   **Authentication & Authorization:**
    *   Strong password policies enforced.
    *   Mandatory Email Verification.
    *   Secure session management (e.g., Firebase Auth tokens with appropriate expiry).
    *   Consider Multi-Factor Authentication (MFA) options (e.g., TOTP via Firebase Identity Platform).
    *   Role-Based Access Control (RBAC) if collaboration features are added later. Currently, user data is strictly isolated.
*   **Data Encryption:**
    *   **In Transit:** All communication via HTTPS/TLS 1.2+.
    *   **At Rest:** Firebase Storage, Firestore, and Qdrant data encrypted at rest (using provider-managed keys or Customer-Managed Encryption Keys - CMEK for higher control). Sensitive configuration (API keys, OAuth refresh tokens) stored in GCP Secret Manager.
*   **Infrastructure Security:**
    *   Utilize Firebase App Check to verify client requests.
    *   Configure strict Firewall rules (VPC firewalls, Cloud Armor WAF).
    *   Regularly update dependencies (frontend, backend, OS) to patch vulnerabilities.
    *   Principle of Least Privilege for all IAM roles and service accounts.
*   **Data Privacy & Isolation:**
    *   **Strict Tenant Isolation:** User data (projects, files, chats) must be strictly isolated. Enforced via Firestore Security Rules based on `auth.uid`, project-specific Qdrant indexes, and storage paths incorporating User/Project IDs. Cross-tenant access must be impossible.
    *   **Cloud Storage Access:** OAuth 2.0 with minimal necessary scopes (read-only preferred). Secure storage and handling of tokens. User explicitly controls folder access. Clear communication about data access.
*   **Input Validation & Output Sanitization:**
    *   Validate all user inputs on both client and server-side to prevent injection attacks (XSS, etc.).
    *   Sanitize AI outputs before rendering in the UI to prevent potential payload injection from generated content.
*   **API Security:**
    *   Protect backend APIs requiring authentication.
    *   Implement rate limiting and abuse detection.
*   **Dependency Scanning:** Use tools (e.g., `npm audit`, Snyk, Dependabot) to scan for vulnerabilities in third-party libraries.
*   **Logging & Monitoring:** Comprehensive logging of security events (logins, failures, access changes). Set up alerts for suspicious activities (e.g., multiple failed logins, unusual API usage).
*   **Compliance:** Design with considerations for GDPR, CCPA, and relevant industry compliance standards (though full certification is a separate process). Provide clear Privacy Policy and Terms of Service.

### 9.4 Usability

*   Intuitive navigation, clear feedback on actions (loading, success, error). Minimalistic design reduces cognitive load. Consistent UI patterns. Accessible design considerations (WCAG AA). Help documentation available.

### 9.5 Reliability

*   High uptime (target > 99.9% for core services). Design for failure (e.g., resilient indexing pipeline, graceful degradation of cloud features if APIs fail). Automated backups for critical data (Firestore backups, Qdrant snapshots).

### 9.6 Error Handling Strategy

*   **General:**
    *   Implement comprehensive logging (e.g., Google Cloud Logging) for all errors (frontend, backend, AI pipeline). Include stack traces, request IDs, user context (anonymized where necessary).
    *   Provide user-friendly error messages in the UI, avoiding technical jargon. Offer suggestions or links to support where appropriate.
    *   Use HTTP status codes correctly in API responses.
*   **Cloud Connector Failures (During Query):**
    *   **Transient Errors (e.g., network timeout, rate limit):** Implement exponential backoff retry mechanism for API calls (e.g., 3 retries).
    *   **Authentication Errors (e.g., expired/revoked token):** Detect invalid token errors. Notify the user clearly in the UI ("Connection to [Cloud Provider] lost. Please reconnect in Settings."). Disable the "Use the cloud" toggle for that provider until re-authenticated. Log the error.
    *   **Permission Errors (e.g., cannot access specific file/folder):** Log the specific error. Notify the user subtly if a search might be incomplete ("Could not access some files in [Cloud Provider]"). Do not halt the entire query; proceed with accessible data.
    *   **API Changes/Deprecations:** Monitor provider APIs. Have a strategy for updating connectors. Log unexpected API responses.
*   **Knowledge File Indexing Failures:**
    *   **Asynchronous Processing:** Indexing runs in the background (Cloud Function/Task).
    *   **Error Logging:** Log detailed errors (file ID, project ID, user ID, specific step failed - parsing, embedding, Qdrant upsert, error message).
    *   **Status Update:** Update `indexingStatus` to 'failed' in Firestore (`knowledgeFiles` collection) and store the `errorMessage`.
    *   **User Notification:** Display a clear 'Failed' status next to the file in the Project view UI. Allow the user to view the error message (simplified version).
    *   **Retry Mechanism:** For transient errors during indexing (e.g., Qdrant temporary unavailability, embedding API timeout), implement automated retries within the background task.
    *   **Manual Retry:** Provide an option in the UI for the user to manually retry indexing for a failed file.
    *   **Unrecoverable Errors (e.g., corrupted file, password-protected PDF):** Clearly indicate the file cannot be processed. Suggest user checks the file.
    *   **Partial Indexing:** Avoid partial indexing of a file if possible. If a file fails, ensure any partially indexed chunks are cleaned up from Qdrant to avoid inconsistent results.

### 9.7 Data Retention Policy

*   **User Account Data (`users` collection):** Retained as long as the account is active. Upon user-initiated account deletion, data is anonymized or deleted following a defined grace period (e.g., 30 days), subject to legal/backup requirements.
*   **Project Data (`projects`, `knowledgeFiles`, Project Qdrant Index):** Retained as long as the project exists and the owning user account is active. Deleting a project triggers deletion of associated `knowledgeFiles` from Firestore, files from Firebase Storage, and the corresponding Qdrant index.
*   **Chat History (`chats` collection):** Retained indefinitely while the user account is active, or until the user explicitly deletes a chat or their account. Chats associated with a deleted project may be retained as standalone chats unless explicitly deleted.
*   **Uploaded Files (Firebase Storage):** Files associated with `knowledgeFiles` are deleted when the corresponding Firestore record is deleted (either file deletion or project deletion). Temporary uploads (e.g., attachments not added to a project) should have a short TTL (e.g., 24 hours).
*   **Backup Policy:** Regular automated backups of Firestore and potentially Qdrant data are maintained for disaster recovery purposes (e.g., 30-day retention for backups), but not intended for retrieving user-deleted data beyond a short grace period.

## 10. Future Considerations / Out of Scope (for V1)

*   Advanced collaboration features (sharing projects, multi-user editing, commenting).
*   Real-time multi-user chat within projects.
*   Generating Microsoft Project (`.mpp`) files.
*   More sophisticated document generation templates/options (e.g., custom company templates).
*   Voice input and output.
*   Mobile application (iOS/Android).
*   Integration with other engineering software (e.g., CMMS APIs, CAD viewers, simulation tools).
*   Advanced analytics dashboard for usage/trends/cost tracking per user/project.
*   Support for more cloud storage providers (e.g., Box, SharePoint).
*   On-premise deployment options (significantly increases complexity).
*   Proactive AI suggestions or alerts based on project context or data changes.
*   Fine-tuning models on domain-specific or customer-specific data (adds significant complexity and cost).

