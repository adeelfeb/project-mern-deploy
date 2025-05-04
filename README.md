### 📘 **Setting Up and Running the Frontend (React) Codebase**

#### ✅ **1. Prerequisites**

Before proceeding, ensure that the following are installed on your system:

* **Node.js** (LTS version recommended — e.g., v18.x or v20.x):
  Node.js is a JavaScript runtime required for building and running React applications. It comes bundled with **npm** (Node Package Manager), which manages your project's dependencies.

  > 📌 To check if Node.js and npm are installed:

  ```bash
  node -v
  npm -v
  ```

If not installed, download from the official site: [https://nodejs.org](https://nodejs.org)

---

#### 📁 **2. Project Setup**

Once Node.js is installed, follow these steps:

1. **Clone the Repository** (if applicable):

   ```bash
   git clone https://github.com/adeelfeb/project-mern-deploy
   cd frontend
   ```

2. **Install Dependencies**:
   Inside the project directory (usually the root), run:

   ```bash
   npm install
   ```

   This will install all dependencies listed in the `package.json` file.

---

#### 🔐 **3. Environment Variables**

Many React projects depend on API keys or configuration values stored in a `.env` file. This file must exist in the project root and contain all required variables.

**Example of a `.env` file:**

```env
VITE_API_BASE_URL=https://api.example.com
VITE_AUTH_TOKEN=your_token_here
```

> 📌 **Important:**

* Prefix environment variables with `VITE_` if you're using Vite, as React apps built with Vite only expose variables with this prefix to the client.
* Ensure your `.env` file is **not** committed to version control (check `.gitignore`).

---

#### ▶️ **4. Running the Application in Development**

To start the development server:

```bash
npm run dev
```

This will:

* Start the React application.
* Automatically open it in your default browser (if configured).
* Enable hot-reloading (any code changes reflect in real-time).

> 📌 The default URL is usually `http://localhost:5173` (for Vite) or `http://localhost:3000` (for Create React App).

---

To build the app for deployment:

```bash
npm run build
```

---

### 🔚 **Final Notes**

* Always verify that all required `.env` variables are present and correctly configured.
* If you encounter issues like missing modules or version mismatches, try:

  ```bash
  rm -rf node_modules
  npm install
  ```
* Consider using **nvm (Node Version Manager)** for managing multiple Node versions if working on different projects.



---
## **1️⃣ Tech Stack for Frontend**  
- **Framework:** React (Switching to TypeScript for better type safety)  
- **State Management:** Redux Toolkit (RTK)  
- **UI Library:** Tailwind CSS / ShadCN (for modern UI components)  
- **Routing:** React Router  
- **Auth Management:** Clerk (since you’ve integrated it before)  
- **API Calls:** Axios / Fetch  
- **Storage:** Appwrite (for handling user-uploaded files and auth)  

---

## **2️⃣ Frontend Pages & Features**
### **🔹 1. Landing Page (Homepage)**
- **Hero Section:**  
  - Catchy tagline about how the tool helps users.  
  - A search bar to enter **YouTube video URLs**.  
  - A CTA button: **"Summarize Now"**.  

- **Features Section:**  
  - Explain key features: Summary, Transcript, Q&A, MCQs.  
  - How it works (video processing & AI-based answers).  
  - Trusted by X users (if you add testimonials).  

- **Footer:**  
  - Contact info, links to privacy policy, and social media.  

---

### **🔹 2. Dashboard (After Login)**
- Users can **see history** of their summarized videos.  
- **Saved transcripts & QnAs** are shown.  
- Option to **upload PDFs** for document summarization (future scope).  
- Profile settings (name, profile picture, logout).  

---

### **🔹 3. Video Summarization Page**
- **URL Input & Video Processing**
  - User enters a YouTube video link.  
  - API processes video, extracts transcript, and generates a summary.  

- **Generated Summary Display**
  - Short & detailed summaries available.  
  - Option to copy or download summary.  

- **Transcript Section**
  - Shows full transcript with timestamps.  
  - Language selection: **English, Hindi, Urdu** (as per your plan).  
  - Downloadable as **.txt or .srt** (for subtitles).  

---

### **🔹 4. Q&A + Assessment Page**
- **Auto-generated MCQs & Short-Answer Questions**
  - Multiple-choice questions (MCQs) based on the video.  
  - AI-generated Q&A (short answers).  
  - Users can attempt the quiz and get scores.  

- **Answer Evaluation System**
  - **MCQs**: Auto-scored.  
  - **Short Answers**: Evaluated by an **LLM model** (after processing).  
  - **User Score Tracking:** Stored in MongoDB, displayed on the dashboard.  

---

### **🔹 5. Authentication Pages**
- **Sign Up / Login Page**  
  - Using **Clerk** for easy integration.  
  - Social logins (Google, GitHub).  
  - Email/password authentication.  

- **Forgot Password / Reset Password**  
  - Reset option via email.  

---

## **3️⃣ UI/UX Enhancements**
### **💡 UI Components**
- **Modals & Toasts**: Success & error messages.  
- **Skeleton Loading States**: Before video processing completes.  
- **Dark Mode Toggle**: Modern UI touch.  

### **🎨 UI Libraries to Use**
- **Tailwind CSS + DaisyUI** (for prebuilt components).  
- **ShadCN (Optional)** if you need fancy UI elements.  
- **Framer Motion** (for animations).  

---

## **4️⃣ API Integration**
- **Backend:** Flask (or Node.js if you switch to TypeScript).  
- **Endpoints to Handle:**
  - `POST /summarize-video` → Process video, return summary & transcript.  
  - `POST /generate-qna` → Generate MCQs & QnAs from transcript.  
  - `POST /evaluate-answer` → Evaluate user’s short answers.  
  - `GET /user-history` → Fetch saved summaries & assessments.  

- **Axios Setup for API Calls:**  
  - Global config with base URL & error handling.  

---

## **5️⃣ Deployment**
- **Frontend:** Vercel / Netlify  
- **Backend:** Railway / Render / AWS (if scaling up)  

---

## **6️⃣ Future Enhancements**
🔹 **PDF Uploads for Summarization (Text-based RAG model).**  
🔹 **Chatbot (Gemini/OpenAI) for deeper Q&A on videos.**  
🔹 **User Leaderboard (Gamification of assessments).**  

---

