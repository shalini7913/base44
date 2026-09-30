# RESQ - AI Disaster Response & Emergency Command Center

RESQ is an emergency management and disaster response web platform built with **React**, **Vite**, **TailwindCSS**, **Express**, and **Socket.io**. It provides real-time multi-hazard threat monitoring, live GPS rescue unit tracking, automated safe evacuation route optimization, and interactive emergency SOS broadcasting.

---

## 🚀 Quick Start

### 1. Run Both Frontend and Backend Simultaneously
```bash
npm run dev:all
# or
npm start
```

This starts:
- **Express + Socket.io Server**: `http://localhost:5000`
- **Vite React Frontend**: `http://localhost:3000`

---

## 🛠 Available Scripts

- `npm run dev:all` - Runs both backend API server and Vite frontend concurrently.
- `npm run dev` - Runs the Vite frontend development server on port 3000.
- `npm run server` - Runs the Express and WebSockets server on port 5000.
- `npm run build` - Builds production assets into `dist/`.
- `npm run preview` - Previews the production build locally.

---

## 🌟 Application Features

1. **🚨 Instant Emergency SOS (`/sos`)**: Real-time distress beacon broadcasting over WebSockets to rescue dispatch grids.
2. **🗺️ Interactive Tactical Map (`/map`, `/rescue/map`)**: Leaflet-based geospatial display of rescue units, hazard perimeters, and field hospitals.
3. **🧭 Evacuation Route Finder (`/routes`)**: Dynamic route assessment highlighting hazard-free escape corridors.
4. **📢 Live Warnings & Bulletins (`/alerts`)**: Verified disaster alerts categorized by severity (Critical, Extreme, High, Medium).
5. **🏥 Hospitals & Trauma Centers (`/hospitals`)**: Telemetry on bed capacity, ICU availability, oxygen reserve, and blood supply.
6. **📦 Logistics Supply Matrix (`/resources`, `/rescue/resources`)**: Warehouse inventory tracking and emergency relief dispatch.
7. **📊 AI Personal Vulnerability Meter (`/risk`)**: Environmental danger scoring based on location and proximity to hazards.
8. **🤖 Autonomous AI Agents (`/agents`)**: Real-time monitoring of automated triage, pathfinding, and logistics agents.
9. **🛡️ Command Ops Center (`/rescue/command`)**: First responder command dashboard for live team status and dispatch operations.
