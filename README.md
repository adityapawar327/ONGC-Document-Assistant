# ONGC Document Assistant

AI-powered document intelligence system for Oil and Natural Gas Corporation. Upload technical manuals, safety procedures, operational documentation, and reports to get instant, accurate answers with source citations.

## Features

### Core Capabilities
- **AI-Powered Search**: Instant answers from your documents using Google Gemini 2.5 Flash
- **Source Citations**: Every answer includes references to source documents
- **Bilingual Support**: Full interface in English and Hindi (हिंदी)
- **Multiple File Types**: PDF, Word (.docx), Excel (.xlsx), and Text files
- **Secure Processing**: Documents processed securely with session-based storage

### Advanced Features
- **Accuracy Modes**: Choose between Very Accurate, Moderate, or Creative responses
- **Context Window**: Adjust response detail (Short, Medium, or High)
- **File Management**: View and manage uploaded documents in Settings
- **Add Files During Chat**: Upload additional documents without restarting
- **Example Questions**: AI-generated suggestions based on your documents

## Quick Start

### Prerequisites
- Node.js 20.18+ (20.19+ recommended)
- Gemini API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ongc-document-assistant
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   
   Create or edit `.env.local` file:
   ```env
   VITE_API_KEY=your_gemini_api_key_here
   ```

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## Usage Guide

### 1. Upload Documents
- Drag and drop files onto the upload area
- Or click "Browse Files" to select from your computer
- Supported formats: PDF, Word, Excel, Text
- Multiple files can be uploaded at once

### 2. Start Chat Session
- Click "Upload and Chat" to process your documents
- The AI will analyze them and generate helpful question suggestions
- Processing time depends on file size and quantity

### 3. Ask Questions
- Type your questions in the chat input
- Or click on suggested questions
- Get instant AI-powered answers with source citations
- View source text by clicking on citation buttons

### 4. Customize & Manage
- **Settings Panel**: Access via Settings button
  - Adjust accuracy mode
  - Change context window
  - View uploaded files
  - Remove files (restarts chat)
- **Add More Files**: Use paperclip icon during chat
- **New Chat**: Start fresh with different documents
- **Language Toggle**: Switch between English and Hindi

## Configuration

### Accuracy Modes

**Very Accurate**
- Strict responses only from uploaded documents
- Best for: Compliance, regulatory documents, fact-checking

**Moderate** (Default)
- Balanced approach with mostly document-based answers
- Best for: Most use cases, general queries

**Creative**
- Flexible responses with general knowledge
- Best for: Exploratory questions, broader context

### Context Window

**Short (4 chunks)**
- Quick, concise answers
- Best for: Simple questions

**Medium (8 chunks)** (Default)
- Balanced responses
- Best for: Most queries

**High (15 chunks)**
- Comprehensive, detailed answers
- Best for: Complex questions, in-depth analysis

## Project Structure

```
ongc-document-assistant/
├── components/
│   ├── ChatInterface.tsx       # Main chat UI
│   ├── WelcomeScreen.tsx       # Upload screen
│   ├── SettingsPanel.tsx       # Settings modal
│   ├── LanguageToggle.tsx      # Language switcher
│   ├── ProgressBar.tsx         # Upload progress
│   ├── Spinner.tsx             # Loading indicator
│   └── icons/                  # Icon components
├── services/
│   └── geminiService.ts        # Gemini API integration
├── App.tsx                     # Main app component
├── index.tsx                   # Entry point
├── LanguageContext.tsx         # Language state management
├── i18n.ts                     # Translations (EN/HI)
├── types.ts                    # TypeScript types
├── index.css                   # Global styles (ONGC theme)
├── .env.local                  # Environment variables
└── package.json                # Dependencies
```

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS + Inline Styles
- **AI**: Google Gemini 2.5 Flash with FileSearch
- **Languages**: English + Hindi

## Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint
```

### Environment Variables

Create `.env.local` file:
```env
VITE_API_KEY=your_gemini_api_key_here
```

**Security Note**: Never commit `.env.local` to version control

## Design System

### ONGC Color Scheme
- **Primary**: Maroon (#800020)
- **Secondary**: Dark Maroon (#5a0016)
- **Accent 1**: Yellow (#FFD700)
- **Accent 2**: Orange (#FF8C00)
- **Text**: White (#FFFFFF)

### Typography
- **Font**: Inter, Segoe UI, Roboto, Helvetica Neue, Arial
- **Sizes**: Responsive with clamp()
- **Weights**: 400 (regular), 600 (semi-bold), 700 (bold), 800 (extra-bold)

### Components
- Professional, clean design
- Consistent button sizing (38px height)
- Smooth animations and transitions
- Responsive layout for all screen sizes

## Browser Support

- Chrome/Edge (Chromium) - Recommended
- Firefox
- Safari
- Mobile browsers

## Troubleshooting

### API Key Issues
**Problem**: "API key not valid" error
**Solution**: 
1. Verify key in `.env.local`
2. Ensure key has FileSearch API access
3. Restart dev server after changing `.env.local`

### Upload Fails
**Problem**: File upload doesn't work
**Solution**:
1. Check file format (PDF, DOCX, XLSX, TXT)
2. Verify file size (very large files may timeout)
3. Check API key permissions

### Language Not Switching
**Problem**: UI doesn't change language
**Solution**:
1. Clear browser cache
2. Check LanguageContext is properly initialized
3. Verify translations exist in `i18n.ts`

## Performance

- Fast initial load
- Hot module replacement in development
- Optimized production bundle
- Efficient re-renders with React 19
- Smooth 60fps animations

## Security

- API key stored in environment variables
- Not exposed in client code
- Secure API communication
- Session-based document storage
- Auto-cleanup on exit

## Deployment

### Recommended Platforms

**Vercel** (Recommended)
- Zero configuration
- Automatic HTTPS
- Environment variable support
- Deploy: `vercel`

**Netlify**
- Easy deployment
- Form handling
- Edge functions
- Deploy: `netlify deploy`

**AWS Amplify**
- Enterprise-grade
- Scalable
- AWS integration

### Production Checklist
- [ ] Update API key with production key
- [ ] Configure environment variables
- [ ] Enable HTTPS
- [ ] Set up error tracking
- [ ] Configure CORS properly
- [ ] Add authentication if needed
- [ ] Set up monitoring
- [ ] Optimize bundle size

## Contributing

This is a customized application for ONGC. For modifications:

1. Follow existing code style
2. Maintain ONGC branding
3. Test in both English and Hindi
4. Ensure responsive design
5. Update documentation

## License

Apache-2.0

## Support

For technical issues:
- Check documentation
- Review code comments
- Contact development team

---

**Version**: 1.4.0  
**Status**: Production Ready ✅  
**Last Updated**: 2024  
**Customized for**: Oil and Natural Gas Corporation (ONGC)

## Quality Assurance

✅ **Code Quality**
- No TypeScript errors
- Clean code structure
- Proper type safety
- Consistent formatting

✅ **UI/UX**
- Professional design
- Smooth animations
- Responsive layout
- No loading flashes

✅ **Functionality**
- All features working
- Bilingual support
- File management
- Settings panel

✅ **Performance**
- Fast initial load
- Optimized bundle
- Efficient rendering
- 60fps animations

✅ **Security**
- Environment variables
- Secure API calls
- Session cleanup
- No hardcoded secrets

## Social Media Sharing

The application includes comprehensive Open Graph and Twitter Card meta tags for beautiful social media previews:

**Features:**
- Custom title and description
- ONGC logo as preview image
- Optimized for Facebook, Twitter, LinkedIn
- Professional appearance when shared

**Preview includes:**
- Application title
- Description of features
- ONGC branding
- Bilingual support mention

## SEO Optimization

- ✅ Meta tags for search engines
- ✅ Open Graph tags for social media
- ✅ Twitter Card support
- ✅ Robots.txt for crawlers
- ✅ Sitemap.xml for indexing
- ✅ Semantic HTML structure

## Acknowledgments

- Built with Google Gemini AI
- Powered by React and Vite
- Designed for ONGC
- Enterprise-grade quality
