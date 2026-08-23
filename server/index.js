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

app.post('/api/movies', (res, req) => {
    const { title, release_year} = res.body;
    const stmt = db.prepare('INSERT INTO movies (title, release_year) VALUES(?, ?)');
    const result = stmt.run( title, release_year);
    res.json({ id:result.lastInsertRowid, title, release_year});

})

app.listen(PORT,() => {
    console.log(`server running on http://localhost:${PORT}`);
});
