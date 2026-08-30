# Website Auditor Frontend

A modern, high-performance Next.js dashboard for analyzing websites and identifying architectural, SEO, and performance issues. Built with TypeScript, Tailwind CSS, and Framer Motion for a polished, interactive user experience.

## 🎯 Features

- **Dark Mode Dashboard**: Sleek, high-contrast interface optimized for readability
- **URL Validation**: Deep regex validation with real-time feedback
- **Scan Depth Options**: Choose between Fast scans or Deep Analysis
- **Real-time Progress Tracking**: Step-by-step progress indicator during analysis
- **Interactive Issue Visualization**: Expandable issue cards with severity categorization
- **Metrics Dashboard**: Overview cards showing total issues, critical errors, warnings, and optimizations
- **Responsive Design**: Fully mobile-responsive using Tailwind CSS
- **Smooth Animations**: Beautiful transitions with Framer Motion
- **Type-Safe**: Full TypeScript support with strict mode enabled

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Client**: Native Fetch API with SSE support

## 📋 Requirements

- Node.js 18+ (supports both npm, yarn, pnpm, and bun)
- Backend server running on `http://localhost:5000` (configurable)

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 2. Configure Environment

Copy the example environment file and update if needed:

```bash
cp .env.example .env.local
```

**Environment Variables:**
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: `http://localhost:5000`)

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main page (orchestrator)
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── UrlInput.tsx       # URL input with validation
│   │   ├── AnalysisResults.tsx # Main results grid
│   │   ├── IssueCard.tsx      # Expandable issue detail card
│   │   └── LoadingState.tsx   # Loading skeleton & progress
│   └── types/
│       └── analyzer.ts        # TypeScript interfaces
├── package.json               # Dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind configuration
├── next.config.js             # Next.js configuration
└── .env.example               # Example environment variables
```

## 🎨 Component Architecture

### Page (Orchestrator)
The main page (`page.tsx`) manages the overall state and orchestrates communication between child components:
- Handles URL submission
- Manages loading states
- Processes API responses
- Coordinates error handling

### UrlInput
Validates user input with regex patterns:
- Supports bare domains, www URLs, and full HTTP(S) URLs
- Shows real-time validation feedback
- Scan depth selector (Fast / Deep Analysis)

### AnalysisResults
Grid-based results dashboard:
- **Metrics Cards**: Summary statistics with color-coded severity indicators
- **Issue Feed**: Sortable list of issues with expandable details
- **Issue Cards**: Deep dive into each problem with business impact and remediation steps

### LoadingState
Interactive progress indicator:
- Animated spinner with step counter
- Progress bar with percentage
- Step-by-step breakdown of analysis phases

## 🔌 API Integration

### Endpoint: POST `/api/audit`

**Request:**
```json
{
  "url": "https://example.com",
  "scanDepth": "Fast" | "Deep Analysis"
}
```

**Response:**
```json
{
  "success": true,
  "audit": [
    {
      "category": "SEO",
      "issue": "Missing meta description",
      "location": "Homepage",
      "severity": "High",
      "businessImpact": "Reduces click-through rate by ~30%",
      "remediation": "Add a unique meta description (150-160 chars)"
    }
  ]
}
```

## 🎨 Customization

### Colors & Theme
Edit `tailwind.config.ts` to customize:
- Dark mode palette
- Severity indicator colors (success, warning, danger)
- Gradient effects

### Icons
Replace icon imports from `lucide-react` with your preferred icon library.

### Typography
Modify font imports in `layout.tsx` to use different Google Fonts or custom fonts.

## 📦 Build & Deploy

### Build for Production

```bash
npm run build
npm start
```

### Static Export (Optional)
For static hosting, enable in `next.config.js`:
```javascript
const nextConfig = {
  output: 'export',
  // ... rest of config
}
```

### Deploy to Vercel

```bash
vercel
```

Or connect your GitHub repository for automatic deployments.

## 🐛 Troubleshooting

**API Connection Failed**
- Ensure backend server is running on the configured URL
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify CORS is enabled on the backend

**Styling Not Applied**
- Clear `.next` folder: `rm -rf .next`
- Restart dev server: `npm run dev`

**TypeScript Errors**
- Run `npm run build` to check full compilation
- Ensure `src/types/analyzer.ts` is imported correctly

## 📝 License

This project is part of the Website Auditor application suite.

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss proposed changes.

---

**Happy auditing! 🚀**
