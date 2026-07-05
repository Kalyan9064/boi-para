# 🔍 Troubleshooting Guide for Boi Para

This guide provides solutions to common issues you might encounter while setting up or running the Boi Para project. Please read through the relevant sections before seeking further assistance.

---

## Table of Contents
- [General Issues](#general-issues)
  - [Prerequisites Not Met](#prerequisites-not-met)
  - [Repository Cloning Problems](#repository-cloning-problems)
  - [`npm install` Failures](#npm-install-failures)
  - [Node.js Version Mismatch](#nodejs-version-mismatch)
  - [Port Already In Use](#port-already-in-use)
- [Backend-Specific Issues](#backend-specific-issues)
  - [Backend Server Fails to Start](#backend-server-fails-to-start)
  - [MongoDB Connection Errors](#mongodb-connection-errors)
  - [CORS Errors (Cross-Origin Resource Sharing)](#cors-errors-cross-origin-resource-sharing)
  - [JWT Authentication Issues](#jwt-authentication-issues)
  - [Image Upload (Cloudinary) Problems](#image-upload-cloudinary-problems)
  - [Email Sending (Brevo/Nodemailer) Failures](#email-sending-brevonomodemailer-failures)
  - [Gemini AI API Key Issues](#gemini-ai-api-key-issues)
  - [API Endpoints Returning 404 or 500 Errors](#api-endpoints-returning-404-or-500-errors)
- [Frontend-Specific Issues](#frontend-specific-issues)
  - [Frontend Application Fails to Start](#frontend-application-fails-to-start)
  - [Blank Page or UI Not Rendering](#blank-page-or-ui-not-rendering)
  - [API Requests Failing (Network or CORS)](#api-requests-failing-network-or-cors)
  - [Incorrect Data Display or Missing Content](#incorrect-data-display-or-missing-content)
  - [React Router DOM Issues](#react-router-dom-issues)
- [Getting Further Help](#getting-further-help)

---

## General Issues

### Prerequisites Not Met
**Problem:** The project requires specific software (Git, Node.js, npm, MongoDB). If any are missing or incorrectly installed, you might face errors.
**Solution:** Ensure all [prerequisites](#prerequisites) listed in `CONTRIBUTING.md` or `README.md` are installed correctly and meet the minimum version requirements. For Node.js, use `node -v` to check your version.

### Repository Cloning Problems
**Problem:** Issues while cloning the repository (e.g., "repository not found", permission denied).
**Solution:**
1.  Verify the repository URL is correct: `https://github.com/Kalyan9064/boi-para.git`.
2.  If you are cloning your fork, ensure the URL is `https://github.com/<your-username>/boi-para.git`.
3.  Check your internet connection.
4.  If using SSH, ensure your SSH keys are set up correctly on GitHub.

### `npm install` Failures
**Problem:** `npm install` command fails in either the `Backend` or `Frontend` directory with dependency errors.
**Solution:**
1.  **Clear npm cache:**
    ```bash
    npm cache clean --force
    ```
2.  **Delete `node_modules` and `package-lock.json`:**
    ```bash
    # In Backend directory
    rm -rf node_modules package-lock.json
    # In Frontend directory
    rm -rf node_modules package-lock.json
    ```
3.  **Try installing again:**
    ```bash
    npm install
    ```
4.  **Check Node.js/npm versions:** Ensure they are compatible with project dependencies.
5.  **Network issues:** If you are behind a proxy or have a slow connection, try again.

### Node.js Version Mismatch
**Problem:** Some dependencies might require a specific Node.js version, leading to build errors or runtime issues.
**Solution:**
1.  Check your current Node.js version: `node -v`.
2.  The project is developed with Node.js 18+. Consider using a Node Version Manager (NVM) to manage multiple Node.js versions.
    -   **Install NVM:** Follow instructions on the [NVM GitHub page](https://github.com/nvm-sh/nvm).
    -   **Install recommended Node.js version:** `nvm install 18`
    -   **Use the version:** `nvm use 18`
    -   **Set default (optional):** `nvm alias default 18`

### Port Already In Use
**Problem:** When starting the backend or frontend, you see an error like "Port 5000 is already in use" or "Port 5173 is already in use".
**Solution:**
1.  **Identify and kill the process:**
    -   **On Linux/macOS:**
        ```bash
        sudo lsof -i :<PORT_NUMBER>
        kill -9 <PID>
        ```
        (Replace `<PORT_NUMBER>` with 5000 or 5173, and `<PID>` with the process ID from `lsof` output.)
    -   **On Windows (PowerShell):**
        ```powershell
        Get-NetTCPConnection -LocalPort <PORT_NUMBER> | Select-Object OwningProcess
        Stop-Process -Id <OwningProcessId> -Force
        ```
        (Replace `<PORT_NUMBER>` with 5000 or 5173, and `<OwningProcessId>` with the process ID.)
2.  **Change the port:**
    -   **Backend:** Edit `PORT` in `Backend/.env` to another available port (e.g., `5001`). Remember to also update `VITE_API_URL` in `Frontend/.env` and `CLIENT_URL` in `Backend/.env` accordingly.
    -   **Frontend:** Vite usually suggests another port automatically. If not, you can specify it in `vite.config.js` or in `package.json` `dev` script.

---

## Backend-Specific Issues

### Backend Server Fails to Start
**Problem:** Running `npm start` in `Backend` results in errors and the server does not become active.
**Solution:**
1.  **Check `.env` file:** Ensure `Backend/.env` exists and all variables are set correctly as per `Backend/.env.example`. Missing or malformed variables can cause startup failures.
2.  **Review console output:** Look for specific error messages. Mongoose connection errors, JWT secret errors, or unhandled exceptions are common.
3.  **Dependency issues:** Rerun `npm install` (see [`npm install` Failures](#npm-install-failures)).
4.  **Syntax errors:** If you recently made changes, carefully review your code for syntax errors.

### MongoDB Connection Errors
**Problem:** Server starts but fails to connect to MongoDB, showing errors like "MongooseServerSelectionError", "authentication failed", or "connection timed out".
**Solution:**
1.  **Verify `MONGO_URI`:**
    -   Ensure `MONGO_URI` in `Backend/.env` is correct and includes your username and password if applicable.
    -   It should start with `mongodb+srv://` for Atlas or `mongodb://` for local.
2.  **MongoDB Atlas IP Whitelist:** If using MongoDB Atlas, ensure your current IP address is whitelisted in your Atlas project's Network Access settings. Add `0.0.0.0/0` for temporary unrestricted access (not recommended for production).
3.  **Local MongoDB:** If running locally, ensure your MongoDB server is running.
    -   On Linux/macOS: `sudo systemctl status mongod` or `brew services list`.
    -   On Windows: Check services.
4.  **Firewall:** Check if a firewall is blocking the connection to MongoDB (local or remote).

### CORS Errors (Cross-Origin Resource Sharing)
**Problem:** Frontend cannot make requests to the backend, resulting in "CORS policy" errors in the browser console.
**Solution:**
1.  **`CLIENT_URL` in `Backend/.env`:** Ensure `CLIENT_URL` in `Backend/.env` exactly matches the URL where your frontend is running (e.g., `http://localhost:5173`).
2.  **`cors` middleware:** Verify that the `cors` middleware is correctly configured in `Backend/server.js` to allow requests from your `CLIENT_URL`.
    ```javascript
    // Backend/server.js (snippet)
    app.use(cors({
        origin: process.env.CLIENT_URL, // Ensure this matches frontend URL
        credentials: true,
    }));
    ```
3.  **No trailing slash:** Ensure `CLIENT_URL` doesn't have a trailing slash (e.g., `http://localhost:5173` not `http://localhost:5173/`).

### JWT Authentication Issues
**Problem:** Users cannot log in, tokens are invalid, or protected routes deny access unexpectedly.
**Solution:**
1.  **`JWT_SECRET`:** Ensure `JWT_SECRET` in `Backend/.env` is set to a strong, unique value and is consistent.
2.  **Token Expiry:** Check the token's expiration time. If you're testing, ensure tokens aren't expiring too quickly.
3.  **Middleware:** Verify `authMiddleware.js` is correctly applied to protected routes and handles token extraction and verification.
4.  **Client-side storage:** Ensure the frontend is correctly storing (e.g., in localStorage or http-only cookies) and sending the JWT token with authenticated requests.

### Image Upload (Cloudinary) Problems
**Problem:** Book images are not uploading, or you get errors related to Cloudinary.
**Solution:**
1.  **Cloudinary Credentials:** Double-check `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in `Backend/.env`. These must be exact.
2.  **Cloudinary Configuration:** Verify `Backend/config/cloudinary.js` is correctly initialized with the environment variables.
3.  **`multer` and `multer-storage-cloudinary`:** Ensure these dependencies are correctly configured in your upload routes (e.g., `Backend/routes/book.js`) and handling multipart form data.
4.  **File Size/Type:** Check if the image being uploaded exceeds Cloudinary's limits or is an unsupported file type.

### Email Sending (Brevo/Nodemailer) Failures
**Problem:** Verification emails or other system emails are not being sent.
**Solution:**
1.  **Email Configuration:** Check `EMAIL_USER` and `BREVO_API_KEY` in `Backend/.env`.
    -   `EMAIL_USER` should be a valid email address that you have configured in Brevo.
    -   `BREVO_API_KEY` is your API key from your Brevo (Sendinblue) account.
2.  **`sendEmail.js`:** Verify the `Backend/utils/sendEmail.js` function is correctly configured to use Nodemailer with Brevo's SMTP settings.
3.  **Brevo Account Status:** Ensure your Brevo account is active and has sending credit/allowance. Check for any sending restrictions or bounce rates in your Brevo dashboard.
4.  **Spam folder:** Check the recipient's spam or junk folder.

### Gemini AI API Key Issues
**Problem:** AI-related features (if implemented) are not working, or you get API errors from the Gemini service.
**Solution:**
1.  **`GEMINI_API_KEY`:** Ensure `GEMINI_API_KEY` in `Backend/.env` is set and is a valid API key obtained from Google AI Studio.
2.  **API Rate Limits:** Check if you're hitting any rate limits with the Gemini API.
3.  **Network Connectivity:** Ensure your backend server has outbound internet access to reach the Gemini API.

### API Endpoints Returning 404 or 500 Errors
**Problem:** Specific backend API routes return "404 Not Found" or "500 Internal Server Error".
**Solution:**
1.  **404 Not Found:**
    -   **Route definition:** Check `Backend/routes/` files (e.g., `book.js`, `auth.js`) to ensure the route is correctly defined and spelled.
    -   **Middleware order:** Ensure routes are defined *before* any catch-all error handlers.
    -   **HTTP Method:** Verify you are using the correct HTTP method (GET, POST, PUT, DELETE) for the endpoint.
2.  **500 Internal Server Error:**
    -   **Server logs:** The 500 error usually indicates an unhandled exception on the server. Check the backend terminal for detailed error messages, stack traces, and database operation failures.
    -   **Input validation:** Errors can occur if the backend expects certain data formats or fields that are not provided or are incorrect.
    -   **Database operations:** Mongoose queries or save operations might be failing.

---

## Frontend-Specific Issues

### Frontend Application Fails to Start
**Problem:** Running `npm run dev` in `Frontend` results in errors and the application doesn't open in the browser.
**Solution:**
1.  **Check console output:** Look for specific errors in the terminal, often related to JavaScript syntax, module imports, or Vite configuration.
2.  **Dependency issues:** Rerun `npm install` (see [`npm install` Failures](#npm-install-failures)).
3.  **`VITE_API_URL`:** Ensure `Frontend/.env` exists and `VITE_API_URL` is set correctly to your backend URL (e.g., `http://localhost:5000`).
4.  **Syntax errors:** If you recently made changes, carefully review your React components and JavaScript files for syntax errors.

### Blank Page or UI Not Rendering
**Problem:** The browser opens but shows a blank page, or only parts of the UI are visible.
**Solution:**
1.  **Browser Console:** Open your browser's developer tools (F12) and check the "Console" tab for JavaScript errors. These errors are usually the primary cause.
2.  **Network Tab:** In the developer tools, check the "Network" tab to see if API requests are being made and what their responses are. Look for failed requests (red).
3.  **`main.jsx` and `App.jsx`:** Ensure these entry files are correctly structured and `App` is being rendered properly.
4.  **Component Errors:** A faulty component might be crashing the entire application. Comment out recently added components to isolate the issue.

### API Requests Failing (Network or CORS)
**Problem:** Frontend components are unable to fetch data from the backend.
**Solution:**
1.  **Backend Running:** Ensure your backend server is running and accessible at `http://localhost:5000` (or your configured port).
2.  **`VITE_API_URL`:** Verify `VITE_API_URL` in `Frontend/.env` precisely matches your backend's URL.
3.  **Browser Console (Network & Console tabs):**
    -   **Network Tab:** Look for requests with a red status (e.g., 404, 500, or a network error).
    -   **Console Tab:** Check for CORS errors (see [CORS Errors](#cors-errors-cross-origin-resource-sharing)).
4.  **Frontend `api.js`:** Ensure that the `axios` instance in `Frontend/src/api/api.js` is correctly configured to use `VITE_API_URL`.

### Incorrect Data Display or Missing Content
**Problem:** Data fetched from the backend is not displayed correctly, or certain elements are missing.
**Solution:**
1.  **Backend API Response:** Use your browser's network tab or a tool like Postman to check the raw response from the backend API. Is the data structured as expected?
2.  **Frontend State Management:** Verify that the frontend components are correctly processing and storing the fetched data in their state.
3.  **Component Props:** Ensure data is correctly passed down as props to child components.
4.  **Conditional Rendering:** If elements are missing, check if they are hidden due to incorrect conditional rendering logic (e.g., `if (!data) return null;`).

### React Router DOM Issues
**Problem:** Navigation links don't work, pages don't load, or you get "No routes matched location" errors.
**Solution:**
1.  **Route Definitions:** Check `Frontend/src/App.jsx` and any other routing files to ensure all `Route` paths are correctly defined and component mappings are accurate.
2.  **`BrowserRouter`:** Ensure your application is wrapped within `<BrowserRouter>` (usually in `Frontend/src/main.jsx`).
3.  **Link Usage:** Use `<Link to="/path">` from `react-router-dom` for internal navigation, not `<a>` tags (unless navigating to external sites).
4.  **Nested Routes:** If using nested routes, ensure parent routes have an `Outlet` component.

---

## Getting Further Help

If you've tried the solutions above and are still encountering issues, please:

1.  **Check GitHub Issues:** Look for existing issues that match your problem.
2.  **Open a New Issue:** If your problem isn't listed, open a new issue on the [Boi Para GitHub repository](https://github.com/Kalyan9064/boi-para/issues).
    -   Provide a clear title and detailed description.
    -   Include steps to reproduce the issue.
    -   Attach relevant screenshots or code snippets.
    -   Mention your operating system, Node.js version, and browser.
    -   Include any error messages from the browser console or backend terminal.