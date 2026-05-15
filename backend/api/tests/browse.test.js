import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Browse API", () => {
  it("should return games list", async () => {
    const response = await request(app).get("/browse");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("should filter by genre", async () => {
    const response = await request(app)
      .get("/browse")
      .query({
        zanr: 1,
      });

    expect(response.status).toBe(200);
  });

  it("should sort safely", async () => {
    const response = await request(app)
      .get("/browse")
      .query({
        sort: "prosjecna_ocjena",
      });

    expect(response.status).toBe(200);
  });
});