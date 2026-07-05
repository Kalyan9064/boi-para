# Contributing to Boi Para
Thank you for considering contributing to Boi Para.
Boi Para is a full-stack MERN application that serves as a second-hand book marketplace, connecting students and book lovers to buy and sell used books. Our mission is to make educational resources more affordable and promote sustainable book reuse within the community.
We welcome contributors of all experience levels, whether you are:
- fixing bugs,
- improving UI/UX,
- writing documentation,
- optimizing backend logic,
- adding new features,
- improving accessibility,
- or enhancing developer experience.
Every contribution helps improve the project and the open-source community around it.
---
# Table of Contents
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Finding Issues](#finding-issues)
- [Before Working on an Issue](#before-working-on-an-issue)
- [Contribution Workflow](#contribution-workflow)
- [Branch Naming Convention](#branch-naming-convention)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Pull Request Checklist](#pull-request-checklist)
- [Code Style Guidelines](#code-style-guidelines)
- [General Coding Guidelines](#general-coding-guidelines)
- [Testing Guidelines](#testing-guidelines)
- [Contribution Areas](#contribution-areas)
- [Best Practices for Contributors](#best-practices-for-contributors)
- [Need Help?](#need-help)
- [Thank You](#thank-you)
---
# Getting Started
## Prerequisites
Before contributing, make sure you have:
- Git
- Node.js (v18 or higher recommended)
- npm
- MongoDB installed locally or a MongoDB Atlas connection string
---
# Fork and Clone the Repository
```bash
# Fork the repository first from https://github.com/Kalyan9064/boi-para
# Clone your fork
git clone https://github.com/<your-username>/boi-para.git
# Move into the project directory
cd boi-para
# Add upstream remote
git remote add upstream https://github.com/Kalyan9064/boi-para.git
```
---
# Development Setup
## Backend Setup
Navigate to the `Backend` directory:
```bash
cd Backend
npm install
```
Create a `.env` file inside the `Backend` directory and populate it with your environment variables. You can use `Backend/.env.example` as a template:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email_address_here
BREVO_API_KEY=your_brevo_api_key_here
```
Run the backend server:
```bash
npm start
```
The backend server will run on `http://localhost:5000` (or the `PORT` you specified).

---
## Frontend Setup
Open a new terminal, navigate to the `Frontend` directory:
```bash
cd ../Frontend
npm install
```
Create a `.env` file inside the `Frontend` directory and add the following environment variable. You can use `Frontend/.env.example` as a template:
```env
VITE_API_URL=http://localhost:5000
```
Run the frontend development server:
```bash
npm run dev
```
The frontend application will typically run on `http://localhost:5173` (or another available port).

---
# Project Structure
```text
boi-para/
│
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/            # API service calls
│   │   ├── assets/         # Static assets (images, icons)
│   │   ├── components/     # Reusable React components
│   │   ├── data/           # Static data (e.g., categories.js)
│   │   ├── pages/          # Top-level page components
│   │   ├── styles/         # CSS modules/stylesheets
│   │   └── utils/          # Utility functions (e.g., getTimeAgo, toast)
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── Backend/
│   ├── config/             # Configuration files (e.g., cloudinary.js)
│   ├── middleware/         # Express middleware (e.g., authMiddleware.js)
│   ├── models/             # Mongoose schemas/models
│   ├── routes/             # API route definitions
│   ├── uploads/            # File upload directory
│   ├── utils/              # Backend utility functions
│   ├── .env.example
│   ├── server.js           # Main Express server entry point
│   ├── package.json
│   └── ...
│
├── .github/                # GitHub Actions workflows
├── .gitignore
├── package.json
└── README.md
```
---
# Finding Issues
We maintain issues across multiple contribution levels.
| Level | Labels |
|---|---|
| Beginner | `good first issue` |
| Intermediate | `enhancement` |
| Advanced | `feature` |
| Bug Fixes | `bug` |
| Documentation | `documentation` |
| Performance | `performance` |
| UI/UX | `ui/ux` |
| Backend | `backend` |
| Frontend | `frontend` |
---
# Before Working on an Issue
Before starting work on an issue:
1. Check whether someone is already assigned.
2. Comment on the issue expressing your interest.
3. Wait for issue assignment before starting work.
4. Keep communication active during development.
Inactive issues may be reassigned after prolonged inactivity.
---
# Contribution Workflow
## 1. Create a Branch
Use meaningful branch names.
```bash
git checkout -b feat/feature-name
```
Examples:
```bash
git checkout -b feat/book-wishlist
git checkout -b fix/auth-bug
git checkout -b docs/update-readme
git checkout -b refactor/book-routes
```
---
# Branch Naming Convention
| Type | Prefix |
|---|---|
| Feature | `feat/` |
| Bug Fix | `fix/` |
| Documentation | `docs/` |
| Refactor | `refactor/` |
| Testing | `test/` |
| Chore | `chore/` |
---
# Commit Message Guidelines
Use clean and descriptive commit messages.
## Examples
```bash
feat: implement book wishlist functionality
fix: resolve incorrect distance calculation in nearby books
docs: update quick start guide in README
refactor: improve image upload logic
```
---
# Making Changes
While contributing:
- Keep PRs focused and small
- Follow project structure (e.g., components in `Frontend/src/components`, models in `Backend/models`)
- Avoid unrelated modifications
- Maintain code readability
- Reuse existing components whenever possible
- Test your changes before submission
---
# Pull Request Process
## Before Submitting a PR
Make sure:
- The application runs correctly locally (both frontend and backend).
- No build errors exist.
- No unnecessary files are included (e.g., large test files, temp files).
- Code follows project structure and existing patterns.
- Environment variables (`.env` files) are not committed.
- PR addresses only one issue or feature (or a closely related set).
---
## PR Submission Steps
1. Push your branch to your fork:
```bash
git push origin feat/feature-name
```
2. Open a Pull Request on the main repository (`Kalyan9064/boi-para`).
3. Include:
    - A clear and concise description of the changes.
    - Reference to the issue it closes (e.g., `Closes #XYZ`).
    - Screenshots or screen recordings for UI/UX changes.
    - Details on how to test the changes.
4. Wait for maintainer review and address any feedback.
---
# Pull Request Checklist
Before submitting a PR, ensure the following are checked:
- [x] My code compiles and runs successfully locally.
- [x] There are no console errors or warnings in the browser or server logs.
- [x] The UI is responsive (if frontend changes are made).
- [x] Existing functionality remains unaffected by my changes.
- [x] My code follows the project's established structure and coding patterns.
- [x] My branch is up to date with the `upstream/main` branch.
- [x] The PR description is properly filled out, providing context for the changes.
- [x] The relevant issue (if any) is linked in the PR description.
---
# Code Style Guidelines
## Frontend (React.js)
- Use functional React components with hooks.
- Prefer reusable and modular components.
- Adhere to a proper folder structure within `src/`.
- Optimize for performance, avoiding unnecessary re-renders.
- Ensure UI is responsive and accessible.
- Use `axios` for API calls.

## Backend (Node.js, Express.js, Mongoose)
- Keep API routes and logic modular and organized within `routes/` and potentially `utils/`.
- Use `middleware/` for authentication, authorization, and other request processing.
- Define Mongoose schemas clearly in `models/`.
- Follow RESTful API practices for endpoint design.
- Implement robust input validation and error handling.
- Avoid duplicated logic by creating helper functions in `utils/`.
---
# General Coding Guidelines
- Write clean, readable, and self-documenting code.
- Use meaningful and descriptive variable, function, and file names.
- Remove unused imports, variables, and code blocks.
- Keep functions and modules small and focused on a single responsibility.
- Avoid hardcoded values; use environment variables or configuration files where appropriate.
---
# Testing Guidelines
Before submitting changes, thoroughly test your modifications.
## Frontend Testing
Run the frontend development server:
```bash
npm run dev
```
Verify the following:
-   **UI Responsiveness:** Test on different screen sizes and devices.
-   **Navigation:** Ensure all links and routes work correctly.
-   **Forms:** Test form submissions, input validations, and error messages.
-   **State Updates:** Verify that UI updates correctly based on user interactions and API responses.
-   **API Integrations:** Confirm that data is fetched and displayed correctly from the backend.
-   **User Flows:** Test end-to-end user journeys (e.g., registration, login, adding a book, searching).

## Backend Testing
Ensure the backend server is running:
```bash
npm start
```
Use tools like Postman, Insomnia, or your frontend application to verify:
-   **API Endpoints:** Test all modified and new API routes.
-   **Database Operations:** Confirm CRUD (Create, Read, Update, Delete) operations on models work as expected.
-   **Authentication/Authorization:** Verify protected routes restrict access correctly and that JWT tokens are handled properly.
-   **Error Handling:** Test edge cases and invalid inputs to ensure appropriate error responses.
-   **Server Stability:** Ensure the server doesn't crash under various request conditions.
---
# Contribution Areas
Contributors can work on multiple areas of the project.
## Frontend Enhancements
-   Improving existing UI/UX for various pages (e.g., Home, Browse, BookDetails).
-   Enhancing responsive design across all components.
-   Adding new features like book wishlist, advanced search filters, or a chat system.
-   Optimizing performance for faster page loads and smoother interactions.
-   Improving accessibility for users with disabilities.
-   Refactoring existing components for better maintainability and reusability.

## Backend Improvements
-   Optimizing API endpoints for better performance and scalability.
-   Implementing new API features (e.g., for real-time chat, notifications).
-   Enhancing existing authentication and authorization mechanisms.
-   Improving database queries and indexing for efficiency.
-   Refactoring backend logic for modularity and cleaner code.
-   Adding robust logging and monitoring capabilities.

## Future Systems & Features
-   Real-time buyer-seller chat.
-   Book recommendation system.
-   Ratings and reviews system for books and sellers.
-   Online payment integration for direct transactions.
-   Order tracking system for book deliveries.
-   Admin dashboard for managing listings and users.

## Documentation
-   Updating existing documentation (e.g., README, API docs).
-   Creating new guides for specific features or troubleshooting.
-   Improving code comments and inline documentation.
---
# Best Practices for Contributors
- Focus on quality over quantity in your contributions.
- Maintain clean code standards and adhere to project style guidelines.
- Keep pull requests focused on a single issue or feature.
- Respect maintainers and fellow contributors in all communications.
- Write scalable and maintainable code that aligns with the project's long-term goals.
- Ask questions if anything is unclear or if you need assistance.
---
# Need Help?
If you face issues while contributing or have questions:
- Open a discussion on the GitHub repository.
- Create an issue, clearly describing your problem.
- Ask questions in the comments of an existing issue.
- Reach out to maintainers politely for guidance.
---
# Thank You
Thank you for contributing to Boi Para and helping improve the project for the open-source community. Your efforts are greatly appreciated!