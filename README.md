# 📚 Boi Para - Second-Hand Book Marketplace

## Overview

**Boi Para** is a full-stack MERN application designed to help students and book lovers buy and sell second-hand books easily. Many students purchase expensive textbooks for a semester and no longer need them afterward, while other students struggle to find affordable study materials. Boi Para bridges this gap by providing a dedicated platform where users can list their old books for sale and buyers can discover books at lower prices.

The platform offers a simple, secure, and user-friendly experience for managing book listings, connecting buyers with sellers, and promoting book reuse within the community.

🌐 **Live Demo:** https://boi-para.vercel.app/

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
- 📧 Email: [kalyanchakraborty9064@gmail.com](mailto:kalyanchakraborty9064@gmail.com)

---

## 📌 Conclusion

Boi Para is a community-driven marketplace that makes buying and selling second-hand books simple, affordable, and efficient. By connecting book owners with interested buyers, the platform helps students save money, promotes book reuse, and creates a more accessible learning ecosystem.
