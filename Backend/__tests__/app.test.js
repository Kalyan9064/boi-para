const request = require("supertest");
const app = require("../server");
const User = require("../models/User");
const Book = require("../models/Book");
const Review = require("../models/Review");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Mock Models and Email Utility
jest.mock("../models/User");
jest.mock("../models/Book");
jest.mock("../models/Review");
jest.mock("../models/Conversation");
jest.mock("../models/Message");
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

  describe("Ratings, Reviews & Reputation Endpoints", () => {
    beforeEach(() => {
      jwt.verify.mockReturnValue({ id: "000000000000000000000002" });
    });

    it("should create review successfully and trigger average calculation", async () => {
      User.findById.mockResolvedValue({ _id: "000000000000000000000001", name: "John Seller" });
      Review.findOne.mockResolvedValue(null); // No duplicate review
      Review.prototype.save = jest.fn().mockResolvedValue(true);
      
      Review.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue({
          _id: "reviewId123",
          review: "Excellent seller!",
          rating: 5,
          seller: "000000000000000000000001",
          reviewer: { _id: "000000000000000000000002", name: "Reviewer User" }
        })
      });

      // Mock aggregate for calcAverageRatings
      Review.aggregate = jest.fn().mockResolvedValue([
        { _id: "000000000000000000000001", nRating: 1, avgRating: 5.0 }
      ]);
      User.findByIdAndUpdate = jest.fn().mockResolvedValue(true);

      const response = await request(app)
        .post("/api/reviews")
        .set("Authorization", "Bearer mockToken")
        .send({
          seller: "000000000000000000000001",
          rating: 5,
          review: "Great condition book, fast dispatch!"
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toContain("submitted successfully");
      expect(response.body.review.rating).toBe(5);
      expect(User.findByIdAndUpdate).toHaveBeenCalled();
    });

    it("should fail validation if seller or rating is missing", async () => {
      const response = await request(app)
        .post("/api/reviews")
        .set("Authorization", "Bearer mockToken")
        .send({
          review: "Too short"
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toHaveProperty("seller");
      expect(response.body.errors).toHaveProperty("rating");
    });

    it("should prevent duplicate reviews from same reviewer for same seller", async () => {
      User.findById.mockResolvedValue({ _id: "000000000000000000000001", name: "John Seller" });
      Review.findOne.mockResolvedValue({ _id: "existingReviewId" }); // Duplicate exists

      const response = await request(app)
        .post("/api/reviews")
        .set("Authorization", "Bearer mockToken")
        .send({
          seller: "000000000000000000000001",
          rating: 4,
          review: "Second attempt review"
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("already reviewed this seller");
    });

    it("should prevent self-reviewing", async () => {
      // Reviewer ID is mocked as "000000000000000000000002"
      const response = await request(app)
        .post("/api/reviews")
        .set("Authorization", "Bearer mockToken")
        .send({
          seller: "000000000000000000000002", // self-reviewing
          rating: 5,
          review: "I am awesome!"
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain("cannot submit a review for yourself");
    });
  });

  describe("Real-Time Chat & Messaging Endpoints", () => {
    beforeEach(() => {
      jwt.verify.mockReturnValue({ id: "000000000000000000000002" });
    });

    describe("POST /api/conversations", () => {
      it("should fail validation if sellerId is missing or invalid", async () => {
        const response = await request(app)
          .post("/api/conversations")
          .set("Authorization", "Bearer mockToken")
          .send({});

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Validation failed");
      });

      it("should prevent starting a conversation with oneself", async () => {
        const response = await request(app)
          .post("/api/conversations")
          .set("Authorization", "Bearer mockToken")
          .send({ sellerId: "000000000000000000000002" });

        expect(response.status).toBe(400);
        expect(response.body.message).toContain("cannot start a conversation with yourself");
      });

      it("should return existing conversation if it exists", async () => {
        User.findById.mockResolvedValue({ _id: "000000000000000000000001", name: "Seller" });
        const mockConv = {
          _id: "convId123",
          participants: ["000000000000000000000002", "000000000000000000000001"],
          unreadCounts: new Map([["000000000000000000000002", 0], ["000000000000000000000001", 0]])
        };
        Conversation.findOne.mockResolvedValue(mockConv);

        const populate2 = jest.fn().mockResolvedValue(mockConv);
        const populate1 = jest.fn().mockReturnValue({ populate: populate2 });
        Conversation.findById.mockReturnValue({ populate: populate1 });

        const response = await request(app)
          .post("/api/conversations")
          .set("Authorization", "Bearer mockToken")
          .send({ sellerId: "000000000000000000000001" });

        expect(response.status).toBe(200);
        expect(response.body._id).toBe("convId123");
      });
    });

    describe("GET /api/conversations", () => {
      it("should retrieve list of conversations for current user", async () => {
        const mockList = [
          { _id: "convId123", participants: ["000000000000000000000002", "000000000000000000000001"] }
        ];

        const sortMock = jest.fn().mockResolvedValue(mockList);
        const populate2 = jest.fn().mockReturnValue({ sort: sortMock });
        const populate1 = jest.fn().mockReturnValue({ populate: populate2 });
        Conversation.find.mockReturnValue({ populate: populate1 });

        const response = await request(app)
          .get("/api/conversations")
          .set("Authorization", "Bearer mockToken");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body[0]._id).toBe("convId123");
      });
    });

    describe("PUT /api/conversations/:id/read", () => {
      it("should fail if user is not a participant of conversation", async () => {
        const mockConv = {
          _id: "convId123",
          participants: ["000000000000000000000003", "000000000000000000000004"]
        };
        Conversation.findById.mockResolvedValue(mockConv);

        const response = await request(app)
          .put("/api/conversations/convId123/read")
          .set("Authorization", "Bearer mockToken");

        expect(response.status).toBe(403);
        expect(response.body.message).toContain("not authorized");
      });

      it("should reset unread count and update other sender's messages to read", async () => {
        const mockMap = {
          set: jest.fn(),
          get: jest.fn()
        };
        const mockConv = {
          _id: "convId123",
          participants: ["000000000000000000000002", "000000000000000000000001"],
          unreadCounts: mockMap,
          save: jest.fn().mockResolvedValue(true)
        };
        Conversation.findById.mockResolvedValue(mockConv);
        Message.updateMany.mockResolvedValue({ modifiedCount: 2 });

        const response = await request(app)
          .put("/api/conversations/convId123/read")
          .set("Authorization", "Bearer mockToken");

        expect(response.status).toBe(200);
        expect(mockMap.set).toHaveBeenCalledWith("000000000000000000000002", 0);
        expect(mockConv.save).toHaveBeenCalled();
        expect(Message.updateMany).toHaveBeenCalled();
      });
    });

    describe("POST /api/messages", () => {
      it("should fail if sender is not part of conversation", async () => {
        const mockConv = {
          _id: "000000000000000000000123",
          participants: ["000000000000000000000003", "000000000000000000000004"]
        };
        Conversation.findById.mockResolvedValue(mockConv);

        const response = await request(app)
          .post("/api/messages")
          .set("Authorization", "Bearer mockToken")
          .send({ conversationId: "000000000000000000000123", text: "Hello!" });

        expect(response.status).toBe(403);
        expect(response.body.message).toContain("not authorized");
      });

      it("should successfully send message and update unread count for receiver", async () => {
        const mockMap = {
          get: jest.fn().mockReturnValue(1),
          set: jest.fn()
        };
        const mockConv = {
          _id: "000000000000000000000123",
          participants: ["000000000000000000000002", "000000000000000000000001"],
          unreadCounts: mockMap,
          save: jest.fn().mockResolvedValue(true)
        };
        Conversation.findById.mockResolvedValue(mockConv);
        
        const mockMsg = {
          _id: "msgId123",
          conversation: "000000000000000000000123",
          sender: "000000000000000000000002",
          text: "Hello!"
        };
        Message.prototype.save = jest.fn().mockResolvedValue(true);
        Message.findById.mockReturnValue({
          populate: jest.fn().mockResolvedValue(mockMsg)
        });

        const response = await request(app)
          .post("/api/messages")
          .set("Authorization", "Bearer mockToken")
          .send({ conversationId: "000000000000000000000123", text: "Hello!" });

        expect(response.status).toBe(201);
        expect(mockMap.set).toHaveBeenCalledWith("000000000000000000000001", 2);
        expect(mockConv.save).toHaveBeenCalled();
      });
    });

    describe("GET /api/messages/:conversationId", () => {
      it("should return message list if user is participant", async () => {
        const mockConv = {
          _id: "convId123",
          participants: ["000000000000000000000002", "000000000000000000000001"]
        };
        Conversation.findById.mockResolvedValue(mockConv);
        const mockMsgs = [
          { text: "Hello!", sender: { _id: "000000000000000000000002" } }
        ];
        
        const sortMock = jest.fn().mockResolvedValue(mockMsgs);
        const populateMock = jest.fn().mockReturnValue({ sort: sortMock });
        Message.find.mockReturnValue({ populate: populateMock });

        const response = await request(app)
          .get("/api/messages/convId123")
          .set("Authorization", "Bearer mockToken");

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(response.body[0].text).toBe("Hello!");
      });
    });
  });
});
