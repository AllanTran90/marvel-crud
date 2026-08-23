import { useState, useEffect } from 'react'
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  
  return (
    <div>
      <h1>
        Marvel Movies
      </h1>
    </div>
  );
}

export default App;