const API_URL = 'http://localhost:3000/api';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface Usuario {
    id: number;
    nombreUsuario: string;
    email: string;
}

export interface LoginResponse {
    mensaje: string;
    usuario: Usuario;
}

class AuthService {
    // Login de usuario
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        try {
            const response = await fetch(`${API_URL}/usuarios/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.mensaje || 'Error al iniciar sesión');
            }

            const data: LoginResponse = await response.json();
            
            // Guardar usuario en localStorage
            this.saveUser(data.usuario);
            
            return data;
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    }

    // Registrar nuevo usuario
    async register(userData: { nombreUsuario: string; email: string; password: string }) {
        try {
            const response = await fetch(`${API_URL}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.mensaje || 'Error al registrar usuario');
            }

            return await response.json();
        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }

    // Guardar usuario en localStorage
    saveUser(usuario: Usuario): void {
        localStorage.setItem('user', JSON.stringify(usuario));
    }

    // Obtener usuario actual
    getCurrentUser(): Usuario | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }

    // Verificar si está autenticado
    isAuthenticated(): boolean {
        return this.getCurrentUser() !== null;
    }

    // Cerrar sesión
    logout(): void {
        localStorage.removeItem('user');
    }
}

export default new AuthService();
