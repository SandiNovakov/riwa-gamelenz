const express = require("express");
const mariadb = require("mariadb");
const path = require("path");
const cors = require("cors");

//require("dotenv").config({
//  path: path.resolve(__dirname, "..", ".env"),
//});

require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
  quiet: true,
});

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:9000",
    credentials: true,
  }),
);

// MariaDB connection pool
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  connectionLimit: 5,
});

// KORISNIK
// CREATE Korisnik
app.post("/korisnici", async (req, res) => {
  const { korisnicko_ime, lozinka, email, privatni_racun } = req.body;

  const conn = await pool.getConnection();
  await conn.query(
    `INSERT INTO korisnik 
     (korisnicko_ime, lozinka, email, privatni_racun)
     VALUES (?, ?, ?, ?)`,
    [korisnicko_ime, lozinka, email, privatni_racun],
  );
  conn.release();
  res.send("Korisnik created");
});

// READ ALL korisnici
app.get(`/korisnici`, async (req, res) => {
  const conn = await pool.getConnection();

  //Sandi, 23.1.2026: sada podržava pretragu po korisničkom imenu

  try {
    const { korisnicko_ime } = req.query;

    let query = "SELECT * FROM korisnik";
    let params = [];

    if (korisnicko_ime) {
      query += " WHERE korisnicko_ime LIKE ?";
      params.push(`%${korisnicko_ime}%`); // Partial match
      // OR for exact match: params.push(korisnicko_ime);
    }

    const rows = await conn.query(query, params);
    conn.release();
    res.json(rows);
  } catch (error) {
    conn.release();
    res.status(500).json({ error: error.message });
  }
});

// READ ONE Korisnik
app.get("/korisnici/:id", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query(
    "SELECT * FROM korisnik WHERE id_korisnika = ?",
    [req.params.id],
  );
  conn.release();
  res.json(rows[0]);
});

// UPDATE Korisnik
app.put("/korisnici/:id", async (req, res) => {
  const { korisnicko_ime, lozinka, email, privatni_racun } = req.body;

  const conn = await pool.getConnection();
  await conn.query(
    `UPDATE korisnik SET
      korisnicko_ime = ?,
      lozinka = ?,
      email = ?,
      privatni_racun = ?
     WHERE id_korisnika = ?`,
    [korisnicko_ime, lozinka, email, privatni_racun, req.params.id],
  );
  conn.release();
  res.send("Korisnik updated");
});

// DELETE Korisnik
app.delete("/korisnici/:id", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.query("DELETE FROM korisnik WHERE id_korisnika = ?", [
    req.params.id,
  ]);
  conn.release();
  res.send("Korisnik deleted");
});

//ADMINISTRATORI GET PUT DELETE
app.get("/administratori", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.query(
    "SELECT korisnicko_ime, email, id_korisnika FROM korisnik WHERE razina_prava = 1",
  );
  conn.release();
  res.json(rows);
});

app.get("/administratori/check/:id", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query(
    "SELECT 1 FROM korisnik WHERE id_korisnika = ? and razina_prava = 1",
    [req.params.id],
  );

  conn.release();

  if (rows.length === 0) {
    res.json({
      isAdmin: false,
    });
  } else {
    res.json({
      isAdmin: true,
    });
  }
});

app.post("/administratori", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.query(
    "UPDATE korisnik SET razina_prava = 1 WHERE id_korisnika = ?",
    [req.params.id],
  );
  conn.release();
  res.json(rows);
});

app.delete("/administratori/:id", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.query(
    "UPDATE korisnik SET razina_prava = 0 WHERE id_korisnika = ?",
    [req.params.id],
  );
  conn.release();
  res.send("Administratorska prava obrisana");
});

// CREATE igrice
app.post("/igrice", async (req, res) => {
  const {
    naziv_igrice,
    opis,
    datum_izdanja,
    id_izdavaca,
    id_developera,
    id_zanra,
  } = req.body;

  const conn = await pool.getConnection();
  await conn.query(
    `INSERT INTO igrica
     (naziv_igrice, opis, datum_izdanja, id_izdavaca, id_developera, id_zanra)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [naziv_igrice, opis, datum_izdanja, id_izdavaca, id_developera, id_zanra],
  );
  conn.release();
  res.send("Igrica created");
});

// READ ALL igrice
app.get("/igrice", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM igrica");
  conn.release();
  res.json(rows);
});

// READ ONE Igrica
app.get("/igrice/:id", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM igrica WHERE id_igrice = ?", [
    req.params.id,
  ]);
  conn.release();
  res.json(rows[0]);
});

// UPDATE Igrica
app.put("/igrice/:id", async (req, res) => {
  const {
    naziv_igrice,
    opis,
    datum_izdanja,
    id_izdavaca,
    id_developera,
    id_zanra,
  } = req.body;

  const conn = await pool.getConnection();
  await conn.query(
    `UPDATE igrica SET
      naziv_igrice = ?,
      opis = ?,
      datum_izdanja = ?,
      id_izdavaca = ?,
      id_developera = ?,
      id_zanra = ?
     WHERE id_igrice = ?`,
    [
      naziv_igrice,
      opis,
      datum_izdanja,
      id_izdavaca,
      id_developera,
      id_zanra,
      req.params.id,
    ],
  );
  conn.release();
  res.send("Igrica updated");
});

// DELETE Igrica
app.delete("/igrice/:id", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.query("DELETE FROM igrica WHERE id_igrice = ?", [req.params.id]);
  conn.release();
  res.send("Igrica deleted");
});

// CREATE (add game to user's list)
app.post("/liste", async (req, res) => {
  const datum_dodavanja = new Date().toISOString().split("T")[0];
  const { id_korisnika, id_igrice, ocjena, komentar, status } = req.body;

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Insert into Igrica_na_listi
    await conn.query(
      `INSERT INTO igrica_na_listi
       (id_korisnika, id_igrice, datum_dodavanja, ocjena, komentar, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_korisnika, id_igrice, datum_dodavanja, ocjena, komentar, status],
    );

    // Update Igrica.Broj_dodavanja_na_listu
    await conn.query(
      `UPDATE igrica
       SET broj_dodavanja_na_listu = broj_dodavanja_na_listu + 1
       WHERE id_igrice = ?`,
      [id_igrice],
    );

    // Update Korisnik.Broj_igrica_na_listi
    await conn.query(
      `UPDATE korisnik
       SET broj_igrica_na_listi = broj_igrica_na_listi + 1
       WHERE id_korisnika = ?`,
      [id_korisnika],
    );

    await conn.commit();
    res.send("Game added to list and counters updated");
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).send("Error adding game to list");
  } finally {
    conn.release();
  }
});

// READ ALL (entire table)
app.get("/liste", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM igrica_na_listi");
  conn.release();
  res.json(rows);
});

// READ ONE (specific user's specific game)
app.get("/liste/:userId/:gameId", async (req, res) => {
  const { userId, gameId } = req.params;
  const conn = await pool.getConnection();
  const rows = await conn.query(
    "SELECT * FROM igrica_na_listi WHERE id_korisnika = ? AND id_igrice = ?",
    [userId, gameId],
  );
  conn.release();
  res.json(rows[0]);
});

// READ ALL (all games on a user's list)
app.get("/liste/:userId", async (req, res) => {
  const { userId } = req.params;
  const conn = await pool.getConnection();

  try {
    // Get all games with additional game details by joining with Igrica table
    const rows = await conn.query(
      `SELECT 
        il.*, 
        i.naziv_igrice,
        i.opis AS opis_igrice,
        i.datum_izdanja,
        z.naziv_zanra
       FROM igrica_na_listi il
       JOIN igrica i ON il.id_igrice = i.id_igrice
       LEFT JOIN zanr z ON i.id_zanra = z.id_zanra
       WHERE il.id_korisnika = ?`,
      [userId],
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching user game list" });
  } finally {
    conn.release();
  }
});

// UPDATE (specific entry)
app.put("/liste/:userId/:gameId", async (req, res) => {
  const { userId, gameId } = req.params;
  const { ocjena, komentar, status } = req.body;

  const conn = await pool.getConnection();
  await conn.query(
    `UPDATE igrica_na_listi SET
      ocjena = ?,
      komentar = ?,
      status = ?
     WHERE id_korisnika = ? AND id_igrice = ?`,
    [ocjena, komentar, status, userId, gameId],
  );
  conn.release();
  res.send("Entry updated");
});

app.delete("/liste/:userId/:gameId", async (req, res) => {
  const { userId, gameId } = req.params;
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // Delete the entry from Igrica_na_listi
    const result = await conn.query(
      "DELETE FROM igrica_na_listi WHERE id_korisnika = ? AND id_igrice = ?",
      [userId, gameId],
    );

    // MariaDB returns an object with affectedRows property for DELETE queries
    if (result.affectedRows === 0) {
      throw new Error("Entry not found or already deleted");
    }

    // Decrement Igrica.Broj_dodavanja_na_listu
    await conn.query(
      `UPDATE igrica
       SET broj_dodavanja_na_listu = GREATEST(broj_dodavanja_na_listu - 1, 0)
       WHERE id_igrice = ?`,
      [gameId],
    );

    // Decrement Korisnik.Broj_igrica_na_listi
    await conn.query(
      `UPDATE korisnik
       SET broj_igrica_na_listi = GREATEST(broj_igrica_na_listi - 1, 0)
       WHERE id_korisnika = ?`,
      [userId],
    );

    await conn.commit();
    res.send("Entry deleted and counters updated");
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res
      .status(err.message === "Entry not found or already deleted" ? 404 : 500)
      .send(err.message || "Error deleting entry");
  } finally {
    conn.release();
  }
});

// CREATE Zanr
app.post("/zanrovi", async (req, res) => {
  const { naziv_zanra } = req.body;
  const conn = await pool.getConnection();
  await conn.query("INSERT INTO zanr (naziv_zanra) VALUES (?)", [naziv_zanra]);
  conn.release();
  res.send("Zanr created");
});

// READ ALL zanrovi
app.get("/zanrovi", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM zanr");
  conn.release();
  res.json(rows);
});

// READ ONE Zanr
app.get("/zanrovi/:id", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM zanr WHERE id_zanra = ?", [
    req.params.id,
  ]);
  conn.release();
  res.json(rows[0]);
});

// UPDATE Zanr
app.put("/zanrovi/:id", async (req, res) => {
  const { naziv_zanra } = req.body;
  const conn = await pool.getConnection();
  await conn.query("UPDATE zanr SET naziv_zanra = ? WHERE id_zanra = ?", [
    naziv_zanra,
    req.params.id,
  ]);
  conn.release();
  res.send("Zanr updated");
});

// DELETE Zanr
app.delete("/zanrovi/:id", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.query("DELETE FROM zanr WHERE id_zanra = ?", [req.params.id]);
  conn.release();
  res.send("Zanr deleted");
});

app.post("/izdavaci", async (req, res) => {
  const { naziv_izdavaca } = req.body;
  const conn = await pool.getConnection();
  await conn.query("INSERT INTO izdavac (naziv_izdavaca) VALUES (?)", [
    naziv_izdavaca,
  ]);
  conn.release();
  res.send("Izdavac created");
});

app.get("/izdavaci", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM izdavac");
  conn.release();
  res.json(rows);
});

app.get("/izdavaci/:id", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM izdavac WHERE id_izdavaca = ?", [
    req.params.id,
  ]);
  conn.release();
  res.json(rows[0]);
});

app.put("/izdavaci/:id", async (req, res) => {
  const { naziv_izdavaca } = req.body;
  const conn = await pool.getConnection();
  await conn.query(
    "UPDATE izdavac SET naziv_izdavaca = ? WHERE id_izdavaca = ?",
    [naziv_izdavaca, req.params.id],
  );
  conn.release();
  res.send("Izdavac updated");
});

app.delete("/izdavaci/:id", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.query("DELETE FROM izdavac WHERE id_izdavaca = ?", [
    req.params.id,
  ]);
  conn.release();
  res.send("Izdavac deleted");
});

app.post("/developeri", async (req, res) => {
  const { naziv_developera } = req.body;
  const conn = await pool.getConnection();
  await conn.query("INSERT INTO developer (naziv_developera) VALUES (?)", [
    naziv_developera,
  ]);
  conn.release();
  res.send("Developer created");
});

app.get("/developeri", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM developer");
  conn.release();
  res.json(rows);
});

app.get("/developeri/:id", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query(
    "SELECT * FROM developer WHERE id_developera = ?",
    [req.params.id],
  );
  conn.release();
  res.json(rows[0]);
});

app.put("/developeri/:id", async (req, res) => {
  const { naziv_developera } = req.body;
  const conn = await pool.getConnection();
  await conn.query(
    "UPDATE developer SET naziv_developera = ? WHERE id_developera = ?",
    [naziv_developera, req.params.id],
  );
  conn.release();
  res.send("Developer updated");
});

app.delete("/developeri/:id", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.query("DELETE FROM developer WHERE id_developera = ?", [
    req.params.id,
  ]);
  conn.release();
  res.send("Developer deleted");
});

app.post("/platforme", async (req, res) => {
  const { naziv_platforme } = req.body;
  const conn = await pool.getConnection();
  await conn.query("INSERT INTO platforma (naziv_platforme) VALUES (?)", [
    naziv_platforme,
  ]);
  conn.release();
  res.send("Platforma created");
});

app.get("/platforme", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM platforma");
  conn.release();
  res.json(rows);
});

app.get("/platforme/:id", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query(
    "SELECT * FROM platforma WHERE id_platforme = ?",
    [req.params.id],
  );
  conn.release();
  res.json(rows[0]);
});

app.put("/platforme/:id", async (req, res) => {
  const { naziv_platforme } = req.body;
  const conn = await pool.getConnection();
  await conn.query(
    "UPDATE platforma SET naziv_platforme = ? WHERE id_platforme = ?",
    [naziv_platforme, req.params.id],
  );
  conn.release();
  res.send("Platforma updated");
});

app.delete("/platforme/:id", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.query("DELETE FROM platforma WHERE id_platforme = ?", [
    req.params.id,
  ]);
  conn.release();
  res.send("Platforma deleted");
});

// CREATE – povezi igricu s platformom
app.post("/igrice-platforme", async (req, res) => {
  const { id_igrice, id_platforme } = req.body;
  const conn = await pool.getConnection();
  await conn.query(
    "INSERT INTO igrica_na_platformi (id_igrice, id_platforme) VALUES (?, ?)",
    [id_igrice, id_platforme],
  );
  conn.release();
  res.send("Veza Igrica-Platforma dodana");
});

// READ ALL – sve veze Igrica-Platforma
app.get("/igrice-platforme", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM igrica_na_platformi");
  conn.release();
  res.json(rows);
});

// READ ONE – veza između tocno jedne igrice i platforme
app.get("/igrice-platforme/:igricaId/:platformaId", async (req, res) => {
  const { igricaId, platformaId } = req.params;
  const conn = await pool.getConnection();
  const rows = await conn.query(
    "SELECT * FROM igrica_na_platformi WHERE id_igrice = ? AND id_platforme = ?",
    [igricaId, platformaId],
  );
  conn.release();
  res.json(rows[0]);
});

// DELETE – ukloni vezu
app.delete("/igrice-platforme/:igricaId/:platformaId", async (req, res) => {
  const { igricaId, platformaId } = req.params;
  const conn = await pool.getConnection();
  await conn.query(
    "DELETE FROM igrica_na_platformi WHERE id_igrice = ? AND id_platforme = ?",
    [igricaId, platformaId],
  );
  conn.release();
  res.send("Veza igrica-platforma obrisana");
});

app.get("/igrice/detalji/:id", async (req, res) => {
  const { id } = req.params;
  const conn = await pool.getConnection();

  try {
    const [rows] = await conn.query(
      `
SELECT * FROM games_details WHERE id_igrice = ?
    `,
      [id],
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Igrica nije pronađena." });
    }

    res.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Greška pri dohvaćanju igrice." });
  } finally {
    conn.release();
  }
});

//UPDATE prosjecna ocjena, trebalo bi se raditi za svaku igricu povremeno.
// UPDATE prosjecna ocjena
app.put("/igrice/:id/prosjecna-ocjena", async (req, res) => {
  const { id } = req.params;
  const conn = await pool.getConnection();

  try {
    // 1. Get average rating
    const [rows] = await conn.query(
      `
            SELECT AVG(inl.ocjena) AS prosjek
            FROM igrica_na_listi inl
            JOIN korisnik k ON inl.id_korisnika = k.id_korisnika
            WHERE inl.id_igrice = ? AND k.privatni_racun = FALSE AND inl.ocjena IS NOT NULL
        `,
      [id],
    );

    // 2. Update average rating in Igrica table
    await conn.query(
      `
            UPDATE igrica 
            SET prosjecna_ocjena = ? 
            WHERE id_igrice = ?
        `,
      [rows.prosjek, id],
    );
    res.json({
      message: "Prosjecna ocjena azurirana.",
      nova_ocjena: rows.prosjek,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška pri obracunu prosjecne ocjene." });
  } finally {
    conn.release();
  }
});

app.post("/login", async (req, res) => {
  const { korisnicko_ime, lozinka } = req.body; // POST body
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      "SELECT id_korisnika FROM korisnik WHERE korisnicko_ime = ? AND lozinka = ?",
      [korisnicko_ime, lozinka],
    );

    if (rows.length === 0) {
      res.status(401).json({ message: "Pogrešni podaci." });
    } else {
      const id_korisnika = rows[0].id_korisnika;
      res.json({ id_korisnika }); // frontend može ovo spremiti kao cookie
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška" });
  } finally {
    conn.release();
  }
});

/*
 * Vraća:
 * broj_korisnika,
 * broj_igrica,
 * naziv_igrice,
 * opis,
 * prosjecna_ocjena
 */
app.get("/index-summary", async (req, res) => {
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query("SELECT * FROM index_summary");
    res.json(rows[0]); // view always returns exactly 1 row
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška na serveru" });
  } finally {
    conn.release();
  }
});

/*
 * Prima:
 * platforme
 * zanrovi
 * developeri
 * izdavaci
 * naziv_igre
 * datum_od
 * datum_do
 * sort (polje po kojem se sortira.)
 *
 * Vraca:
 * SELECT * FROM games_details;
 */

app.get("/browse", async (req, res) => {
  const q = req.query;

  const {
    naziv_igrice,
    zanr,
    developer,
    izdavac,
    platforma, // single platform ID
    datum_od,
    datum_do,
    sort,
  } = q;

  const where = [];
  const params = [];

  // ---- basic filters (from view columns) ----
  if (naziv_igrice) {
    where.push("naziv_igrice LIKE ?");
    params.push(naziv_igrice);
  }

  if (zanr) {
    where.push("id_zanra = ?");
    params.push(zanr);
  }

  if (developer) {
    where.push("id_developera = ?");
    params.push(developer);
  }

  if (izdavac) {
    where.push("id_izdavaca = ?");
    params.push(izdavac);
  }

  if (datum_od) {
    where.push("datum_izdanja >= ?");
    params.push(datum_od);
  }

  if (datum_do) {
    where.push("datum_izdanja <= ?");
    params.push(datum_do);
  }

  if (platforma) {
    where.push(`
      EXISTS (
        SELECT 1
        FROM igrica_na_platformi ip
        WHERE ip.id_igrice = games_details.id_igrice
          AND ip.id_platforme = ?
      )
    `);
    params.push(platforma);
  }

  // ---- base query ----
  let sql = "SELECT * FROM games_details";

  if (where.length > 0) {
    sql += " WHERE " + where.join(" AND ");
  }

  // ---- safe sorting (whitelist only) ----
  const allowedSort = [
    "naziv_igrice",
    "datum_izdanja",
    "broj_dodavanja_na_listu",
    "prosjecna_ocjena",
  ];

  if (sort && allowedSort.includes(sort)) {
    sql += ` ORDER BY ${sort} DESC`;
  }

  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška na serveru" });
  } finally {
    conn.release();
  }
});

app.post("/check_rights", async (req, res) => {
  const { id_korisnika } = req.body; // POST body
  if (!id_korisnika) {
    return res.status(200).json({
      razina_prava: 0,
      message: "Nije dan ID.",
    });
  }
  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(
      "SELECT razina_prava FROM korisnik WHERE id_korisnika = ?",
      [id_korisnika],
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        message: "korisnik nije pronađen.",
        razina_prava: 0,
      });
    }
    const razina_prava = rows[0].razina_prava;
    res.json({ razina_prava }); // frontend može ovo spremiti kao cookie
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška", razina_prava: 0 });
  } finally {
    conn.release();
  }
});

app.get("/lista_igrica/:id_korisnika", async (req, res) => {
  const { id_korisnika } = req.params;
  const q = req.query;

  if (id_korisnika === null) {
    res.json.status("404");
  }

  const { naziv_igrice, zanr, developer, izdavac, status, sort } = q;

  const where = [];
  const params = [];

  where.push(`id_korisnika = ?`);
  params.push(id_korisnika);

  // ---- basic filters (from view columns) ----
  if (naziv_igrice) {
    where.push("naziv_igrice LIKE ?");
    params.push(naziv_igrice);
  }

  if (zanr) {
    where.push("id_zanra = ?");
    params.push(zanr);
  }

  if (developer) {
    where.push("id_developera = ?");
    params.push(developer);
  }

  if (izdavac) {
    where.push("id_izdavaca = ?");
    params.push(izdavac);
  }

  if (status) {
    where.push("status = ?");
    params.push(status);
  }

  // ---- base query ----
  let sql = "SELECT * FROM korisnik_lista_igrica";

  if (where.length > 0) {
    sql += " WHERE " + where.join(" AND ");
  }

  // ---- safe sorting (whitelist only) ----
  const allowedSort = ["naziv_igrice", "datum_dodavanja", "ocjena"];

  if (sort && allowedSort.includes(sort)) {
    sql += ` ORDER BY ${sort} DESC`;
  }

  const conn = await pool.getConnection();
  try {
    const rows = await conn.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška na serveru" });
  } finally {
    conn.release();
  }
});

app.listen(3000, () => {
  console.log("API running on \x1b[36mhttp://localhost:3000/\x1b[0m");
});
