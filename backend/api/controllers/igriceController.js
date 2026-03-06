const pool = require("../config/db");

exports.create = async (req, res) => {
  const {
    naziv_igrice,
    opis,
    datum_izdanja,
    id_izdavaca,
    id_developera,
    id_zanra,
  } = req.body;

  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.execute(
      `INSERT INTO igrica
       (naziv_igrice, opis, datum_izdanja, id_izdavaca, id_developera, id_zanra)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [naziv_igrice, opis, datum_izdanja, id_izdavaca, id_developera, id_zanra],
    );

    res.json({
      message: "Igrica stvorena",
      id: Number(result.insertId),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.getAll = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM igrica");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.getOne = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM igrica WHERE id_igrice = ?", [
      req.params.id,
    ]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.update = async (req, res) => {
  const {
    naziv_igrice,
    opis,
    datum_izdanja,
    id_izdavaca,
    id_developera,
    id_zanra,
  } = req.body;

  let conn;
  try {
    conn = await pool.getConnection();
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
    res.send("Igrica updated");
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.delete = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query("DELETE FROM igrica WHERE id_igrice = ?", [req.params.id]);
    res.send("Igrica deleted");
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.browse = async (req, res) => {
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

exports.getDetails = async (req, res) => {
  const { id } = req.params;
  let conn;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT * FROM v_games_details WHERE id_igrice = ?",
      [id],
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Igrica nije pronađena." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ message: "Greška pri dohvaćanju igrice." });
  } finally {
    if (conn) conn.release();
  }
};
