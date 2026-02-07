const API_URL = 'http://localhost:3000/api';

export interface Accidente {
    idAccidente?: number;
    conductorId: number;
    vehiculoId: number;
    fechaAccidente: string;
    descripcion: string;
    gravedad: 'leve' | 'moderada' | 'grave';
    conductor?: {
        nombreConductor: string;
    };
    vehiculo?: {
        marca: string;
        modelo: string;
        numeroPlaca: string;
    };
}

class AccidenteService {
    async getAll(): Promise<Accidente[]> {
        const response = await fetch(`${API_URL}/accidentes`);
        if (!response.ok) throw new Error('Error al obtener accidentes');
        return response.json();
    }

    async getById(id: number): Promise<Accidente> {
        const response = await fetch(`${API_URL}/accidentes/${id}`);
        if (!response.ok) throw new Error('Error al obtener accidente');
        return response.json();
    }

    async create(accidente: Accidente): Promise<Accidente> {
        const response = await fetch(`${API_URL}/accidentes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(accidente),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.mensaje || 'Error al crear accidente');
        }
        return response.json();
    }

    async update(id: number, accidente: Accidente): Promise<Accidente> {
        const response = await fetch(`${API_URL}/accidentes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(accidente),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.mensaje || 'Error al actualizar accidente');
        }
        return response.json();
    }

    async delete(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/accidentes/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar accidente');
    }
}

export default new AccidenteService();
