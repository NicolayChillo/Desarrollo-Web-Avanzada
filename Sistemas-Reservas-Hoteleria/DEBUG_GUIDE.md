# 🔍 Guía de Depuración - Sistema de Reservas de Hotelería

## 📋 Qué Buscar en la Consola

### 🌐 **Frontend (Consola del Navegador - F12)**

#### 1. **Cuando carga la página Hero:**

```
🏠 [HERO] === INICIANDO CARGA DE HABITACIONES ===
```

#### 2. **Durante la petición de habitaciones:**

```
🔍 [DEBUG] === INICIANDO PETICIÓN DE HABITACIONES ===
🔍 [DEBUG] URL: http://localhost:9090/habitaciones
🔍 [DEBUG] Token presente: SÍ ✅  ó  NO ❌
🔍 [DEBUG] Token (primeros 20 chars): eyJhbGciOiJIUzI1NiI...
🔍 [DEBUG] Headers enviados: {
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbG..."  // Solo si hay token
}
```

#### 3. **Respuesta del servidor:**

```
🔍 [DEBUG] Response status: 200
🔍 [DEBUG] Response OK: true
🔍 [DEBUG] Response headers: { ... }
✅ [DEBUG] Habitaciones recibidas:
   - Cantidad: 10  (o el número que sea)
   - Tipo de dato: object
   - Es array: true
   - Datos completos: [ {...}, {...}, ... ]
```

#### 4. **Procesamiento de habitaciones:**

```
🏠 [HERO] Habitaciones recibidas: [ ... ]
🏠 [HERO] Total habitaciones: 10
🏠 [HERO] Tipo de dato: object
🏠 [HERO] Es array: true
🏠 [HERO] Habitación #1: {
  numero: "101",
  estado: "DISPONIBLE",
  tipo: {...},
  objetoCompleto: {...}
}
✅ [HERO] Habitación DISPONIBLE - Tipo: simple
   ➕ Contando como SIMPLE
```

#### 5. **Resultado final:**

```
🎯 [HERO] Conteo final: { simple: 5, doble: 3, estudio: 1, suite: 1 }
🎯 [HERO] Actualizando estado con: { ... }
🏁 [HERO] Finalizando carga. Loading = false
```

---

### ⚙️ **Backend (Consola del Terminal de Java)**

#### 1. **Cuando llega la petición GET /habitaciones:**

```
🔍 [CONTROLLER] === GET /habitaciones - Inicio ===
```

#### 2. **En el servicio:**

```
🔍 [SERVICE] === listar() - Inicio ===
🔍 [SERVICE] Habitaciones encontradas en BD: 10
🔍 [SERVICE] Procesando habitacion: 101 | Estado: DISPONIBLE | Tipo: SIMPLE
🔍 [SERVICE] Procesando habitacion: 102 | Estado: OCUPADA | Tipo: DOBLE
...
🔍 [SERVICE] Respuestas mapeadas: 10
🔍 [SERVICE] === listar() - Fin ===
```

#### 3. **En el controlador (respuesta):**

```
🔍 [CONTROLLER] Cantidad de habitaciones: 10
🔍 [CONTROLLER] Habitaciones: [HabitacionResponse(...), ...]
🔍 [CONTROLLER] === GET /habitaciones - Fin ===
```

---

## 🚨 Problemas Comunes y Soluciones

### ❌ **Problema 1: "Token presente: NO"**

**Causa:** No se ha hecho login o el token no se guardó correctamente.

**Solución:** 
- Verificar si existe un flujo de login en la aplicación
- Si el endpoint `/habitaciones` NO requiere autenticación, esto es normal
- Revisar el archivo `SecurityConfig.java` (línea 49): el GET está configurado como `.permitAll()`

---

### ❌ **Problema 2: "Cantidad: 0" o "No es un array"**

**Causa:** La base de datos está vacía o la respuesta del backend tiene un formato incorrecto.

**Solución:**
1. Verificar que la base de datos tenga habitaciones:
   ```sql
   SELECT * FROM habitacion;
   ```
2. Verificar logs del backend para ver cuántas habitaciones se encontraron
3. Verificar que el backend esté corriendo en `localhost:9090`

---

### ❌ **Problema 3: "Response status: 401" o "403"**

**Causa:** Problema de autenticación/autorización.

**Solución:**
- Revisar la configuración de seguridad en el backend
- Asegurarse de que el endpoint esté en la lista de `.permitAll()`
- Si requiere token, implementar flujo de login

---

### ❌ **Problema 4: "Response status: 0" o error CORS**

**Causa:** El backend no está corriendo o problema de CORS.

**Solución:**
1. Verificar que el backend esté corriendo: `http://localhost:9090/habitaciones`
2. Revisar configuración CORS en el backend
3. Verificar que el puerto sea el correcto (9090)

---

### ❌ **Problema 5: Habitaciones no se cuentan correctamente**

**Causa:** El formato de los datos no coincide con lo esperado.

**Revisar:**
- Que `habitacion.estado` sea exactamente `"DISPONIBLE"` (mayúsculas)
- Que `habitacion.tipoHabitacion.nombre` contenga: "simple", "doble", "estudio" o "suite" (minúsculas o parcial)
- Ver logs detallados de cada habitación para entender la estructura

---

## 🔧 Pasos para Depurar

1. **Abrir DevTools del navegador** (F12)
2. **Ir a la pestaña Console**
3. **Recargar la página** (F5 o Ctrl+R)
4. **Observar los mensajes** siguiendo la secuencia de arriba
5. **En la terminal del backend**, observar los logs del servidor
6. **Comparar** ambas salidas para identificar dónde está el problema

---

## ✅ Flujo Esperado Correcto

```
FRONTEND                              BACKEND
--------                              -------
🏠 HERO Inicia                       
  ↓
🔍 Petición GET /habitaciones  ----→  🔍 CONTROLLER recibe GET
  ↓                                     ↓
🔍 Headers enviados              →  🔍 SERVICE consulta BD
  ↓                                     ↓
                                      🔍 SERVICE encuentra N habitaciones
                                        ↓
                                      🔍 CONTROLLER devuelve respuesta
  ↓                                     ↓
✅ Response OK: true            ←----  HTTP 200 + JSON
  ↓
🏠 HERO procesa habitaciones
  ↓
🏠 HERO cuenta por tipo
  ↓
🎯 Conteo final actualizado
  ↓
🏁 Loading = false
```

---

## 📞 Si el Problema Persiste

Copiar TODA la salida de la consola (frontend y backend) y compartirla para análisis más profundo.

**Información útil:**
- Mensajes de error completos
- Status code de la respuesta HTTP
- Estructura de los datos recibidos
- Número de habitaciones en base de datos
