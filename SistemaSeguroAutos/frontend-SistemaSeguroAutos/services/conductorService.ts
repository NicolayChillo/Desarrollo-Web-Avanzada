const API_URL = 'http://localhost:3000/api';

export interface Conductor {
    idConductor?: number;
    nombreConductor: string;
    numeroLicenia: string;
    fechaNacimiento: string;
    numeroAccidentes: number;
}

class ConductorService {
    async getAll(): Promise<Conductor[]> {
        const response = await fetch(`${API_URL}/conductores`);
        if (!response.ok) throw new Error('Error al obtener conductores');
        return response.json();
    }

    async getById(id: number): Promise<Conductor> {
        const response = await fetch(`${API_URL}/conductores/${id}`);
        if (!response.ok) throw new Error('Error al obtener conductor');
        return response.json();
    }

    async create(conductor: Conductor): Promise<Conductor> {
        const response = await fetch(`${API_URL}/conductores`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(conductor),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.mensaje || 'Error al crear conductor');
        }
        return response.json();
    }

    async update(id: number, conductor: Partial<Conductor>): Promise<Conductor> {
        const response = await fetch(`${API_URL}/conductores/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(conductor),
        });
        if (!response.ok) throw new Error('Error al actualizar conductor');
        return response.json();
    }

    async delete(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/conductores/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar conductor');
    }
}

export default new ConductorService();
