# 🌐 Language Learning VR Platform

A full-stack immersive language learning platform powered by the MERN stack, featuring real-time 3D VR environments, pronunciation practice via the Web Speech API, and structured course/quiz content management.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Prerequisites](#3-prerequisites)
4. [Clone the Repository](#4-clone-the-repository)
5. [Environment Variables](#5-environment-variables)
6. [Backend Setup](#6-backend-setup)
7. [Frontend Setup](#7-frontend-setup)
8. [MongoDB Setup](#8-mongodb-setup)
9. [Seed Sample Data](#9-seed-sample-data)
10. [Create Admin Account](#10-create-admin-account)
11. [Running the Full App](#11-running-the-full-app)
12. [Project Folder Structure](#12-project-folder-structure)
13. [Browser Requirements](#13-browser-requirements)
14. [Common Errors & Fixes](#14-common-errors--fixes)

---

## 1. Project Overview

This platform combines traditional language learning (courses, lessons, quizzes) with immersive VR conversation scenarios. Users can:

- **Browse & enroll** in language courses (Spanish, French, and more)
- **Watch video lessons** and track progress per course
- **Take quizzes** after each lesson to test comprehension
- **Practice speaking** in VR scenes (coffee shop, airport, market) using real-time speech recognition and text-to-speech feedback
- **Admins** can create/edit/delete courses, lessons, quiz questions, and VR scenarios through a dedicated dashboard

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Database** | MongoDB | Persistent data storage |
| **Backend** | Express.js + Node.js | REST API server |
| **Frontend** | React 19 + Vite | UI framework and build tool |
| **Language** | TypeScript + JSX | Type-safe frontend code |
| **3D / VR** | Three.js | Immersive 3D scene rendering |
| **VR Input** | WebXR API | VR headset support |
| **Speech** | Web Speech API | Pronunciation recording & TTS |
| **Styling** | Tailwind CSS v4 | Utility-first CSS framework |

---

## 3. Prerequisites

Install the following tools before getting started:

| Tool | Minimum Version | Download |
|---|---|---|
| **Node.js** | v18.x or higher | https://nodejs.org |
| **npm** | v9.x (bundled with Node) | Included with Node.js |
| **Git** | Any recent version | https://git-scm.com |
| **MongoDB** | v6.x (local) OR use Atlas (cloud) | https://www.mongodb.com/try/download/community |
| **Browser** | Chrome 80+ or Edge 80+ | https://www.google.com/chrome / https://www.microsoft.com/edge |

> **Why Chrome or Edge?** Firefox and Safari do not fully support the `SpeechRecognition` API or WebXR, which are core to the VR pronunciation features.

---

## 4. Clone the Repository

```bash
git clone <your-repo-url>
cd language-vr
```

---

## 5. Environment Variables

The server requires a `.env` file to run. A template is provided at `server/.env.example`.

> 🔒 **Security:** Never share your `.env` file or push it to GitHub. It contains your database password and JWT secret. The `.env` file is already listed in `.gitignore` so it will not be pushed — but never remove it from `.gitignore`.
>
> Always copy `.env.example` to `.env` and fill in your own values. The `.env.example` file is safe to commit — it contains only placeholder values.

### Backend — `server/.env`

Copy `server/.env.example` to `server/.env` and fill in:

| Variable | Purpose | How to get it |
|---|---|---|
| `PORT` | Port the Express server listens on | Leave as `5000`. Change only if 5000 is in use. |
| `MONGO_URI` | Full MongoDB connection string | See [MongoDB Setup](#8-mongodb-setup) below |
| `JWT_SECRET` | Secret key used to sign auth tokens | Any long random string (e.g. `openssl rand -hex 32` in Git Bash) |
| `JWT_EXPIRE` | Token expiry duration | `7d` means tokens expire after 7 days. |
| `CLIENT_URL` | Frontend URL for CORS | Leave as `http://localhost:5173` for local dev. |

### Frontend — `client/.env`

Copy `client/.env.example` to `client/.env` and fill in:

| Variable | Purpose |
|---|---|
| `VITE_API_URL` | Full URL to the backend API, e.g. `http://localhost:5000/api` |

> All Vite environment variables **must** start with `VITE_` to be accessible in the browser.

### Getting your `MONGO_URI` from Atlas

1. Log in to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Open your cluster → click **Connect**
3. Choose **Drivers** → select **Node.js**
4. Copy the connection string — it looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/language-platform?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your Atlas database user credentials

---

## 6. Backend Setup

```bash
cd server
npm install
```

### Backend Dependencies

| Package | Version | Purpose |
|---|---|---|
| `express` | ^5.2.1 | Web framework for building the REST API |
| `mongoose` | ^9.5.0 | MongoDB ODM — schema modeling and database queries |
| `bcryptjs` | ^3.0.3 | Password hashing before storing in the database |
| `jsonwebtoken` | ^9.0.3 | Generating and verifying JWT authentication tokens |
| `cors` | ^2.8.6 | Enables cross-origin requests from the frontend |
| `dotenv` | ^17.4.2 | Loads environment variables from the `.env` file |
| `nodemon` *(dev)* | ^3.1.14 | Auto-restarts the server on file changes during development |

### Configure environment and start

```bash
# Copy the example file
cp .env.example .env

# Open .env and fill in your MONGO_URI and JWT_SECRET
# Then start the dev server:
npm run dev
```

### Expected output

```
MongoDB Connected
Server running on port 5000
```

### Available API Routes

| Route | Description |
|---|---|
| `POST /api/auth/register` | Register a new user |
| `POST /api/auth/login` | Login and receive JWT |
| `GET /api/courses` | Fetch all courses |
| `GET /api/lessons/:courseId` | Fetch lessons for a course |
| `GET /api/quizzes/:lessonId` | Fetch quiz for a lesson |
| `POST /api/progress` | Update lesson progress |
| `GET /api/vr/scenarios` | Fetch all VR scenarios |
| `POST /api/vr/scenarios` | Create a VR scenario (admin only) |

---

## 7. Frontend Setup

```bash
cd client
npm install
```

### Frontend Dependencies

| Package | Version | Purpose |
|---|---|---|
| `react` | ^19.2.5 | Core UI framework |
| `react-dom` | ^19.2.5 | DOM rendering for React |
| `react-router-dom` | ^7.14.2 | Client-side routing and navigation |
| `axios` | ^1.15.2 | HTTP client for calling the backend API |
| `three` | ^0.184.0 | 3D engine for rendering VR scenes |
| `react-hot-toast` | ^2.6.0 | Toast notifications for user feedback |
| `lucide-react` | ^1.8.0 | Icon library used throughout the UI |
| `tailwindcss` | ^4.2.4 | Utility-first CSS framework for styling |
| `@tailwindcss/vite` | ^4.2.4 | Vite plugin to integrate Tailwind v4 |
| `typescript` | ~6.0.2 | Type safety for the frontend codebase |
| `vite` | ^8.0.9 | Fast development build tool |

### Start the dev server

```bash
npm run dev
```

### Expected output

```
VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open [http://localhost:5173](http://localhost:5173) in **Chrome or Edge**.

---

## 8. MongoDB Setup

### Option A — MongoDB Atlas (Recommended for beginners)

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a **free account**
2. Click **Create a Deployment** → choose the free **M0** tier
3. Choose a cloud provider and region → click **Create**
4. When prompted, create a **Database User**:
   - Set a username and a strong password — save these, you'll need them for `MONGO_URI`
5. Under **Network Access** → click **Add IP Address** → choose **Allow Access from Anywhere** (`0.0.0.0/0`) for local development
6. Go back to your cluster → click **Connect** → **Drivers** → **Node.js**
7. Copy the connection string and paste it into `server/.env` as `MONGO_URI`, replacing `<username>` and `<password>`

### Option B — Local MongoDB

1. Download MongoDB Community Edition from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Follow the installer instructions for your OS
3. Start the MongoDB service:
   - **Windows**: MongoDB starts automatically as a service after install
   - **macOS/Linux**: Run `mongod` or `brew services start mongodb-community`
4. Set this in `server/.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/language-platform
   ```

---

## 9. Seed Sample Data

The project includes two seed scripts to populate the database with demo content.

> ⚠️ **Warning:** The seed scripts delete all existing data in the affected collections before inserting new data. Do not run these on a production database.

### Step 1 — Seed Courses, Lessons & Quizzes

```bash
cd server
node seed.js
```

**What it creates:**
- 1 Admin user: `admin@example.com` / `password123`
- 1 Regular user: `user@example.com` / `password123`
- 2 Sample courses: *Spanish for Beginners*, *Advanced French Conversation*
- 2 Sample lessons with embedded YouTube videos
- 2 Quiz questions linked to the lessons

### Step 2 — Seed VR Scenarios

```bash
node seedVR.js
```

**What it creates:**
- 3 Spanish VR scenarios with full dialogue trees:
  - **Ordering Coffee** (coffee-shop setting)
  - **Airport Check-In** (airport setting)
  - **Market Shopping** (market setting)
- Each scenario has 3 dialogue steps with NPC lines and multiple-choice responses

---

## 10. Create Admin Account

After registering a new account through the UI, you can promote it to admin using one of these methods:

### Via MongoDB Atlas (Web UI)

1. Open your Atlas cluster → **Browse Collections**
2. Select the `language-platform` database → `users` collection
3. Find your user document → click **Edit**
4. Change `"role": "user"` to `"role": "admin"` → save

### Via MongoDB Compass (Desktop App)

1. Connect Compass to your database using your `MONGO_URI`
2. Navigate to `language-platform` → `users`
3. Double-click your user document to edit it
4. Update the `role` field to `"admin"` → save

### Via MongoDB Shell (`mongosh`)

```js
use language-platform

db.users.updateOne(
  { email: "your@email.com" },
  { $set: { role: "admin" } }
)
```

Once promoted, log out and log back in — the Admin Dashboard link will appear in the navigation bar.

---

## 11. Running the Full App

You need **two terminals** running simultaneously:

```bash
# Terminal 1 — Backend
cd server
npm run dev
```

```bash
# Terminal 2 — Frontend
cd client
npm run dev
```

Then open **http://localhost:5173** in **Chrome or Edge**.

### Login with seeded accounts (if you ran seed.js)

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `password123` |
| User | `user@example.com` | `password123` |

---

## 12. Project Folder Structure

```
language-vr/
├── server/                        # Node.js + Express backend
│   ├── controllers/               # Route handler logic
│   │   ├── authController.js      # Register, login, JWT generation
│   │   ├── courseController.js    # Course CRUD operations
│   │   ├── lessonController.js    # Lesson CRUD operations
│   │   ├── quizController.js      # Quiz logic and answer checking
│   │   ├── progressController.js  # User progress tracking
│   │   └── vrController.js        # VR scenario CRUD + progress
│   ├── middleware/
│   │   └── auth.js                # JWT verification middleware
│   ├── models/                    # Mongoose schema definitions
│   │   ├── User.js                # User schema (name, email, role)
│   │   ├── Course.js              # Course schema
│   │   ├── Lesson.js              # Lesson schema (content, videoUrl)
│   │   ├── Quiz.js                # Quiz question schema
│   │   ├── Enrollment.js          # User ↔ Course enrollment
│   │   ├── Progress.js            # Lesson completion tracking
│   │   ├── VRScenario.js          # VR scenario + dialogue schema
│   │   └── VRProgress.js          # VR scenario completion tracking
│   ├── routes/                    # Express route definitions
│   │   ├── auth.js
│   │   ├── courses.js
│   │   ├── lessons.js
│   │   ├── quizzes.js
│   │   ├── progress.js
│   │   └── vr.js
│   ├── seed.js                    # Seeds courses, lessons, quizzes & users
│   ├── seedVR.js                  # Seeds VR scenarios
│   ├── index.js                   # App entry point
│   ├── .env.example               # Environment variable template
│   └── package.json
│
├── client/                        # React + Vite frontend
│   ├── src/
│   │   ├── pages/                 # Full-page route components
│   │   │   ├── Home.tsx           # Landing page
│   │   │   ├── Login.tsx          # Login form
│   │   │   ├── Register.tsx       # Registration form
│   │   │   ├── Dashboard.tsx      # User progress dashboard
│   │   │   ├── Courses.tsx        # Course listing and enrollment
│   │   │   ├── Lesson.tsx         # Video lesson + quiz page
│   │   │   ├── Quiz.tsx           # Quiz interface
│   │   │   ├── VRHub.jsx          # VR scenario selection hub
│   │   │   ├── VRScene.jsx        # VR scene entry point
│   │   │   └── Admin.tsx          # Admin dashboard (CRUD)
│   │   ├── components/            # Reusable UI components
│   │   │   ├── Navbar.tsx         # Navigation bar
│   │   │   ├── Footer.tsx         # Footer
│   │   │   ├── ProtectedRoute.tsx # Auth guard for private routes
│   │   │   ├── VRSceneRenderer.jsx # Three.js 3D scene renderer
│   │   │   └── VRDialogue.jsx     # In-VR dialogue and speech UI
│   │   ├── context/
│   │   │   └── AuthContext.tsx    # Global auth state (user, token)
│   │   ├── App.tsx                # Root component with routing
│   │   ├── main.tsx               # React entry point
│   │   └── index.css              # Global styles + Tailwind imports
│   ├── index.html
│   └── package.json
│
└── README.md
```

---

## 13. Browser Requirements

The following features **require Chrome or Edge**:

| Feature | API Used | Chrome | Edge | Firefox | Safari |
|---|---|---|---|---|---|
| Pronunciation recording | `SpeechRecognition` | ✅ | ✅ | ❌ | ❌ |
| Text-to-speech (NPC voice) | `speechSynthesis` | ✅ | ✅ | ⚠️ Partial | ⚠️ Partial |
| VR headset support | `WebXR` | ✅ | ✅ | ❌ | ❌ |

> All other features (courses, lessons, quizzes, admin panel) work in any modern browser. Only VR and speech features require Chrome or Edge.

---

## 14. Common Errors & Fixes

| Error | Cause | Fix |
|---|---|---|
| `MongoDB connection failed` | Wrong `MONGO_URI` or Atlas IP not whitelisted | Double-check `server/.env`. In Atlas, go to **Network Access** → add `0.0.0.0/0` |
| `JWT malformed` or `invalid signature` | Wrong or missing `JWT_SECRET` | Ensure `JWT_SECRET` is set in `server/.env` and matches what was used to sign existing tokens |
| `Microphone not working` / no speech recognized | Wrong browser | Switch to **Chrome** or **Edge**. Check that microphone permissions are allowed for `localhost` |
| White/blank VR scene | VR scenario has no dialogue steps | Log in as admin → go to **Admin Dashboard** → **VR Scenarios** → add dialogue steps to the scenario |
| `CORS error` in browser console | Frontend/backend port mismatch | Make sure backend runs on **port 5000** and frontend on **port 5173** |
| `Cannot find module '...'` | Dependencies not installed | Run `npm install` inside both `/server` and `/client` directories |
| `Port 5000 already in use` | Another process is using port 5000 | Change `PORT=5001` in `server/.env`, or kill the conflicting process |
| `401 Unauthorized` on API requests | JWT token expired or missing | Log out and log back in to get a fresh token |
| Seed script wipes existing data | Normal behavior | The seed scripts clear collections before inserting. Only run on a development database |
| `vite: command not found` | Running `npm run dev` from wrong directory | Make sure you are inside the `/client` folder, not the project root |

---

## 📝 License

This project is for educational purposes.

---

*Built with ❤️ using MongoDB, Express.js, React, Node.js, Three.js, WebXR, and the Web Speech API.*
