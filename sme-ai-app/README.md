# SME.AI - Subject Matter Expert AI Assistant

SME.AI is an advanced AI-powered assistant specifically designed for industrial professionals in various engineering fields. It provides specialized assistance, document processing, and project organization for SMEs in electrical engineering, mechanical engineering, process engineering, process control, and project engineering.

## Key Features

- **Specialized Knowledge Base**: Access to specialized engineering knowledge with real-time internet search capability
- **Project Organization**: Create and manage projects with relevant knowledge files
- **Cloud Integration**: Connect with Google Drive, Microsoft OneDrive, and Dropbox
- **Document Processing**: Upload and process various file formats for knowledge extraction
- **Document Generation**: Generate professional Word documents, PowerPoint presentations, and Excel spreadsheets
- **Multimodal Input**: Support for text, images, and audio inputs

## Tech Stack

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- Firebase (Authentication, Firestore, Storage)
- Google Cloud Platform (Vertex AI, Cloud Functions)
- Qdrant Vector Database

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Firebase project
- Google Cloud Platform project with Vertex AI access

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/sme-ai.git
   cd sme-ai-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.local.example` to `.env.local`
   - Update all variables with your actual configuration values

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
sme-ai-app/
├── public/           # Static assets
├── src/
│   ├── app/          # App Router pages and layouts
│   ├── components/   # React components
│   ├── lib/          # Utility functions and libraries
│   ├── services/     # API and external service integrations
│   ├── styles/       # Global styles
│   └── types/        # TypeScript type definitions
```

## Deployment

This application can be deployed to Vercel, Netlify, or any other hosting platform that supports Next.js applications.

## License

This project is proprietary and confidential. All rights reserved.
