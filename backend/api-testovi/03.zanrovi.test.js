import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Žanrovi API - kreiranje žanra", () => {
  it("treba kreirati novi žanr", async () => {
    const response = await request(app).post("/zanrovi").send({
      naziv_zanra: "Action",
    });
    expect(response.status).toBe(200);
  });
});

describe("Žanrovi API - dohvaćanje žanrova", () => {
  it("treba dohvatiti sve žanrove", async () => {
    const response = await request(app).get("/zanrovi");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti jedan žanr po ID-u", async () => {
    const response = await request(app).get("/zanrovi/1");
    expect(response.status).toBe(200);
    expect(response.body.id_zanra).toBeDefined();
    expect(response.body.naziv_zanra).toBeDefined();
  });
});

describe("Žanrovi API - ažuriranje žanra", () => {
  it("treba ažurirati naziv žanra", async () => {
    const response = await request(app).put("/zanrovi/1").send({
      naziv_zanra: "Ažurirani žanr",
    });
    expect(response.status).toBe(200);
  });
});

describe("Žanrovi API - brisanje žanra", () => {
  it("treba obrisati žanr", async () => {
    await request(app).post("/zanrovi").send({
      naziv_zanra: "Za brisanje",
    });
    const response = await request(app).delete("/zanrovi/2");
    expect(response.status).toBe(200);
  });
});