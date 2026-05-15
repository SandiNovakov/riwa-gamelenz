import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Korisnici API", () => {
  it("should return all users", async () => {
    const response = await request(app).get("/korisnici");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should search users by username", async () => {
    const response = await request(app)
      .get("/korisnici")
      .query({
        korisnicko_ime: "san",
      });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should create a user", async () => {
    const response = await request(app)
      .post("/korisnici")
      .send({
        korisnicko_ime: "testuser",
        lozinka: "123456",
        email: "test@test.com",
        privatni_racun: false,
      });

    expect(response.status).toBe(200);
  });
});