# SME.AI Frontend Development To-Do List
*Last Updated: May 3, 2025*

## Common Components & Styling

- [x] Create design system based on branding guidelines
- [x] Set up color theme variables (blue #4F46E5, purple #7C3AED, etc.)
- [x] Set up typography with Helvetica Neue
- [x] Create gradient styles for headers (Blue to Purple)
- [x] Set up light/dark mode theming
- [x] Create reusable UI components:
  - [x] Button component (primary, secondary, text variants)
  - [x] Input fields with appropriate styling
  - [x] Dropdown/select components
  - [x] Toggle components
  - [x] Modal component
  - [x] Toast notifications
  - [x] Loading indicators with blue/purple theme (spinner, dots, bar variants)
  - [x] Card component

## Landing Page

- [x] Design and implement hero section with value proposition
- [x] Create product description section
- [x] Implement target industries section
- [x] Create pricing tier comparison section
- [x] Add call-to-action buttons
- [ ] Design and implement application screenshots/mockups
- [ ] Create testimonials section (for future use)
- [x] Implement footer with links

## Authentication

- [x] Create sign up page with multi-step form
  - [x] User details form (Step 1)
  - [x] Industry selection form (Step 2)
- [x] Implement form validation logic
- [x] Create sign in page
- [x] Implement "Forgot Password" functionality
- [x] Set up OAuth integration for Google sign-in
- [ ] Create email verification flow
- [ ] Implement rate limiting for login attempts
- [ ] Create account lockout system

## Main Application Interface

- [x] Create layout with collapsible navigation panel
- [x] Implement chat view component
- [x] Design welcome message and prompt suggestions
- [x] Create dynamic chat input that repositions on first message
- [x] Implement message history display

## Left Navigation Panel

- [x] Create collapsible sidebar component
- [x] Implement tree view component for nested items
- [x] Build Projects section with collapsible header
- [x] Create "New Project" button and modal
- [x] Implement tree view for existing projects
- [x] Build Chats section with recent/historical chats
- [x] Create Cloud Connection section with service icons
- [ ] Implement "Connect New Cloud Account" functionality
- [ ] Create "Manage Connections" modal/page
- [x] Design bottom section with user profile, settings, logout

## Chat Functionality

- [x] Create multi-line text input area for prompts
- [x] Implement "Use the internet" toggle with visual states
- [x] Implement "Use the cloud" toggle with visual states
- [x] Create "Assistance specialty" dropdown
- [x] Implement "Create a Document" dropdown
- [x] Create "Attachment" dropdown with file options
- [x] Design send button with animation
- [ ] Implement optional voice input button
- [x] Create "Thinking..." animation indicator
- [x] Design chat message components (user vs AI)
- [x] Implement copy functionality for code snippets
- [ ] Create feedback buttons for AI responses

## Project Management

- [x] Create "New Project" modal with form fields
- [x] Implement file upload area with drag & drop
- [x] Create progress indicators for file uploads
- [x] Design Project Page View with chat interface
- [ ] Implement right panel for project details
- [x] Create Knowledge Files list with status indicators
- [x] Implement file download/delete functionality
- [x] Create "Add Knowledge Files" button
- [x] Create Projects listing page (with empty state, loading state, and grid layout)

## Cloud Storage Integration

- [ ] Implement OAuth flow for Google Drive
- [ ] Implement OAuth flow for Microsoft OneDrive
- [ ] Implement OAuth flow for Dropbox
- [ ] Create folder selection interface
- [ ] Implement folder browsing functionality
- [ ] Create UI for managing authorized folders
- [ ] Design cloud connection status indicators

## Document Generation

- [ ] Create document type selection dropdown
- [ ] Implement document download functionality
- [ ] Design download progress indicators

## Attachments & Multimodal

- [ ] Implement image upload functionality
- [ ] Create local file upload component
- [ ] Implement cloud file picker
- [ ] Design attachment preview component

## User Profile & Settings

- [ ] Create user profile page with editable fields
- [ ] Implement change password functionality
- [ ] Create settings page with sections:
  - [ ] Cloud connections management
  - [x] Theme preferences (Light/Dark mode)
  - [ ] Notification settings
  - [ ] Data management options
  - [ ] Security settings
  - [ ] Help/Support links
  - [ ] Legal links

## Responsive Design

- [ ] Ensure responsive design for all components
- [ ] Test on different screen sizes
- [ ] Implement mobile-specific UX improvements

## Accessibility

- [ ] Implement WCAG AA compliance features
- [ ] Add appropriate ARIA labels
- [ ] Ensure keyboard navigation
- [ ] Test with screen readers

## Shared Components and Global Variables

The following components and variables are shared across the application:

### Shared UI Components
- `Button`: Located at `/src/components/ui/Button.tsx` - Primary UI component with variants (primary, secondary, outline)
- `Card`: Located at `/src/components/ui/Card.tsx` - Container component for content sections
- `Input`: Located at `/src/components/ui/Input.tsx` - Form input fields with labels and validation
- `Toggle`: Located at `/src/components/ui/Toggle.tsx` - Toggle switch for binary options
- `Dropdown`: Located at `/src/components/ui/Dropdown.tsx` - Select component for dropdown options (with id optional)
- `Modal`: Located at `/src/components/ui/Modal.tsx` - Reusable modal component for popups and forms
- `Toast`: Located at `/src/components/ui/Toast.tsx` - Notification component for system messages
- `ToastContainer`: Located at `/src/components/ui/ToastContainer.tsx` - Container for managing toast notifications
- `Loading`: Located at `/src/components/ui/Loading.tsx` - Loading indicators with different styles (spinner, dots, bar)
- `ThemeToggle`: Located at `/src/components/ui/ThemeToggle.tsx` - Component for switching between light/dark themes

### Project Components
- `ProjectCreationModal`: Located at `/src/components/projects/ProjectCreationModal.tsx` - Modal for creating new projects

### Chat Components
- `Message`: Located at `/src/components/chat/Message.tsx` - Individual message component (user or AI)
- `ChatInput`: Located at `/src/components/chat/ChatInput.tsx` - Chat input area with controls
- `ChatView`: Located at `/src/components/chat/ChatView.tsx` - Main chat view with message history

### Global Context
- `AuthContext`: Located at `/src/lib/auth-context.tsx` - Provides authentication state and methods
- `ThemeContext`: Located at `/src/lib/theme-context.tsx` - Manages theme state and preferences
- `providers.tsx`: Located at `/src/lib/providers.tsx` - Wraps application with context providers

### Services
- `auth-service.ts`: Located at `/src/services/auth-service.ts` - Handles all Firebase authentication methods
- `project-service.ts`: Located at `/src/services/project-service.ts` - Handles project CRUD operations

### Theme Variables
```
// Primary colors
Blue: #4F46E5
Purple: #7C3AED
Light Gray: #F9FAFB (for backgrounds)
Dark Gray: #1F2937 (for dark mode)
```

## Bug Fixes
- [x] Fixed type compatibility with Dropdown component options (made id optional)
- [x] Fixed Loading component export to use named export instead of default export
- [x] Fixed type compatibility issue with ProjectCreationModal's onProjectCreate prop
- [x] Fixed proper imports of components across the application

## Next High Priority Frontend Tasks
1. ✅ Set up light/dark mode theming
2. Complete the profile and settings pages
3. Build the document generation interface
4. Implement the cloud storage integration components
5. Enhance responsive design for mobile devices

# Frontend Development Tasks

## User Interface
- [x] Set up light/dark mode theming
- [x] Create responsive dashboard layout
- [x] Design and implement settings page with cloud connections management
- [ ] Implement file browser and document viewer
- [ ] Create AI chat interface with expandable context panel
- [ ] Design project management UI with folders and categories

## Authentication
- [ ] Implement login/signup pages
- [ ] Add social authentication options
- [ ] Create password reset flow
- [ ] Set up JWT authentication with refresh tokens

## Features
- [ ] Build drag-and-drop file upload
- [ ] Create document annotation tools
- [ ] Implement real-time collaboration features
- [ ] Design and build notifications system
- [ ] Create user profile and account management

## Performance
- [ ] Set up code splitting and lazy loading
- [ ] Optimize image loading with next/image
- [ ] Implement caching strategy for API responses
- [ ] Add service worker for offline capabilities

## Accessibility
- [ ] Ensure proper keyboard navigation
- [ ] Add screen reader support with ARIA attributes
- [ ] Test and fix color contrast issues
- [ ] Implement focus management

## Testing
- [ ] Set up unit testing with Jest
- [ ] Configure E2E testing with Playwright
- [ ] Create component tests with React Testing Library
- [ ] Implement visual regression testing