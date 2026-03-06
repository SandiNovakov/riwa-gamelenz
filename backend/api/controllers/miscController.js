const pool = require("../config/db");
/*
 * Vraca:
 * broj_korisnika,
 * broj_igrica,
 * naziv_igrice,
 * opis,
 * prosjecna_ocjena
 */
exports.getIndexSummary = async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("SELECT * FROM v_index_summary");
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Greška na serveru" });
  } finally {
    if (conn) conn.release();
  }
};
