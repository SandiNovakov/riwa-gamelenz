import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Igrice-Platforme API - povezivanje igrice i platforme", () => {
  it("treba povezati igricu s platformom", async () => {
    const response = await request(app).post("/igrice-platforme").send({
      id_igrice: 1,
      id_platforme: 1,
    });
    expect(response.status).toBe(200);
  });
});

describe("Igrice-Platforme API - dohvaćanje veza", () => {
  it("treba dohvatiti sve veze između igrica i platformi", async () => {
    const response = await request(app).get("/igrice-platforme");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti specifičnu vezu", async () => {
    await request(app).post("/platforme").send({
      naziv_platforme: "plat_za_test_dohvata_veze",
    });

    await request(app).post("/igrice-platforme").send({
      id_igrice: 1,
      id_platforme: 2,
    });

    const response = await request(app).get("/igrice-platforme/1/2");
    expect(response.status).toBe(200);
  });
});

describe("Igrice-Platforme API - brisanje veze", () => {
  it("treba obrisati vezu između igrice i platforme", async () => {
    await request(app).post("/platforme").send({
      naziv_platforme: "plat_za_test_brisanja_veze",
    });

    await request(app).post("/igrice-platforme").send({
      id_igrice: 1,
      id_platforme: 3,
    });

    const response = await request(app).delete("/igrice-platforme/1/3");
    expect(response.status).toBe(200);
  });
});