const pool = require("../config/db");

exports.create = async (req, res) => {
  const { naziv_developera } = req.body;
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.query("INSERT INTO developer (naziv_developera) VALUES (?)", [
      naziv_developera,
    ]);
    res.send("Developer created");
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
    const rows = await conn.query("SELECT * FROM developer");
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
      "SELECT * FROM developer WHERE id_developera = ?",
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
  const { naziv_developera } = req.body;
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.query(
      "UPDATE developer SET naziv_developera = ? WHERE id_developera = ?",
      [naziv_developera, req.params.id],
    );
    res.send("Developer updated");
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
    await conn.query("DELETE FROM developer WHERE id_developera = ?", [
      req.params.id,
    ]);
    res.send("Developer deleted");
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};
