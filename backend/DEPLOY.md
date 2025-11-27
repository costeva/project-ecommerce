# Guía de Despliegue

## ⚠️ Nota Importante sobre Vercel

Vercel está optimizado para funciones serverless y aplicaciones Next.js. **NestJS no es ideal para Vercel** porque:
- NestJS es una aplicación de Node.js de larga duración
- Vercel funciona mejor con funciones serverless sin estado
- Puede haber problemas de conexión a la base de datos con el pooling de conexiones

## Alternativas Recomendadas

### 1. Railway (Recomendado) 🚂

**Railway** es excelente para NestJS y tiene soporte nativo para PostgreSQL.

1. Ve a [railway.app](https://railway.app)
2. Inicia sesión con GitHub
3. Click en "New Project"
4. Selecciona "Deploy from GitHub repo"
5. Elige tu repositorio `project-ecommerce`
6. Railway detectará automáticamente que es un proyecto Node.js
7. Add una nueva base de datos PostgreSQL (o conecta tu Neon)
8. Agrega las variables de entorno en Settings > Variables:
   ```
   DATABASE_HOST=${{Postgres.PGHOST}}
   DATABASE_PORT=${{Postgres.PGPORT}}
   DATABASE_USER=${{Postgres.PGUSER}}
   DATABASE_PASS=${{Postgres.PGPASSWORD}}
   DATABASE_NAME=${{Postgres.PGDATABASE}}
   ```
9. Click en "Deploy"

### 2. Render 🎨

**Render** es otra excelente opción.

1. Ve a [render.com](https://render.com)
2. Inicia sesión con GitHub
3. Click en "New +" > "Web Service"
4. Conecta tu repositorio de GitHub
5. Configura:
   - **Name**: ecommerce-api
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`
6. En "Environment Variables", agrega todas las variables de tu `.env`
7. Click en "Create Web Service"

### 3. Fly.io 🪰

Fly.io es otra opción confiable:

1. Instala el CLI: `npm install -g @fly/cli`
2. Login: `flyctl auth login`
3. Crear app: `flyctl launch`
4. Configurar variables de entorno: `flyctl secrets set DATABASE_HOST=...`

## Si Aún Quieres Usar Vercel

Si decides usar Vercel de todos modos:

1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con GitHub
3. Importa tu repositorio
4. En "Environment Variables", agrega:
   - `DATABASE_HOST`: ep-super-bonus-acq75809-pooler.sa-east-1.aws.neon.tech
   - `DATABASE_PORT`: 5432
   - `DATABASE_USER`: neondb remains the same
   - `DATABASE_PASS`: tu contraseña
   - `DATABASE_NAME`: neondb
   - `PORT`: 3000
5. Click en "Deploy"

**Nota**: Es posible que necesites usar el conector de Neon para Vercel para mejor compatibilidad.

