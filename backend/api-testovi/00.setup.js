// tests/globalSetup.js
import pool from "../../api/config/db.js";

export default async function () {
  console.log("--- Global Setup: Truncate sve tablice ---");
  const conn = await pool.getConnection();
  
  try {
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");

    await conn.query("TRUNCATE TABLE igrica_na_platformi");
    await conn.query("TRUNCATE TABLE igrica_na_listi");
    await conn.query("TRUNCATE TABLE platforma");
    await conn.query("TRUNCATE TABLE developer");
    await conn.query("TRUNCATE TABLE izdavac");
    await conn.query("TRUNCATE TABLE zanr");
    await conn.query("TRUNCATE TABLE igrica");
    await conn.query("TRUNCATE TABLE korisnik");

    await conn.query("SET FOREIGN_KEY_CHECKS = 1");
    console.log("--- Baza obrisana, pokrecu se testovi... ---");
  } catch (err) {
    console.error("Critical Error during global truncate:", err);
    process.exit(1);
  } finally {
    conn.release();
  }
}