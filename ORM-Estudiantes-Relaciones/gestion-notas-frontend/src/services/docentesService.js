import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:3000/api/docentes" });

const mapDocente = (d) => ({ ...d, id: d.idDocente });

const docentesService = {
  listar: async () => { const res = await api.get('/'); return (res.data || []).map(mapDocente); },
  obtener: async (id) => { const res = await api.get(`/${id}`); return mapDocente(res.data); },
  crear: async (payload) => { const res = await api.post('/', payload); return mapDocente(res.data); },
  actualizar: async (id, payload) => { const res = await api.put(`/${id}`, payload); return mapDocente(res.data); },
  eliminar: async (id) => { const res = await api.delete(`/${id}`); return res.data; }
};

export default docentesService;
