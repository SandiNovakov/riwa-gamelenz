import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Developeri API - kreiranje developera", () => {
  it("treba kreirati novog developera", async () => {
    const response = await request(app).post("/developeri").send({
      naziv_developera: "Rockstar Games",
    });
    expect(response.status).toBe(200);
  });
});

describe("Developeri API - dohvaćanje developera", () => {
  it("treba dohvatiti sve developere", async () => {
    const response = await request(app).get("/developeri");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti jednog developera po ID-u", async () => {
    const response = await request(app).get("/developeri/1");
    expect(response.status).toBe(200);
    expect(response.body.id_developera).toBeDefined();
    expect(response.body.naziv_developera).toBeDefined();
  });
});

describe("Developeri API - ažuriranje developera", () => {
  it("treba ažurirati naziv developera", async () => {
    const response = await request(app).put("/developeri/1").send({
      naziv_developera: "Ažurirani developer",
    });
    expect(response.status).toBe(200);
  });
});

describe("Developeri API - brisanje developera", () => {
  it("treba obrisati developera", async () => {
    await request(app).post("/developeri").send({
      naziv_developera: "Za brisanje",
    });
    const response = await request(app).delete("/developeri/2");
    expect(response.status).toBe(200);
  });
});