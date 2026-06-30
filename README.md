# 🔥 DocFlow AI — AI-Powered Document Tools

> **Summarize, Translate, Merge, Split, Compress & Convert** — all powered by AI, processed securely in your browser.

![DocFlow AI](https://img.shields.io/badge/DocFlow_AI-v1.0-orange?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3-06B6D4?style=flat-square&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)

---

## 📌 About

**DocFlow AI** is a modern, full-stack web application that provides AI-powered document processing tools — similar to iLovePDF but enhanced with artificial intelligence. All file processing happens **in-memory** for maximum privacy and speed.

---

## 👥 Team Information

| Role | Name |
|------|------|
| **AI & Backend** | m.shri subashini|
| **Frontend & UI** | k.prakash|

---

## ✨ Features — Fully Working

### 🤖 AI Tools
- **AI Summarize** — Upload text/documents → get AI-generated summaries
- **AI Translate** — Translate document content into any target language
- **AI Question Generator** — Generate study/quiz questions from documents
- **OCR Text Extraction** — Extract text from scanned images using Tesseract.js

### 📄 PDF Organize Tools
- **Merge PDF** — Combine multiple PDF files into one
- **Split PDF** — Extract specific page ranges into separate files
- **Compress PDF** — Reduce PDF file size while maintaining quality

### ✏️ Editing Tools
- **Add Watermark** — Stamp custom text watermarks on all PDF pages (adjustable opacity)

### 🔄 Convert Tools
- **Image ↔ PDF** — Convert images to PDF and vice versa
- **Compress Image** — Reduce image file size with quality control

### 🔐 Authentication
- **Email + Password** sign up with **email verification**
- **Google OAuth** sign-in (one-click)
- Protected routes — all tools require authentication

### 🎨 UI/UX
- Dark/Light mode toggle
- Responsive design — mobile-friendly with collapsible sidebar
- Drag & drop file upload with validation
- Processing animations and toast notifications

---

## 🚧 Features in Beta (Future Scope)

| Feature | Status |
|---------|--------|
| PDF → Word Conversion | 🔶 Beta |
| Word → PDF Conversion | 🔶 Beta |
| Excel → PDF Conversion | 🔶 Beta |
| PPT → PDF Conversion | 🔶 Beta |
| Remove Watermark | 🔶 Beta |
| Edit PDF (inline text) | 🔶 Beta |

These features are marked with a **BETA** badge in the UI.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite 5 |
| **Styling** | Tailwind CSS 3, shadcn/ui, Framer Motion |
| **Backend** | Supabase Edge Functions |
| **AI** | Google Gemini / OpenAI via AI Gateway |
| **Auth** | Supabase Auth + Google OAuth |
| **PDF Processing** | pdf-lib (client-side) |
| **OCR** | Tesseract.js (client-side) |
| **Image Processing** | browser-image-compression |
| **File Handling** | JSZip, FileSaver.js |

---

## 🚀 How It Works

```
User uploads file
  → Client-side validation (type + size ≤ 20MB)
  → Process in-memory (pdf-lib / Tesseract / AI API)
  → Return result for download
  → Files are NEVER permanently stored
```

---

## 📂 Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── Sidebar.tsx    # Navigation with tool categories
│   ├── HomeView.tsx   # Dashboard with tool cards
│   └── FileDropZone.tsx
├── contexts/          # Auth context provider
├── pages/             # Route pages (Index, Auth, ResetPassword)
├── tools/             # Individual tool implementations
│   ├── AISummarize.tsx
│   ├── AITranslate.tsx
│   ├── AIQuestions.tsx
│   ├── OCRTool.tsx
│   ├── MergePDF.tsx
│   ├── SplitPDF.tsx
│   ├── CompressPDF.tsx
│   ├── AddWatermark.tsx
│   ├── CompressImage.tsx
│   └── ConvertTool.tsx
├── lib/               # Utilities and API helpers
└── integrations/      # Backend client configuration
supabase/
└── functions/         # Edge Functions (AI endpoints)
```

---

## 🔒 Security & Privacy

- No permanent file storage — all processing in browser memory
- Email verification required for account creation
- Google OAuth for secure one-click sign-in
- Protected routes — authentication required for all tools

---

## 🖥️ How to Navigate

1. **Sign Up / Sign In** — Email (verified) or Google OAuth
2. **Dashboard** — Browse tools by category (AI, Organize, Editing, Convert)
3. **Select a Tool** — Click any tool card
4. **Upload File** — Drag & drop or click (max 20MB)
5. **Process** — Click the action button
6. **Download** — Get your result instantly

---

## 🏃 Running Locally

```bash
git clone <https://github.com/shri8977/docflow-ai>
cd docflow-ai
npm install
npm run dev
```

Runs on `http://localhost:5173`

---

## 📄 License

MIT License

---

Built with ❤️ using **React** + **TypeScript** + **AI**
