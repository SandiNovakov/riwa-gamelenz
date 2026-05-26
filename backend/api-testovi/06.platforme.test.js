import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Platforme API - kreiranje platforme", () => {
  it("treba kreirati novu platformu", async () => {
    const response = await request(app).post("/platforme").send({
      naziv_platforme: "PlayStation 5",
    });
    expect(response.status).toBe(200);
  });
});

describe("Platforme API - dohvaćanje platformi", () => {
  it("treba dohvatiti sve platforme", async () => {
    const response = await request(app).get("/platforme");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti jednu platformu po ID-u", async () => {
    const response = await request(app).get("/platforme/1");
    expect(response.status).toBe(200);
    expect(response.body.id_platforme).toBeDefined();
    expect(response.body.naziv_platforme).toBeDefined();
  });
});

describe("Platforme API - ažuriranje platforme", () => {
  it("treba ažurirati naziv platforme", async () => {
    const response = await request(app).put("/platforme/1").send({
      naziv_platforme: "Ažurirana platforma",
    });
    expect(response.status).toBe(200);
  });
});

describe("Platforme API - brisanje platforme", () => {
  it("treba obrisati platformu", async () => {
    await request(app).post("/platforme").send({
      naziv_platforme: "Za brisanje",
    });
    const response = await request(app).delete("/platforme/2");
    expect(response.status).toBe(200);
  });
});