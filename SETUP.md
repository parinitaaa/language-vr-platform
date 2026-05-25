# 🚀 How to Set Up the App (No Coding Experience Needed)

Follow these steps in order. Take your time. You've got this!

---

## Step 1 — Download and Install These Programs

Install them one at a time, in this order.

---

### 1a. Install Node.js

This is what makes the app run.

1. Go to **https://nodejs.org**
2. Click the big green button that says **LTS**
3. Open the file that downloads
4. Keep clicking **Next** and then **Install**
5. Wait for it to finish, then click **Finish**

> This might take a couple of minutes. That's normal.

---

### 1b. Install Git

This lets you download the project.

1. Go to **https://git-scm.com**
2. Click the **Download** button
3. Open the file that downloads
4. Keep clicking **Next** all the way through
5. Click **Install**, then **Finish**

> You don't need to change any of the default settings. Just keep clicking Next.

---

### 1c. Install MongoDB Compass (Optional)

This lets you see your database visually, like a spreadsheet.

1. Go to **https://www.mongodb.com/products/compass**
2. Click **Download**
3. Open the file and install it like a normal app

> You only need this if you want to look at or edit your data visually. It's not required to run the app.

---

## Step 2 — Open the Terminal

The terminal is a text window where you type commands.

**On Windows:**
1. Press the **Windows key** on your keyboard
2. Type **cmd**
3. Press **Enter**

A black window will open. That's the terminal.

**On Mac:**
1. Press **Command + Space** at the same time
2. Type **terminal**
3. Press **Enter**

A window will open. That's the terminal.

> The terminal might look scary but you're just going to copy and paste things into it.

---

## Step 3 — Download the Project

Type these into the terminal **one line at a time**. Press **Enter** after each line.

```
git clone <your-repo-url>
```

```
cd language-vr
```

> Replace `<your-repo-url>` with the actual link to the project. Ask the person who gave you this guide for that link.

---

## Step 4 — Install Everything the App Needs

Now we install the app. Copy and paste each line one at a time and press **Enter** after each one.

**First, the backend (the server side):**

```
cd server
```

```
npm install
```

> Wait for it to finish. You'll see a lot of text scrolling by. That's normal. It might take a minute or two.

**Then, the frontend (the visual side):**

```
cd ../client
```

```
npm install
```

> Wait for this one to finish too. Same thing — lots of scrolling text is normal.

---

## Step 5 — Create Your Settings File

The app needs a settings file to know how to connect to the database.

> ⚠️ **Security:** This file contains your database password and secret key. **Never share it with anyone and never push it to GitHub.** It is already listed in `.gitignore` so it will not be pushed automatically — but be careful.

1. On your computer, open the **server** folder inside the project folder
2. Find a file called **.env.example**

> If you can't see it on Windows, go to the **View** tab at the top of the folder and check the box that says **Hidden items**.

3. Make a **copy** of that file
4. Rename the copy to **.env** (just remove the word "example")
5. Right-click the **.env** file and open it with **Notepad** (Windows) or **TextEdit** (Mac)
6. You'll see these lines. Fill them in:

```
PORT=5000
MONGO_URI=        ← you will paste your database link here in Step 6
JWT_SECRET=       ← type any random words here, like: mysecretkey123
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

> Don't worry about what these mean. Just fill them in. You'll get the MONGO_URI link in the next step. Leave PORT, JWT_EXPIRE, and CLIENT_URL exactly as shown.

---

## Step 6 — Set Up Your Free Database (MongoDB Atlas)

This is where the app saves all of its data. It's completely free.

1. Go to **https://www.mongodb.com/atlas**
2. Click **Try Free** and create an account
3. After logging in, click **Create** and choose the **free option** — it says **M0** and **Free**
4. It will ask you to create a **database username and password**
   - Write these down somewhere safe
   - This is NOT your Atlas account login — it's a separate username just for the database
5. When it asks about **IP Address**, type this exactly:

```
0.0.0.0/0
```

Then click **Add Entry**. This allows your computer to connect.

6. Click **Connect** → then **Drivers**
7. You'll see a long link that starts with **mongodb+srv://**
8. Copy that whole link
9. In the link, find the part that says **\<password\>** and replace it with the password you wrote down in step 4
10. Open your **.env** file again and paste the whole link after **MONGO_URI=**

It should look something like this:

```
MONGO_URI=mongodb+srv://myusername:mypassword123@cluster0.abc12.mongodb.net/language-platform?retryWrites=true&w=majority
```

> Make sure there are no spaces before or after the link.

---

## Step 7 — Start the App

You need **two terminal windows** open at the same time.

**Terminal Window 1 — Start the server:**

Open a terminal and type these one at a time:

```
cd language-vr
```

```
cd server
```

```
npm run dev
```

You should see:

```
MongoDB Connected
Server running on port 5000
```

> If you see this, great! Leave this window open and don't close it.

**Terminal Window 2 — Start the visual part:**

Open a **second** terminal window and type these one at a time:

```
cd language-vr
```

```
cd client
```

```
npm run dev
```

You should see a line that says something like:

```
Local:   http://localhost:5173/
```

> Leave this window open too. Both need to stay running while you use the app.

---

## Step 8 — Open the App

1. Open **Google Chrome** or **Microsoft Edge**
2. Go to this address:

```
http://localhost:5173
```

3. You should see the app!

> You must use **Chrome or Edge**. Firefox and Safari will not work for the microphone and VR features.

---

## Step 9 — Make Yourself an Admin

Do this **after** you create an account inside the app.

1. Go to **https://www.mongodb.com/atlas** and log in
2. Click your cluster, then click **Browse Collections**
3. Click the **users** collection
4. Find your account — look for your email address
5. Click the **pencil icon** to edit your account
6. Find the part that says **"role": "user"**
7. Change **"user"** to **"admin"**
8. Save the change
9. Go back to the app, log out, and log back in

> Now you'll see the Admin Dashboard in the menu. From there you can add courses, lessons, and VR scenarios.

---

## Step 10 — If Something Goes Wrong

**"npm install is not working"**
→ You probably haven't installed Node.js yet. Go back to Step 1 and install it first.

**"MongoDB not connecting" or "MongoDB connection failed"**
→ The link in your `.env` file might be wrong. Open it and check that you pasted the full `MONGO_URI` link and replaced `<password>` with your actual password.

**"Microphone is not working"**
→ You must be using **Chrome** or **Edge**. Switch browsers and try again. Also check that you clicked **Allow** when the browser asked for microphone permission.

**"The VR scene is blank or white"**
→ Log in as admin and go to the Admin Dashboard. Open a VR scenario and add some dialogue steps to it first.

**"I can't find the .env file"**
→ On Windows, open the server folder, click the **View** tab at the top, and check the box called **Hidden items**. The file should now appear.

**"Page not loading at all"**
→ Make sure both terminal windows are still open and running. If either one shows an error, re-read the step and try the commands again.

---

## You're Done! 🎉

If everything is running, open **http://localhost:5173** in Chrome or Edge and start exploring the app.

If you get stuck, don't panic — read the error message carefully and match it to the list above.
