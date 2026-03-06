const pool = require("../config/db");

// Platforma CRUD
exports.create = async (req, res) => {
  const { naziv_platforme } = req.body;
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.query("INSERT INTO platforma (naziv_platforme) VALUES (?)", [
      naziv_platforme,
    ]);
    res.send("Platforma created");
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
    const rows = await conn.query("SELECT * FROM platforma");
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
      "SELECT * FROM platforma WHERE id_platforme = ?",
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
  const { naziv_platforme } = req.body;
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.query(
      "UPDATE platforma SET naziv_platforme = ? WHERE id_platforme = ?",
      [naziv_platforme, req.params.id],
    );
    res.send("Platforma updated");
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
    await conn.query("DELETE FROM platforma WHERE id_platforme = ?", [
      req.params.id,
    ]);
    res.send("Platforma deleted");
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

// Igrica-Platforma veze
exports.addGamePlatform = async (req, res) => {
  const { id_igrice, id_platforme } = req.body;
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.query(
      "INSERT INTO igrica_na_platformi (id_igrice, id_platforme) VALUES (?, ?)",
      [id_igrice, id_platforme],
    );
    res.send("Veza Igrica-Platforma dodana");
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.getAllGamePlatforms = async (req, res) => {
  let conn;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM igrica_na_platformi");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.getOneGamePlatform = async (req, res) => {
  const { igricaId, platformaId } = req.params;
  let conn;

  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT * FROM igrica_na_platformi WHERE id_igrice = ? AND id_platforme = ?",
      [igricaId, platformaId],
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.deleteGamePlatform = async (req, res) => {
  const { igricaId, platformaId } = req.params;
  let conn;

  try {
    conn = await pool.getConnection();
    await conn.query(
      "DELETE FROM igrica_na_platformi WHERE id_igrice = ? AND id_platforme = ?",
      [igricaId, platformaId],
    );
    res.send("Veza igrica-platforma obrisana");
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};
