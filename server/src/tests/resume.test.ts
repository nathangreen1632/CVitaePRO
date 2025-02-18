import request from "supertest";
import app from "../server.js"; // Ensure the correct path
import { Response } from "supertest"; // Import Response type

describe("Resume API Tests", () => {
  let token: string;

  beforeAll(async () => {
    // First, login and retrieve a token
    const loginRes: Response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    token = loginRes.body.token;
  });

  it("should create a new resume", async () => {
    const res: Response = await request(app)
      .post("/api/resumes")
      .set("Authorization", `Bearer ${token}`)
      .send({
        content: "Generated resume content",
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("resume");
  });
});
