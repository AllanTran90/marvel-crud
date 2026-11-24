const db = require("./database");
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// --- Hjälpfunktioner: varje SQL-fråga finns bara på ett ställe ---

function getMovieWithActors(id) {
  const movie = db.prepare("SELECT * FROM movies WHERE id = ?").get(id);
  if (!movie) return null;

  const actors = db
    .prepare(
      `
        SELECT actors.id, actors.name, actors.imdb_url, movie_actors.character_name
        FROM actors
        JOIN movie_actors ON actors.id = movie_actors.actor_id
        WHERE movie_actors.movie_id = ?
      `,
    )
    .all(id);

  return { ...movie, actors };
}

function getActorWithMovies(id) {
  const actor = db.prepare("SELECT * FROM actors WHERE id = ?").get(id);
  if (!actor) return null;

  const movies = db
    .prepare(
      `
        SELECT movies.id, movies.title, movies.releaseYear, movie_actors.character_name
        FROM movies
        JOIN movie_actors ON movies.id = movie_actors.movie_id
        WHERE movie_actors.actor_id = ?
      `,
    )
    .all(id);

  return { ...actor, movies };
}

// --- Validering ---
// Varje funktion returnerar ett felmeddelande, eller null om allt är okej.
// Lita aldrig på klienten: formulär går att kringgå, t.ex. med curl.

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function validateMovie({ title, releaseYear }) {
  if (!isNonEmptyString(title)) {
    return "Title is required";
  }
  const year = Number(releaseYear);
  if (!Number.isInteger(year) || year < MIN_YEAR || year > MAX_YEAR) {
    return `Release year must be a whole number between ${MIN_YEAR} and ${MAX_YEAR}`;
  }
  return null;
}

function validateActor({ name, imdb_url }) {
  if (!isNonEmptyString(name)) {
    return "Name is required";
  }
  // Länken visas som <a href>, så bara http(s) är tillåtet.
  // Annars skulle t.ex. "javascript:..." kunna köra kod när någon klickar.
  if (imdb_url && !/^https?:\/\//i.test(imdb_url)) {
    return "IMDb link must start with http:// or https://";
  }
  return null;
}

function sendError(res, status, message) {
  return res.status(status).json({ error: message });
}

// --- Routes ---

app.get("/api/test", (req, res) => {
  res.json({ message: "server work!! WIIHOO!" });
});

app.get("/api/movies", (req, res) => {
  const movies = db.prepare("SELECT * FROM movies").all();
  res.json(movies);
});

app.post("/api/movies", (req, res) => {
  const error = validateMovie(req.body);
  if (error) return sendError(res, 400, error);

  const title = req.body.title.trim();
  const releaseYear = Number(req.body.releaseYear);

  const result = db
    .prepare("INSERT INTO movies (title, releaseYear) VALUES (?, ?)")
    .run(title, releaseYear);

  res.status(201).json({ id: result.lastInsertRowid, title, releaseYear });
});

app.get("/api/movies/:id", (req, res) => {
  const movie = getMovieWithActors(req.params.id);
  if (!movie) return sendError(res, 404, "Movie not found");

  res.json(movie);
});

app.put("/api/movies/:id", (req, res) => {
  const { id } = req.params;

  const error = validateMovie(req.body);
  if (error) return sendError(res, 400, error);

  const result = db
    .prepare("UPDATE movies SET title = ?, releaseYear = ? WHERE id = ?")
    .run(req.body.title.trim(), Number(req.body.releaseYear), id);

  if (result.changes === 0) return sendError(res, 404, "Movie not found");

  res.json(getMovieWithActors(id));
});

app.delete("/api/movies/:id", (req, res) => {
  const { id } = req.params;
  const result = db.prepare("DELETE FROM movies WHERE id = ?").run(id);

  if (result.changes === 0) return sendError(res, 404, "Movie not found");

  res.json({ message: `Movie ${id} deleted` });
});

app.post("/api/movies/:id/actors", (req, res) => {
  const { id } = req.params;
  const { name, character_name } = req.body;

  if (!isNonEmptyString(name)) return sendError(res, 400, "Actor name is required");

  const movie = db.prepare("SELECT id FROM movies WHERE id = ?").get(id);
  if (!movie) return sendError(res, 404, "Movie not found");

  const trimmedName = name.trim();
  const character = typeof character_name === "string" ? character_name.trim() : "";

  let actor = db.prepare("SELECT * FROM actors WHERE name = ?").get(trimmedName);

  if (actor) {
    const alreadyInMovie = db
      .prepare("SELECT 1 FROM movie_actors WHERE movie_id = ? AND actor_id = ?")
      .get(id, actor.id);
    if (alreadyInMovie) {
      return sendError(res, 409, `${actor.name} is already in this movie`);
    }
  } else {
    const result = db.prepare("INSERT INTO actors (name) VALUES (?)").run(trimmedName);
    actor = { id: result.lastInsertRowid, name: trimmedName, imdb_url: null };
  }

  db.prepare(
    "INSERT INTO movie_actors (movie_id, actor_id, character_name) VALUES (?, ?, ?)",
  ).run(id, actor.id, character);

  res.status(201).json({
    id: actor.id,
    name: actor.name,
    imdb_url: actor.imdb_url,
    character_name: character,
  });
});

app.get("/api/actors/:id", (req, res) => {
  const actor = getActorWithMovies(req.params.id);
  if (!actor) return sendError(res, 404, "Actor not found");

  res.json(actor);
});

app.put("/api/actors/:id", (req, res) => {
  const { id } = req.params;

  const error = validateActor(req.body);
  if (error) return sendError(res, 400, error);

  const name = req.body.name.trim();
  // Tom sträng sparas som NULL, så "ingen länk" alltid ser likadan ut i databasen
  const imdbUrl = req.body.imdb_url ? req.body.imdb_url.trim() : null;

  const result = db
    .prepare("UPDATE actors SET name = ?, imdb_url = ? WHERE id = ?")
    .run(name, imdbUrl, id);

  if (result.changes === 0) return sendError(res, 404, "Actor not found");

  res.json(getActorWithMovies(id));
});

app.delete("/api/actors/:id", (req, res) => {
  const { id } = req.params;
  const result = db.prepare("DELETE FROM actors WHERE id = ?").run(id);

  if (result.changes === 0) return sendError(res, 404, "Actor not found");

  res.json({ message: `Actor ${id} deleted` });
});

// --- Felhantering ---

// Okända /api-adresser ger JSON istället för Express standard-HTML
app.use("/api", (req, res) => {
  sendError(res, 404, "Endpoint not found");
});

// Fångar alla fel som kastas i routes (Express känner igen den via 4 parametrar).
// Användaren får ett generellt meddelande; detaljerna loggas bara på servern.
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return sendError(res, 400, "Request body is not valid JSON");
  }
  console.error(err);
  sendError(res, 500, "Something went wrong on the server");
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});
