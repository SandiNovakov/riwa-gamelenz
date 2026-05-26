import { describe, it, expect } from "vitest";
import request from "supertest";
import pool from "../config/db.js";
import app from "../app.js";

// 00. truncate
describe("Truncate all tables", () => {
  it("treba isprazniti sve tablice i resetirati auto_increment", async () => {
    const conn = await pool.getConnection();

    try {
      await conn.query("SET FOREIGN_KEY_CHECKS = 0");

      await conn.query("TRUNCATE TABLE igrica_na_platformi");
      await conn.query("TRUNCATE TABLE igrica_na_listi");
      await conn.query("TRUNCATE TABLE platforma");
      await conn.query("TRUNCATE TABLE developer");
      await conn.query("TRUNCATE TABLE izdavac");
      await conn.query("TRUNCATE TABLE zanr");
      await conn.query("TRUNCATE TABLE igrica");
      await conn.query("TRUNCATE TABLE korisnik");

      await conn.query("SET FOREIGN_KEY_CHECKS = 1");

      expect(true).toBe(true);
    } catch (err) {
      console.error("Error truncating tables:", err);
      throw err;
    } finally {
      conn.release();
    }
  });
});

// 01. korisnici
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

// 02. admin
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

// 03. zanrovi
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

// 04. izdavaci
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

// 05. developeri
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

// 06. platforme
describe("Platforme API - kreiranje platforme", () => {
  it("treba kreirati novu platformu", async () => {
    const response = await request(app).post("/platforme").send({
      naziv_platforme: "PlayStation 5",
    });

    expect(response.status).toBe(200);
  });
});

describe("Platforme API - dohvaćanje platformi", () => {
  it("treba dohvatiti sve platforme", async () => {
    const response = await request(app).get("/platforme");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti jednu platformu po ID-u", async () => {
    const response = await request(app).get("/platforme/1");

    expect(response.status).toBe(200);
    expect(response.body.id_platforme).toBeDefined();
    expect(response.body.naziv_platforme).toBeDefined();
  });
});

describe("Platforme API - ažuriranje platforme", () => {
  it("treba ažurirati naziv platforme", async () => {
    const response = await request(app).put("/platforme/1").send({
      naziv_platforme: "Ažurirana platforma",
    });

    expect(response.status).toBe(200);
  });
});

describe("Platforme API - brisanje platforme", () => {
  it("treba obrisati platformu", async () => {
    await request(app).post("/platforme").send({
      naziv_platforme: "Za brisanje",
    });

    const response = await request(app).delete("/platforme/2");

    expect(response.status).toBe(200);
  });
});

// 07. igrice
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

// 08. igrice-platforme
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

// 09. liste
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
    const response = await request(app).get(
      "/lista_igrica/1?naziv_igrice=Zelda",
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba sortirati listu po ocjeni", async () => {
    const response = await request(app).get("/lista_igrica/1?sort=ocjena");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

// 10. misc
describe("Browse API - pretraživanje igrica", () => {
  it("treba dohvatiti sve igrice s filtriranjem po nazivu", async () => {
    const response = await request(app).get("/browse?naziv_igrice=Zelda");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti igrice filtrirane po žanru", async () => {
    const response = await request(app).get("/browse?zanr=1");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti igrice filtrirane po developeru", async () => {
    const response = await request(app).get("/browse?developer=1");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti igrice filtrirane po platformi", async () => {
    const response = await request(app).get("/browse?platforma=1");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba dohvatiti igrice u rasponu datuma", async () => {
    const response = await request(app).get(
      "/browse?datum_od=2020-01-01&datum_do=2024-12-31",
    );

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba sortirati igrice po nazivu", async () => {
    const response = await request(app).get("/browse?sort=naziv_igrice");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it("treba sortirati igrice po prosječnoj ocjeni", async () => {
    const response = await request(app).get("/browse?sort=prosjecna_ocjena");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("Index Summary API", () => {
  it("treba dohvatiti sažetak podataka za početnu stranicu", async () => {
    const response = await request(app).get("/index-summary");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("broj_korisnika");
    expect(response.body).toHaveProperty("broj_igrica");
  });
});
