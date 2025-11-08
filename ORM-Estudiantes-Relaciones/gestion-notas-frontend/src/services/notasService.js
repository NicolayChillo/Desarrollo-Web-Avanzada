import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000/api/notas" });

const mapNota = (n) => ({
  ...n,
  id: n.idNota,
  idEstudiante: n.idEstudiante,
  idAsignatura: n.idAsignatura
});

const notasService = {
  listar: async () => { const res = await api.get('/'); return (res.data || []).map(mapNota); },
  crear: async (payload) => { const res = await api.post('/', payload); return mapNota(res.data); },
  obtener: async (id) => { const res = await api.get(`/${id}`); return mapNota(res.data); },
  actualizar: async (id, payload) => { const res = await api.put(`/${id}`, payload); return mapNota(res.data); },
  eliminar: async (id) => { const res = await api.delete(`/${id}`); return res.data; }
};

export default notasService;
