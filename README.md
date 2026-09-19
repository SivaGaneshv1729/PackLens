# PackLens: AI-Powered Package Compliance Checker

PackLens is an objective analysis tool designed to verify packaging compliance with legal metrology rules using Google's powerful **Gemini Vision AI**. 

This repository contains a full-stack application that allows users to upload an image of a product package, process the image using AI, and receive an objective report detailing whether the package meets regulatory standards. It's built to be fast, reliable, and completely local (with an in-memory database) for easy objective testing.

## 🚀 Features

- **Dynamic AI Parsing:** Analyzes physical packaging images (food, cosmetics, etc.) to dynamically extract the Product Name, Manufacturer, Category, MRP, and Net Quantity.
- **Objective Compliance Engine:** Automatically verifies the package against 8 strict legal metrology checks and returns a structured JSON schema of Passes, Fails, and Warnings.
- **Fallback Logic:** Supports up to 5 Gemini API keys (`GEMINI_API_KEY_1` ... `GEMINI_API_KEY_5`). If one hits a rate limit or fails, it automatically cycles to the next to guarantee uptime.
- **In-Memory Database:** Designed for rapid objective testing, the backend runs entirely on a transient in-memory Python list. **No MongoDB or database installation required!**

## 📐 Architecture

The system is broken down into two main services:

### 1. Frontend (React + Vite)
- Built with **React 19**, **TypeScript**, and **Vite**.
- Styled using **Tailwind CSS** and **shadcn/ui** components for a premium, highly-responsive look and feel.
- State management and API data fetching is handled seamlessly using **React Query** (`@tanstack/react-query`).
- **Pages**:
  - `Dashboard`: Displays key metrics and a list of all historical analyses.
  - `Upload Package`: A dedicated, drag-and-drop interface for uploading packaging images.
  - `Results`: A comprehensive list of all analyses performed in the workspace.
  - `Reports`: A printable and shareable summary view of individual compliance checks.

### 2. Backend (FastAPI + Python)
- Built with **FastAPI** for high-performance, asynchronous routing.
- **AI Integration**: Powered by the **Google GenAI SDK** (`gemini-2.5-flash`). The backend parses the uploaded image, validates the data, and returns a detailed compliance report.
- Provides endpoints for uploading images (`/api/compliance/analyze`), listing history (`/api/compliance/results`), and fetching dashboard metrics (`/api/compliance/dashboard`).

## 📁 Project Structure

```text
PackLens/
├── backend/                  # FastAPI Python backend service
│   ├── lib/                  # Core processing & AI integration logic
│   │   └── analyzer.py       # Gemini Vision AI image analysis & compliance checking
│   ├── models/               # Pydantic data schemas
│   │   └── compliance.py     # Data models for checks, packages, & results
│   ├── routers/              # API route definitions
│   │   └── compliance.py     # Endpoints for analyze, results, & dashboard stats
│   ├── tests/                # Pytest test files & fixtures
│   ├── uploads/              # Uploaded package image storage
│   ├── .env                  # Environment variables (API keys, CORS, etc.)
│   ├── pytest.ini            # Pytest configuration
│   ├── requirements.txt      # Python dependencies
│   └── server.py             # Main FastAPI application entry point
│
├── frontend/                 # React 19 + TypeScript + Vite frontend app
│   ├── public/               # Static assets & public files
│   ├── src/                  # Application source code
│   │   ├── components/       # UI components & shadcn design elements
│   │   ├── lib/              # API helpers, utilities, & custom icons
│   │   ├── pages/            # Page components (Dashboard, Upload, Results, Reports, etc.)
│   │   ├── services/         # API client hooks & services
│   │   ├── types/            # TypeScript type definitions
│   │   ├── App.tsx           # Main App layout & route configuration
│   │   ├── index.css         # Global Tailwind CSS styles
│   │   └── main.tsx          # React application root entry point
│   ├── package.json          # Node.js dependencies & npm scripts
│   ├── tsconfig.json         # TypeScript configuration
│   └── vite.config.ts        # Vite configuration & dev server backend proxy
│
├── tests/                    # End-to-end (E2E) Playwright test suites
│   ├── e2e/                  # Test spec files
│   ├── fixtures/             # Test helpers & test fixtures
│   └── playwright.config.ts  # Playwright configuration
│
├── design_guidelines.json    # Design tokens & UX principles
├── README.md                 # Project documentation
└── TEMPLATE.md               # Design specification template
```

## 🔍 Compliance Checks Performed

The AI automatically checks for the following 8 metrology rules:
1. **Manufacturer**: Is the Manufacturer / Packer Name present?
2. **Address**: Is the Manufacturer / Packer Address present and complete?
3. **Generic Name**: Is the Generic Name of the commodity stated?
4. **Quantity**: Is the Net Quantity stated with clear units?
5. **MRP**: Is the Maximum Retail Price (MRP) stated (ideally with 'Inclusive of all taxes')?
6. **Date**: Is the Date of Manufacture or Packing present?
7. **Consumer Care**: Are Consumer Care Details (email or phone) present?
8. **Origin**: Is the Country of Origin stated (only if imported, otherwise skipped)?

## 🛠 Setup and Installation

### Prerequisites
- Node.js (v18+)
- Python 3.10+

### Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows
   .\venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure API Keys:
   Open the `.env` file in the `backend` directory. Add your Gemini API keys:
   ```env
   GEMINI_API_KEY_1=your_first_key_here
   GEMINI_API_KEY_2=your_second_key_here
   # (Supports up to 5 fallback keys)
   ```

5. Start the backend server:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   ```

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   # or yarn / pnpm
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🧪 Testing the Application

1. Navigate to `http://localhost:3000` in your web browser.
2. Click **Upload new package**.
3. Drag and drop an image of a packaged product.
4. Wait for the AI to parse the image.
5. Review the objective evidence on the **Results** page, which highlights violations, reasons, and recommendations.
*(Note: Restarting the FastAPI server will clear the in-memory history, providing a fresh slate for objective testing.)*
