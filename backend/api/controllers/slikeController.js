const pool = require("../config/db");

exports.getImage = async (req, res) => {
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
};

exports.uploadImage = async (req, res) => {
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
};

exports.deleteImage = async (req, res) => {
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
};
