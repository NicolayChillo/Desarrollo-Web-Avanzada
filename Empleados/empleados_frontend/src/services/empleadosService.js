import axios from "axios";

// Instancia axios local para el service 
const api = axios.create({
  baseURL: "http://localhost:3000/api/empleados",
});

// Servicio para encapsular llamadas relacionadas con empleados
const empleadosService = {
  listar: async () => {
    const res = await api.get("/");
    return res.data;
  },

  crear: async (datos) => {
    const res = await api.post("/", datos);
    return res.data;
  },

  obtener: async (id) => {
    const res = await api.get(`/${id}`);
    return res.data;
  },

  actualizar: async (id, datos) => {
    const res = await api.put(`/${id}`, datos);
    return res.data;
  },

  eliminar: async (id) => {
    const res = await api.delete(`/${id}`);
    return res.data;
  },

  // Horas
  registrarHoras: async (id, payload) => {
    const res = await api.post(`/${id}/horas`, payload);
    return res.data;
  },

  obtenerRegistros: async (id) => {
    const res = await api.get(`/${id}/horas`);
    return res.data;
  },

  // Resumen semanal
  resumenSemana: async (id, inicio) => {
    const res = await api.get(`/${id}/semana`, { params: inicio ? { inicio } : {} });
    return res.data;
  },

  salario: async (id) => {
    const res = await api.get(`/${id}/salario`);
    return res.data;
  },

  estadisticas: async () => {
    const res = await api.get(`/estadisticas`);
    return res.data;
  }
};

export default empleadosService;
