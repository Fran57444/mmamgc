# Massive Model: A Miracle Growing Constantly

Reproductor de musica construido con React, Vite, Express y MongoDB.
Codeado localmente, primer push despues del cambio.

## Desarrollo local

1. Instala Node.js 20 o superior.
2. Instala dependencias con `npm install`.
3. Copia `.env.example` como `.env` y completa sus valores.
4. Ejecuta `npm run dev`.

La aplicación estará disponible en `http://localhost:5163` y la API local en `http://localhost:5000`.

## Variables de entorno

`MONGO_URI` conecta la API con MongoDB.

`DRIVE_FOLDER_ID`, `GOOGLE_OAUTH_CREDENTIALS_JSON` y `GOOGLE_OAUTH_TOKEN_JSON` habilitan el almacenamiento de archivos en Google Drive.

`VITE_API_URL` es opcional. Déjalo vacío para usar `/api` en Vercel o configúralo como `http://localhost:5000/api` en un entorno local separado.

Nunca subas `.env`, `token.json` ni `oauth-credentials.json` al repositorio.

## Validación

```bash
npm run lint
npm run build
```

## Vercel

El proyecto incluye `vercel.json` y expone la API mediante `api/index.js`. Configura en Vercel las mismas variables privadas de `.env` y despliega la rama principal.
