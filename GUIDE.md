# 🌐 Language Learning VR Platform — Complete Setup Guide

> **Who is this for?** This guide is written for anyone, even if you have never written a single line of code. Every step is explained in plain language. Just follow it from top to bottom and you'll have the app running on your computer.

---

## 📋 What You'll Do (Big Picture)

| Step | What you're doing | Time |
|---|---|---|
| 1 | Install 3 programs on your computer | ~10 min |
| 2 | Download the project | ~2 min |
| 3 | Create a free online database | ~5 min |
| 4 | Connect the database to the app | ~3 min |
| 5 | Start the app | ~2 min |
| 6 | Load sample data (optional) | ~1 min |

**Total: about 25 minutes for first-time setup.**

---

## ✅ Before You Start — Checklist

Make sure you have:

- [ ] A computer running **Windows 10 or later**, or **macOS 12 or later**
- [ ] An internet connection
- [ ] A web browser — **Google Chrome** or **Microsoft Edge** (not Firefox or Safari)
- [ ] About 500 MB of free disk space

> **Why Chrome or Edge?** The VR and microphone features in this app use browser technology that only works in Chrome and Edge. Everything else (courses, lessons, quizzes) works in any browser.

---

## STEP 1 — Install the Required Programs

You need to install **3 programs**. Do them in this order.

---

### 1A — Install Node.js

Node.js is the engine that runs the app's backend server.

**Windows:**
1. Open your browser and go to: **https://nodejs.org**
2. You'll see two buttons. Click the one that says **LTS** (it may show a version number like "20 LTS")
3. A file will download — open it when it's done
4. Click **Next** → **Next** → **Next** → **Install**
5. Wait for it to finish (about 1–2 minutes), then click **Finish**

**Mac:**
1. Go to **https://nodejs.org**
2. Click the **LTS** button
3. Open the `.pkg` file that downloads
4. Follow the installer prompts, clicking **Continue** and **Install**
5. Enter your Mac password if asked, then click **Finish**

**How to check it worked:**
> Open the terminal (instructions below in Step 2) and type `node --version` then press Enter. You should see something like `v20.x.x`. If you do, it's installed! ✅

---

### 1B — Install Git

Git is a tool that lets you download the project from the internet.

**Windows:**
1. Go to **https://git-scm.com/download/win**
2. The download should start automatically. If not, click the **64-bit Git for Windows Setup** link
3. Open the downloaded file
4. Keep clicking **Next** through all the screens — you don't need to change anything
5. Click **Install**, then **Finish**

**Mac:**
1. Open the **Terminal** app (press `Command + Space`, type "Terminal", press Enter)
2. Type this and press Enter:
   ```
   xcode-select --install
   ```
3. A window will pop up — click **Install** and wait for it to finish
4. Git is now installed ✅

**How to check it worked:**
> In the terminal, type `git --version` and press Enter. You should see something like `git version 2.x.x`. ✅

---

### 1C — (Optional) Install MongoDB Compass

MongoDB Compass is a visual app that lets you see and edit your database like a spreadsheet. You only need it if you want to manually look at your data.

1. Go to **https://www.mongodb.com/try/download/compass**
2. Click **Download**
3. Open the installer and follow the prompts

> This is **not required** to run the app. Skip it if you want to keep things simple.

---

## STEP 2 — Open the Terminal (Command Line)

The terminal is a text window where you'll type commands. It looks old-fashioned but it's perfectly safe — you're just giving instructions to your computer.

**On Windows:**
1. Press the **Windows key** (⊞) on your keyboard
2. Type **cmd** and press **Enter**
3. A black window will open — that's your terminal ✅

**On Mac:**
1. Press **Command (⌘) + Space** at the same time
2. Type **Terminal** and press **Enter**
3. A white or dark window will open — that's your terminal ✅

> 💡 **Tip:** You can copy commands from this guide and paste them into the terminal. On Windows, right-click to paste. On Mac, press Command+V.

---

## STEP 3 — Download the Project

In the terminal, type the following command and press **Enter**:

```
git clone https://github.com/parinitaaa/language-vr-platform.git
```

> ⚠️ **Important:** Replace the URL above with the actual link to the project. Ask the person who gave you this guide for the correct link if you don't have it.

After the download finishes, type this and press **Enter** to go into the project folder:

```
cd language-vr
```

> You should now see the folder name in your terminal prompt. That means you're in the right place. ✅

---

## STEP 4 — Install the App's Code Dependencies

The app needs additional code packages to work. We install them now.

### 4A — Install backend dependencies

Type this exactly and press **Enter**:

```
cd server
```

Then type this and press **Enter**:

```
npm install
```

⏳ Wait for it to finish. You'll see a lot of text scrolling by — that is completely normal. It may take 1–3 minutes.

When it's done, you'll see your cursor back at the `>` prompt.

---

### 4B — Install frontend dependencies

Now type this and press **Enter** to go to the frontend folder:

```
cd ../client
```

Then type this and press **Enter**:

```
npm install
```

⏳ Wait again. Same scrolling text — all normal. Takes another 1–3 minutes.

> ✅ **Done with Step 4!** Both sides of the app are now installed.

---

## STEP 5 — Create a Free Database (MongoDB Atlas)

The app stores all its data (users, courses, VR scenarios) in a database. We'll use **MongoDB Atlas**, which is completely free.

### 5A — Create your Atlas account

1. Open your browser and go to: **https://www.mongodb.com/atlas**
2. Click **Try Free**
3. Fill in your name, email address, and a password, then click **Create your Atlas account**
4. Check your email and confirm your account

---

### 5B — Create a free database cluster

After logging in:

1. Click the big green button that says **Create** or **Build a Cluster**
2. You'll see options with prices. Choose **M0** — it says **Free** next to it
3. Pick any cloud provider and region (the defaults are fine)
4. Click **Create Deployment**
5. Atlas will now take about 1–3 minutes to set up your database. You'll see a loading animation.

---

### 5C — Create a database user

A database user is like a key that allows the app to access the database.

> ⚠️ This is **different** from your Atlas account login. This is a separate username just for the database.

When prompted (or by going to **Database Access** in the left sidebar):

1. Click **Add New Database User**
2. Choose **Password** as the authentication method
3. Enter a username (example: `myuser`)
4. Enter a password — write this down! You'll need it in the next step.
   - Or click **Auto Generate** to get a random one — if you do this, copy it immediately.
5. Under **Database User Privileges**, keep it as **Read and write to any database**
6. Click **Add User**

---

### 5D — Allow your computer to connect

By default, Atlas blocks all connections. We need to whitelist your computer.

1. In the left sidebar, click **Network Access**
2. Click **Add IP Address**
3. Click the button that says **Allow Access from Anywhere**
4. You'll see `0.0.0.0/0` appear in the box — this is correct
5. Click **Confirm**

---

### 5E — Get your connection string

1. In the left sidebar, click **Database** (or **Clusters**)
2. Click **Connect** on your cluster
3. Click **Drivers**
4. Make sure the driver is set to **Node.js**
5. You'll see a connection string that looks like this:

   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Copy** this entire string
7. In the string, replace `<username>` with the username you created in Step 5C
8. Replace `<password>` with the password you wrote down in Step 5C
9. Also add the database name before the `?`: change `mongodb.net/` to `mongodb.net/language-platform`

The final result should look like:

```
mongodb+srv://myuser:mypassword123@cluster0.abc12.mongodb.net/language-platform?retryWrites=true&w=majority
```

**Keep this string handy — you'll paste it in the next step.**

---

## STEP 6 — Create the Settings File

The app needs a settings file (called `.env`) to know your database link and other configuration.

### 6A — Find the template file

1. Open your **File Explorer** (Windows) or **Finder** (Mac)
2. Navigate to the project folder, then open the **server** subfolder
3. Look for a file called **.env.example**

> **Can't see it on Windows?** Open the **View** tab at the top of File Explorer and check the box labelled **Hidden items**. The file will now appear.

---

### 6B — Make a copy and rename it

1. Right-click on `.env.example`
2. Click **Copy**
3. Right-click in an empty area of the same folder → **Paste**
4. Right-click the new copy → **Rename**
5. Name it exactly: `.env` (just remove the word "example", including the dot before it)

> ⚠️ The file name must be exactly `.env` — not `env.txt` or `.env.example`. If Windows adds `.txt` to the end, you may need to rename it again and remove the `.txt`.

---

### 6C — Edit the file

1. Right-click on `.env` → **Open with** → **Notepad** (Windows) or **TextEdit** (Mac)
2. You'll see the file contents. Edit it to look like this:

```
PORT=5000
MONGO_URI=your-connection-string-here
JWT_SECRET=any-random-words-here
JWT_EXPIRE=7d
```

- **PORT** — leave it as `5000`
- **MONGO_URI** — paste the connection string you copied in Step 5E
- **JWT_SECRET** — type any random words or characters (example: `mysupersecretkey12345abc`). This is a security key — just make it something hard to guess.
- **JWT_EXPIRE** — leave it as `7d`

3. Save the file (press **Ctrl+S** on Windows or **Command+S** on Mac)

**Example of what a finished `.env` file looks like:**

```
PORT=5000
MONGO_URI=mongodb+srv://myuser:mypassword123@cluster0.abc12.mongodb.net/language-platform?retryWrites=true&w=majority
JWT_SECRET=myRandomSecret_XyZ_9876
JWT_EXPIRE=7d
```

---

## STEP 7 — Start the App

You'll need **two terminal windows** open at the same time. One runs the backend server, one runs the frontend.

---

### Terminal Window 1 — Start the Backend Server

1. Open a terminal window (see Step 2 for how to open one)
2. Navigate to your project's **server** folder:

   **On Windows:**
   ```
   cd C:\Users\YourName\language-vr\server
   ```
   *(Replace `YourName` with your actual Windows username)*

   **On Mac:**
   ```
   cd ~/language-vr/server
   ```

3. Start the server:
   ```
   npm run dev
   ```

4. After a few seconds you should see:
   ```
   MongoDB Connected
   Server running on port 5000
   ```

   ✅ If you see this, the backend is running! **Leave this window open.**

> ❌ **If you see an error instead**, jump to the [Troubleshooting](#troubleshooting) section at the bottom.

---

### Terminal Window 2 — Start the Frontend

1. Open a **second** terminal window (same steps as before)
2. Navigate to the **client** folder:

   **On Windows:**
   ```
   cd C:\Users\YourName\language-vr\client
   ```

   **On Mac:**
   ```
   cd ~/language-vr/client
   ```

3. Start the frontend:
   ```
   npm run dev
   ```

4. After a few seconds you should see:
   ```
   VITE ready in xxx ms

     ➜  Local:   http://localhost:5173/
   ```

   ✅ The frontend is running! **Leave this window open too.**

---

## STEP 8 — Open the App in Your Browser

1. Open **Google Chrome** or **Microsoft Edge**
2. In the address bar at the top, type:
   ```
   http://localhost:5173
   ```
3. Press **Enter**

🎉 **You should now see the Language Learning VR Platform!**

> If the page doesn't load, make sure both terminal windows from Step 7 are still open and running.

---

## STEP 9 — Load Sample Data (Optional but Recommended)

If you want the app to come pre-loaded with sample courses, lessons, quizzes, and VR scenarios, run these two commands.

> ⚠️ **Warning:** These commands will delete and replace any existing data in your database. Only run them on a fresh install or a test database.

Go to **Terminal Window 1** (the backend one). Press **Ctrl+C** to stop the server first.

Then type:

```
node seed.js
```

Wait for it to finish, then type:

```
node seedVR.js
```

After both finish, restart the server:

```
npm run dev
```

**What gets created:**

| What | Details |
|---|---|
| Admin account | Email: `admin@example.com` Password: `password123` |
| Regular user account | Email: `user@example.com` Password: `password123` |
| Sample courses | *Spanish for Beginners*, *Advanced French Conversation* |
| Sample lessons | 2 video lessons with YouTube videos |
| Sample quizzes | 2 quiz sets with multiple-choice questions |
| VR scenarios | 3 scenarios: Coffee Shop, Airport Check-In, Market Shopping |

You can now log in with `admin@example.com` / `password123` and explore everything.

---

## STEP 10 — Create Your Own Admin Account

If you register a new account yourself through the app, it will be a regular user by default. To give it admin powers:

### Method 1: Via MongoDB Atlas (Easiest)

1. Go to **https://www.mongodb.com/atlas** and log in
2. Click your cluster name
3. Click **Browse Collections**
4. Click on the **language-platform** database, then the **users** collection
5. Find your account by looking for your email address
6. Click the **pencil icon** (edit) on your user document
7. Find the field that says `"role": "user"`
8. Change `"user"` to `"admin"`
9. Click **Update**
10. Go back to the app → log out → log back in

✅ You'll now see the **Admin Dashboard** in the navigation menu. From there you can add/edit/delete courses, lessons, quizzes, and VR scenarios.

---

## STEP 11 — How to Use the App

Once you're logged in, here's a quick overview of what you can do:

### As a Regular User
| Feature | Where to find it |
|---|---|
| Browse courses | Click **Courses** in the top menu |
| Enroll in a course | Open any course → click **Enroll** |
| Watch a lesson | Open an enrolled course → click on a lesson |
| Take a quiz | After watching a lesson, a quiz button appears |
| Practice VR speaking | Click **VR Hub** in the top menu |
| Track your progress | Click **Dashboard** in the top menu |

### As an Admin
All of the above, plus:

| Feature | Where to find it |
|---|---|
| Add/edit/delete courses | **Admin Dashboard** → Courses tab |
| Add/edit/delete lessons | **Admin Dashboard** → Lessons tab |
| Add/edit quiz questions | **Admin Dashboard** → Quizzes tab |
| Add/edit VR scenarios | **Admin Dashboard** → VR Scenarios tab |

---

## STEP 12 — Stopping and Restarting the App

### To stop the app:
In each terminal window, press **Ctrl + C**. The server will stop.

### To start the app again later:
You don't need to redo all the steps. Just open two terminals and repeat Step 7:

**Terminal 1:**
```
cd path/to/language-vr/server
npm run dev
```

**Terminal 2:**
```
cd path/to/language-vr/client
npm run dev
```

Then visit `http://localhost:5173` in Chrome or Edge.

---

## 🔧 Troubleshooting

Here are the most common problems and how to fix them.

---

### ❌ "npm is not recognized" or "node is not recognized"

**What it means:** Node.js was not installed correctly, or your terminal needs to be restarted.

**Fix:**
1. Close the terminal
2. Open it again
3. Try the command again

If it still doesn't work, go back to **Step 1A** and reinstall Node.js.

---

### ❌ "MongoDB connection failed" or "MongoServerError"

**What it means:** The app can't connect to your database.

**Fix — checklist:**
- [ ] Open `server/.env` and check that `MONGO_URI=` has your connection string (no spaces around the `=`)
- [ ] Make sure you replaced `<username>` and `<password>` in the connection string with your actual database username and password
- [ ] Make sure you added `language-platform` before the `?` in the connection string
- [ ] Go to MongoDB Atlas → **Network Access** → make sure `0.0.0.0/0` is listed. If not, add it.
- [ ] Make sure your internet is working

---

### ❌ "Port 5000 is already in use"

**What it means:** Something else on your computer is already using that port.

**Fix:**
Open `server/.env` and change `PORT=5000` to `PORT=5001`, save the file, and restart the server.

---

### ❌ "CORS error" in the browser

**What it means:** The frontend and backend are running on different ports than expected.

**Fix:** Make sure:
- Backend is running on port **5000** (`npm run dev` inside `server/`)
- Frontend is running on port **5173** (`npm run dev` inside `client/`)
- You are opening `http://localhost:5173` in the browser, not port 5000

---

### ❌ Microphone not working / speech not recognized

**What it means:** The browser doesn't support speech recognition.

**Fix:**
- Switch to **Google Chrome** or **Microsoft Edge** — these are the only browsers that support this feature
- When the browser asks "Allow this site to use your microphone?", click **Allow**
- Make sure your microphone is plugged in and working

---

### ❌ VR scene is blank or white

**What it means:** The VR scenario has no dialogue content yet.

**Fix:**
1. Log in as an admin account
2. Go to **Admin Dashboard** → **VR Scenarios**
3. Open a scenario and add dialogue steps to it

---

### ❌ "I can't find the .env file"

**What it means:** Hidden files are not visible in your file explorer.

**Fix on Windows:**
1. Open the `server` folder in File Explorer
2. Click the **View** tab at the top of the window
3. Check the box that says **Hidden items**
4. The `.env` file should now appear

---

### ❌ The page at localhost:5173 won't load

**What it means:** One or both parts of the app are not running.

**Fix:**
- Check that **both** terminal windows are open and running
- Look for error messages in the terminals
- If a terminal shows an error, re-read the step it corresponds to and try the commands again
- Make sure you used **Chrome or Edge**, not Firefox or Safari

---

### ❌ "Cannot find module '...'" error

**What it means:** The app's code packages were not installed.

**Fix:**
- Make sure you ran `npm install` inside **both** the `server/` folder AND the `client/` folder
- If you're not sure, run `npm install` again — it won't cause any harm

---

### ❌ "401 Unauthorized" error

**What it means:** Your login session has expired.

**Fix:** Log out of the app and log back in. Your session will refresh.

---

## 🌐 Browser Compatibility Summary

| Feature | Chrome | Edge | Firefox | Safari |
|---|---|---|---|---|
| Courses & Lessons | ✅ | ✅ | ✅ | ✅ |
| Quizzes | ✅ | ✅ | ✅ | ✅ |
| Admin Dashboard | ✅ | ✅ | ✅ | ✅ |
| **VR Pronunciation (Microphone)** | ✅ | ✅ | ❌ | ❌ |
| **Text-to-Speech (NPC Voice)** | ✅ | ✅ | ⚠️ Partial | ⚠️ Partial |
| **VR Headset Support** | ✅ | ✅ | ❌ | ❌ |

**Use Chrome or Edge for the best experience.**

---

## 📁 What's in Each Folder

You don't need to touch these, but it's good to know what they are:

```
language-vr/
├── server/          ← The backend. Handles data, logins, and database.
│   ├── .env         ← Your private settings file (you created this)
│   ├── seed.js      ← Script to load sample courses and users
│   └── seedVR.js    ← Script to load sample VR scenarios
│
├── client/          ← The frontend. What you see in the browser.
│
├── README.md        ← Technical documentation (for developers)
├── SETUP.md         ← Simplified setup steps
├── GUIDE.md         ← This file — the full beginner guide
└── install.md       ← Quick reference for developers
```

---

## 🎉 You're All Set!

If the app is running and you can see it at `http://localhost:5173`, congratulations — you've set it up successfully!

Here's a quick summary of what's running:
- 🟢 **Backend server** → `http://localhost:5000` (handles all the data)
- 🟢 **Frontend** → `http://localhost:5173` (what you use in the browser)
- 🟢 **Database** → MongoDB Atlas (your free cloud database)

---

*If you get completely stuck, take a screenshot of the error message and share it with the person who gave you this guide.*
