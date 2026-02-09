const API_BASE_URL = 'http://localhost:9090';

let authToken: string | null = null;

export const setAuthToken = (token: string) => {
  authToken = token;
};

export const login = async (correo: string, contrasena: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ correo, contrasena }),
  });

  if (!response.ok) {
    throw new Error('Error al iniciar sesión');
  }

  const data = await response.json();
  setAuthToken(data.token);
  return data;
};

export const getHabitaciones = async () => {
  const response = await fetch(`${API_BASE_URL}/habitaciones`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { 'Authorization': `Bearer ${authToken}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener habitaciones');
  }

  return await response.json();
};

export const getHabitacionesPorTipo = async (nombreTipo: string) => {
  const response = await fetch(`${API_BASE_URL}/habitaciones/tipo/${nombreTipo}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener habitaciones por tipo');
  }

  return await response.json();
};
