const pool = require("../config/db");

exports.create = async (req, res) => {
  const { korisnicko_ime, lozinka, email, privatni_racun } = req.body;

  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      `INSERT INTO korisnik 
       (korisnicko_ime, lozinka, email, privatni_racun)
       VALUES (?, ?, ?, ?)`,
      [korisnicko_ime, lozinka, email, privatni_racun],
    );
    res.send("Korisnik created");
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.getAll = async (req, res) => {
  let conn;
  try {
    const { korisnicko_ime } = req.query;

    let query = "SELECT * FROM korisnik";
    let params = [];

    if (korisnicko_ime) {
      query += " WHERE korisnicko_ime LIKE ?";
      params.push(`%${korisnicko_ime}%`);
    }

    conn = await pool.getConnection();
    const rows = await conn.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.getOne = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT * FROM korisnik WHERE id_korisnika = ?",
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
  const { korisnicko_ime, lozinka, email, privatni_racun } = req.body;
  let conn;

  try {
    conn = await pool.getConnection();

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

    res.send("Korisnik updated");
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
    await conn.query("DELETE FROM korisnik WHERE id_korisnika = ?", [
      req.params.id,
    ]);
    res.send("Korisnik deleted");
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.getAdmins = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT korisnicko_ime, email, id_korisnika FROM korisnik WHERE razina_prava = 1",
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.checkAdmin = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT id_korisnika FROM korisnik WHERE id_korisnika = ? and razina_prava = 1",
      [req.params.id],
    );

    if (rows.length === 0) {
      res.json({ isAdmin: false });
    } else {
      res.json({ isAdmin: true });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.addAdmin = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      "UPDATE korisnik SET razina_prava = 1 WHERE id_korisnika = ?",
      [req.params.id],
    );
    res.json("admin dodan");
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};

exports.removeAdmin = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.query(
      "UPDATE korisnik SET razina_prava = 0 WHERE id_korisnika = ?",
      [req.params.id],
    );
    res.send("Administratorska prava obrisana");
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (conn) conn.release();
  }
};
