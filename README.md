# Marvel CRUD

A full-stack CRUD application for browsing Marvel Cinematic Universe movies and actors, built as a learning project. Users can create, read, update, and delete movies, link actors to movies, and browse between movies and actor filmographies.

## Features

- **Movies**
  - View all movies as cards in a grid layout
  - Add a new movie (title + release year)
  - Delete a movie
  - Click a movie card to view its detail page
- **Actors**
  - Add an actor (with character name) to a specific movie
  - Click an actor's name to view their detail page, including their full filmography
  - Filmography links back to each movie's detail page
  - Placeholder for an IMDb link per actor
- **Routing**
  - `/` — movie list
  - `/movies/:id` — movie detail page (info + actors + add-actor form)
  - `/actors/:id` — actor detail page (info + filmography + IMDb link)

## Tech Stack

**Backend**
- Node.js + Express
- SQLite via `better-sqlite3`
- CORS enabled for local frontend/backend communication

**Frontend**
- React (Vite)
- React Router (`react-router-dom`) for client-side routing
- Plain CSS (Grid + Flexbox for the card layout)

## Project Structure

```
marvel-crud/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── App.jsx          # Route definitions
│       ├── MovieList.jsx    # Movie list + create form
│       ├── MovieCard.jsx    # Individual movie card (clickable)
│       ├── MovieDetail.jsx  # Movie detail page + add-actor form
│       ├── ActorDetail.jsx  # Actor detail page + filmography
│       └── App.css
└── server/          # Express backend
    ├── index.js      # Routes
    ├── database.js   # SQLite connection + schema
    └── marvel.db     # SQLite database file
```

## Database Schema

- **movies** — `id`, `title`, `releaseYear`
- **actors** — `id`, `name`, `imdb_url`
- **movie_actors** — join table linking movies and actors, with `character_name`

## API Endpoints

| Method | Endpoint                     | Description                                  |
|--------|-------------------------------|-----------------------------------------------|
| GET    | `/api/movies`                 | Get all movies                                |
| GET    | `/api/movies/:id`              | Get a single movie with its actors            |
| POST   | `/api/movies`                  | Create a new movie                            |
| PUT    | `/api/movies/:id`              | Update a movie                                |
| DELETE | `/api/movies/:id`              | Delete a movie                                |
| POST   | `/api/movies/:id/actors`       | Add an actor to a movie (creates actor if new)|
| GET    | `/api/actors/:id`              | Get a single actor with their filmography     |

## Getting Started

### Backend

```bash
cd server
npm install
nodemon index.js
```

Server runs on `http://localhost:3001`.

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` (or the next available port).

Both the backend and frontend need to be running at the same time for the app to work.

## Roadmap / TODO

- [ ] Update functionality in the UI for both movies and actors (backend route for movies already exists)
- [ ] Add real IMDb URLs for actors
- [ ] Delete functionality for actors
- [ ] User-facing error handling (currently errors only log to the console)
- [ ] Form validation (empty fields, non-numeric release year, etc.)
- [ ] Visual polish (loading states, delete confirmation, Marvel-themed styling)

## Author

Allan Tranx