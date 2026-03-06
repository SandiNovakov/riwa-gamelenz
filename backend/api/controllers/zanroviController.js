const pool = require("../config/db");

exports.create = async (req, res) => {
  const { naziv_zanra } = req.body;
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.query("INSERT INTO zanr (naziv_zanra) VALUES (?)", [
      naziv_zanra,
    ]);
    res.send("Zanr created");
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
    const rows = await conn.query("SELECT * FROM zanr");
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
    const rows = await conn.query("SELECT * FROM zanr WHERE id_zanra = ?", [
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
  const { naziv_zanra } = req.body;
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.query("UPDATE zanr SET naziv_zanra = ? WHERE id_zanra = ?", [
      naziv_zanra,
      req.params.id,
    ]);
    res.send("Zanr updated");
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
    await conn.query("DELETE FROM zanr WHERE id_zanra = ?", [req.params.id]);
    res.send("Zanr deleted");
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};
