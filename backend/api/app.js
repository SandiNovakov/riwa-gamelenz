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
        Korisnicko_ime,
        Lozinka,
        Email,
        Privatni_racun,
    } = req.body;

    const conn = await pool.getConnection();
    await conn.query(
        `INSERT INTO Korisnik 
     (Korisnicko_ime, Lozinka, Email, Privatni_racun)
     VALUES (?, ?, ?, ?)`,
        [Korisnicko_ime, Lozinka, Email, Privatni_racun]
    );
    conn.release();
    res.send('Korisnik created');
});

// READ ALL korisnici
app.get('/korisnici', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Korisnik');
    conn.release();
    res.json(rows);
});

// READ ONE Korisnik
app.get('/korisnici/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Korisnik WHERE ID_korisnika = ?', [req.params.id]);
    conn.release();
    res.json(rows[0]);
});

// UPDATE Korisnik
app.put('/korisnici/:id', async (req, res) => {
    const {
        Korisnicko_ime,
        Lozinka,
        Email,
        Privatni_racun,
    } = req.body;

    const conn = await pool.getConnection();
    await conn.query(
        `UPDATE Korisnik SET
      Korisnicko_ime = ?,
      Lozinka = ?,
      Email = ?,
      Privatni_racun = ?
     WHERE ID_korisnika = ?`,
        [Korisnicko_ime, Lozinka, Email, Privatni_racun, req.params.id]
    );
    conn.release();
    res.send('Korisnik updated');
});

// DELETE Korisnik
app.delete('/korisnici/:id', async (req, res) => {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM Korisnik WHERE ID_korisnika = ?', [req.params.id]);
    conn.release();
    res.send('Korisnik deleted');
});

// CREATE igrice
app.post('/igrice', async (req, res) => {
    const {
        Naziv_igrice,
        Opis,
        Datum_izdanja,
        ID_izdavaca,
        ID_developera,
        ID_zanra
    } = req.body;

    const conn = await pool.getConnection();
    await conn.query(
        `INSERT INTO Igrica
     (Naziv_igrice, Opis, Datum_izdanja, ID_izdavaca, ID_developera, ID_zanra)
     VALUES (?, ?, ?, ?, ?, ?)`,
        [Naziv_igrice, Opis, Datum_izdanja, ID_izdavaca, ID_developera, ID_zanra]
    );
    conn.release();
    res.send('Igrica created');
});

// READ ALL igrice
app.get('/igrice', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Igrica');
    conn.release();
    res.json(rows);
});

// READ ONE Igrica
app.get('/igrice/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Igrica WHERE ID_igrice = ?', [req.params.id]);
    conn.release();
    res.json(rows[0]);
});

// UPDATE Igrica
app.put('/igrice/:id', async (req, res) => {
    const {
        Naziv_igrice,
        Opis,
        Datum_izdanja,
        ID_izdavaca,
        ID_developera,
        ID_zanra
    } = req.body;

    const conn = await pool.getConnection();
    await conn.query(
        `UPDATE Igrica SET
      Naziv_igrice = ?,
      Opis = ?,
      Datum_izdanja = ?,
      ID_izdavaca = ?,
      ID_developera = ?,
      ID_zanra = ?
     WHERE ID_igrice = ?`,
        [Naziv_igrice, Opis, Datum_izdanja, ID_izdavaca, ID_developera, ID_zanra, req.params.id]
    );
    conn.release();
    res.send('Igrica updated');
});

// DELETE Igrica
app.delete('/igrice/:id', async (req, res) => {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM Igrica WHERE ID_igrice = ?', [req.params.id]);
    conn.release();
    res.send('Igrica deleted');
});

// CREATE (add game to user's list)
app.post('/liste', async (req, res) => {
    const Datum_dodavanja = new Date().toISOString().split('T')[0];
    const {
        ID_korisnika,
        ID_igrice,
        Ocjena,
        Komentar,
        Status
    } = req.body;

    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        // Insert into Igrica_na_listi
        await conn.query(
            `INSERT INTO Igrica_na_listi
       (ID_korisnika, ID_igrice, Datum_dodavanja, Ocjena, Komentar, Status)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [ID_korisnika, ID_igrice, Datum_dodavanja, Ocjena, Komentar, Status]
        );

        // Update Igrica.Broj_dodavanja_na_listu
        await conn.query(
            `UPDATE Igrica
       SET Broj_dodavanja_na_listu = Broj_dodavanja_na_listu + 1
       WHERE ID_igrice = ?`,
            [ID_igrice]
        );

        // Update Korisnik.Broj_igrica_na_listi
        await conn.query(
            `UPDATE Korisnik
       SET Broj_igrica_na_listi = Broj_igrica_na_listi + 1
       WHERE ID_korisnika = ?`,
            [ID_korisnika]
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
    const rows = await conn.query('SELECT * FROM Igrica_na_listi');
    conn.release();
    res.json(rows);
});

// READ ONE (specific user's specific game)
app.get('/liste/:userId/:gameId', async (req, res) => {
    const { userId, gameId } = req.params;
    const conn = await pool.getConnection();
    const rows = await conn.query(
        'SELECT * FROM Igrica_na_listi WHERE ID_korisnika = ? AND ID_igrice = ?',
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
        i.Naziv_igrice,
        i.Opis AS Opis_igrice,
        i.Datum_izdanja,
        z.Naziv_zanra
       FROM Igrica_na_listi il
       JOIN Igrica i ON il.ID_igrice = i.ID_igrice
       LEFT JOIN Zanr z ON i.ID_zanra = z.ID_zanra
       WHERE il.ID_korisnika = ?`,
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
        Datum_dodavanja,
        Ocjena,
        Komentar,
        Status
    } = req.body;

    const conn = await pool.getConnection();
    await conn.query(
        `UPDATE Igrica_na_listi SET
      Datum_dodavanja = ?,
      Ocjena = ?,
      Komentar = ?,
      Status = ?
     WHERE ID_korisnika = ? AND ID_igrice = ?`,
        [Datum_dodavanja, Ocjena, Komentar, Status, userId, gameId]
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
            'DELETE FROM Igrica_na_listi WHERE ID_korisnika = ? AND ID_igrice = ?',
            [userId, gameId]
        );

        // MariaDB returns an object with affectedRows property for DELETE queries
        if (result.affectedRows === 0) {
            throw new Error('Entry not found or already deleted');
        }

        // Decrement Igrica.Broj_dodavanja_na_listu
        await conn.query(
            `UPDATE Igrica
       SET Broj_dodavanja_na_listu = GREATEST(Broj_dodavanja_na_listu - 1, 0)
       WHERE ID_igrice = ?`,
            [gameId]
        );

        // Decrement Korisnik.Broj_igrica_na_listi
        await conn.query(
            `UPDATE Korisnik
       SET Broj_igrica_na_listi = GREATEST(Broj_igrica_na_listi - 1, 0)
       WHERE ID_korisnika = ?`,
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
    const { Naziv_zanra } = req.body;
    const conn = await pool.getConnection();
    await conn.query('INSERT INTO Zanr (Naziv_zanra) VALUES (?)', [Naziv_zanra]);
    conn.release();
    res.send('Zanr created');
});

// READ ALL zanrovi
app.get('/zanrovi', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Zanr');
    conn.release();
    res.json(rows);
});

// READ ONE Zanr
app.get('/zanrovi/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Zanr WHERE ID_zanra = ?', [req.params.id]);
    conn.release();
    res.json(rows[0]);
});

// UPDATE Zanr
app.put('/zanrovi/:id', async (req, res) => {
    const { Naziv_zanra } = req.body;
    const conn = await pool.getConnection();
    await conn.query('UPDATE Zanr SET Naziv_zanra = ? WHERE ID_zanra = ?', [Naziv_zanra, req.params.id]);
    conn.release();
    res.send('Zanr updated');
});

// DELETE Zanr
app.delete('/zanrovi/:id', async (req, res) => {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM Zanr WHERE ID_zanra = ?', [req.params.id]);
    conn.release();
    res.send('Zanr deleted');
});


app.post('/izdavaci', async (req, res) => {
    const { Naziv_izdavaca } = req.body;
    const conn = await pool.getConnection();
    await conn.query('INSERT INTO Izdavac (Naziv_izdavaca) VALUES (?)', [Naziv_izdavaca]);
    conn.release();
    res.send('Izdavac created');
});

app.get('/izdavaci', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Izdavac');
    conn.release();
    res.json(rows);
});

app.get('/izdavaci/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Izdavac WHERE ID_izdavaca = ?', [req.params.id]);
    conn.release();
    res.json(rows[0]);
});

app.put('/izdavaci/:id', async (req, res) => {
    const { Naziv_izdavaca } = req.body;
    const conn = await pool.getConnection();
    await conn.query('UPDATE Izdavac SET Naziv_izdavaca = ? WHERE ID_izdavaca = ?', [Naziv_izdavaca, req.params.id]);
    conn.release();
    res.send('Izdavac updated');
});

app.delete('/izdavaci/:id', async (req, res) => {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM Izdavac WHERE ID_izdavaca = ?', [req.params.id]);
    conn.release();
    res.send('Izdavac deleted');
});

app.post('/developeri', async (req, res) => {
    const { Naziv_developera } = req.body;
    const conn = await pool.getConnection();
    await conn.query('INSERT INTO Developer (Naziv_developera) VALUES (?)', [Naziv_developera]);
    conn.release();
    res.send('Developer created');
});

app.get('/developeri', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Developer');
    conn.release();
    res.json(rows);
});

app.get('/developeri/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Developer WHERE ID_developera = ?', [req.params.id]);
    conn.release();
    res.json(rows[0]);
});

app.put('/developeri/:id', async (req, res) => {
    const { Naziv_developera } = req.body;
    const conn = await pool.getConnection();
    await conn.query('UPDATE Developer SET Naziv_developera = ? WHERE ID_developera = ?', [Naziv_developera, req.params.id]);
    conn.release();
    res.send('Developer updated');
});

app.delete('/developeri/:id', async (req, res) => {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM Developer WHERE ID_developera = ?', [req.params.id]);
    conn.release();
    res.send('Developer deleted');
});

app.post('/platforme', async (req, res) => {
    const { Naziv_platforme } = req.body;
    const conn = await pool.getConnection();
    await conn.query('INSERT INTO Platforma (Naziv_platforme) VALUES (?)', [Naziv_platforme]);
    conn.release();
    res.send('Platforma created');
});

app.get('/platforme', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Platforma');
    conn.release();
    res.json(rows);
});

app.get('/platforme/:id', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Platforma WHERE ID_platforme = ?', [req.params.id]);
    conn.release();
    res.json(rows[0]);
});

app.put('/platforme/:id', async (req, res) => {
    const { Naziv_platforme } = req.body;
    const conn = await pool.getConnection();
    await conn.query('UPDATE Platforma SET Naziv_platforme = ? WHERE ID_platforme = ?', [Naziv_platforme, req.params.id]);
    conn.release();
    res.send('Platforma updated');
});

app.delete('/platforme/:id', async (req, res) => {
    const conn = await pool.getConnection();
    await conn.query('DELETE FROM Platforma WHERE ID_platforme = ?', [req.params.id]);
    conn.release();
    res.send('Platforma deleted');
});

// CREATE – povezi igricu s platformom
app.post('/igrice-platforme', async (req, res) => {
    const { ID_igrice, ID_platforme } = req.body;
    const conn = await pool.getConnection();
    await conn.query(
        'INSERT INTO Igrica_na_platformi (ID_igrice, ID_platforme) VALUES (?, ?)',
        [ID_igrice, ID_platforme]
    );
    conn.release();
    res.send('Veza Igrica-Platforma dodana');
});

// READ ALL – sve veze Igrica-Platforma
app.get('/igrice-platforme', async (req, res) => {
    const conn = await pool.getConnection();
    const rows = await conn.query('SELECT * FROM Igrica_na_platformi');
    conn.release();
    res.json(rows);
});

// READ ONE – veza između tocno jedne igrice i platforme
app.get('/igrice-platforme/:igricaId/:platformaId', async (req, res) => {
    const { igricaId, platformaId } = req.params;
    const conn = await pool.getConnection();
    const rows = await conn.query(
        'SELECT * FROM Igrica_na_platformi WHERE ID_igrice = ? AND ID_platforme = ?',
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
    'DELETE FROM Igrica_na_platformi WHERE ID_igrice = ? AND ID_platforme = ?',
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
    i.ID_igrice,
    i.Naziv_igrice,
    i.Opis,
    i.Datum_izdanja,
    i.Prosjecna_ocjena,
    i.Broj_dodavanja_na_listu,
    z.Naziv_zanra AS Zanr,
    izd.Naziv_izdavaca AS Izdavac,
    dev.Naziv_developera AS Developer,
    
    (SELECT GROUP_CONCAT(p.Naziv_platforme SEPARATOR ', ')
        FROM Platforma p
        JOIN Igrica_na_platformi ip ON p.ID_platforme = ip.ID_platforme
        WHERE ip.ID_igrice = i.ID_igrice
    ) AS Platforme

FROM Igrica i
LEFT JOIN Zanr z ON i.ID_zanra = z.ID_zanra
LEFT JOIN Izdavac izd ON i.ID_izdavaca = izd.ID_izdavaca
LEFT JOIN Developer dev ON i.ID_developera = dev.ID_developera
WHERE i.ID_igrice = ?
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
            SELECT AVG(inl.Ocjena) AS prosjek
            FROM Igrica_na_listi inl
            JOIN Korisnik k ON inl.ID_korisnika = k.ID_korisnika
            WHERE inl.ID_igrice = ? AND k.Privatni_racun = FALSE AND inl.Ocjena IS NOT NULL
        `, [id]);

        // 2. Update average rating in Igrica table
        await conn.query(`
            UPDATE Igrica 
            SET Prosjecna_ocjena = ? 
            WHERE ID_igrice = ?
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
