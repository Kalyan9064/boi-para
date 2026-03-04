
# 📚 Boi Para — Old Book Marketplace

Boi Para is a **second-hand book marketplace** where users can **buy and sell used books**, similar to OLX.
The platform connects **buyers and sellers**, allowing them to communicate directly to complete transactions.

---

# 🚀 Project Overview

Boi Para allows users to:

* Register and login
* Upload books for sale
* Browse books
* Search books
* Filter books by category
* View seller information
* Upload book images
* Connect buyer and seller

---

# 🏗 Backend Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT Authentication**
* **Multer (Image Upload)**

---

# 📦 Implemented Backend Features

## 🔐 Authentication

```
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/profile
```

Features:

* User registration
* Password hashing
* JWT authentication
* Protected routes

---

## 📚 Book APIs

```
POST   /api/books          → Upload a book
GET    /api/books          → Get all books (with pagination)
GET    /api/books/:id      → Get single book
DELETE /api/books/:id      → Delete book (only seller)
GET    /api/books/search   → Search books
GET    /api/books/category/:category → Filter by category
```

---

## 🖼 Image Upload

Book images are uploaded using **Multer**.

Images are stored in:

```
/uploads
```

Example stored image:

```
uploads/171999234-book.jpg
```

---

## 🗄 Book Model Fields

Each book contains the following fields:

```
title
author
price
category
condition
description
location
image
seller
isSold
createdAt
updatedAt
```

---

# 🔄 Current Marketplace Workflow

### Seller Flow

```
User Login
     ↓
Click "Sell Book"
     ↓
Upload book details + image
     ↓
Book stored in MongoDB
     ↓
Book appears in marketplace
```

---

### Buyer Flow

```
User visits homepage
     ↓
Browse books
     ↓
Filter by category
     ↓
View book details
     ↓
Contact seller
```

---

# 📊 Backend Progress

Completed features:

```
✔ Authentication system
✔ Book upload with image
✔ Pagination
✔ Search books
✔ Category filtering
✔ Delete own book
✔ Seller information
✔ Location field
```

Backend completion level:

```
~80% Complete
```

---

# 🎯 Next Features (Planned)

Upcoming improvements:

```
Location-based filtering
Contact seller (WhatsApp integration)
User dashboard (My listings)
Nearby books feature
Frontend (React)
Deployment
```

Example upcoming API:

```
GET /api/books/location/:city
```

---

# 🌍 Future Vision

Boi Para aims to become a **local book exchange platform** where students can easily buy and sell used books in their city.

---
