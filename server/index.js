const db = require("./database");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json({ message: "server work!! WIIHOO!" });
});

app.get("/api/movies", (req, res) => {
  const movies = db.prepare("SELECT * FROM movies").all();
  res.json(movies);
});

app.get("/api/movies/:id", (req, res) => {
  const { id } = req.params;

  const movie = db.prepare("SELECT * FROM movies WHERE id = ?").get(id);

  if (!movie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  const actors = db
    .prepare(
      `
        SELECT actors.id, actors.name, movie_actors.character_name
        FROM actors
        JOIN movie_actors ON actors.id = movie_actors.actor_id
        WHERE movie_actors.movie_id = ?
    `,
    )
    .all(id);

  res.json({ ...movie, actors });
});

app.put("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  const { title, releaseYear } = req.body;
  const stmt = db.prepare(
    "UPDATE movies SET title = ?, releaseYear = ? WHERE id = ?",
  );
  const result = stmt.run(title, releaseYear, id);
  res.json({ id: Number(id), title, releaseYear });
});

app.delete("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM movies WHERE id = ?");
  stmt.run(id);
  res.json({ message: `Movie ${id} deleted` });
});

app.post("/api/movies/:id/actors", (req, res) => {
  const { id } = req.params;
  const { name, character_name } = req.body;

  let actor = db.prepare("SELECT * FROM actors WHERE name = ?").get(name);

  if (!actor) {
    const result = db.prepare("INSERT INTO actors (name) VALUES (?)").run(name);
    actor = { id: result.lastInsertRowid, name };
  }

  db.prepare(
    `
        INSERT INTO movie_actors (movie_id, actor_id, character_name)
        VALUES (?, ?, ?)
    `,
  ).run(id, actor.id, character_name);

  res.json({ id: actor.id, name: actor.name, character_name });
});

app.get('/api/actors/:id', (req, res) => {
    const { id } = req.params;

    const actor = db.prepare('SELECT * FROM actors WHERE id = ?').get(id);

    if (!actor) {
        return res.status(404).json({ error: 'Actor not found' });
    }

    const movies = db.prepare(`
        SELECT movies.id, movies.title, movies.releaseYear, movie_actors.character_name
        FROM movies
        JOIN movie_actors ON movies.id = movie_actors.movie_id
        WHERE movie_actors.actor_id = ?
    `).all(id);

    res.json({ ...actor, movies });
});

app.delete("/api/actors/:id", (req, res) => {
  const { id } = req.params;
  const stmt = db.prepare("DELETE FROM actors WHERE id = ?");
  stmt.run(id);
  res.json({ message: `Actor ${id} deleted` });
});

app.post("/api/movies", (req, res) => {
  const { title, releaseYear } = req.body;
  const stmt = db.prepare(
    "INSERT INTO movies (title, releaseYear) VALUES(?, ?)",
  );
  const result = stmt.run(title, releaseYear);
  res.json({ id: result.lastInsertRowid, title, releaseYear });
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
