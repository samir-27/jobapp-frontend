export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export async function fetchWithAuth(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE_URL}${cleanEndpoint}`;
  const token = localStorage.getItem('authToken');

  const headers = {
    ...(options.headers || {}),
  };

  // If body is not FormData, default to application/json
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers['Content-Type']
  ) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('authToken');
    // If not already on auth page, redirect
    if (
      !window.location.pathname.includes('/signin') &&
      !window.location.pathname.includes('/signup')
    ) {
      window.location.href = '/signin';
    }
  }

  return response;
}
