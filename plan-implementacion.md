# Plan de Implementación — EvaluMind (Correcciones Post-Evaluación)

## Contexto
Evaluación profesional completa (5 agentes en paralelo) encontró 36 issues: 6 críticos, 14 altos, 10 medios, 6 bajos. Este plan cubre todas las correcciones organizadas en 5 fases por prioridad y dependencias.

---

## Fase 1: Seguridad y protección de datos (CRÍTICO)

### 1.1 Crear `firestore.rules`
- **Archivo nuevo:** `firestore.rules`
- Reglas: bloquear lecturas, solo permitir `create` con campos requeridos (`testId`, `sessionId`, `createdAt`, `responses`), validar tipos
- Actualizar `firebase.json` para referenciar el archivo de reglas

### 1.2 Eliminar `userAgent` del payload de Firestore
- **Archivo:** `src/hooks/useTestSubmission.js:25`
- Eliminar línea `userAgent: navigator.userAgent`
- Reduce riesgo de fingerprinting

### 1.3 Agregar rate limiting básico en el cliente
- **Archivo:** `src/hooks/useTestSubmission.js`
- Agregar `useRef` flag `isSubmitting` para prevenir envíos duplicados
- Debounce de 2 segundos entre submissions del mismo testId+sessionId

### 1.4 Agregar validación de configuración Firebase
- **Archivo:** `src/firebase/config.js`
- Validar que las variables de entorno requeridas existan antes de inicializar
- Exportar `db` como null si no están configuradas (evita crash en init)

---

## Fase 2: Bugs funcionales (CRÍTICO)

### 2.1 Corregir normalización de dimensiones en ProfileMap
- **Archivos:**
  - `src/utils/sessionResults.js` — modificar `saveCompletedTest` para guardar `maxScores` y `max` por dimensión
  - `src/components/Profile/ProfileMap.jsx` — usar `dim.max` guardado en vez de hardcodear 16
- **Impacto:** Barras, fortalezas, áreas de esfuerzo y estrategias ahora usan porcentajes correctos para Burnout Masking (max 12/8) y Ejecutivas (max 20)

### 2.2 Eliminar hardcodeo de maxScores para PDF en ProfileMap
- **Archivo:** `src/components/Profile/ProfileMap.jsx:292-311`
- Leer `maxScores` y `max` por dimensión desde los datos guardados en sessionStorage (ya corregido en 2.1)
- Eliminar el objeto gigante de maxScores hardcodeados

### 2.3 Corregir `position: relative` en progress bar
- **Archivo:** `src/components/Test/TestContainer.css`
- Agregar `position: relative` a `.progress-bar-wrapper`
- Cambiar color del texto a `#fff` con `text-shadow` para legibilidad sobre el fill azul

### 2.4 Agregar estilos de foco visibles en radio buttons Likert
- **Archivo:** `src/components/Test/TestContainer.css`
- Agregar `.likert-label:focus-within { outline: 3px solid #4a90d9; outline-offset: 2px; }`
- Agregar `:focus-visible` global para botones y links en `index.css`

### 2.5 Extraer factory function para scoring Likert
- **Archivo:** `src/utils/scoring.js`
- Crear `createLikertScorer(config)` que reciba `{ dimensions, thresholds, categoryRules, profiles, childhoodNote }`
- Reimplementar las 7 funciones Likert como llamadas a la factory
- **Cuidado:** Mantener exactamente los mismos thresholds y comportamiento

### 2.6 Agregar Error Boundary
- **Archivo nuevo:** `src/components/Common/ErrorBoundary.jsx`
- Implementar `componentDidCatch` con fallback UI amigable
- Envolver rutas en `App.jsx` con `<ErrorBoundary>`

---

## Fase 3: Seguridad y estructura (ALTO)

### 3.1 Agregar headers de seguridad en firebase.json
- **Archivo:** `firebase.json`
- Agregar CSP, X-Content-Type-Options, X-Frame-Options, Strict-Transport-Security

### 3.2 Extraer scoring de FAS a util separado
- **Archivo nuevo:** `src/utils/fasScoring.js`
- Mover lógica de `finishTask()` (FasTask.jsx:79-131) a función `calculateFasScore(words, letter)`
- Agregar tests unitarios para FAS scoring
- Actualizar `FasTask.jsx` para usar la nueva función

### 3.3 Agregar ruta 404
- **Archivo nuevo:** `src/components/Common/NotFound.jsx`
- **Archivo:** `src/App.jsx` — agregar `<Route path="*" element={<NotFound />} />`

### 3.4 Mejorar sistema de complementariedad
- **Archivo:** `src/utils/sessionResults.js`
- Cambiar `rule.id` parsing: definir campo `tests: ['tdah-adult-v2', 'rsd-adult-v1']` en vez de inferir del ID
- Agregar 4 reglas nuevas: RSD+Burnout, Ejecutivas+TDAH, Ejecutivas+TEA, Alexitimia+Burnout

### 3.5 Agregar code splitting con React.lazy
- **Archivo:** `src/App.jsx`
- `React.lazy()` para RecursosPage, ProfileMap, AdaptationStoriesPage, NotFound
- Envolver en `<Suspense fallback={<Loading />}>`

### 3.6 Agregar React.memo donde corresponda
- **Archivos:** `QuestionCard.jsx`, `ExamplesAccordion.jsx`, `StoryCard` (inline en AdaptationStoriesPage)
- Solo donde los props son estables entre renders

### 3.7 Corregir contrastes WCAG AA
- **Archivo:** `src/components/Test/TestContainer.css`
- `.test-nav-hint`: `#999` → `#666`
- `.test-card-info`: `#888` → `#555`
- `.results-saving`/`.results-saved`: usar color más oscuro
- `.results-profiles li`: `#2c6faa` → `#1a5276`

### 3.8 Agregar focus trap y Escape al modal
- **Archivo:** `src/components/Common/DisclaimerModal.jsx`
- `useEffect` para atrapar foco dentro del modal
- `onKeyDown` para cerrar con Escape
- `autoFocus` en el checkbox al abrir

### 3.9 Mover static objects fuera del componente
- **Archivo:** `src/components/Test/ResultsView.jsx:110-160`
- Mover `categoryLabels` y `categoryColors` a nivel módulo (fuera del componente)
- Envolver `getComplementarityNotes` en `useMemo`

---

## Fase 4: CSS y estilos (MEDIO)

### 4.1 Introducir CSS custom properties
- **Archivo:** `src/index.css`
- Definir `:root` con `--color-primary: #4a90d9`, `--color-dark: #1a1a2e`, `--color-text: #222`, `--color-text-muted: #555`, etc.
- Reemplazar ocurrencias hardcodeadas en todos los CSS

### 4.2 Mover estilos inline a archivos CSS
- **Archivos nuevos:** `DatInput.css`, `FasTask.css`, `ResultsView.css`, `ProfileMap.css`, `AdaptationStories.css`
- **Archivos a modificar:** `DatInput.jsx`, `FasTask.jsx`, `ResultsView.jsx`, `ProfileMap.jsx`, `AdaptationStoriesPage.jsx`
- Reemplazar `style={{...}}` con `className` en todos los componentes

### 4.3 Agregar breakpoint tablet (~768px)
- **Archivo:** `src/components/Test/TestContainer.css`
- Agregar `@media (max-width: 768px)` para layouts intermedios

### 4.4 Mover estilos de página fuera de index.css
- **Archivos nuevos:** `HomePage.css`, `RecursosPage.css`
- **Archivo:** `src/index.css` — eliminar `.home-page`, `.tests-grid`, `.test-card`, `.recursos-page`, `.recursos-section`
- **Archivos:** `HomePage.jsx`, `RecursosPage.jsx` — importar nuevos CSS

### 4.5 Mover responsive del header a Layout.css
- **Archivo:** `TestContainer.css:473-476` — eliminar reglas `.app-header`
- **Archivo:** `Layout.css` — agregar reglas responsive del header

---

## Fase 5: HTML, SEO y testing (MEDIO-BAJO)

### 5.1 Mejorar index.html
- **Archivo:** `index.html`
- Cambiar `lang="en"` → `lang="es"`
- Agregar `meta name="description"`
- Agregar Open Graph tags
- Agregar title descriptivo: "EvaluMind — Screening orientativo de neurodivergencia"

### 5.2 Agregar robots.txt
- **Archivo nuevo:** `public/robots.txt`

### 5.3 Agregar favicon
- **Archivo:** `public/favicon.svg` (SVG simple con "NS" o icono cerebro)

### 5.4 Mejorar tests E2E
- **Archivo:** `e2e/helpers.js` — reemplazar `dispatchEvent('click')` por `click()` de Playwright
- **Archivos:** `e2e/*.spec.js` — reemplazar `waitForTimeout` con condiciones específicas
- Quitar `force: true` de clicks excepto donde sea absolutamente necesario
- Agregar `page.route()` para simular llamadas a Firestore
- Agregar proyecto Firefox + WebKit en `playwright.config.js`

### 5.5 Agregar tests unitarios faltantes
- **Archivos nuevos:** `src/utils/wordValidation.test.js`, `src/utils/sessionResults.test.js`, `src/utils/fasScoring.test.js`
- Word validation: nombres propios, verbos, duplicados, bloqueadas
- Session results: reglas complementariedad, save/load/clear
- FAS scoring: fluidez, flexibilidad, perseveración, categorías

### 5.6 Correcciones menores
- **Archivo:** `src/utils/scoring.js:7` — eliminar función `round` no usada
- **Archivo:** `src/utils/scoring.js:352-423` — nombrar constantes mágicas DAT (`DISTANCE_*`, `RAW_SCORE_FACTOR`, `CONSISTENCY_FACTOR`)
- **Archivo:** `src/components/Test/DatInput.jsx` — agregar `aria-hidden="true"` a emojis
- **Archivo:** `src/components/Test/FasTask.jsx` — usar `Date.now()` para timer preciso
- **Archivo:** `src/components/Test/ResultsView.jsx` — agregar `aria-live="polite"` a mensajes de estado
- **Archivo:** `src/components/Test/SectionHeader.jsx` — eliminar `role="heading"` redundante del div
- **Archivo:** `src/components/Test/InstructionsBanner.jsx` — eliminar conflicto `role="alert"` + `aria-live="polite"`
- **Archivo:** `src/components/Profile/ProfileMap.jsx` — reemplazar `window.location.reload()` por `navigate('/')`
- **Archivo:** `src/components/Profile/ProfileMap.jsx` — agregar `role="progressbar"` a barras de dimensión
- **Archivo:** `src/components/Common/DisclaimerModal.jsx` — alinear `aria-label` del checkbox con texto visible
- **Archivo:** `src/components/Layout/Layout.jsx` — cambiar `<Link><h1>` a `<h1><Link>` y usar `NavLink` con `aria-current`
- **Archivo:** `src/index.css` — eliminar `'Segoe UI'` redundante del font-family

---

## Verificación

Después de cada fase:
1. `npm run test:unit` — verificar que 71+ tests pasan
2. `npm run test:e2e` — verificar que 28+ tests pasan (más los nuevos)
3. `npm run build` — verificar que el build no tiene errores
4. `npm run dev` — verificar visualmente flujos clave (Likert, DAT, FAS, Perfil)
