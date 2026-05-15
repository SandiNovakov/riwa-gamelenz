import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Administrator API", () => {
  it("should check admin rights", async () => {
    const response = await request(app)
      .get("/administratori/check/1");

    expect(response.status).toBe(200);
    expect(response.body.isAdmin).toBeDefined();
  });

  it("should return rights level", async () => {
    const response = await request(app)
      .post("/check_rights")
      .send({
        id_korisnika: 1,
      });

    expect(response.status).toBe(200);
    expect(response.body.razina_prava).toBeDefined();
  });
});