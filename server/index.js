const db = require('./database');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) =>{
    res.json({message: 'server work!! WIIHOO!'});
});

app.get('/api/movies', ( req, res) =>{
    const movies = db.prepare('SELECT * FROM movies').all();
    res.json(movies);
} )

app.put('/api/movies/:id', (req, res) =>{
    const { id } = req.params;
    const { title, releaseYear } = req.body;
    const stmt = db.prepare('UPDATE movies SET title = ?, releaseYear = ? WHERE id = ?');
    const result = stmt.run(title, releaseYear, id);
    res.json({ id: Number(id), title, releaseYear });
 })

app.delete('/api/movies/:id', (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare('DELETE FROM movies WHERE id = ?');
    stmt.run(id);
    res.json({ message: `Movie ${id} deleted` });
});

app.post('/api/movies', (req, res) => {
    const { title, releaseYear} = req.body;
    const stmt = db.prepare('INSERT INTO movies (title, releaseYear) VALUES(?, ?)');
    const result = stmt.run( title, releaseYear);
    res.json({ id:result.lastInsertRowid, title, releaseYear});
});

app.listen(PORT,() => {
    console.log(`server running on http://localhost:${PORT}`);
});
