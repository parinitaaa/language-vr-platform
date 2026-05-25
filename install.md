# Quick Install Guide

Get the app running in 5 steps.

---

## Step 1 — Install backend dependencies

```bash
cd server && npm install
```

---

## Step 2 — Install frontend dependencies

```bash
cd ../client && npm install
```

---

## Step 3 — Set up your environment file

```bash
cp server/.env.example server/.env
```

Then open `server/.env` and fill in:

- `MONGO_URI` — your MongoDB connection string (from MongoDB Atlas or local MongoDB)
- `JWT_SECRET` — any long random string (e.g. `mysecretkey123abc`)
- `PORT` — leave as `5000`

See `README.md` Section 5–8 for detailed instructions on getting these values.

---

## Step 4 — Run the app

Open **two separate terminal windows**.

**Terminal 1 — Backend:**

```bash
cd server && npm run dev
```

Expected output:
```
MongoDB Connected
Server running on port 5000
```

**Terminal 2 — Frontend:**

```bash
cd client && npm run dev
```

Expected output:
```
VITE v8.x  ready

  ➜  Local:   http://localhost:5173/
```

---

## Step 5 — Open in browser

```
http://localhost:5173
```

> **Use Chrome or Edge only.** Firefox and Safari do not support the speech recognition and VR features.

---

## Optional — Seed sample data

Run these from the `server/` directory after the backend is connected to MongoDB:

```bash
node seed.js      # adds sample courses, lessons, quizzes, and two test accounts
node seedVR.js    # adds 3 VR scenarios (coffee shop, airport, market)
```

After running `seed.js`, you can log in with:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@example.com` | `password123` |
| User | `user@example.com` | `password123` |
