# Oryn - Operational Reasioning Yeild Navigator
AI-Based Business Problem Identification and Solution Recommendation System


## Current Progress

The project is currently in the early frontend development stage. The repository contains a React + Vite application under the `frontend/` folder with the base UI foundation and a landing page shell in place.

Completed so far:
- Project structure created and initialized with React, Vite, Bootstrap, and Tailwind
- Landing page scaffold established with navigation
- Brand identity and styling foundation for the ORYN interface
- Basic routing setup for the landing page

Still in progress / not yet implemented:
- Full business analysis workflow
- AI-driven problem detection and recommendations
- Backend API and database integration
- Authentication and user management
- Dashboard, reporting, and insight views
- Data ingestion and model logic for operational decision support

## Project Vision

Oryn aims to support decision-makers by combining business context, operational data, and AI-powered reasoning to:
- identify recurring business problems,
- highlight likely root causes,
- prioritize issues by impact, and
- recommend actionable solutions.

## Tech Stack

- Frontend: React + Vite
- Styling: Bootstrap and Tailwind CSS
- Routing: React Router
- UI icons: React Icons / Lucide

## Project Structure

```text
ORYN/
├── README.md
├── frontend/
│   ├── package.json
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── pages/
│       │   └── Landing/
│       └── services/
└── .git/
```

## Run Locally

```bash
cd frontend
npm install
npm run dev
```

Then open the local Vite URL shown in the terminal to view the app.

## Roadmap

### Phase 1: Frontend foundation
- Landing page and branding
- Basic navigation and responsive layout
- Initial app shell setup

### Phase 2: Core product workflow
- Problem intake and business context forms
- AI analysis flow
- Recommendation output UI

### Phase 3: Intelligence layer
- Backend services and model integration
- Data processing and analysis engine
- Recommendation validation

### Phase 4: Full product experience
- Authentication
- User profiles and saved analyses
- Insights dashboard and reporting

## Status Summary

Oryn is currently in an early MVP / prototype stage, with the frontend foundation and landing experience established. The next major milestone is building the actual analysis engine and backend workflow that powers the product's core value proposition.
