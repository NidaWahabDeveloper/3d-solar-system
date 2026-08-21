import request from "supertest";
import "./setup.js"; // sets up the in-memory MongoDB before/after hooks
import app from "../server.js";

describe("Auth routes", () => {
  it("registers a new user and returns a token", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("token"); // token means registration actually worked
    expect(res.body.data.password).toBeUndefined(); // password hash should never be sent back
  });

  it("rejects duplicate email registration", async () => {
    // first registration should go through fine
    await request(app).post("/api/auth/register").send({
      name: "Test User",
      email: "dupe@example.com",
      password: "password123",
    });

    // second one with the same email should fail
    const res = await request(app).post("/api/auth/register").send({
      name: "Another User",
      email: "dupe@example.com",
      password: "password456",
    });

    expect(res.statusCode).toBe(400); // duplicate key error → 400 via errorHandler
  });

  it("rejects registration with an invalid email format", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Bad Email",
      email: "not-an-email",
      password: "password123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("logs in with correct credentials", async () => {
    // create the user first
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email: "login@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "login@example.com",
      password: "password123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("token");
  });

  it("rejects login with wrong password", async () => {
    // create the user first
    await request(app).post("/api/auth/register").send({
      name: "Login User",
      email: "wrongpass@example.com",
      password: "password123",
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "wrongpass@example.com",
      password: "totallyWrongPassword",
    });

    expect(res.statusCode).toBe(401); // wrong password → 401, no hint whether email exists
  });
});