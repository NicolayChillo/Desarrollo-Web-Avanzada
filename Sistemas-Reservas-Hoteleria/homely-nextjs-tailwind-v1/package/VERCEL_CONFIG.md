# Configuración de Variables de Entorno en Vercel

Para que tu aplicación funcione correctamente en Vercel, necesitas configurar las siguientes variables de entorno:

## Variables Requeridas

Ve a tu proyecto en Vercel → Settings → Environment Variables y agrega:

### 1. NEXTAUTH_URL
- **Valor**: La URL de tu aplicación en Vercel
- **Ejemplo**: `https://tu-proyecto.vercel.app`
- **Importante**: Debe ser la URL exacta de tu deploy en Vercel

### 2. NEXTAUTH_SECRET
- **Valor**: Una cadena aleatoria y secreta
- **Generación**: Puedes generarla ejecutando en terminal:
  ```bash
  openssl rand -base64 32
  ```
  O usa: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- **Ejemplo**: `aB3dEf9hIjKlMnOpQrStUvWxYz1234567890aBcDeF=`

### 3. NEXT_PUBLIC_API_URL
- **Valor**: La URL de tu backend en Render
- **Ejemplo**: `https://tu-backend.onrender.com`
- **Importante**: Esta es la URL de tu API en Render (sin barra final)

## Pasos para configurar en Vercel:

1. Ve a [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **Environment Variables**
4. Agrega cada variable con su valor
5. Selecciona los ambientes: **Production**, **Preview**, y **Development**
6. Guarda los cambios
7. Ve a **Deployments** y haz **Redeploy** para aplicar las variables

## Verificación

Después del redeploy, tu aplicación debería funcionar sin el error de NextAuth.

## Notas Importantes:

- ✅ No incluyas barras finales (/) en las URLs
- ✅ Las variables que inician con `NEXT_PUBLIC_` son visibles en el cliente
- ✅ `NEXTAUTH_SECRET` debe ser diferente en producción que en desarrollo
- ✅ Después de cambiar variables, siempre haz un redeploy
