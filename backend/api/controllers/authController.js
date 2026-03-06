const pool = require("../config/db");

exports.login = async (req, res) => {
  const { korisnicko_ime, lozinka } = req.body;
  let conn;

  try {
    conn = await pool.getConnection();
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
    if (conn) conn.release();
  }
};

exports.checkRights = async (req, res) => {
  const { id_korisnika } = req.body;

  if (!id_korisnika) {
    return res.status(200).json({
      razina_prava: 0,
      message: "Nije dan ID.",
    });
  }

  let conn;
  try {
    conn = await pool.getConnection();
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
    if (conn) conn.release();
  }
};
