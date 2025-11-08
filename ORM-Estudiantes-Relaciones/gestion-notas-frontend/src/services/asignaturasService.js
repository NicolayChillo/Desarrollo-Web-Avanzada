import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000/api/asignaturas" });

const mapAsignatura = (a) => ({ ...a, id: a.idAsignatura });

const asignaturasService = {
  listar: async () => { const res = await api.get('/'); return (res.data || []).map(mapAsignatura); },
  obtener: async (id) => { const res = await api.get(`/${id}`); return mapAsignatura(res.data); },
  crear: async (payload) => { const res = await api.post('/', payload); return mapAsignatura(res.data); },
  actualizar: async (id, payload) => { const res = await api.put(`/${id}`, payload); return mapAsignatura(res.data); },
  eliminar: async (id) => { const res = await api.delete(`/${id}`); return res.data; }
};

export default asignaturasService;
