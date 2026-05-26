import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Browse API - pretraživanje igrica", () => {
  it("treba dohvatiti sve igrice s filtriranjem po nazivu", async () => {
    const response = await request(app).get("/browse?naziv_igrice=Zelda");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti igrice filtrirane po žanru", async () => {
    const response = await request(app).get("/browse?zanr=1");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti igrice filtrirane po developeru", async () => {
    const response = await request(app).get("/browse?developer=1");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti igrice filtrirane po platformi", async () => {
    const response = await request(app).get("/browse?platforma=1");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti igrice u rasponu datuma", async () => {
    const response = await request(app).get("/browse?datum_od=2020-01-01&datum_do=2024-12-31");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba sortirati igrice po nazivu", async () => {
    const response = await request(app).get("/browse?sort=naziv_igrice");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba sortirati igrice po prosječnoj ocjeni", async () => {
    const response = await request(app).get("/browse?sort=prosjecna_ocjena");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("Index Summary API", () => {
  it("treba dohvatiti sažetak podataka za početnu stranicu", async () => {
    const response = await request(app).get("/index-summary");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("broj_korisnika");
    expect(response.body).toHaveProperty("broj_igrica");
  });
});