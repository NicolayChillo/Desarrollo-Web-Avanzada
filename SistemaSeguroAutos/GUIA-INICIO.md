# Guía de Inicio Rápido - Sistema de Seguros de Autos

## 1. Configuración Inicial

### Base de Datos
Asegúrate de tener MySQL corriendo con la siguiente configuración:
- Host: localhost
- Puerto: 3306
- Base de datos: sistema_seguro_autos
- Usuario: root
- Contraseña: mateo200414

### Crear la Base de Datos
```sql
CREATE DATABASE IF NOT EXISTS sistema_seguro_autos;
USE sistema_seguro_autos;
```

## 2. Iniciar el Backend

```bash
cd backend-SistemaSeguroAutos
npm install
npm start
```

El backend se ejecutará en: `http://localhost:3000`

## 3. Iniciar el Frontend

Abrir una nueva terminal:

```bash
cd frontend-SistemaSeguroAutos
npm install
npm run dev
```

El frontend se ejecutará en: `http://localhost:3001`

## 4. Crear un Usuario de Prueba

Puedes usar Thunder Client o Postman para crear un usuario:

**Endpoint:** POST `http://localhost:3000/api/usuarios`

**Body (JSON):**
```json
{
    "nombreUsuario": "Admin",
    "email": "admin@seguros.com",
    "password": "admin123"
}
```

## 5. Probar el Login

1. Abre el navegador en: `http://localhost:3001/auth/login`
2. Ingresa las credenciales:
   - **Email:** admin@seguros.com
   - **Contraseña:** admin123
3. Haz clic en "Iniciar Sesión"
4. Deberías ser redirigido al dashboard

## 6. Verificar la Sesión

Abre la consola del navegador (F12) y escribe:
```javascript
localStorage.getItem('usuario')
```

Deberías ver el objeto del usuario guardado.

## Estructura de Endpoints

### Usuarios
- `POST /api/usuarios` - Crear usuario
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/:id` - Obtener usuario por ID
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario
- `POST /api/usuarios/login` - Login

### Conductores
- `POST /api/conductores` - Crear conductor
- `GET /api/conductores` - Obtener todos los conductores
- `GET /api/conductores/:id` - Obtener conductor por ID
- `PUT /api/conductores/:id` - Actualizar conductor
- `DELETE /api/conductores/:id` - Eliminar conductor

## Solución de Problemas

### Backend no se conecta a la base de datos
- Verificar que MySQL esté corriendo
- Verificar credenciales en `backend/src/Config/database.js`
- Revisar el puerto de MySQL (debe ser 3306)

### Frontend no se conecta al backend
- Verificar que el backend esté corriendo en puerto 3000
- Revisar la URL en `frontend/config/constants.ts`
- Verificar errores CORS en la consola del navegador

### Error al hacer login
- Verificar que el usuario exista en la base de datos
- Verificar que el email y contraseña sean correctos
- Revisar la consola del navegador para mensajes de error
- Revisar logs del backend en la terminal

## Notas Importantes

⚠️ **Seguridad**: Este proyecto usa contraseñas en texto plano. Para producción, implementar bcrypt para hashear contraseñas.

⚠️ **Sesión**: La sesión se maneja con localStorage. Para producción, implementar JWT (JSON Web Tokens).

⚠️ **CORS**: Si tienes problemas de CORS, asegúrate de que el backend tenga configurado cors para aceptar peticiones desde localhost:3001.
