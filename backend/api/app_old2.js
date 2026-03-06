const express = require("express");
const mariadb = require("mariadb");
const path = require("path");
const cors = require("cors");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

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
  connectionLimit: 20,
});

// KORISNIK
// CREATE Korisnik
app.post("/korisnici", async (req, res) => {
  const { korisnicko_ime, lozinka, email, privatni_racun } = req.body;

  const conn = await pool.getConnection();
  // REMOVED: broj_igrica_na_listi column reference - now calculated in view
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
      params.push(`%${korisnicko_ime}%`);
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
  try {
    if (!lozinka) {
      await conn.query(
        `UPDATE korisnik SET
      korisnicko_ime = ?,
      email = ?,
      privatni_racun = ?
     WHERE id_korisnika = ?`,
        [korisnicko_ime, email, privatni_racun, req.params.id],
      );
    } else {
      // REMOVED: broj_igrica_na_listi from UPDATE - now calculated
      await conn.query(
        `UPDATE korisnik SET
      korisnicko_ime = ?,
      lozinka = ?,
      email = ?,
      privatni_racun = ?
     WHERE id_korisnika = ?`,
        [korisnicko_ime, lozinka, email, privatni_racun, req.params.id],
      );
    }
  } finally {
    conn.release();
  }
  res.send("Korisnik updated");
});

// DELETE Korisnik
app.delete("/korisnici/:id", async (req, res) => {
  const conn = await pool.getConnection();
  // REMOVED: No need to manually update counters - ON DELETE CASCADE handles it
  await conn.query("DELETE FROM korisnik WHERE id_korisnika = ?", [
    req.params.id,
  ]);
  conn.release();
  res.send("Korisnik deleted");
});

//ADMINISTRATORI GET PUT DELETE
app.get("/administratori", async (req, res) => {
  const conn = await pool.getConnection();
  const rows = await conn.query(
    "SELECT korisnicko_ime, email, id_korisnika FROM korisnik WHERE razina_prava = 1",
  );
  conn.release();
  res.json(rows);
});

app.get("/administratori/check/:id", async (req, res) => {
  const conn = await pool.getConnection();
  let rows;
  try {
    rows = await conn.query(
      "SELECT id_korisnika FROM korisnik WHERE id_korisnika = ? and razina_prava = 1",
      [req.params.id],
    );
  } finally {
    conn.release();
  }
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

app.post("/administratori/:id", async (req, res) => {
  const conn = await pool.getConnection();
  await conn.query(
    "UPDATE korisnik SET razina_prava = 1 WHERE id_korisnika = ?",
    [req.params.id],
  );
  conn.release();
  res.json("admin dodan");
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
  // REMOVED: prosjecna_ocjena and broj_dodavanja_na_listu - now calculated
  const result = await conn.execute(
    `INSERT INTO igrica
     (naziv_igrice, opis, datum_izdanja, id_izdavaca, id_developera, id_zanra)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [naziv_igrice, opis, datum_izdanja, id_izdavaca, id_developera, id_zanra],
  );
  conn.release();
  res.json({
    message: "Igrica stvorena",
    id: Number(result.insertId),
  });
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
  // REMOVED: prosjecna_ocjena and broj_dodavanja_na_listu from UPDATE
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
  // REMOVED: No need to manually delete images - handled by DELETE CASCADE on foreign keys
  // REMOVED: No need to update counters - they're calculated now
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
    // REMOVED: Transaction no longer needed since we removed counter updates
    // REMOVED: No more igrica.broj_dodavanja_na_listu update
    // REMOVED: No more korisnik.broj_igrica_na_listi update

    // Insert into Igrica_na_listi only
    await conn.query(
      `INSERT INTO igrica_na_listi
       (id_korisnika, id_igrice, datum_dodavanja, ocjena, komentar, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_korisnika, id_igrice, datum_dodavanja, ocjena, komentar, status],
    );

    res.send("Game added to list");
  } catch (err) {
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
    // REMOVED: Transaction no longer needed
    // REMOVED: No more igrica.broj_dodavanja_na_listu decrement
    // REMOVED: No more korisnik.broj_igrica_na_listi decrement

    // Just delete the entry
    const result = await conn.query(
      "DELETE FROM igrica_na_listi WHERE id_korisnika = ? AND id_igrice = ?",
      [userId, gameId],
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Entry not found");
    }

    res.send("Entry deleted");
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message || "Error deleting entry");
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
    // CHANGED: games_details view now includes calculated fields
    const rows = await conn.query(
      "SELECT * FROM v_games_details WHERE id_igrice = ?",
      [id],
    );
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Igrica nije pronađena." });
    }

    res.json(rows[0]); // CHANGED: return first row, not array
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Greška pri dohvaćanju igrice." });
  } finally {
    conn.release();
  }
});

// REMOVED: /igrice/:id/prosjecna-ocjena endpoint - now calculated in view
// REMOVED entire app.put("/igrice/:id/prosjecna-ocjena", ...) function

app.post("/login", async (req, res) => {
  const { korisnicko_ime, lozinka } = req.body;
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
      res.json({ id_korisnika });
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
    // CHANGED: using v_index_summary view
    const rows = await conn.query("SELECT * FROM v_index_summary");
    res.json(rows[0]);
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
 * SELECT * FROM v_games_details;
 */
app.get("/browse", async (req, res) => {
  const q = req.query;

  const {
    naziv_igrice,
    zanr,
    developer,
    izdavac,
    platforma,
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
        WHERE ip.id_igrice = v_games_details.id_igrice
          AND ip.id_platforme = ?
      )
    `);
    params.push(platforma);
  }

  // ---- base query ----
  let sql = "SELECT * FROM v_games_details";

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
    res.status(404).json({ message: "Korisnik nije pronađen" });
    return;
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
  let sql = "SELECT * FROM v_korisnik_lista_igrica";

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

// ==================== SIMPLIFIED IMAGE API ====================
// (unchanged - this part was already refactored)

app.get("/images", async (req, res) => {
  let conn;
  try {
    const { veza_tablica, id_veze, tip_slike } = req.query;

    if (!veza_tablica || !id_veze || !tip_slike) {
      return res.status(400).json({
        error: "veza_tablica, id_veze and tip_slike are required",
      });
    }

    conn = await pool.getConnection();
    const rows = await conn.execute(
      `SELECT id_slike, mime_type, data 
       FROM slike 
       WHERE veza_tablica = ? AND id_veze = ? AND tip_slike = ?`,
      [veza_tablica, id_veze, tip_slike],
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Image not found" });
    }

    const image = rows[0];
    res.json({
      id: Number(image.id_slike),
      mime_type: image.mime_type,
      data: image.data.toString("base64"),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

app.post("/images", upload.single("image"), async (req, res) => {
  let conn;
  try {
    const { veza_tablica, id_veze, tip_slike } = req.body;

    if (!req.file || !veza_tablica || !id_veze || !tip_slike) {
      return res.status(400).json({ error: "Missing required fields or file" });
    }

    conn = await pool.getConnection();

    const existing = await conn.execute(
      `SELECT id_slike FROM slike WHERE veza_tablica = ? AND id_veze = ? AND tip_slike = ?`,
      [veza_tablica, id_veze, tip_slike],
    );

    let result;
    if (existing.length > 0) {
      result = await conn.execute(
        `UPDATE slike 
         SET mime_type = ?, data = ?, size = ?
         WHERE id_slike = ?`,
        [
          req.file.mimetype,
          req.file.buffer,
          req.file.size,
          existing[0].id_slike,
        ],
      );
      console.log("Image updated, ID:", existing[0].id_slike);
    } else {
      result = await conn.execute(
        `INSERT INTO slike (veza_tablica, id_veze, tip_slike, mime_type, data, size)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          veza_tablica,
          id_veze,
          tip_slike,
          req.file.mimetype,
          req.file.buffer,
          req.file.size,
        ],
      );
      console.log("Image created, ID:", result.insertId);
    }

    const imageId =
      existing.length > 0
        ? Number(existing[0].id_slike)
        : Number(result.insertId);

    res.json({
      message: "success",
      id: imageId,
    });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

app.delete("/images", async (req, res) => {
  let conn;
  try {
    const { veza_tablica, id_veze, tip_slike } = req.query;

    if (!veza_tablica || !id_veze || !tip_slike) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    conn = await pool.getConnection();
    const result = await conn.execute(
      `DELETE FROM slike WHERE veza_tablica = ? AND id_veze = ? AND tip_slike = ?`,
      [veza_tablica, id_veze, tip_slike],
    );

    res.json({
      message: "Image deleted",
      affected: result.affectedRows,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
});

app.listen(3000, () => {
  console.log("API running on \x1b[36mhttp://localhost:3000/\x1b[0m");
});
