const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const Book = require("../models/Book");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Mock Models and Email Utility
jest.mock("../models/User");
jest.mock("../models/Book");
jest.mock("../utils/sendEmail", () => jest.fn().mockResolvedValue(true));
jest.mock("jsonwebtoken");
jest.mock("bcryptjs");

describe("BoiPara Backend - Validation & Error Handling Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Authentication Routes Validation", () => {
    describe("POST /api/auth/register", () => {
      it("should fail validation if name, email, password, or phone is missing", async () => {
        const response = await request(app)
          .post("/api/auth/register")
          .send({});

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Validation failed");
        expect(response.body.errors).toHaveProperty("name");
        expect(response.body.errors).toHaveProperty("email");
        expect(response.body.errors).toHaveProperty("password");
        expect(response.body.errors).toHaveProperty("phone");
      });

      it("should fail validation if email is invalid", async () => {
        const response = await request(app)
          .post("/api/auth/register")
          .send({
            name: "John Doe",
            email: "invalid-email",
            password: "password123",
            phone: "+1234567890"
          });

        expect(response.status).toBe(400);
        expect(response.body.errors.email).toContain("must be a valid email");
      });

      it("should fail validation if password is too short", async () => {
        const response = await request(app)
          .post("/api/auth/register")
          .send({
            name: "John Doe",
            email: "john@example.com",
            password: "123",
            phone: "+1234567890"
          });

        expect(response.status).toBe(400);
        expect(response.body.errors.password).toContain("at least 6 characters");
      });

      it("should fail validation if phone format is invalid", async () => {
        const response = await request(app)
          .post("/api/auth/register")
          .send({
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            phone: "abc-12345"
          });

        expect(response.status).toBe(400);
        expect(response.body.errors.phone).toContain("must be a valid phone number");
      });

      it("should register successfully with correct inputs", async () => {
        User.findOne.mockResolvedValue(null);
        bcrypt.hash.mockResolvedValue("hashedPassword123");
        User.prototype.save = jest.fn().mockResolvedValue(true);

        const response = await request(app)
          .post("/api/auth/register")
          .send({
            name: "John Doe",
            email: "john@example.com",
            password: "password123",
            phone: "+1234567890"
          });

        expect(response.status).toBe(201);
        expect(response.body.message).toContain("Registered successfully");
      });
    });

    describe("POST /api/auth/login", () => {
      it("should fail validation if email or password is missing", async () => {
        const response = await request(app)
          .post("/api/auth/login")
          .send({});

        expect(response.status).toBe(400);
        expect(response.body.errors).toHaveProperty("email");
        expect(response.body.errors).toHaveProperty("password");
      });

      it("should fail validation if email format is invalid", async () => {
        const response = await request(app)
          .post("/api/auth/login")
          .send({
            email: "invalid-email",
            password: "password123"
          });

        expect(response.status).toBe(400);
        expect(response.body.errors.email).toContain("must be a valid email");
      });

      it("should login successfully with valid credentials", async () => {
        const mockUser = {
          _id: "userId123",
          email: "john@example.com",
          password: "hashedPassword123",
          isVerified: true
        };
        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue("mockToken");

        const response = await request(app)
          .post("/api/auth/login")
          .send({
            email: "john@example.com",
            password: "password123"
          });

        expect(response.status).toBe(200);
        expect(response.body.message).toContain("Login successful");
        expect(response.body.token).toBe("mockToken");
      });

      it("should return error if user is not verified", async () => {
        const mockUser = {
          _id: "userId123",
          email: "john@example.com",
          password: "hashedPassword123",
          isVerified: false
        };
        User.findOne.mockResolvedValue(mockUser);

        const response = await request(app)
          .post("/api/auth/login")
          .send({
            email: "john@example.com",
            password: "password123"
          });

        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toContain("verify your email");
      });
    });
  });

  describe("Book Routes Validation", () => {
    describe("POST /api/books", () => {
      it("should fail validation if auth token is missing", async () => {
        const response = await request(app)
          .post("/api/books")
          .send({});

        expect(response.status).toBe(401);
        expect(response.body.message).toBe("No token provided");
      });

      it("should fail validation if required fields are missing", async () => {
        jwt.verify.mockReturnValue({ id: "sellerId123" });

        const response = await request(app)
          .post("/api/books")
          .set("Authorization", "Bearer mockToken")
          .send({});

        expect(response.status).toBe(400);
        expect(response.body.errors).toHaveProperty("title");
        expect(response.body.errors).toHaveProperty("author");
        expect(response.body.errors).toHaveProperty("price");
        expect(response.body.errors).toHaveProperty("category");
        expect(response.body.errors).toHaveProperty("condition");
        expect(response.body.errors).toHaveProperty("location");
      });

      it("should fail validation if condition is not enum compliant", async () => {
        jwt.verify.mockReturnValue({ id: "sellerId123" });

        const response = await request(app)
          .post("/api/books")
          .set("Authorization", "Bearer mockToken")
          .send({
            title: "Test Book",
            author: "Author Name",
            price: 15.99,
            category: "Fiction",
            condition: "Brand New", // Invalid condition (not in Like New, Very Good, Good, Fair)
            location: "New York"
          });

        expect(response.status).toBe(400);
        expect(response.body.errors.condition).toContain("must be one of");
      });

      it("should fail validation if price is negative", async () => {
        jwt.verify.mockReturnValue({ id: "sellerId123" });

        const response = await request(app)
          .post("/api/books")
          .set("Authorization", "Bearer mockToken")
          .send({
            title: "Test Book",
            author: "Author Name",
            price: -10,
            category: "Fiction",
            condition: "Good",
            location: "New York"
          });

        expect(response.status).toBe(400);
        expect(response.body.errors.price).toContain("must be at least 0");
      });

      it("should create book successfully with valid inputs", async () => {
        jwt.verify.mockReturnValue({ id: "sellerId123" });
        Book.prototype.save = jest.fn().mockResolvedValue(true);

        const response = await request(app)
          .post("/api/books")
          .set("Authorization", "Bearer mockToken")
          .send({
            title: "Test Book",
            author: "Author Name",
            price: 15.99,
            category: "Fiction",
            condition: "Good",
            location: "New York",
            description: "Nice book"
          });

        expect(response.status).toBe(201);
        expect(response.body.message).toContain("Book added successfully");
      });
    });

    describe("PUT /api/books/:id", () => {
      it("should fail validation if not authorized", async () => {
        jwt.verify.mockReturnValue({ id: "differentSellerId" });
        const mockBook = {
          _id: "bookId123",
          seller: "sellerId123"
        };
        Book.findById.mockResolvedValue(mockBook);

        const response = await request(app)
          .put("/api/books/bookId123")
          .set("Authorization", "Bearer mockToken")
          .send({
            title: "Updated Book",
            author: "Author Name",
            price: 15.99,
            category: "Fiction",
            condition: "Good",
            location: "New York"
          });

        expect(response.status).toBe(403);
        expect(response.body.message).toBe("Not authorized");
      });
    });
  });

  describe("Centralized Error Handler formatting", () => {
    it("should format CastError into a 400 Bad Request response", async () => {
      // Trigger a CastError by trying to GET a book and mocking findById to throw a CastError
      const castError = new Error("Cast to ObjectId failed");
      castError.name = "CastError";
      castError.path = "_id";
      Book.findById.mockReturnValue({
        populate: jest.fn().mockRejectedValue(castError)
      });

      const response = await request(app).get("/api/books/invalidId");

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Invalid value for field: _id");
    });
  });

  describe("Book Listing, Advanced Filters & Pagination", () => {
    it("should return raw array of books for backward compatibility when pagination is not requested", async () => {
      const mockBooks = [
        { title: "Book 1", price: 10, category: "classic" },
        { title: "Book 2", price: 20, category: "academic" }
      ];
      Book.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockResolvedValue(mockBooks)
      });

      const response = await request(app).get("/api/books");

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe("Book 1");
    });

    it("should return paginated and filtered metadata when paginate=true is provided", async () => {
      const mockBooks = [
        { title: "Book 1", price: 10, category: "classic" }
      ];
      Book.countDocuments = jest.fn().mockResolvedValue(10);
      Book.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBooks)
      });

      const response = await request(app)
        .get("/api/books?paginate=true&page=2&limit=5&category=classic");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination).toEqual({
        total: 10,
        limit: 5,
        page: 2,
        pages: 2,
        hasNext: false,
        hasPrev: true
      });
    });

    it("should sort books based on sort parameter", async () => {
      const mockBooks = [
        { title: "Book 1", price: 10 },
        { title: "Book 2", price: 20 }
      ];
      Book.countDocuments = jest.fn().mockResolvedValue(2);
      const mockSort = jest.fn().mockReturnThis();
      Book.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        sort: mockSort,
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue(mockBooks)
      });

      const response = await request(app).get("/api/books?paginate=true&sort=price_asc");

      expect(response.status).toBe(200);
      expect(mockSort).toHaveBeenCalledWith({ price: 1 });
    });
  });
});
