import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Login API", () => {
  it("should login successfully", async () => {
    const response = await request(app).post("/login").send({
      korisnicko_ime: "test",
      lozinka: "test",
    });

    expect(response.status).toBe(200);
    expect(response.body.id_korisnika).toBeDefined();
  });

  it("should reject invalid credentials", async () => {
    const response = await request(app).post("/login").send({
      korisnicko_ime: "wrong",
      lozinka: "wrong",
    });

    expect(response.status).toBe(401);
  });
});
