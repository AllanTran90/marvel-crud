// Adressen till backend-servern. Ändra här om porten eller servern byts.
export const API_URL = 'http://localhost:3001/api';

// Gemensam fetch för hela appen.
// - Gör om `body` till JSON automatiskt
// - Kastar ett Error med ett läsbart meddelande om något går fel,
//   så att komponenterna bara behöver en .catch() för att visa felet
export async function apiFetch(path, { body, ...options } = {}) {
  let res;

  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    // fetch kastar bara när servern inte går att nå alls (t.ex. inte startad)
    throw new Error('Could not reach the server. Is it running?');
  }

  // Servern svarar med JSON, men var beredd på att den inte gör det
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    // Servern skickar { error: "..." } vid fel, se sendError i server/index.js
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data;
}
