# All Dependencies

This file explains every package this project uses and how to install them.

---

## How to Install Everything

### Backend

```bash
cd server
npm install
```

### Frontend

```bash
cd client
npm install
```

---

## Backend Packages (`server/`)

These are installed into the `server/` folder.

| Package | Version | What it does |
|---|---|---|
| `express` | ^5.2.1 | Runs the backend web server and handles all API routes |
| `mongoose` | ^9.5.0 | Connects to the MongoDB database and defines data models |
| `bcryptjs` | ^3.0.3 | Encrypts user passwords before saving them to the database |
| `jsonwebtoken` | ^9.0.3 | Creates and verifies secure login tokens (JWT) |
| `cors` | ^2.8.6 | Allows the frontend (port 5173) to talk to the backend (port 5000) |
| `dotenv` | ^17.4.2 | Reads your `.env` settings file so the app knows your database URL and secret key |
| `nodemon` *(dev only)* | ^3.1.14 | Automatically restarts the backend server when you save changes to any file |

---

## Frontend Packages (`client/`)

These are installed into the `client/` folder.

| Package | Version | What it does |
|---|---|---|
| `react` | ^19.2.5 | The core library for building the user interface |
| `react-dom` | ^19.2.5 | Renders the React app inside the browser |
| `react-router-dom` | ^7.14.2 | Handles navigation between pages (Home, Login, Dashboard, VR Hub, etc.) |
| `axios` | ^1.15.2 | Sends HTTP requests from the frontend to the backend API |
| `three` | ^0.184.0 | Renders the 3D VR environments (coffee shop, airport, market scenes) |
| `lucide-react` | ^1.8.0 | Provides icons used throughout the UI (mic, check, globe, book, etc.) |
| `react-hot-toast` | ^2.6.0 | Shows pop-up notification messages (success, error, info) |
| `tailwindcss` | ^4.2.4 | Styles the app using utility CSS classes |
| `@tailwindcss/vite` | ^4.2.4 | Vite plugin that integrates Tailwind CSS v4 into the build process |
| `typescript` *(dev only)* | ~6.0.2 | Adds type checking to the frontend TypeScript/TSX files |
| `vite` *(dev only)* | ^8.0.9 | Fast development server and build tool for the frontend |
| `@vitejs/plugin-react` *(dev only)* | ^6.0.1 | Vite plugin that enables React support (JSX transformation) |
| `@types/react` *(dev only)* | ^19.2.14 | TypeScript type definitions for React |
| `@types/react-dom` *(dev only)* | ^19.2.3 | TypeScript type definitions for React DOM |

---

## Browser-Only Features (No `npm install` Needed)

These features are built directly into Chrome and Edge — no package installation required.

| Feature | Browser API | Used For |
|---|---|---|
| Pronunciation recording | `SpeechRecognition` / `webkitSpeechRecognition` | Recording what the user says in VR dialogue practice |
| Text-to-speech (NPC voice) | `speechSynthesis` | Reading NPC dialogue lines out loud in the target language |
| VR headset support | `WebXR` / `navigator.xr` | Entering immersive VR mode with a compatible headset |

> These APIs are only available in **Chrome** and **Edge**. Firefox and Safari do not support them.

---

## Where These Are Used in the Code

| Package | Files that use it |
|---|---|
| `three` | `client/src/components/VRSceneRenderer.jsx` |
| `SpeechRecognition` (browser built-in) | `client/src/components/VRDialogue.jsx` |
| `speechSynthesis` (browser built-in) | `client/src/components/VRDialogue.jsx` |
| `WebXR` (browser built-in) | `client/src/components/VRSceneRenderer.jsx` |
| `axios` | All pages: `VRScene.jsx`, `VRHub.jsx`, `Admin.tsx`, `Courses.tsx`, `Dashboard.tsx`, `Lesson.tsx`, `Login.tsx`, `Quiz.tsx`, `Register.tsx` |
| `react-router-dom` | `App.tsx` and every page that uses `Link`, `useNavigate`, `useParams` |
| `lucide-react` | `VRDialogue.jsx`, `Home.tsx`, `Lesson.tsx`, `Quiz.tsx`, `Dashboard.tsx`, `Login.tsx`, `Register.tsx`, `Admin.tsx`, `Navbar.tsx` |
| `react-hot-toast` | `App.tsx` (global `<Toaster />`), `Login.tsx`, `Register.tsx`, `Lesson.tsx`, `Quiz.tsx`, `Courses.tsx` |
| `jsonwebtoken` | `server/middleware/auth.js`, `server/controllers/authController.js` |
| `bcryptjs` | `server/controllers/authController.js`, `server/seed.js` |
| `mongoose` | All files in `server/models/`, `server/index.js`, `server/seed.js`, `server/seedVR.js` |
| `cors` | `server/index.js` |
| `dotenv` | `server/index.js`, `server/seed.js`, `server/seedVR.js` |
| `express` | `server/index.js` and all files in `server/routes/` |
