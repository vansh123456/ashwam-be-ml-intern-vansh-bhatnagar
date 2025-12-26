# Ashwam PII Scrubber - Frontend

React + TypeScript + Vite frontend for the PII scrubbing application.

## Features

- 📤 Upload `.jsonl` journal files
- 🔍 Real-time PII detection and scrubbing
- 🎨 Color-coded highlights for different PII types
- 📊 Summary statistics panel
- 💾 Download scrubbed results as JSONL

## Prerequisites

- Node.js 18+ and npm
- Backend server running (see backend README)

## Installation

```bash
npm install
```

## Development

1. **Start the backend server** (in a separate terminal):
   ```bash
   cd ../backend
   npm start
   ```
   Backend runs on `http://localhost:3000` by default.

2. **Start the frontend dev server**:
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173` (or next available port).

3. Open your browser to the frontend URL.

## Environment Variables

Create a `.env` file in the frontend directory to customize the backend URL:

```env
VITE_API_URL=http://localhost:3000
```

If not set, defaults to `http://localhost:3000`.

## Usage

1. Click "Choose File" and select a `journals.jsonl` file
2. Click "Scrub Data" to process the file
3. View results in the right panel with color-coded PII highlights
4. Check the summary panel for PII type counts
5. Click "Download Scrubbed JSONL" to save results

## PII Type Colors

- **EMAIL**: Blue
- **PHONE**: Green
- **NAME**: Purple
- **ADDRESS**: Orange
- **DOB**: Teal
- **PROVIDER**: Pink
- **APPT_ID**: Red
- **INSURANCE_ID**: Brown
- **GOV_ID**: Grey

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
frontend/
├── src/
│   ├── api/           # API client for backend communication
│   ├── components/   # React components
│   ├── utils/         # Utility functions (JSONL parsing)
│   ├── styles/        # CSS styles
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── public/            # Static assets
└── package.json

```

## Troubleshooting

**Backend connection errors:**
- Ensure backend is running on port 3000
- Check CORS settings in backend
- Verify `VITE_API_URL` matches backend URL

**File upload issues:**
- Ensure file has `.jsonl` extension
- Check file size (backend limit: 50MB)
- Verify JSONL format is valid

