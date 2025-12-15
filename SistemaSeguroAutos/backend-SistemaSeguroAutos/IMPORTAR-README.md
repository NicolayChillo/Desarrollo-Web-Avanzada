# 📋 Importar Conductores desde JSON

## 🎯 Descripción
Este módulo permite importar múltiples conductores desde un archivo JSON externo al sistema de seguros de autos.

## 📁 Archivos Creados

1. **datos-conductores.json** - Archivo con 10 conductores de ejemplo
2. **importar-conductores.ps1** - Script PowerShell para importación automática
3. **Endpoint**: `POST /api/conductores/importar`

## 🚀 Cómo Usar

### Opción 1: Usar el Script PowerShell (Recomendado)

1. Asegúrate de que el servidor esté corriendo:
   ```powershell
   npm run dev
   ```

2. En otra terminal, ejecuta el script:
   ```powershell
   .\importar-conductores.ps1
   ```

### Opción 2: Usar Postman o Thunder Client

**Endpoint:** `POST http://localhost:3000/api/conductores/importar`

**Body (JSON):**
```json
{
  "conductores": [
    {
      "nombre": "Juan Carlos Pérez",
      "edad": 22,
      "licencia": "LIC-001-2024",
      "accidentes": 0,
      "email": "juan.perez@email.com",
      "telefono": "0987654321"
    },
    {
      "nombre": "María González López",
      "edad": 45,
      "licencia": "LIC-002-2024",
      "accidentes": 1,
      "email": "maria.gonzalez@email.com",
      "telefono": "0991234567"
    }
  ]
}
```

### Opción 3: Usar PowerShell Manual

```powershell
$conductores = Get-Content .\datos-conductores.json | ConvertFrom-Json

$body = @{
    conductores = $conductores
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:3000/api/conductores/importar" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body
```

## 📊 Formato de los Datos

### Campos Requeridos:
- **nombre** (string): Nombre completo del conductor
- **edad** (number): Edad del conductor
- **licencia** (string): Número de licencia único

### Campos Opcionales:
- **accidentes** (number): Número de accidentes previos (default: 0)
- **email** (string): Correo electrónico
- **telefono** (string): Número de teléfono

### Ejemplo de un Conductor:
```json
{
  "nombre": "Juan Carlos Pérez",
  "edad": 22,
  "licencia": "LIC-001-2024",
  "accidentes": 0,
  "email": "juan.perez@email.com",
  "telefono": "0987654321"
}
```

## ✅ Respuesta del Servidor

```json
{
  "mensaje": "Importación completada",
  "total": 10,
  "exitosos": 8,
  "fallidos": 2,
  "detalles": {
    "exitosos": [
      {
        "id": 1,
        "nombre": "Juan Carlos Pérez",
        "licencia": "LIC-001-2024"
      }
    ],
    "fallidos": [
      {
        "datos": { ... },
        "error": "La licencia LIC-12345 ya está registrada"
      }
    ],
    "total": 10
  }
}
```

## ⚠️ Validaciones

El sistema valida automáticamente:
- ✅ Campos obligatorios (nombre, edad, licencia)
- ✅ Licencias únicas (no permite duplicados)
- ✅ Formato de datos correcto
- ✅ Calcula fecha de nacimiento aproximada desde la edad

## 🔄 Conductores de Ejemplo Incluidos

El archivo `datos-conductores.json` incluye 10 conductores con diferentes perfiles:

1. **Conductor joven** (22 años) - Recargo por edad
2. **Conductor adulto** (45 años) - Riesgo estándar
3. **Conductor mayor** (68 años) - Recargo por edad avanzada
4. **Conductor con múltiples accidentes** (4 accidentes)
5. **Conductores con historial limpio** (0 accidentes)
6. Y más...

## 🛠️ Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
```

### Error: "Cannot connect to server"
Asegúrate de que el servidor esté corriendo:
```bash
npm run dev
```

### Error: "La licencia ya está registrada"
Este error es normal si intentas importar los mismos datos dos veces. Cambia los números de licencia en el JSON.

## 📝 Notas

- La fecha de nacimiento se calcula automáticamente restando la edad del año actual
- Si un conductor falla, los demás continuarán importándose
- El sistema reporta tanto éxitos como fallos en la respuesta
