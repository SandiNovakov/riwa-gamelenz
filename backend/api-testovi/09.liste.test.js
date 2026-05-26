import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../api/app.js";

describe("Liste API - dodavanje igrice na listu", () => {
  it("treba uspješno dodati igricu na listu s validnim podacima", async () => {
    const response = await request(app).post("/liste").send({
      id_korisnika: 1,
      id_igrice: 1,
      ocjena: 5,
      komentar: "Odlična igrica",
      status: "igram",
    });
    expect(response.status).toBe(201);
  });

  it("treba odbiti dodavanje bez id_korisnika i id_igrice", async () => {
    const response = await request(app).post("/liste").send({
      ocjena: 5,
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Missing required fields");
  });

  it("treba odbiti dodavanje igrice koja već postoji na listi", async () => {
    await request(app).post("/liste").send({
      id_korisnika: 1,
      id_igrice: 1,
      status: "igram",
    });

    const response = await request(app).post("/liste").send({
      id_korisnika: 1,
      id_igrice: 1,
      status: "igram",
    });
    expect(response.status).toBe(409);
    expect(response.body.error).toBe("DUPLICATE_ENTRY");
  });

  it("treba odbiti dodavanje s nepostojećim korisnikom", async () => {
    const response = await request(app).post("/liste").send({
      id_korisnika: 999,
      id_igrice: 1,
      status: "igram",
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("INVALID_REFERENCE");
  });

  it("treba odbiti dodavanje s nepostojećom igricom", async () => {
    const response = await request(app).post("/liste").send({
      id_korisnika: 1,
      id_igrice: 999,
      status: "igram",
    });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe("INVALID_REFERENCE");
  });
});

describe("Liste API - dohvaćanje svih unosa", () => {
  it("treba dohvatiti sve unose iz tabele igrica_na_listi", async () => {
    const response = await request(app).get("/liste");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("Liste API - dohvaćanje specifičnog unosa", () => {
  it("treba dohvatiti unos za određeni korisnik-igrica par", async () => {
    await request(app).post("/liste").send({
      id_korisnika: 1,
      id_igrice: 2,
      status: "igram",
    });

    const response = await request(app).get("/liste/1/2");
    expect(response.status).toBe(200);
  });
});

describe("Liste API - dohvaćanje korisnikove liste", () => {
  it("treba dohvatiti sve igrice sa detaljima za određenog korisnika", async () => {
    const response = await request(app).get("/liste/1");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("naziv_igrice");
    expect(response.body[0]).toHaveProperty("naziv_zanra");
  });
});

describe("Liste API - ažuriranje unosa", () => {
  it("treba uspješno ažurirati ocjenu, komentar i status", async () => {
    await request(app).post("/liste").send({
      id_korisnika: 1,
      id_igrice: 3,
      status: "igram",
    });

    const response = await request(app).put("/liste/1/3").send({
      ocjena: 4,
      komentar: "Ažurirani komentar",
      status: "završeno",
    });
    expect(response.status).toBe(200);
  });
});

describe("Liste API - brisanje unosa (transakcija)", () => {
  it("treba uspješno obrisati unos i smanjiti brojače", async () => {
    await request(app).post("/liste").send({
      id_korisnika: 1,
      id_igrice: 1,
      status: "igram",
    });

    const response = await request(app).delete("/liste/1/1");
    expect(response.status).toBe(200);
  });

  it("treba vratiti 404 kod brisanja nepostojećeg unosa", async () => {
    const response = await request(app).delete("/liste/999/999");
    expect(response.status).toBe(404);
    expect(response.body.error).toBe("NOT_FOUND");
  });
});

describe("Liste API - filtrirana korisnikova lista", () => {
  it("treba filtrirati listu po statusu", async () => {
    const response = await request(app).get("/lista_igrica/1?status=igrano");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba filtrirati listu po nazivu igrice", async () => {
    const response = await request(app).get("/lista_igrica/1?naziv_igrice=Zelda");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba sortirati listu po ocjeni", async () => {
    const response = await request(app).get("/lista_igrica/1?sort=ocjena");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});