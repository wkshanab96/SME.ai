# SME.AI Frontend Development To-Do List
*Last Updated: May 1, 2025*

## Common Components & Styling

- [x] Create design system based on branding guidelines
- [x] Set up color theme variables (blue #4F46E5, purple #7C3AED, etc.)
- [x] Set up typography with Helvetica Neue
- [x] Create gradient styles for headers (Blue to Purple)
- [ ] Set up light/dark mode theming
- [x] Create reusable UI components:
  - [x] Button component (primary, secondary, text variants)
  - [x] Input fields with appropriate styling
  - [x] Dropdown/select components
  - [x] Toggle components
  - [ ] Modal component
  - [ ] Toast notifications
  - [ ] Loading indicators with blue/purple theme
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
- [ ] Implement "Forgot Password" functionality
- [x] Set up OAuth integration for Google sign-in
- [ ] Create email verification flow
- [ ] Implement rate limiting for login attempts
- [ ] Create account lockout system

## Main Application Interface

- [x] Create layout with collapsible navigation panel
- [ ] Implement chat view component
- [ ] Design welcome message and prompt suggestions
- [ ] Create dynamic chat input that repositions on first message
- [ ] Implement message history display

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

- [ ] Create multi-line text input area for prompts
- [ ] Implement "Use the internet" toggle with visual states
- [ ] Implement "Use the cloud" toggle with visual states
- [ ] Create "Assistance specialty" dropdown
- [ ] Implement "Create a Document" dropdown
- [ ] Create "Attachment" dropdown with file options
- [ ] Design send button with animation
- [ ] Implement optional voice input button
- [ ] Create "Thinking..." animation indicator
- [ ] Design chat message components (user vs AI)
- [ ] Implement copy functionality for code snippets
- [ ] Create feedback buttons for AI responses

## Project Management

- [ ] Create "New Project" modal with form fields
- [ ] Implement file upload area with drag & drop
- [ ] Create progress indicators for file uploads
- [ ] Design Project Page View with chat interface
- [ ] Implement right panel for project details
- [ ] Create Knowledge Files list with status indicators
- [ ] Implement file download/delete functionality
- [ ] Create "Add Knowledge Files" button

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
  - [ ] Theme preferences (Light/Dark mode)
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
- `Dropdown`: Located at `/src/components/ui/Dropdown.tsx` - Select component for dropdown options

### Global Context
- `AuthContext`: Located at `/src/lib/auth-context.tsx` - Provides authentication state and methods
- `providers.tsx`: Located at `/src/lib/providers.tsx` - Wraps application with context providers

### Authentication Service
- `auth-service.ts`: Located at `/src/services/auth-service.ts` - Handles all Firebase authentication methods

### Theme Variables
```
// Primary colors
Blue: #4F46E5
Purple: #7C3AED
Light Gray: #F9FAFB (for backgrounds)
Dark Gray: #1F2937 (for dark mode)
```

## Next High Priority Frontend Tasks
1. Implement the chat interface component with message history
2. Create the project creation modal and file upload UI
3. Build the document generation interface
4. Complete the profile and settings pages