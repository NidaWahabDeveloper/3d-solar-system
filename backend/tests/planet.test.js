import request from "supertest";
import "./setup.js";
import app from "../server.js";


const registerAndGetToken = async (overrides = {}) => {
  const res = await request(app)
    .post("/api/auth/register")
    .send({ name: "Tester", email: "tester@example.com", password: "password123", ...overrides });
  return res.body.data.token;
};

describe("Planet routes", () => {
  it("returns an empty list when no planets exist yet", async () => {
    const res = await request(app).get("/api/planets");
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toEqual([]);
  });

  it("blocks a normal (non-admin) user from creating a planet", async () => {
    const token = await registerAndGetToken();

    const res = await request(app)
      .post("/api/planets")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Earth", slug: "earth", description: "Our home planet", orbitPosition: 3,
      });

    
    expect(res.statusCode).toBe(403);
  });

  it("blocks creating a planet with no auth token at all", async () => {
    const res = await request(app).post("/api/planets").send({
      name: "Mars", slug: "mars", description: "The red planet", orbitPosition: 4,
    });

    expect(res.statusCode).toBe(401); // no token -- `protect` middleware rejects before authorize even runs
  });

  it("rejects planet creation with missing required fields (validation)", async () => {
   
    const mongoose = (await import("mongoose")).default;
    const User = (await import("../models/User.js")).default;

    const token = await registerAndGetToken({ email: "admin2@example.com" });
    await User.findOneAndUpdate({ email: "admin2@example.com" }, { role: "admin" });

    const res = await request(app)
      .post("/api/planets")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "" }); 

    expect(res.statusCode).toBe(400);
    expect(res.body.errors.length).toBeGreaterThan(0);
  });
});