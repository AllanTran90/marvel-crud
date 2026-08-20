const Database = require('better-sqlite3');

const db = new Database('marvel.db');

// Skapa tabellerna om de inte redan finns
db.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    release_year INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS actors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS movie_actors (
    movie_id INTEGER NOT NULL,
    actor_id INTEGER NOT NULL,
    character_name TEXT,
    PRIMARY KEY (movie_id, actor_id),
    FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
    FOREIGN KEY (actor_id) REFERENCES actors(id) ON DELETE CASCADE
  );
`);

module.exports = db;