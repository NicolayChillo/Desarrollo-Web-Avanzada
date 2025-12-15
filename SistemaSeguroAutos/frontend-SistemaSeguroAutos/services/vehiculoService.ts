const API_URL = 'http://localhost:3000/api';

export interface Vehiculo {
    idVehiculo?: number;
    marca: string;
    modelo: string;
    anio: number;
    numeroPlaca: string;
    tipo: 'sedan' | 'SUV' | 'camioneta';
    uso: 'personal' | 'comercial';
    valorComercial: number;
}

class VehiculoService {
    async getAll(): Promise<Vehiculo[]> {
        const response = await fetch(`${API_URL}/vehiculos`);
        if (!response.ok) throw new Error('Error al obtener vehículos');
        return response.json();
    }

    async getById(id: number): Promise<Vehiculo> {
        const response = await fetch(`${API_URL}/vehiculos/${id}`);
        if (!response.ok) throw new Error('Error al obtener vehículo');
        return response.json();
    }

    async create(vehiculo: Vehiculo): Promise<Vehiculo> {
        const response = await fetch(`${API_URL}/vehiculos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vehiculo),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.mensaje || 'Error al crear vehículo');
        }
        return response.json();
    }

    async update(id: number, vehiculo: Partial<Vehiculo>): Promise<Vehiculo> {
        const response = await fetch(`${API_URL}/vehiculos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(vehiculo),
        });
        if (!response.ok) throw new Error('Error al actualizar vehículo');
        return response.json();
    }

    async delete(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/vehiculos/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Error al eliminar vehículo');
    }
}

export default new VehiculoService();
