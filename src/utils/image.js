const BASE_URL =
  import.meta.env.VITE_API_URL || 'https://tazaura.in/api/v1';

export function getImageUrl(path) {
  if (!path) return '/placeholder.jpg';
  if (path.startsWith('http')) return path;
  if (!path.startsWith('/')) path = '/' + path;
  return `${BASE_URL}${path}`;
}
