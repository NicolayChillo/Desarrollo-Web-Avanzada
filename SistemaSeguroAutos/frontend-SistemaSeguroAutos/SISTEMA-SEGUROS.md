# Sistema de Seguros de Autos - Documentación

## ✅ Sistema Completado

El frontend ha sido limpiado y configurado con solo las funcionalidades necesarias para el Sistema de Seguros de Autos.

## 🎯 Funcionalidades Implementadas

### 1. **Dashboard** (`/dashboards/sistema`)
- Muestra estadísticas generales del sistema
- Contadores de vehículos, conductores y cotizaciones
- Gráfico de estado de cotizaciones (aprobadas, pendientes, rechazadas)
- Accesos rápidos a todas las funcionalidades

### 2. **Gestión de Conductores** (`/conductores`)
- ✅ Crear nuevo conductor con formulario
- ✅ Listar todos los conductores en tabla
- ✅ Editar conductores existentes
- ✅ Eliminar conductores
- ✅ Cálculo automático de edad
- ✅ Campos: nombre, licencia, fecha nacimiento, número de accidentes

### 3. **Gestión de Vehículos** (`/vehiculos`)
- ✅ Crear nuevo vehículo con formulario
- ✅ Listar todos los vehículos en tabla
- ✅ Editar vehículos existentes
- ✅ Eliminar vehículos
- ✅ Campos: marca, modelo, año, placa, tipo (Sedán/SUV/Camioneta), uso (Personal/Comercial), valor comercial

### 4. **Nueva Cotización** (`/nueva-cotizacion`)
- ✅ Seleccionar conductor (con información de edad y accidentes)
- ✅ Seleccionar vehículo (con información de tipo y valor)
- ✅ Elegir forma de pago (Anual con descuento, Tarjeta Crédito, Tarjeta Débito)
- ✅ Opción de pago en cuotas (3, 6 o 12 cuotas)
- ✅ Aceptación de términos y condiciones
- ✅ Cálculo automático con todas las reglas de negocio
- ✅ Visualización detallada de:
  - Costo base
  - Recargos aplicados
  - Descuentos aplicados
  - Costo final
  - Detalles de ajustes por conductor, vehículo, accidentes y pago
  - Advertencias (ej: más de 3 accidentes)
  - Vigencia de la cotización

### 5. **Listado de Cotizaciones** (`/cotizaciones`)
- ✅ Tabla con todas las cotizaciones
- ✅ Filtros y paginación
- ✅ Ver detalles completos de cada cotización
- ✅ Visualización de cálculos y reglas aplicadas
- ✅ Botón para crear nueva cotización

## 🚀 Inicio Rápido

### 1. Instalar dependencias
```bash
cd frontend-SistemaSeguroAutos
npm install
```

### 2. Iniciar servidor de desarrollo
```bash
npm run dev
```

El frontend estará disponible en: **http://localhost:3001**

### 3. Login
- URL: http://localhost:3001/auth/login
- Usuario: admin@seguros.com
- Contraseña: admin123

*(Crear usuario primero usando los datos de prueba del backend)*

## 📁 Estructura del Proyecto

```
frontend-SistemaSeguroAutos/
├── app/
│   ├── (full-page)/
│   │   └── auth/
│   │       └── login/          # Página de login
│   └── (main)/
│       ├── dashboards/
│       │   └── sistema/        # Dashboard principal
│       ├── conductores/        # Gestión de conductores
│       ├── vehiculos/          # Gestión de vehículos
│       ├── nueva-cotizacion/   # Formulario de cotización
│       └── cotizaciones/       # Listado de cotizaciones
├── services/
│   ├── authService.ts          # Autenticación
│   ├── conductorService.ts     # API de conductores
│   ├── vehiculoService.ts      # API de vehículos
│   └── cotizacionService.ts    # API de cotizaciones
├── layout/
│   └── AppMenu.tsx             # Menú lateral (limpiado)
└── config/
    └── constants.ts            # Configuración de URLs
```

## 🎨 Componentes Utilizados (PrimeReact)

- **DataTable**: Tablas con paginación, filtros y ordenamiento
- **Dialog**: Modales para formularios
- **InputText**: Campos de texto
- **InputNumber**: Campos numéricos
- **Dropdown**: Selectores desplegables
- **Calendar**: Selector de fechas
- **Checkbox**: Casillas de verificación
- **Button**: Botones de acción
- **Card**: Tarjetas de contenido
- **Chart**: Gráficos (pie chart)
- **Toast**: Notificaciones
- **Tag**: Etiquetas de estado
- **ProgressSpinner**: Indicadores de carga

## 📋 Menú del Sistema

El menú lateral solo muestra:

```
Sistema de Seguros
├── Dashboard
├── Conductores
├── Vehículos
└── Cotizaciones
    ├── Nueva Cotización
    └── Ver Cotizaciones
```

## 🔄 Flujo de Trabajo Recomendado

1. **Registrar Conductores**
   - Ir a "Conductores"
   - Click en "Nuevo Conductor"
   - Llenar formulario
   - Guardar

2. **Registrar Vehículos**
   - Ir a "Vehículos"
   - Click en "Nuevo Vehículo"
   - Llenar formulario
   - Guardar

3. **Generar Cotización**
   - Ir a "Nueva Cotización"
   - Seleccionar conductor
   - Seleccionar vehículo
   - Elegir forma de pago
   - Aceptar términos
   - Click en "Generar Cotización"
   - Ver resultados con todos los cálculos

4. **Ver Cotizaciones**
   - Ir a "Ver Cotizaciones"
   - Click en "Ver Detalles" para ver el cálculo completo

## 🎯 Reglas de Negocio Aplicadas

### Conductor:
- ✅ Menor de 18 años → Rechazado
- ✅ 18-24 años → +25% recargo
- ✅ 25-65 años → Estándar
- ✅ 66-75 años → +20% recargo
- ✅ Mayor de 75 años → Rechazado

### Vehículo:
- ✅ Sedán → Base $500
- ✅ SUV → Base $750
- ✅ Camioneta → Base $800
- ✅ Uso comercial → +30%
- ✅ Más de 20 años → Rechazado

### Accidentes:
- ✅ 0 accidentes → -10% descuento
- ✅ 1-3 accidentes → +15% c/u
- ✅ Más de 3 → Revisión manual (estado "pendiente")

### Forma de Pago:
- ✅ Pago anual → -10% descuento
- ✅ Pago en cuotas → +15% recargo

## 🔧 Configuración

Para cambiar la URL del backend, editar:
```typescript
// frontend/config/constants.ts
export const API_URL = 'http://localhost:3000/api';
```

## 📝 Notas Importantes

- El sistema requiere que el backend esté corriendo en `http://localhost:3000`
- Todas las páginas están protegidas con autenticación
- Si no hay sesión activa, redirige automáticamente al login
- Los formularios tienen validación completa
- Las tablas incluyen paginación automática
- Los mensajes de error se muestran con Toast notifications

## 🎉 Listo para Usar

El sistema está completamente funcional y listo para:
- Registrar conductores y vehículos
- Generar cotizaciones con cálculos automáticos
- Ver listados completos de todos los registros
- Visualizar estadísticas en el dashboard

Todo siguiendo el diseño y componentes de la plantilla Avalon React.
