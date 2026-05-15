# EvaluMind

EvaluMind es una aplicación React/Vite para screening orientativo de rasgos cognitivos y neurodivergentes en adultos. Combina cuestionarios de auto-observación con tareas interactivas breves, un mapa de funcionamiento, notas de complementariedad y exportación a PDF.

## Estado

El sistema está desplegado en producción y actualmente se encuentra en fase de pruebas. Los resultados son orientativos: no constituyen diagnóstico médico, psicológico ni neuropsicológico.

## Privacidad

- No se solicita nombre, correo, teléfono ni identificadores personales.
- El mapa de funcionamiento se conserva en `sessionStorage` y desaparece al cerrar la pestaña.
- Si Firebase está configurado, se envía una copia anónima de respuestas y métricas a Firestore para análisis agregado.
- Las reglas de Firestore bloquean lecturas desde cliente, no permiten updates/deletes y restringen el esquema permitido en `responses`.

## Scripts

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
npm run test:e2e
```

## Variables de entorno

Copia `.env.example` a `.env` y configura:

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Si Firebase no está configurado, la app sigue funcionando con resultados locales de sesión.

## Verificación Recomendada

Antes de publicar cambios:

```bash
npm run lint
npm test
npm run build
npm run test:e2e -- --workers=1
```

La suite e2e contiene algunos casos `skip` para flujos de inyección/atajos que no forman parte de la cobertura estable actual.

## Despliegue

El build genera `dist/`, usado por Firebase Hosting. `firebase.json` incluye rewrites SPA, headers de seguridad y CSP compatible con Firebase/Google Fonts.
