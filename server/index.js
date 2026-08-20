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
    const movie = db.prepare('SELECT * FROM movies').all();
    res.json(movies);
} )

app.listen(PORT,() => {
    console.log(`server running on http://localhost:${PORT}`);
});
