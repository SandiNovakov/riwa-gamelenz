const pool = require("../config/db");

exports.addToList = async (req, res) => {
  const datum_dodavanja = new Date().toISOString().split("T")[0];
  const { id_korisnika, id_igrice, ocjena, komentar, status } = req.body;

  let conn;
  try {
    conn = await pool.getConnection();
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
    if (conn) conn.release();
  }
};

exports.getAll = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM igrica_na_listi");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.getOne = async (req, res) => {
  const { userId, gameId } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT * FROM igrica_na_listi WHERE id_korisnika = ? AND id_igrice = ?",
      [userId, gameId],
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.getUserList = async (req, res) => {
  const { userId } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
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
    if (conn) conn.release();
  }
};

exports.update = async (req, res) => {
  const { userId, gameId } = req.params;
  const { ocjena, komentar, status } = req.body;

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      `UPDATE igrica_na_listi SET
        ocjena = ?,
        komentar = ?,
        status = ?
       WHERE id_korisnika = ? AND id_igrice = ?`,
      [ocjena, komentar, status, userId, gameId],
    );
    res.send("Entry updated");
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.delete = async (req, res) => {
  const { userId, gameId } = req.params;
  let conn;
  try {
    conn = await pool.getConnection();
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
    if (conn) conn.release();
  }
};

exports.getFilteredUserList = async (req, res) => {
  const { id_korisnika } = req.params;
  const q = req.query;

  if (!id_korisnika) {
    return res.status(404).json({ message: "Korisnik nije pronađen" });
  }

  const { naziv_igrice, zanr, developer, izdavac, status, sort } = q;

  const where = [];
  const params = [];

  where.push(`id_korisnika = ?`);
  params.push(id_korisnika);

  // ---- basic filters (from view columns) ----
  if (naziv_igrice) {
    where.push("naziv_igrice LIKE ?");
    params.push(`%${naziv_igrice}%`);
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

  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška na serveru" });
  } finally {
    if (conn) conn.release();
  }
};
