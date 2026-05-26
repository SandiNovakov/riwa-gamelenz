import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Korisnici API - kreiranje korisnika", () => {
  it("treba kreirati novog korisnika s validnim podacima", async () => {
    const response = await request(app).post("/korisnici").send({
      korisnicko_ime: "novi_korisnik",
      lozinka: "lozinka123",
      email: "novi@test.com",
      privatni_racun: false,
    });
    expect(response.status).toBe(200);
  });
});

describe("Korisnici API - dohvaćanje korisnika", () => {
  it("treba dohvatiti sve korisnike", async () => {
    const response = await request(app).get("/korisnici");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti korisnike po korisničkom imenu (pretraga)", async () => {
    const response = await request(app).get("/korisnici?korisnicko_ime=test");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti jednog korisnika po ID-u", async () => {
    const response = await request(app).get("/korisnici/1");
    expect(response.status).toBe(200);
    expect(response.body.id_korisnika).toBeDefined();
  });
});

describe("Korisnici API - ažuriranje korisnika", () => {
  it("treba ažurirati korisnika bez lozinke", async () => {
    const response = await request(app).put("/korisnici/1").send({
      korisnicko_ime: "azurirani_korisnik",
      email: "azurirani@test.com",
      privatni_racun: true,
    });
    expect(response.status).toBe(200);
  });

  it("treba ažurirati korisnika s lozinkom", async () => {
    const response = await request(app).put("/korisnici/1").send({
      korisnicko_ime: "korisnik_s_lozinkom",
      lozinka: "nova_lozinka",
      email: "novi_email@test.com",
      privatni_racun: false,
    });
    expect(response.status).toBe(200);
  });
});

describe("Korisnici API - brisanje korisnika", () => {
  it("treba obrisati korisnika", async () => {
    await request(app).post("/korisnici").send({
      korisnicko_ime: "za_brisanje",
      lozinka: "lozinka",
      email: "brisanje@test.com",
      privatni_racun: false,
    });

    const response = await request(app).delete("/korisnici/2");
    expect(response.status).toBe(200);
  });
});