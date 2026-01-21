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

// UPDATE (specific entry)
app.put("/liste/:userId/:gameId", async (req, res) => {
  const { userId, gameId } = req.params;
  const { datum_dodavanja, ocjena, komentar, status } = req.body;

  const conn = await pool.getConnection();
  await conn.query(
    `UPDATE igrica_na_listi SET
      datum_dodavanja = ?,
      ocjena = ?,
      komentar = ?,
      status = ?
     WHERE id_korisnika = ? AND id_igrice = ?`,
    [datum_dodavanja, ocjena, komentar, status, userId, gameId],
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

// READ ALL zanrovi
app.get("/zanrovi", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM zanr");
  conn.release();
  res.json(rows);
});

app.get("/izdavaci", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM izdavac");
  conn.release();
  res.json(rows);
});

app.get("/developeri", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM developer");
  conn.release();
  res.json(rows);
});

app.get("/platforme", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query("SELECT * FROM platforma");
  conn.release();
  res.json(rows);
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

//prima id_korisnika, vraca razinu prava korisnika;
app.post("/check_rights", async (req, res) => {
  const { id_korisnika } = req.body;
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
    res.json({ razina_prava });
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
