// Live karte waqt .env mein VITE_API_URL=https://your-backend-link likh dein.
export const API =
  import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;