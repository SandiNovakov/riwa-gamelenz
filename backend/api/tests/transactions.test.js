import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../app.js";

describe("Liste API", () => {
  it("should add game to user list", async () => {
    const response = await request(app)
      .post("/liste")
      .send({
        id_korisnika: 1,
        id_igrice: 1,
        ocjena: 5,
        komentar: "Odlicna igra",
        status: "played",
      });

    console.log("Test dodavanje na listu. Za bazu koja nije na novo instalirana treba vratiti 409.");
    console.log("STATUS:", response.status);
    console.log("BODY:", response.body);

    expect([200, 409]).toContain(response.status);
  });

  it("should update list entry", async () => {
    const response = await request(app)
      .put("/liste/1/1")
      .send({
        ocjena: 4,
        komentar: "Updated",
        status: "completed",
      });

    expect(response.status).toBe(200);
  });
});