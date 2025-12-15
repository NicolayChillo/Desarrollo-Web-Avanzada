# Datos de Prueba - Sistema de Seguros de Autos

## 1. Crear Usuario (para Login)

**POST** `http://localhost:3000/api/usuarios`

```json
{
    "nombreUsuario": "Admin Sistema",
    "email": "admin@seguros.com",
    "password": "admin123"
}
```

---

## 2. Crear Conductores

### Conductor 1 - Joven (19 años, 2 accidentes)
**POST** `http://localhost:3000/api/conductores`
```json
{
    "nombreConductor": "Ana Morales",
    "numeroLicenia": "LIC-004-2024",
    "fechaNacimiento": "2006-03-15",
    "numeroAccidentes": 2
}
```

### Conductor 2 - Estándar (35 años, sin accidentes)
**POST** `http://localhost:3000/api/conductores`
```json
{
    "nombreConductor": "Diana Torres",
    "numeroLicenia": "LIC-007-2024",
    "fechaNacimiento": "1990-08-22",
    "numeroAccidentes": 0
}
```

### Conductor 3 - Mayor (68 años, sin accidentes)
**POST** `http://localhost:3000/api/conductores`
```json
{
    "nombreConductor": "Pedro Ramírez",
    "numeroLicenia": "LIC-003-2024",
    "fechaNacimiento": "1957-11-05",
    "numeroAccidentes": 0
}
```

### Conductor 4 - Joven estándar (29 años, sin accidentes)
**POST** `http://localhost:3000/api/conductores`
```json
{
    "nombreConductor": "Luisa Gómez",
    "numeroLicenia": "LIC-12345",
    "fechaNacimiento": "1996-05-12",
    "numeroAccidentes": 0
}
```

### Conductor 5 - Muchos accidentes (45 años, 4 accidentes)
**POST** `http://localhost:3000/api/conductores`
```json
{
    "nombreConductor": "Carlos Fernández",
    "numeroLicenia": "LIC-005-2024",
    "fechaNacimiento": "1980-02-20",
    "numeroAccidentes": 4
}
```

---

## 3. Crear Vehículos

### Vehículo 1 - Sedán Personal (nuevo, valor medio)
**POST** `http://localhost:3000/api/vehiculos`
```json
{
    "marca": "Toyota",
    "modelo": "Corolla",
    "anio": 2023,
    "numeroPlaca": "ABC-1234",
    "tipo": "sedan",
    "uso": "personal",
    "valorComercial": 25000.00
}
```

### Vehículo 2 - SUV Comercial (2020, valor alto)
**POST** `http://localhost:3000/api/vehiculos`
```json
{
    "marca": "Ford",
    "modelo": "Explorer",
    "anio": 2020,
    "numeroPlaca": "XYZ-5678",
    "tipo": "SUV",
    "uso": "comercial",
    "valorComercial": 45000.00
}
```

### Vehículo 3 - Camioneta Personal (2015, valor medio)
**POST** `http://localhost:3000/api/vehiculos`
```json
{
    "marca": "Chevrolet",
    "modelo": "Silverado",
    "anio": 2015,
    "numeroPlaca": "DEF-9012",
    "tipo": "camioneta",
    "uso": "personal",
    "valorComercial": 32000.00
}
```

### Vehículo 4 - Sedán nuevo (2024, valor bajo)
**POST** `http://localhost:3000/api/vehiculos`
```json
{
    "marca": "Honda",
    "modelo": "Civic",
    "anio": 2024,
    "numeroPlaca": "GHI-3456",
    "tipo": "sedan",
    "uso": "personal",
    "valorComercial": 22000.00
}
```

---

## 4. Crear Cotizaciones (Casos de Prueba)

### Caso 1: Conductor Joven (19) + Sedán Personal + Con Accidentes
**Resultado Esperado:** Recargo por conductor joven + recargo por accidentes

**POST** `http://localhost:3000/api/cotizaciones`
```json
{
    "conductorId": 1,
    "usuarioId": 1,
    "vehiculoId": 1,
    "formaPago": "tarjeta_credito",
    "pagoEnCuotas": false,
    "aceptaTerminos": true
}
```

**Detalles del cálculo:**
- Conductor 19 años → Recargo 25% (conductor joven)
- 2 accidentes → Recargo 30% (15% x 2)
- Sedán personal → Costo base $500
- Valor vehículo $25,000 → +$125
- **Costo base:** $625
- **Recargos:** 55% ($343.75)
- **Costo final aproximado:** ~$968.75

---

### Caso 2: Conductor Estándar (35) + Sedán + Sin Accidentes
**Resultado Esperado:** Descuento por sin accidentes

**POST** `http://localhost:3000/api/cotizaciones`
```json
{
    "conductorId": 2,
    "usuarioId": 1,
    "vehiculoId": 4,
    "formaPago": "tarjeta_credito",
    "pagoEnCuotas": false,
    "aceptaTerminos": true
}
```

**Detalles del cálculo:**
- Conductor 35 años → Sin recargo (rango estándar)
- Sin accidentes → Descuento 10%
- Sedán personal → Costo base $500
- Valor vehículo $22,000 → +$110
- **Costo base:** $610
- **Descuento:** 10% ($61)
- **Costo final aproximado:** ~$549

---

### Caso 3: Conductor Mayor (68) + SUV Comercial
**Resultado Esperado:** Recargo por edad + recargo por uso comercial

**POST** `http://localhost:3000/api/cotizaciones`
```json
{
    "conductorId": 3,
    "usuarioId": 1,
    "vehiculoId": 2,
    "formaPago": "tarjeta_credito",
    "pagoEnCuotas": true,
    "numeroCuotas": 12,
    "aceptaTerminos": true
}
```

**Detalles del cálculo:**
- Conductor 68 años → Recargo 20% (edad avanzada)
- Sin accidentes → Descuento 10%
- SUV comercial → Costo base $750 + recargo comercial 30%
- Valor vehículo $45,000 → +$225
- Pago en cuotas → Recargo 15%
- **Costo base:** $975
- **Recargos:** 50% ($487.50)
- **Descuento:** 10%
- **Subtotal:** ~$1,365.75
- **Recargo cuotas 15%:** ~$1,570.61

---

### Caso 4: Muchos Accidentes (>3) - Requiere Revisión
**Resultado Esperado:** Estado "pendiente" por revisión manual

**POST** `http://localhost:3000/api/cotizaciones`
```json
{
    "conductorId": 5,
    "usuarioId": 1,
    "vehiculoId": 3,
    "formaPago": "tarjeta_credito",
    "pagoEnCuotas": false,
    "aceptaTerminos": true
}
```

**Detalles del cálculo:**
- Conductor 45 años → Sin recargo (rango estándar)
- 4 accidentes → **Estado: Pendiente (requiere revisión)**
- Camioneta personal → Costo base $800
- **Estado esperado:** "pendiente"
- **Advertencia:** "Más de 3 accidentes. Requiere revisión manual antes de aprobar."

---

### Caso 5: Pago Anual - Descuento
**Resultado Esperado:** Descuento por pago anual

**POST** `http://localhost:3000/api/cotizaciones`
```json
{
    "conductorId": 4,
    "usuarioId": 1,
    "vehiculoId": 1,
    "formaPago": "ANUAL",
    "pagoEnCuotas": false,
    "aceptaTerminos": true
}
```

**Detalles del cálculo:**
- Conductor 29 años → Sin recargo (rango estándar)
- Sin accidentes → Descuento 10%
- Pago anual → Descuento adicional 10%
- Sedán personal → Costo base $500
- **Descuento total:** ~20%

---

## 5. Casos de Rechazo Automático

### Caso: Conductor Menor de 18
```json
{
    "nombreConductor": "Menor Edad",
    "numeroLicenia": "LIC-MENOR",
    "fechaNacimiento": "2010-01-01",
    "numeroAccidentes": 0
}
```
**Al intentar cotizar:** ❌ "Conductor menor de 18 años. No se permite generar cotización."

---

### Caso: Conductor Mayor de 75
```json
{
    "nombreConductor": "Muy Mayor",
    "numeroLicenia": "LIC-MAYOR",
    "fechaNacimiento": "1945-01-01",
    "numeroAccidentes": 0
}
```
**Al intentar cotizar:** ❌ "Conductor mayor de 75 años. Cotización rechazada automáticamente."

---

### Caso: Vehículo Muy Antiguo (>20 años)
```json
{
    "marca": "Chevrolet",
    "modelo": "Cavalier",
    "anio": 2000,
    "numeroPlaca": "OLD-2000",
    "tipo": "sedan",
    "uso": "personal",
    "valorComercial": 5000.00
}
```
**Al intentar cotizar:** ❌ "Vehículo con más de 20 años de antigüedad. No puede ser cotizado."

---

## 6. Consultar Cotizaciones

### Obtener todas las cotizaciones
**GET** `http://localhost:3000/api/cotizaciones`

### Filtrar por estado
**GET** `http://localhost:3000/api/cotizaciones?estado=aprobada`
**GET** `http://localhost:3000/api/cotizaciones?estado=pendiente`

### Obtener una cotización específica con detalles
**GET** `http://localhost:3000/api/cotizaciones/1`

---

## 7. Login Frontend

Una vez creado el usuario, puedes acceder al frontend:

1. Ir a: `http://localhost:3001/auth/login`
2. Email: `admin@seguros.com`
3. Password: `admin123`

---

## Resumen de Reglas Aplicadas

| Regla | Condición | Efecto |
|-------|-----------|--------|
| **Conductor < 18** | Edad < 18 años | ❌ Cotización rechazada |
| **Conductor 18-24** | 18 ≤ Edad ≤ 24 | +25% recargo |
| **Conductor 25-65** | 25 ≤ Edad ≤ 65 | Estándar (sin recargo) |
| **Conductor 66-75** | 66 ≤ Edad ≤ 75 | +20% recargo |
| **Conductor > 75** | Edad > 75 | ❌ Cotización rechazada |
| **Sin accidentes** | Accidentes = 0 | -10% descuento |
| **1-3 accidentes** | 1 ≤ Accidentes ≤ 3 | +15% por accidente |
| **Más de 3 accidentes** | Accidentes > 3 | ⚠️ Revisión manual |
| **Uso comercial** | Uso = comercial | +30% recargo |
| **Vehículo > 20 años** | Antigüedad > 20 | ❌ No cotizable |
| **Pago anual** | formaPago = ANUAL | -10% descuento |
| **Pago en cuotas** | pagoEnCuotas = true | +15% recargo |
| **Sedán** | tipo = sedan | Base $500 |
| **SUV** | tipo = SUV | Base $750 |
| **Camioneta** | tipo = camioneta | Base $800 |

---

## Orden de Creación Recomendado

1. ✅ Crear usuario (para login)
2. ✅ Crear conductores (5 casos diferentes)
3. ✅ Crear vehículos (4 tipos diferentes)
4. ✅ Crear cotizaciones (probar cada caso)
5. ✅ Login en frontend
6. ✅ Ver listado de cotizaciones con todos los cálculos
