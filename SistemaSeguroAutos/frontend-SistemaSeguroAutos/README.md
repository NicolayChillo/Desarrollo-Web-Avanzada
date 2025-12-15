# Frontend - Sistema de Seguros de Autos

Frontend desarrollado con Next.js 13 y PrimeReact basado en la plantilla Avalon React.

## Requisitos Previos

- Node.js 16 o superior
- npm o yarn
- Backend del Sistema de Seguros ejecutándose en `http://localhost:3000`

## Instalación

Instalar dependencias:

```bash
npm install
# or
yarn install
```

## Ejecución

Ejecutar el servidor de desarrollo:

```bash
npm run dev
# or
yarn dev
```

Abrir [http://localhost:3001](http://localhost:3001) en el navegador para ver la aplicación.

**Nota:** Si el puerto 3001 está ocupado, Next.js usará automáticamente el siguiente puerto disponible.

## Características Implementadas

### 🔐 Login
- Autenticación de usuarios contra la base de datos del backend
- Manejo de sesión mediante localStorage
- Validación de formularios
- Mensajes de error amigables
- Redirección automática al dashboard después del login

### 📁 Estructura del Proyecto

```
frontend-SistemaSeguroAutos/
├── app/                          # Páginas (Next.js 13 App Router)
│   └── (full-page)/
│       └── auth/
│           └── login/
│               └── page.tsx      # Página de login personalizada
├── services/                      # Servicios de API
│   └── authService.ts            # Servicio de autenticación
├── config/                        # Configuraciones
│   └── constants.ts              # Constantes y URLs de la API
├── layout/                        # Componentes de layout (Avalon)
├── public/                        # Archivos estáticos
└── package.json
```

## 🚀 Uso del Login

1. **Iniciar el backend:** Asegúrate de que el backend esté corriendo en `http://localhost:3000`

2. **Navegar al login:** Ve a `http://localhost:3001/auth/login`

3. **Credenciales:** Ingresa un email y contraseña de un usuario registrado en la base de datos

4. **Dashboard:** Al iniciar sesión exitosamente, serás redirigido al dashboard principal

## 📡 API Backend

El frontend se conecta al backend en:
- **Base URL:** `http://localhost:3000/api`
- **Endpoint Login:** `POST /api/usuarios/login`

Puedes modificar la URL de la API en `config/constants.ts`

## 🛠️ Servicios Disponibles

### AuthService (`services/authService.ts`)

Métodos disponibles:

```typescript
// Iniciar sesión
await authService.login({ email, password });

// Registrar nuevo usuario
await authService.register({ nombreUsuario, email, password });

// Cerrar sesión
authService.logout();

// Obtener usuario actual
const usuario = authService.getCurrentUser();

// Verificar si hay sesión activa
const isAuth = authService.isAuthenticated();
```

## 📋 Próximos Pasos

- [ ] Implementar protección de rutas (auth guard)
- [ ] Crear páginas para gestión de conductores
- [ ] Implementar formularios de registro de usuarios
- [ ] Añadir validaciones adicionales en formularios
- [ ] Mejorar manejo de errores global
- [ ] Implementar tokens JWT (actualmente usa localStorage)
- [ ] Añadir módulo de gestión de pólizas

## 🔧 Solución de Problemas

### Error de conexión con backend
- Verificar que el backend esté ejecutándose en puerto 3000
- Revisar la consola del navegador para errores CORS
- Verificar que la URL en `config/constants.ts` sea correcta

### Error de compilación
```bash
rm -rf .next
npm install
npm run dev
```

## 📚 Aprender Más

Para aprender más sobre las tecnologías usadas:

- [Next.js Documentation](https://nextjs.org/docs) - características y API de Next.js
- [PrimeReact Documentation](https://primereact.org/) - componentes UI de PrimeReact
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - guía de TypeScript