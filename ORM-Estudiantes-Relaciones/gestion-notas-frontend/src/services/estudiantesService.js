import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000/api/estudiantes" });

// Helper para mapear la respuesta del backend a un objeto con 'id'
const mapEstudiante = (e) => ({ ...e, id: e.idEstudiante });

const estudiantesService = {
  listar: async () => { const res = await api.get('/'); return (res.data || []).map(mapEstudiante); },
  crear: async (payload) => { const res = await api.post('/', payload); return mapEstudiante(res.data); },
  obtener: async (id) => { const res = await api.get(`/${id}`); return mapEstudiante(res.data); },
  actualizar: async (id, payload) => { const res = await api.put(`/${id}`, payload); return mapEstudiante(res.data); },
  eliminar: async (id) => { const res = await api.delete(`/${id}`); return res.data; }
};

export default estudiantesService;
