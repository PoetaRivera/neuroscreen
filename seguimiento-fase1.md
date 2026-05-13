# Seguimiento Fase 1 — NeuroScreen MVP

## Estado actual: 9 tests + 5 features + testing

### Tests de screening

| # | Test | testId | Tipo | Ítems | Máx | Categorías |
|---|---|---|---|---|---|---|
| 1 | TDAH Adulto | `tdah-adult-v2` | Likert | 16 (A8/B3/C5) | 64 | baja / moderada / alta probabilidad |
| 2 | TEA Adulto | `tea-adult-v1` | Likert | 16 (A4×4) | 64 | baja / moderada / alta probabilidad |
| 3 | Alta Sensibilidad | `hsp-adult-v1` | Likert | 16 (A4×4) | 64 | promedio / moderada / marcada sensibilidad |
| 4 | Alexitimia | `alexitimia-adult-v1` | Likert | 16 (A4×4) | 64 | baja / moderada / marcada alexitimia |
| 5 | RSD | `rsd-adult-v1` | Likert | 16 (A4×4) | 64 | baja / moderada / marcada RSD |
| 6 | Burnout por Masking | `burnout-masking-v1` | Likert | 13 (A4/B3/C2/D4) | 52 | bajo / moderado / severo |
| 7 | Funciones Ejecutivas | `funciones-ejecutivas-v1` | Likert | 18 (A4/B5/C5/D4) | 72 | preservadas / moderadas / significativas |
| 8 | DAT | `dat-v1` | Tarea | 1 tarea (10 palabras) | 100 | convergente / moderadamente-divergente / altamente-divergente |
| 9 | Fluencia Verbal (FAS) | `fas-v1` | Tarea | 1 tarea (60s crono) | ~30+ | baja / moderada / alta fluidez |

### Features implementadas

| # | Feature | Ruta | Descripción |
|---|---|---|---|
| 1 | Mapa de Funcionamiento | `/perfil` | Dashboard combinado, barras normalizadas, fortalezas/áreas/estrategias |
| 2 | Notas de complementariedad | ResultsView | 5 reglas entre tests (TDAH+RSD, TEA+Alexitimia, HSP+RSD, TDAH+TEA, TEA+HSP) |
| 3 | Historias de Adaptación | `/historias` | 2 historias narrativas con perfil matching |
| 4 | Exportación PDF | ResultsView + ProfileMap | jsPDF texto plano |
| 5 | Mejoras DAT | DatInput | Instrucciones anti-narrativa, detección misma categoría, warning específico |

### Testing

| Suite | Tipo | Framework | Tests | Estado |
|---|---|---|---|---|
| Unitarios (scoring) | Unit | Vitest | 71 | 71 pass, 0 fail |
| E2E (flujos completos) | E2E | Playwright | 31 | 28 pass, 3 skip, 0 fail |

```
npm run test:unit   # 71 tests de scoring (<1s)
npm run test:e2e    # 31 tests de flujo (~10s)
npm test            # alias para test:unit
```

### Cobertura de tests unitarios por scoring

| Función | Tests | Verifica |
|---|---|---|
| `calculateTdahScore` | 8 | Ceros, máx, umbrales 16/6/10, categorías ≤22/≤36/>36, perfiles, dimensiones, maxScores |
| `calculateTeaScore` | 6 | Umbral social ≥8 (masking), resto ≥9, perfiles, childhoodNote |
| `calculateHspScore` | 5 | Categorías HSP, umbral ≥9, 20-30%, temperamento |
| `calculateAlexithymiaScore` | 4 | Categorías sin "probabilidad", childhoodNote TEA |
| `calculateRsdScore` | 4 | Perfiles, boundary ≤40, nota TDAH+TEA |
| `calculateMaskingBurnoutScore` | 6 | 13 ítems, máx 52, dims irregulares (16/12/8/16), umbrales |
| `calculateExecutiveScore` | 6 | 18 ítems, máx 72, dims irregulares (16/20/20/16), umbrales |
| `calculateDatScore` | 7 | <7 error, convergente/divergente, pares ordenados, distancias fijas |
| Interfaz unificada | 24 | 8 funciones × 3 asserts: estructura, descripción, childhoodNote |

### Cobertura de tests e2e por flujo

| Suite | Tests | Cubre |
|---|---|---|
| HomePage | 5 | Render, 9 cards, metadatos, navegación |
| Likert flow | 8 | Disclaimer, navegación, Anterior, validación, localStorage, TEA/EF/Burnout |
| DAT flow | 6 | Input, validación, ejemplos, misma categoría, cálculo |
| FAS flow | 3 | Letra, cronómetro, validación |
| Profile + Nav + PDF | 8 | Estado vacío, sessionStorage, rutas, historias, PDF |

### Despliegue

| Servicio | URL |
|---|---|
| Producción | https://neuroscreen-app.web.app |
| Firebase Console | https://console.firebase.google.com/project/neuroscreen-app |
| GitHub | https://github.com/PoetaRivera/neuroscreen |

### Arquitectura final

```
src/
├── data/ (11 archivos)
│   ├── index.js                    ← Registro: 9 tests
│   ├── tdahQuestions.js            ← 16 ítems
│   ├── teaQuestions.js             ← 16 ítems
│   ├── hspQuestions.js             ← 16 ítems
│   ├── alexithymiaQuestions.js     ← 16 ítems
│   ├── rsdQuestions.js             ← 16 ítems
│   ├── burnoutMaskingQuestions.js  ← 13 ítems
│   ├── executiveQuestions.js       ← 18 ítems
│   ├── datConfig.js                ← Instrucciones, ejemplos, categorías semánticas
│   ├── fasConfig.js                ← Letras, reglas, categorías FAS
│   └── adaptationStories.js        ← 2 historias + perfil matching
├── utils/ (5 archivos)
│   ├── scoring.js                  ← 8 funciones de puntuación
│   ├── scoring.test.js             ← 71 tests unitarios
│   ├── wordValidation.js           ← Validación de palabras DAT
│   ├── sessionResults.js           ← Persistencia + reglas complementariedad
│   └── pdfExport.js                ← Exportación PDF con jsPDF
├── components/
│   ├── Test/ (10 archivos)
│   │   ├── TestContainer.jsx       ← Orquestador: Likert + DAT + FAS
│   │   ├── QuestionCard.jsx        ← Pregunta Likert + ejemplos
│   │   ├── DatInput.jsx            ← Input palabras + chips + validación
│   │   ├── FasTask.jsx             ← Cronómetro 60s + input palabras
│   │   ├── ResultsView.jsx         ← Resultados: 21 categorías + DAT/FAS
│   │   ├── ExamplesAccordion.jsx
│   │   ├── SectionHeader.jsx
│   │   ├── InstructionsBanner.jsx
│   │   ├── ProgressBar.jsx
│   │   └── TestContainer.css
│   ├── Common/DisclaimerModal.jsx
│   ├── Profile/ProfileMap.jsx      ← Dashboard combinado
│   ├── Stories/AdaptationStoriesPage.jsx
│   ├── Layout/Layout.jsx
│   ├── HomePage.jsx                ← 9 cards + enlaces perfil/historias
│   └── RecursosPage.jsx
├── hooks/useTestSubmission.js      ← Firestore + sessionStorage
├── firebase/config.js
├── App.jsx                         ← 6 rutas
└── main.jsx
```

### Rutas

| Ruta | Página |
|---|---|
| `/` | HomePage (9 cards + enlaces) |
| `/test/:testId` | 9 tests (7 Likert + DAT + FAS) |
| `/perfil` | Mapa de Funcionamiento |
| `/historias` | Historias de Adaptación |
| `/recursos` | Recursos y ayuda profesional |

### Pendiente

1. Firebase Firestore: credenciales reales en `.env` + reglas + colección `responses`
2. Rate limiting en Firestore
3. Directorio profesional real en `/recursos`
4. Metaetiquetas noindex + robots.txt
5. i18n (multi-idioma)
6. Modo oscuro (`prefers-color-scheme`)
7. Tipografía opcional para dislexia (OpenDyslexic)
8. Favicon personalizado
9. Code splitting (bundle >500KB)
10. Span de Dígitos (tarea interactiva de memoria de trabajo)
