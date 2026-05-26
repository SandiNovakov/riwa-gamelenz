import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Izdavači API - kreiranje izdavača", () => {
  it("treba kreirati novog izdavača", async () => {
    const response = await request(app).post("/izdavaci").send({
      naziv_izdavaca: "Nintendo",
    });
    expect(response.status).toBe(200);
  });
});

describe("Izdavači API - dohvaćanje izdavača", () => {
  it("treba dohvatiti sve izdavače", async () => {
    const response = await request(app).get("/izdavaci");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti jednog izdavača po ID-u", async () => {
    const response = await request(app).get("/izdavaci/1");
    expect(response.status).toBe(200);
    expect(response.body.id_izdavaca).toBeDefined();
    expect(response.body.naziv_izdavaca).toBeDefined();
  });
});

describe("Izdavači API - ažuriranje izdavača", () => {
  it("treba ažurirati naziv izdavača", async () => {
    const response = await request(app).put("/izdavaci/1").send({
      naziv_izdavaca: "Ažurirani izdavač",
    });
    expect(response.status).toBe(200);
  });
});

describe("Izdavači API - brisanje izdavača", () => {
  it("treba obrisati izdavača", async () => {
    await request(app).post("/izdavaci").send({
      naziv_izdavaca: "Za brisanje",
    });
    const response = await request(app).delete("/izdavaci/2");
    expect(response.status).toBe(200);
  });
});