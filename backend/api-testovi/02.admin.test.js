import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Administratori API - dodjeljivanje administratorskih prava", () => {
  it("treba dodijeliti administratorska prava korisniku", async () => {
    const response = await request(app).post("/administratori/1");
    expect(response.status).toBe(200);
  });
});

describe("Administratori API - dohvaćanje administratora", () => {
  it("treba dohvatiti sve administratore", async () => {
    const response = await request(app).get("/administratori");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0]).toHaveProperty("korisnicko_ime");
    expect(response.body[0]).toHaveProperty("email");
    expect(response.body[0]).toHaveProperty("id_korisnika");
  });
});

describe("Administratori API - provjera administratorskih prava", () => {
  it("treba vratiti true za korisnika koji je admin", async () => {
    await request(app).post("/administratori/1");
    const response = await request(app).get("/administratori/check/1");
    expect(response.status).toBe(200);
    expect(response.body.isAdmin).toBe(true);
  });

  it("treba vratiti false za korisnika koji nije admin", async () => {
    const response = await request(app).get("/administratori/check/999");
    expect(response.status).toBe(200);
    expect(response.body.isAdmin).toBe(false);
  });
});

describe("Administratori API - oduzimanje administratorskih prava", () => {
  it("treba oduzeti administratorska prava korisniku", async () => {
    await request(app).post("/administratori/1");
    const response = await request(app).delete("/administratori/1");
    expect(response.status).toBe(200);
  });
});