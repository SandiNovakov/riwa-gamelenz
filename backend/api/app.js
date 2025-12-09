const express = require('express');
const mariadb = require('mariadb');
require('dotenv').config();

const app = express();
app.use(express.json());

// MariaDB connection pool
const pool = mariadb.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	connectionLimit: 5
});

// KORISNIK
// CREATE Korisnik
app.post('/korisnici', async (req, res) => {
    const {
        korisnicko_ime,
        lozinka,
        email,
        privatni_racun,
    } = req.body;

    const conn = await pool.getConnection();
    await conn.query(
        `INSERT INTO korisnik 
     (korisnicko_ime, lozinka, email, privatni_racun)
     VALUES (?, ?, ?, ?)`,
        [korisnicko_ime, lozinka, email, privatni_racun]
    );
    conn.release();
    res.send('Korisnik created');
});

// READ ALL korisnici
app.get('/korisnici', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM korisnik');
    conn.release();
    res.json(rows);
});

// READ ONE Korisnik
app.get('/korisnici/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM korisnik WHERE id_korisnika = ?', [req.params.id]);
    conn.release();
    res.json(rows[0]);
});

// UPDATE Korisnik
app.put('/korisnici/:id', async (req, res) => {
    const {
        korisnicko_ime,
        lozinka,
        email,
        privatni_racun,
    } = req.body;

    const conn = await pool.getConnection();
    await conn.query(
        `UPDATE korisnik SET
      korisnicko_ime = ?,
      lozinka = ?,
      email = ?,
      privatni_racun = ?
     WHERE id_korisnika = ?`,
        [korisnicko_ime, lozinka, email, privatni_racun, req.params.id]
    );
    conn.release();
    res.send('Korisnik updated');
});

// DELETE Korisnik
app.delete('/korisnici/:id', async (req, res) => {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM korisnik WHERE id_korisnika = ?', [req.params.id]);
    conn.release();
    res.send('Korisnik deleted');
});

// CREATE igrice
app.post('/igrice', async (req, res) => {
    const {
        naziv_igrice,
        opis,
        datum_izdanja,
        id_izdavaca,
        id_developera,
        id_zanra
    } = req.body;

    const conn = await pool.getConnection();
    await conn.query(
        `INSERT INTO igrica
     (naziv_igrice, opis, datum_izdanja, id_izdavaca, id_developera, id_zanra)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [naziv_igrice, opis, datum_izdanja, id_izdavaca, id_developera, id_zanra]
    );
    conn.release();
    res.send('Igrica created');
});

// READ ALL igrice
app.get('/igrice', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM igrica');
    conn.release();
    res.json(rows);
});

// READ ONE Igrica
app.get('/igrice/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM igrica WHERE id_igrice = ?', [req.params.id]);
    conn.release();
    res.json(rows[0]);
});

// UPDATE Igrica
app.put('/igrice/:id', async (req, res) => {
    const {
        naziv_igrice,
        opis,
        datum_izdanja,
        id_izdavaca,
        id_developera,
        id_zanra
    } = req.body;

    const conn = await pool.getConnection();
    await conn.query(
        `UPDATE igrica SET
      naziv_igrice = ?,
      opis = ?,
      datum_izdanja = ?,
      id_izdavaca = ?,
      id_developera = ?,
      id_zanra = ?
     WHERE id_igrice = ?`,
        [naziv_igrice, opis, datum_izdanja, id_izdavaca, id_developera, id_zanra, req.params.id]
    );
    conn.release();
    res.send('Igrica updated');
});

// DELETE Igrica
app.delete('/igrice/:id', async (req, res) => {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM igrica WHERE id_igrice = ?', [req.params.id]);
    conn.release();
    res.send('Igrica deleted');
});

// CREATE (add game to user's list)
app.post('/liste', async (req, res) => {
    const datum_dodavanja = new Date().toISOString().split('T')[0];
    const {
        id_korisnika,
        id_igrice,
        ocjena,
        komentar,
        status
    } = req.body;

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // Insert into Igrica_na_listi
        await conn.query(
            `INSERT INTO igrica_na_listi
       (id_korisnika, id_igrice, datum_dodavanja, ocjena, komentar, status)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [id_korisnika, id_igrice, datum_dodavanja, ocjena, komentar, status]
        );

        // Update Igrica.Broj_dodavanja_na_listu
        await conn.query(
            `UPDATE igrica
       SET broj_dodavanja_na_listu = broj_dodavanja_na_listu + 1
       WHERE id_igrice = ?`,
            [id_igrice]
        );

        // Update Korisnik.Broj_igrica_na_listi
        await conn.query(
            `UPDATE korisnik
       SET broj_igrica_na_listi = broj_igrica_na_listi + 1
       WHERE id_korisnika = ?`,
            [id_korisnika]
        );

        await conn.commit();
        res.send('Game added to list and counters updated');
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(500).send('Error adding game to list');
    } finally {
        conn.release();
    }
});

// READ ALL (entire table)
app.get('/liste', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM igrica_na_listi');
    conn.release();
    res.json(rows);
});

// READ ONE (specific user's specific game)
app.get('/liste/:userId/:gameId', async (req, res) => {
    const { userId, gameId } = req.params;
    const conn = await pool.getConnection();
    const rows = await conn.query(
        'SELECT * FROM igrica_na_listi WHERE id_korisnika = ? AND id_igrice = ?',
        [userId, gameId]
    );
    conn.release();
    res.json(rows[0]);
});

// READ ALL (all games on a user's list)
app.get('/liste/:userId', async (req, res) => {
    const { userId } = req.params;
    const conn = await pool.getConnection();

    try {
        // Get all games with additional game details by joining with Igrica table
        const rows = await conn.query(
            `SELECT 
        il.*, 
        i.naziv_igrice,
        i.opis AS opis_igrice,
        i.datum_izdanja,
        z.naziv_zanra
       FROM igrica_na_listi il
       JOIN igrica i ON il.id_igrice = i.id_igrice
       LEFT JOIN zanr z ON i.id_zanra = z.id_zanra
       WHERE il.id_korisnika = ?`,
            [userId]
        );

        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error fetching user game list' });
    } finally {
        conn.release();
    }
});

// UPDATE (specific entry)
app.put('/liste/:userId/:gameId', async (req, res) => {
    const { userId, gameId } = req.params;
    const {
        datum_dodavanja,
        ocjena,
        komentar,
        status
    } = req.body;

    const conn = await pool.getConnection();
    await conn.query(
        `UPDATE igrica_na_listi SET
      datum_dodavanja = ?,
      ocjena = ?,
      komentar = ?,
      status = ?
     WHERE id_korisnika = ? AND id_igrice = ?`,
        [datum_dodavanja, ocjena, komentar, status, userId, gameId]
    );
    conn.release();
    res.send('Entry updated');
});

app.delete('/liste/:userId/:gameId', async (req, res) => {
    const { userId, gameId } = req.params;
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // Delete the entry from Igrica_na_listi
        const result = await conn.query(
            'DELETE FROM igrica_na_listi WHERE id_korisnika = ? AND id_igrice = ?',
            [userId, gameId]
        );

        // MariaDB returns an object with affectedRows property for DELETE queries
        if (result.affectedRows === 0) {
            throw new Error('Entry not found or already deleted');
        }

        // Decrement Igrica.Broj_dodavanja_na_listu
        await conn.query(
            `UPDATE igrica
       SET broj_dodavanja_na_listu = GREATEST(broj_dodavanja_na_listu - 1, 0)
       WHERE id_igrice = ?`,
            [gameId]
        );

        // Decrement Korisnik.Broj_igrica_na_listi
        await conn.query(
            `UPDATE korisnik
       SET broj_igrica_na_listi = GREATEST(broj_igrica_na_listi - 1, 0)
       WHERE id_korisnika = ?`,
            [userId]
        );

        await conn.commit();
        res.send('Entry deleted and counters updated');
    } catch (err) {
        await conn.rollback();
        console.error(err);
        res.status(err.message === 'Entry not found or already deleted' ? 404 : 500)
            .send(err.message || 'Error deleting entry');
    } finally {
        conn.release();
    }
});

// CREATE Zanr
app.post('/zanrovi', async (req, res) => {
    const { naziv_zanra } = req.body;
    const conn = await pool.getConnection();
    await conn.query('INSERT INTO zanr (naziv_zanra) VALUES (?)', [naziv_zanra]);
    conn.release();
    res.send('Zanr created');
});

// READ ALL zanrovi
app.get('/zanrovi', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM zanr');
    conn.release();
    res.json(rows);
});

// READ ONE Zanr
app.get('/zanrovi/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM zanr WHERE id_zanra = ?', [req.params.id]);
    conn.release();
    res.json(rows[0]);
});

// UPDATE Zanr
app.put('/zanrovi/:id', async (req, res) => {
    const { naziv_zanra } = req.body;
    const conn = await pool.getConnection();
    await conn.query('UPDATE zanr SET naziv_zanra = ? WHERE id_zanra = ?', [naziv_zanra, req.params.id]);
    conn.release();
    res.send('Zanr updated');
});

// DELETE Zanr
app.delete('/zanrovi/:id', async (req, res) => {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM zanr WHERE id_zanra = ?', [req.params.id]);
    conn.release();
    res.send('Zanr deleted');
});


app.post('/izdavaci', async (req, res) => {
    const { naziv_izdavaca } = req.body;
    const conn = await pool.getConnection();
    await conn.query('INSERT INTO izdavac (naziv_izdavaca) VALUES (?)', [naziv_izdavaca]);
    conn.release();
    res.send('Izdavac created');
});

app.get('/izdavaci', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM izdavac');
    conn.release();
    res.json(rows);
});

app.get('/izdavaci/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM izdavac WHERE id_izdavaca = ?', [req.params.id]);
    conn.release();
    res.json(rows[0]);
});

app.put('/izdavaci/:id', async (req, res) => {
    const { naziv_izdavaca } = req.body;
    const conn = await pool.getConnection();
    await conn.query('UPDATE izdavac SET naziv_izdavaca = ? WHERE id_izdavaca = ?', [naziv_izdavaca, req.params.id]);
    conn.release();
    res.send('Izdavac updated');
});

app.delete('/izdavaci/:id', async (req, res) => {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM izdavac WHERE id_izdavaca = ?', [req.params.id]);
    conn.release();
    res.send('Izdavac deleted');
});

app.post('/developeri', async (req, res) => {
    const { naziv_developera } = req.body;
    const conn = await pool.getConnection();
    await conn.query('INSERT INTO developer (naziv_developera) VALUES (?)', [naziv_developera]);
    conn.release();
    res.send('Developer created');
});

app.get('/developeri', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM developer');
    conn.release();
    res.json(rows);
});

app.get('/developeri/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM developer WHERE id_developera = ?', [req.params.id]);
    conn.release();
    res.json(rows[0]);
});

app.put('/developeri/:id', async (req, res) => {
    const { naziv_developera } = req.body;
    const conn = await pool.getConnection();
    await conn.query('UPDATE developer SET naziv_developera = ? WHERE id_developera = ?', [naziv_developera, req.params.id]);
    conn.release();
    res.send('Developer updated');
});

app.delete('/developeri/:id', async (req, res) => {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM developer WHERE id_developera = ?', [req.params.id]);
    conn.release();
    res.send('Developer deleted');
});

app.post('/platforme', async (req, res) => {
    const { naziv_platforme } = req.body;
    const conn = await pool.getConnection();
    await conn.query('INSERT INTO platforma (naziv_platforme) VALUES (?)', [naziv_platforme]);
    conn.release();
    res.send('Platforma created');
});

app.get('/platforme', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM platforma');
    conn.release();
    res.json(rows);
});

app.get('/platforme/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM platforma WHERE id_platforme = ?', [req.params.id]);
    conn.release();
    res.json(rows[0]);
});

app.put('/platforme/:id', async (req, res) => {
    const { naziv_platforme } = req.body;
    const conn = await pool.getConnection();
    await conn.query('UPDATE platforma SET naziv_platforme = ? WHERE id_platforme = ?', [naziv_platforme, req.params.id]);
    conn.release();
    res.send('Platforma updated');
});

app.delete('/platforme/:id', async (req, res) => {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM platforma WHERE id_platforme = ?', [req.params.id]);
    conn.release();
    res.send('Platforma deleted');
});

// CREATE – povezi igricu s platformom
app.post('/igrice-platforme', async (req, res) => {
    const { id_igrice, id_platforme } = req.body;
    const conn = await pool.getConnection();
    await conn.query(
        'INSERT INTO igrica_na_platformi (id_igrice, id_platforme) VALUES (?, ?)',
        [id_igrice, id_platforme]
    );
    conn.release();
    res.send('Veza Igrica-Platforma dodana');
});

// READ ALL – sve veze Igrica-Platforma
app.get('/igrice-platforme', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM igrica_na_platformi');
    conn.release();
    res.json(rows);
});

// READ ONE – veza između tocno jedne igrice i platforme
app.get('/igrice-platforme/:igricaId/:platformaId', async (req, res) => {
    const { igricaId, platformaId } = req.params;
    const conn = await pool.getConnection();
    const rows = await conn.query(
        'SELECT * FROM igrica_na_platformi WHERE id_igrice = ? AND id_platforme = ?',
        [igricaId, platformaId]
    );
    conn.release();
    res.json(rows[0]);
});

// DELETE – ukloni vezu
app.delete('/igrice-platforme/:igricaId/:platformaId', async (req, res) => {
  const { igricaId, platformaId } = req.params;
  const conn = await pool.getConnection();
  await conn.query(
    'DELETE FROM igrica_na_platformi WHERE id_igrice = ? AND id_platforme = ?',
    [igricaId, platformaId]
  );
  conn.release();
  res.send('Veza igrica-platforma obrisana');
});

app.get('/igrice/detalji/:id', async (req, res) => {
    const { id } = req.params;
    const conn = await pool.getConnection();

    try {
        const [rows] = await conn.query(`
SELECT 
    i.id_igrice,
    i.naziv_igrice,
    i.opis,
    i.datum_izdanja,
    i.prosjecna_ocjena,
    i.broj_dodavanja_na_listu,
    z.naziv_zanra AS zanr,
    izd.naziv_izdavaca AS izdavac,
    dev.naziv_developera AS developer,
    
    (SELECT GROUP_CONCAT(p.naziv_platforme SEPARATOR ', ')
        FROM platforma p
        JOIN igrica_na_platformi ip ON p.id_platforme = ip.id_platforme
        WHERE ip.id_igrice = i.id_igrice
    ) AS platforme

FROM igrica i
LEFT JOIN zanr z ON i.id_zanra = z.id_zanra
LEFT JOIN izdavac izd ON i.id_izdavaca = izd.id_izdavaca
LEFT JOIN developer dev ON i.id_developera = dev.id_developera
WHERE i.id_igrice = ?
    `, [id, id]);
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'Igrica nije pronađena.' });
        }

        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ message: 'Greška pri dohvaćanju igrice.' });
    } finally {
        conn.release();
    }
});

//UPDATE prosjecna ocjena, trebalo bi se raditi za svaku igricu povremeno.
// UPDATE prosjecna ocjena
app.put('/igrice/:id/prosjecna-ocjena', async (req, res) => {
    const { id } = req.params;
    const conn = await pool.getConnection();

    try {
        // 1. Get average rating
        const [rows] = await conn.query(`
            SELECT AVG(inl.ocjena) AS prosjek
            FROM igrica_na_listi inl
            JOIN korisnik k ON inl.id_korisnika = k.id_korisnika
            WHERE inl.id_igrice = ? AND k.privatni_racun = FALSE AND inl.ocjena IS NOT NULL
        `, [id]);

        // 2. Update average rating in Igrica table
        await conn.query(`
            UPDATE igrica 
            SET prosjecna_ocjena = ? 
            WHERE id_igrice = ?
        `, [rows.prosjek, id]);
        res.json({ 
            message: 'Prosjecna ocjena azurirana.', 
            nova_ocjena: rows.prosjek 
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Greška pri obracunu prosjecne ocjene.' });
    } finally {
        conn.release();
    }
});

app.listen(3000, () => {
    console.log('API running on http://localhost:3000');
});
