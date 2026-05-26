import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Igrice API - kreiranje igrice", () => {
  it("treba kreirati novu igricu s validnim podacima", async () => {
    const response = await request(app).post("/igrice").send({
      naziv_igrice: "The Legend of Zelda",
      opis: "Open world adventure game",
      datum_izdanja: "2023-05-12",
      id_izdavaca: 1,
      id_developera: 1,
      id_zanra: 1,
    });
    expect(response.status).toBe(200);
  });
});

describe("Igrice API - dohvaćanje igrica", () => {
  it("treba dohvatiti sve igrice", async () => {
    const response = await request(app).get("/igrice");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti jednu igricu po ID-u", async () => {
    const response = await request(app).get("/igrice/1");
    expect(response.status).toBe(200);
    expect(response.body.id_igrice).toBeDefined();
    expect(response.body.naziv_igrice).toBeDefined();
  });
});

describe("Igrice API - ažuriranje igrice", () => {
  it("treba ažurirati podatke o igrici", async () => {
    const response = await request(app).put("/igrice/1").send({
      naziv_igrice: "Ažurirana igrica",
      opis: "Ažurirani opis",
      datum_izdanja: "2024-01-01",
      id_izdavaca: 1,
      id_developera: 1,
      id_zanra: 1,
    });
    expect(response.status).toBe(200);
  });
});

describe("Igrice API - brisanje igrice", () => {
  it("treba obrisati igricu", async () => {
    await request(app).post("/igrice").send({
      naziv_igrice: "Za brisanje",
      opis: "Opis",
      datum_izdanja: "2024-01-01",
      id_izdavaca: 1,
      id_developera: 1,
      id_zanra: 1,
    });
    const response = await request(app).delete("/igrice/2");
    expect(response.status).toBe(200);
  });
});

describe("Igrice API - detalji igrice", () => {
  it("treba dohvatiti detaljne podatke o igrici", async () => {
    const response = await request(app).get("/igrice/detalji/1");
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
  });
});

describe("Igrice API - ažuriranje prosječne ocjene", () => {
  it("treba izračunati i ažurirati prosječnu ocjenu", async () => {
    const response = await request(app).put("/igrice/1/prosjecna-ocjena");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("nova_ocjena");
  });
});

