import request from "supertest";
import app from "../server";

describe("Authentication API Tests", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "puppy",
      password: "password123",
    });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");
  });

  it("should login a user", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "JollyWave",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should reject an invalid login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      username: "XRated",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
  });
});
