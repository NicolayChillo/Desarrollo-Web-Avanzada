const API_BASE_URL = 'http://localhost:9090';

let authToken: string | null = null;

// Interfaces
export interface LoginResponse {
  token: string;
  tokenType?: string;
  idUsuario?: number;
  rol?: string;
}

// ==================== HABITACIONES ====================
export interface CrearHabitacionRequest {
  codigo: string;
  descripcion: string;
  nBathroom: number;
  estado: string;
  idTipoHabitacion: number;
  imagen: File;
}

export const crearHabitacion = async (datos: CrearHabitacionRequest) => {
  const token = localStorage.getItem('token');
  const formData = new FormData();
  formData.append('codigo', datos.codigo);
  formData.append('descripcion', datos.descripcion);
  formData.append('nBathroom', String(datos.nBathroom));
  formData.append('estado', datos.estado);
  formData.append('idTipoHabitacion', String(datos.idTipoHabitacion));
  formData.append('imagen', datos.imagen);

  const response = await fetch(`${API_BASE_URL}/habitaciones`, {
    method: 'POST',
    headers: {
      ...(token && { 'Authorization': `Bearer ${token}` }),
      // NO poner 'Content-Type', fetch lo gestiona para FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Error al crear habitación');
  }

  return await response.json();
};

export const setAuthToken = (token: string) => {
  authToken = token;
};

export const login = async (correo: string, contrasena: string): Promise<LoginResponse> => {
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

  const data: LoginResponse = await response.json();
  setAuthToken(data.token);
  return data;
};

export const register = async (nombre: string, correo: string, contrasena: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/registro`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ nombre, correo, contrasena }),
  });

  if (!response.ok) {
    throw new Error('Error al registrarse');
  }

  return await response.json();
};

// Decodifica el JWT para obtener el rol del usuario
export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
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

// ==================== RESERVAS ====================

export interface CreateReservaRequest {
  idUsuario: number;
  idHabitacion: number;
  fechaInicio: string; // formato: YYYY-MM-DD
  fechaFin: string;
  numeroHuespedes: number;
  observacion?: string;
}

export const createReserva = async (reservaData: CreateReservaRequest) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/reservas`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(reservaData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Error al crear la reserva');
  }

  return await response.json();
};

export const getMisReservas = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/reservas/mias`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener reservas');
  }

  return await response.json();
};

export const getAllReservas = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/reservas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener todas las reservas');
  }

  return await response.json();
};

export const confirmarReserva = async (idReserva: number) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/reservas/${idReserva}/confirmar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Error al confirmar la reserva');
  }
};

export const cancelarReserva = async (idReserva: number) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/reservas/${idReserva}/cancelar`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Error al cancelar la reserva');
  }
};

// ==================== ADMIN ====================

export interface Estadisticas {
  totalHabitaciones: number;
  reservasPendientes: number;
  reservasConfirmadas: number;
  ingresosTotal: number;
}

export const getEstadisticasAdmin = async (): Promise<Estadisticas> => {
  const token = localStorage.getItem('token');
  
  // Obtener datos en paralelo
  const [habitacionesRes, reservasRes] = await Promise.all([
    fetch(`${API_BASE_URL}/habitaciones`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    }),
    fetch(`${API_BASE_URL}/reservas`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
    })
  ]);

  if (!habitacionesRes.ok || !reservasRes.ok) {
    throw new Error('Error al obtener estadísticas');
  }

  const habitaciones = await habitacionesRes.json();
  const reservas = await reservasRes.json();

  const totalHabitaciones = habitaciones.length;
  const reservasPendientes = reservas.filter((r: any) => r.estado === 'PENDIENTE').length;
  const reservasConfirmadas = reservas.filter((r: any) => r.estado === 'CONFIRMADA').length;
  const ingresosTotal = reservas
    .filter((r: any) => r.estado === 'CONFIRMADA')
    .reduce((sum: number, r: any) => sum + (r.total || 0), 0);

  return {
    totalHabitaciones,
    reservasPendientes,
    reservasConfirmadas,
    ingresosTotal
  };
};

export const getTodosUsuarios = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/api/usuarios`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener usuarios');
  }

  return await response.json();
};

export const cambiarRolUsuario = async (idUsuario: number, nuevoRol: string) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/api/usuarios/${idUsuario}/rol`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify({ tipoRol: nuevoRol }),
  });

  if (!response.ok) {
    throw new Error('Error al cambiar rol');
  }

  return await response.json();
};

export const eliminarUsuario = async (idUsuario: number) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/api/usuarios/${idUsuario}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Error al eliminar usuario');
  }

  return await response.json();
};

export const obtenerPerfil = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/api/usuarios/perfil`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener perfil');
  }

  return await response.json();
};

export const actualizarPerfil = async (datos: { nombre?: string; correo?: string; password?: string }) => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/api/usuarios/perfil`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
    body: JSON.stringify(datos),
  });

  if (!response.ok) {
    let errorMessage = 'Error al actualizar perfil';
    try {
      const text = await response.text();
      if (text) {
        const errorData = JSON.parse(text);
        errorMessage = errorData?.message || errorMessage;
      }
    } catch (e) {
      console.error('Error al parsear respuesta de error:', e);
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }
    throw new Error(errorMessage);
  }

  try {
    const text = await response.text();
    return text ? JSON.parse(text) : { success: true };
  } catch (e) {
    console.error('Error al parsear respuesta exitosa:', e);
    return { success: true };
  }
};

// ==================== DASHBOARD COMPLETO ====================

export interface OcupacionMensual {
  mes: number;
  año: number;
  habitacionesOcupadas: number;
  totalHabitaciones: number;
  porcentajeOcupacion: number;
  label: string;
}

export interface TopHabitacion {
  idHabitacion: number;
  codigoHabitacion: string;
  tipoHabitacion: string;
  cantidadReservas: number;
  ingresosTotales: number;
  ingresoPromedio: number;
}

export interface EstadisticasGenerales {
  totalIngresos: number;
  totalIngresosMes: number;
  totalReservas: number;
  totalReservasConfirmadas: number;
  totalHabitaciones: number;
  habitacionesDisponibles: number;
  tasaOcupacionPromedio: number;
  porcentajeOcupacion: number;  // Alias de tasaOcupacionPromedio para compatibilidad
}

export interface DashboardResumen {
  estadisticasGenerales: EstadisticasGenerales;
  ocupacionMensual: OcupacionMensual[];
  topHabitaciones: TopHabitacion[];
}

export const getDashboardResumen = async (): Promise<DashboardResumen> => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/api/dashboard/resumen`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener resumen del dashboard');
  }

  const data = await response.json();
  
  // Transformar la respuesta del backend para que coincida con la interfaz del frontend
  return {
    estadisticasGenerales: {
      ...data.estadisticasGenerales,
      porcentajeOcupacion: data.estadisticasGenerales.tasaOcupacionPromedio || 0
    },
    ocupacionMensual: data.ocupacionMensual || [],
    topHabitaciones: data.topHabitaciones || []
  };
};

