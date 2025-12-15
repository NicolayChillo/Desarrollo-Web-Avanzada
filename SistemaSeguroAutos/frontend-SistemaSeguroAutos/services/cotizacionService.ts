const API_URL = 'http://localhost:3000/api';

export interface CotizacionCreate {
    conductorId: number;
    usuarioId: number;
    vehiculoId: number;
    formaPago?: string;
    pagoEnCuotas?: boolean;
    numeroCuotas?: number;
    aceptaTerminos: boolean;
}

export interface Cotizacion {
    idCotizacion: number;
    costoBase: number;
    costoFinal: number;
    descuentos: number;
    recargos: number;
    estado: string;
    fechaCreacion: string;
    fechaVencimiento: string;
    detalleCalculo: any;
    conductor: {
        nombreConductor: string;
    };
    vehiculo: {
        marca: string;
        modelo: string;
        tipo: string;
        numeroPlaca: string;
    };
    usuario: {
        nombreUsuario: string;
    };
}

class CotizacionService {
    async getAll(): Promise<Cotizacion[]> {
        const response = await fetch(`${API_URL}/cotizaciones`);
        if (!response.ok) throw new Error('Error al obtener cotizaciones');
        return response.json();
    }

    async getById(id: number): Promise<Cotizacion> {
        const response = await fetch(`${API_URL}/cotizaciones/${id}`);
        if (!response.ok) throw new Error('Error al obtener cotización');
        return response.json();
    }

    async create(cotizacion: CotizacionCreate): Promise<any> {
        const response = await fetch(`${API_URL}/cotizaciones`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cotizacion),
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.mensaje || 'Error al crear cotización');
        }
        return response.json();
    }
}

export default new CotizacionService();
