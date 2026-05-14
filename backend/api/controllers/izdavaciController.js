const pool = require("../config/db");

exports.create = async (req, res) => {
  const { naziv_izdavaca } = req.body;
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.query("INSERT INTO izdavac (naziv_izdavaca) VALUES (?)", [
      naziv_izdavaca,
    ]);
    res.send("Izdavac created");
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
    const rows = await conn.query("SELECT * FROM izdavac");
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
    const rows = await conn.query(
      "SELECT * FROM izdavac WHERE id_izdavaca = ?",
      [req.params.id],
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.update = async (req, res) => {
  const { naziv_izdavaca } = req.body;
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.query(
      "UPDATE izdavac SET naziv_izdavaca = ? WHERE id_izdavaca = ?",
      [naziv_izdavaca, req.params.id],
    );
    res.send("Izdavac updated");
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
    await conn.query("DELETE FROM izdavac WHERE id_izdavaca = ?", [
      req.params.id,
    ]);
    res.send("Izdavac deleted");
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};
