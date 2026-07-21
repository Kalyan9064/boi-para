# 📚 Boi Para - Second-Hand Book Marketplace

## Table of Contents

- [Overview](#overview)
- [🤝 Contributing & Support](#-contributing--support)
- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚨 Problem It Solves](#-problem-it-solves)
- [🎯 Target Users](#-target-users)
- [⚙️ Technical Approach](#️-technical-approach)
  - [Frontend Architecture](#frontend-architecture)
  - [Backend Architecture](#backend-architecture)
  - [Database Design](#database-design)
  - [Authentication Flow](#authentication-flow)
  - [Data Flow](#data-flow)
- [📂 Project Structure](#-project-structure)
- [🚀 Quick Start](#-quick-start)
- [🚀 Future Improvements](#-future-improvements)
- [🌟 Key Highlights](#-key-highlights)
- [👨‍💻 Developer](#-developer)
- [📌 Conclusion](#-conclusion)

---

## Overview

**Boi Para** is a full-stack MERN application designed to help students and book lovers buy and sell second-hand books easily. Many students purchase expensive textbooks for a semester and no longer need them afterward, while other students struggle to find affordable study materials. Boi Para bridges this gap by providing a dedicated platform where users can list their old books for sale and buyers can discover books at lower prices.

The platform offers a simple, secure, and user-friendly experience for managing book listings, connecting buyers with sellers, and promoting book reuse within the community.

🌐 **Live Demo:** https://boi-para.vercel.app/

---

## 🤝 Contributing & Support

We welcome contributions to Boi Para! If you're a new contributor, please read our comprehensive [CONTRIBUTING.md](CONTRIBUTING.md) guide for detailed instructions on how to set up your development environment, follow our coding standards, and submit your contributions.

If you encounter any issues while setting up or running the project, please refer to our [TROUBLESHOOTING.md](TROUBLESHOOTING.md) guide for solutions to common problems.

This project is open-source and distributed under the [MIT License](LICENSE).

---

## ✨ Features

### 👤 User Authentication
- Secure user registration and login
- JWT-based authentication
- Protected routes for authorized users
- Personalized user dashboard

### 📖 Book Listing Management
- Add old books for sale
- Upload book images
- Update book information
- Delete book listings
- Manage personal listings

### 🔍 Search & Discovery
- Browse available books
- Search by book title or author
- View detailed book information
- Explore books from different categories

### 🤝 Buyer & Seller Connection
- View seller information
- Contact sellers directly
- Easy communication between buyers and sellers
- Transparent listing information

### 📱 Responsive Design
- Mobile-friendly interface
- Optimized for desktop, tablet, and mobile devices
- Clean and intuitive user experience

### 🔒 Security
- Password hashing using bcrypt
- JWT token authentication
- Protected API routes
- Input validation and error handling

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- HTML5
- CSS3
- JavaScript (ES6+)

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas
- Mongoose ODM

### Authentication
- JSON Web Token (JWT)
- bcrypt.js

### Deployment
- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 🚨 Problem It Solves

Students often spend a significant amount of money purchasing textbooks and reference materials. After completing their courses, these books frequently remain unused. At the same time, many students search for affordable second-hand books but struggle to find reliable sellers.

Traditional methods such as Facebook groups, WhatsApp groups, or local marketplaces often have several limitations:

- Difficult to find specific books
- No centralized platform
- Poor organization of listings
- Lack of detailed book information
- Inefficient buyer-seller communication

**Boi Para solves these problems by providing:**

- A dedicated marketplace for second-hand books
- Organized and searchable book listings
- Direct connection between buyers and sellers
- Affordable access to educational resources
- A sustainable way to reuse books instead of leaving them unused

---

## 🎯 Target Users

### 🎓 Students
Students looking for affordable textbooks, academic books, and study materials.

### 📚 Book Lovers
Readers interested in purchasing second-hand books at lower prices.

### 💰 Individual Sellers
People who want to sell books they no longer need.

### 🏫 Educational Communities
Schools, colleges, coaching centers, and student groups involved in book exchange activities.

---

## ⚙️ Technical Approach

### Frontend Architecture

The frontend is developed using React.js and follows a component-based architecture. Each UI section is separated into reusable components, making the application maintainable and scalable.

Key responsibilities:
- Rendering book listings
- Managing user interactions
- Handling authentication state
- Communicating with backend APIs using Axios
- Client-side routing with React Router

### Backend Architecture

The backend follows RESTful API principles using Node.js and Express.js.

The server is responsible for:
- User authentication
- Managing book listings
- Handling CRUD operations
- Processing requests and responses
- Validating incoming data
- Protecting secure routes

### Database Design

MongoDB stores application data using Mongoose schemas.

#### User Collection

Stores:
- User name
- Email
- Password
- Contact information

#### Book Collection

Stores:
- Book title
- Author name
- Description
- Price
- Category
- Book image
- Seller information
- Creation date

Relationships between books and users are maintained through MongoDB ObjectId references.

### Authentication Flow

1. User registers an account.
2. Password is securely hashed using bcrypt.
3. User logs in with valid credentials.
4. Server generates a JWT token.
5. Token is stored on the client side.
6. Protected routes verify token authenticity before granting access.
7. Authenticated users can create, edit, and manage book listings.

### Data Flow

```text
User
 ↓
React Frontend
 ↓
Axios API Request
 ↓
Express.js Server
 ↓
MongoDB Database
 ↓
API Response
 ↓
Updated UI
```

---

## 📂 Project Structure

```bash
boi-para/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── context/
│   │   └── assets/
│
├── server/
│   ├── models/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   └── config/
│
├── package.json
└── README.md
```

---

## 🚀 Quick Start

Follow these steps to set up and run Boi Para locally on your machine.

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone https://github.com/Kalyan9064/boi-para.git
cd boi-para
```

### 2. Backend Setup

Navigate to the `Backend` directory, install dependencies, and set up environment variables.

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend` directory and add the following environment variables. You can use `Backend/.env.example` as a template.

```
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

**Note:**
- Replace `your_mongodb_connection_string_here` with your MongoDB Atlas connection string.
- Obtain Cloudinary credentials from your Cloudinary account.
- Generate a strong `JWT_SECRET`.
- Get a `GEMINI_API_KEY` from Google AI Studio or similar.
- Provide your email and Brevo (Sendinblue) API key for email services.

Start the backend server:

```bash
npm start
```

The backend server will run on `http://localhost:5000` (or the `PORT` you specified).

### 3. Frontend Setup

Open a new terminal, navigate to the `Frontend` directory, install dependencies, and set up environment variables.

```bash
cd ../Frontend
npm install
```

Create a `.env` file in the `Frontend` directory and add the following environment variable. You can use `Frontend/.env.example` as a template.

```
VITE_API_URL=http://localhost:5000
```

Start the frontend development server:

```bash
npm run dev
```

The frontend application will typically run on `http://localhost:5173` (or another available port).

### 4. Access the Application

Once both the frontend and backend servers are running, open your web browser and navigate to `http://localhost:5173` to access the Boi Para application.

---

## 🚀 Future Improvements

- Real-time buyer-seller chat
- Book wishlist functionality
- Ratings and reviews
- Advanced search filters
- Book recommendation system
- Online payment integration
- Order tracking system
- Admin dashboard and analytics

---

## 🌟 Key Highlights

- MERN Stack Application
- Secure JWT Authentication
- Responsive User Interface
- Second-Hand Book Marketplace
- MongoDB Database Integration
- RESTful API Architecture
- Full CRUD Functionality
- Buyer-Seller Connection Platform

---

## 👨‍💻 Developer

**Kalyan Chakraborty**

B.Tech in Computer Science & Engineering

- 🌐 Live Project: https://boi-para.vercel.app/
- 💻 GitHub: https://github.com/Kalyan9064
- 📧 Email: kalyanchakraborty9064@gmail.com

---

## 📌 Conclusion

Boi Para is a community-driven marketplace that makes buying and selling second-hand books simple, affordable, and efficient. By connecting book owners with interested buyers, the platform helps students save money, promotes book reuse, and creates a more accessible learning ecosystem.
