# Language Learning Platform (MERN Stack)

A fully functional web application for language learning, featuring authentication, course browsing, lesson viewing with embedded videos, interactive quizzes, and progress tracking.

## Prerequisites for Windows

Make sure you have the following installed on your Windows machine:
1. **Node.js**: Download and install from [nodejs.org](https://nodejs.org/).
2. **MongoDB**: Download and install MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community). Ensure MongoDB service is running.
3. **Git** (optional but recommended).

## Setup Instructions

### 1. Clone or Download the Repository
Navigate to the project folder (`language-vr`) in your terminal or PowerShell.

### 2. Set Up Environment Variables
Create a file named `.env` in the `server` directory. You can copy the contents from `.env.example`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/language-platform
JWT_SECRET=super_secret_jwt_key_12345
```

### 3. Backend Setup
Open a terminal and run the following commands:
```powershell
cd server
npm install
npm run dev
```
*(Note: If `npm run dev` is not available, you can use `node index.js` or install `nodemon` globally and run `nodemon index.js`)*

#### Seed the Database (Optional)
To populate the database with sample courses, lessons, and quizzes:
```powershell
cd server
node seed.js
```
*This will create an Admin user (`admin@example.com` / `password123`) and a Test user (`user@example.com` / `password123`).*

### 4. Frontend Setup
Open a **new** terminal and run the following commands:
```powershell
cd client
npm install
npm run dev
```

### 5. View the App
Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173/`).

## Features Included
- **Phase 1**: Authentication (JWT + bcrypt), Course Listings, Enrollment.
- **Phase 2**: Interactive Lessons (Text & Video), Quizzes with Instant Feedback, Dashboard with Progress Tracking.
- **Admin**: Simple panel to create new courses.

## Tech Stack
- Frontend: React.js (Vite), Tailwind CSS v4, React Router v7, Context API
- Backend: Node.js, Express.js
- Database: MongoDB + Mongoose
