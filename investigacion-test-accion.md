# Investigación: Complementos de Acción para EvaluMind

## Objetivo
Complementar los 7 tests Likert existentes con tareas conductuales/de rendimiento que midan objetivamente los mismos constructos, permitiendo comparar auto-reporte vs. rendimiento real.

---

## Hallazgo científico fundamental

**El auto-reporte y las medidas de rendimiento miden constructos diferentes.**

Toplak, West & Stanovich (2013, *Journal of Child Psychology and Psychiatry*) — metaanálisis de 20 estudios:
- Solo 24% de las correlaciones entre auto-reporte y tests de rendimiento fueron significativas
- **Correlación mediana: r = 0.19**
- Conclusión: "Evalúan constructos mentales subyacentes diferentes"

**Implicación práctica:** Nunca combinar en un solo score. Mostrar lado a lado. La discrepancia entre ambos ES la señal diagnóstica valiosa.

---

## Estado actual de EvaluMind

| # | Test | Tipo actual | ¿Tiene complemento de acción? |
|---|------|-------------|-------------------------------|
| 1 | TDAH | Likert 16 ítems | ❌ No |
| 2 | TEA | Likert 16 ítems | ❌ No |
| 3 | HSP | Likert 16 ítems | ❌ No |
| 4 | Alexitimia | Likert 16 ítems | ❌ No |
| 5 | RSD | Likert 16 ítems | ❌ No |
| 6 | Burnout Masking | Likert 13 ítems | ❌ No |
| 7 | F. Ejecutivas | Likert 18 ítems | ❌ No |
| 8 | DAT | **Tarea de acción** | ✅ Ya es conductual |
| 9 | FAS | **Tarea de acción** | ✅ Ya es conductual |

---

## Propuestas por test

### 1. TDAH — Complemento: SART + Flanker

**SART (Sustained Attention to Response Task)** — 6-8 min
- Paradigma: Dígitos 1-9 aparecen secuencialmente. Presionar tecla para TODOS excepto el "3" (10% de ensayos).
- Mide: Atención sostenida + inhibición de respuesta prepotente
- Métricas: Errores de comisión (fallos de inhibición), errores de omisión (lapsos atencionales), variabilidad de tiempo de reacción (RTV)
- Validez: Kang et al. validaron versión web vs laboratorio. El RTV es marcador endofenotípico de TDAH
- Browser: ✅ Implementación simple en React. Teclado como input. Sin dependencias externas.

**Flanker Task** — 8-10 min
- Paradigma: Flecha central entre distractores (<<><< vs <<<<<). Responder dirección de la flecha central.
- Mide: Control de interferencia atencional (inhibición)
- Métricas: Efecto Flanker (RT incongruente - RT congruente), precisión
- Validez: NIH Toolbox lo incluye para TDAH. Solomon et al. (2021) validaron en autismo y TDAH.
- Browser: ✅ Plugin jsPsych existente (`@jspsych/plugin-flanker`). O React con arrow keys.
- **Cubre dimensiones:** Inatención (SART), Impulsividad (errores comisión), Hiperactividad (variabilidad RT)

**Cálculo de score combinado TDAH:**
```
Self-report Likert → probabilidad (baja/moderada/alta)
SART → errores comisión + RTV → z-score vs normas
Flanker → efecto interferencia → z-score vs normas
Discrepancia → |z_likert - z_accion| > 1.0 SD → flag
```

---

### 2. TEA — Complemento: RMET + Navon

**RMET (Reading the Mind in the Eyes)** — 10-12 min
- Paradigma: 36 fotos de región ocular. Elegir entre 4 opciones el estado mental.
- Mide: Teoría de la mente / cognición social
- Métricas: Aciertos totales (0-36). Media normativa ~26/36 (SD ~3.5)
- Validez: Szczypinski et al. (2020), Livingston et al. (2024). Correlaciona negativamente con AQ.
- Browser: ✅ Presentación de imágenes + selección múltiple. Banco de imágenes necesario (Radboud Faces Database con licencia académica).
- **Cubre dimensiones:** Comunicación social (reconocimiento de estados mentales), Relaciones (interpretación de señales sociales sutiles)

**Navon Hierarchical Figures** — 8-10 min
- Paradigma: Letras grandes compuestas de letras pequeñas. Identificar nivel global o local.
- Mide: Procesamiento local vs global (coherencia central débil en TEA)
- Métricas: Efecto de precedencia global, efecto de interferencia, sesgo local
- Validez: L-POST (Torfs et al., 2014) validó versión online. Ju et al. (2023) en tableta.
- Browser: ✅ Canvas HTML5. Figuras generadas proceduralmente.
- **Cubre dimensiones:** Sensorial/intereses (procesamiento perceptual detallado), Rutinas/flexibilidad (cambio de set perceptual)

**Cálculo de score combinado TEA:**
```
Self-report Likert → probabilidad (baja/moderada/alta)
RMET → aciertos → z-score
Navon → sesgo local → z-score
Si self-report alto + RMET bajo → masking improbable (déficit medible)
Si self-report alto + RMET normal/alto → posible masking compensatorio
```

---

### 3. HSP — Complemento: Detección en Ruido + Distracción Auditiva

**Nota:** No existen tareas conductuales validadas para HSP. Esto sería investigación original.

**Detección de Señal en Ruido Visual** — 8-10 min
- Paradigma: Detectar un cuadrado objetivo entre ruido visual dinámico progresivo (método de escalera adaptativa).
- Mide: Umbral sensorial (LST — Low Sensory Threshold)
- Métricas: Umbral de detección (intensidad de ruido donde la señal se vuelve detectable)
- Hipótesis: PAS (Personas Altamente Sensibles) detectan la señal con más ruido (umbral más bajo)
- Browser: ✅ Canvas HTML5 con generación procedural de ruido.
- **Cubre dimensiones:** Sensibilidad sensorial, Sobrestimulación

**Tarea de Distracción Auditiva** — 8-12 min
- Paradigma: Tarea visual principal (detección de cambio de color) con distractores auditivos variables.
- Mide: Susceptibilidad a la sobrestimulación (EOE — Ease of Excitation)
- Métricas: Costo de distracción (diferencia RT entre condiciones con/sin ruido)
- Hipótesis: PAS muestran mayor costo de distracción, especialmente con ruido social (voces)
- Browser: ✅ Web Audio API para generar tonos/ruido blanco/voces.
- **Cubre dimensiones:** Procesamiento profundo (costo atencional), Sobrestimulación

**Cálculo de score combinado HSP:**
```
Self-report Likert → sensibilidad (promedio/moderada/marcada)
Umbral sensorial → inverso del umbral → z-score
Costo distracción → RT_ruido - RT_silencio → z-score
Si ambos altos → perfil HSP validado conductualmente
```

---

### 4. Alexitimia — Complemento: Reconocimiento Emocional Facial

**FER (Facial Emotion Recognition)** — 8-12 min
- Paradigma: 60 fotos de rostros expresando 6 emociones básicas + neutro. Identificar la emoción.
- Mide: Capacidad de identificar emociones en otros (déficit central en alexitimia)
- Métricas: Precisión global (0-60), precisión por emoción, matriz de confusión, RT
- Efecto específico: Alexitimia reduce precisión para tristeza, miedo, ira. La alegría se preserva.
- Validez: Prikachin et al. (2009), meta-análisis de 20+ estudios. Efecto robusto.
- Browser: ✅ Imágenes + botones de selección. KDEF o Radboud Faces Database.
- **Cubre dimensiones:** Identificación emocional (reconocer emociones), Descripción emocional (etiquetado correcto)

**Vocabulario Emocional** — 8-12 min (opcional, complementa al FER)
- Paradigma: 15-20 escenarios emocionales. Seleccionar la emoción más específica de una lista de 20-40 términos.
- Mide: Granularidad emocional (diferenciación entre emociones similares)
- Métricas: Puntuación de especificidad (0-2 por escenario), rango de vocabulario
- Browser: ✅ React form con dropdown/type-ahead de emociones.

**Cálculo de score combinado Alexitimia:**
```
Self-report Likert → alexitimia (baja/moderada/marcada)
FER → precisión global y por emoción → z-score
Si self-report alto + FER bajo → alexitimia confirmada conductualmente
Si self-report alto + FER normal → posible sesgo de auto-percepción (la persona cree que no identifica emociones pero sí puede)
Si self-report bajo + FER bajo → alexitimia no consciente (la persona no sabe que tiene déficit)
```

---

### 5. RSD — Complemento: Escenarios Sociales Ambiguos

**Ambiguous Social Scenarios Task** — 8-12 min
- Paradigma: 16 escenarios sociales ambiguos breves. Para cada uno: elegir interpretación (rechazo vs. benigna), calificar impacto emocional (1-5), calificar probabilidad de cada interpretación (0-100%).
- Ejemplo: "Un colega no te saluda al pasar por el pasillo." → ¿Te está evitando o estaba distraído?
- Mide: Sesgo de interpretación hacia el rechazo
- Métricas: Proporción de interpretaciones de rechazo, impacto emocional medio, latencia de respuesta
- Efecto: Tamaños de efecto grandes (d = 0.6-1.0) entre RSD alta y sesgo de interpretación
- Validez: Downey & Feldman (1996, validación original RSQ), Romero-Canyas et al. (2010, revisión meta-analítica)
- Browser: ✅ React form simple con escenarios y escalas Likert. Sin dependencias de tiempo.
- **Cubre dimensiones:** Percepción de rechazo, Intensidad emocional, Rumia, Evitación anticipatoria

**Rejection Word Stroop** — 6-9 min (opcional)
- Paradigma: Stroop clásico (nombrar color de tinta) con palabras de rechazo, negativas generales, y neutras.
- Mide: Sesgo atencional automático hacia señales de rechazo
- Métricas: Índice de interferencia por rechazo (RT_rechazo - RT_neutro)
- Browser: ✅ React con teclas de colores.

**Cálculo de score combinado RSD:**
```
Self-report Likert → RSD (baja/moderada/marcada)
Escenarios → proporción interpretaciones rechazo → z-score
Si self-report alto + sesgo alto → RSD confirmada (percibe + reporta)
Si self-report bajo + sesgo alto → RSD no consciente
Si self-report alto + sesgo bajo → posible hipervigilancia auto-reportada sin sesgo automático
```

---

### 6. Burnout por Masking — Complemento: Auto-Discrepancia

**Self-Discrepancy Task** — 6-8 min
- Paradigma: 20-25 adjetivos de personalidad. Para cada uno: calificar "cuánto muestras esto en público/trabajo" (1-7) y "cuánto sientes que realmente eres así" (1-7).
- Mide: Brecha entre el yo auténtico y el yo presentado (masking)
- Métricas: Discrepancia global (media de |público - privado|), esfuerzo de supresión, dominios específicos
- Efecto: r = 0.4-0.6 entre discrepancia y burnout por masking
- Validez: Cage et al. (2018, masking autista), Hull et al. (2017, CAT-Q)
- Browser: ✅ React con grid de sliders dobles. Sin dependencias de tiempo.
- **Cubre dimensiones:** Pérdida de identidad (brecha auténtico/presentado), Agotamiento físico (esfuerzo de supresión), Desconexión emocional (supresión emocional)

**Energy Prediction Task** — 5 min (opcional)
- Paradigma: 10-15 actividades cotidianas. Predecir cuánta energía consumirán (1-7) y cuánto masking requerirán (1-7). Luego reportar el gasto real.
- Mide: Error de predicción energética (subestimación crónica = marcador de burnout)
- Browser: ✅ React con sliders.

**Cálculo de score combinado Burnout:**
```
Self-report Likert → burnout (bajo/moderado/severo)
Auto-discrepancia → |público - privado| → z-score
Si self-report alto + discrepancia alta → burnout validado
Si self-report alto + discrepancia baja → posible otra causa del agotamiento
```

---

### 7. Funciones Ejecutivas — Complemento: Digit Span + Flanker + Cambio de Tarea

**Digit Span (Forward + Backward)** — 6-10 min
- Paradigma: Secuencias de dígitos (audio o visual). Repetir en orden (forward) o inverso (backward). Longitud creciente (2-9 dígitos).
- Mide: Memoria de trabajo verbal, atención
- Métricas: Span forward, span backward, puntuación total
- Validez: Gold standard clínico (WAIS-IV). Déficits en TDAH, TEA, daño frontal.
- Browser: ✅ Visual: dígitos mostrados secuencialmente. Respuesta vía teclado numérico o botones. Audio opcional con Web Audio API.
- **Cubre dimensiones:** Memoria de trabajo

**Flanker Task** — 8-10 min (compartido con TDAH, ejecutar una sola vez)
- Mide: Inhibición
- **Cubre dimensiones:** Inhibición

**Switch Task (Color-Forma)** — 6-10 min
- Paradigma: Estímulos con color y forma. Alternar entre clasificar por color o por forma según cue.
- Mide: Flexibilidad cognitiva (costo de cambio de set mental)
- Métricas: Switch cost (RT_switch - RT_repeat en ms)
- Validez: Monsell (2003), Kiesel et al. (2010, metaanálisis)
- Browser: ✅ React con estímulos visuales y teclas de respuesta.
- **Cubre dimensiones:** Flexibilidad cognitiva

**Cálculo de score combinado Ejecutivas:**
```
Self-report Likert → dificultades (preservadas/moderadas/significativas)
Digit Span → span total → z-score vs normas por edad
Flanker → efecto interferencia → z-score
Switch Task → switch cost → z-score
Perfil de discrepancia por dimensión:
  - workingMemory: Digit Span backward vs self-report memoria de trabajo
  - inhibition: Flanker vs self-report inhibición
  - flexibility: Switch cost vs self-report flexibilidad
```

---

## Arquitectura de implementación

### Patrón de componentes
```
src/
├── components/Test/
│   ├── SARTTask.jsx              ← TDAH: atención sostenida
│   ├── FlankerTask.jsx           ← TDAH + Ejecutivas: inhibición
│   ├── RMETTask.jsx              ← TEA: teoría de la mente
│   ├── NavonTask.jsx             ← TEA: procesamiento local-global
│   ├── SensoryThresholdTask.jsx  ← HSP: detección en ruido
│   ├── AuditoryDistractionTask.jsx ← HSP: distracción auditiva
│   ├── FERTask.jsx               ← Alexitimia: reconocimiento emocional
│   ├── SocialScenariosTask.jsx   ← RSD: escenarios ambiguos
│   ├── SelfDiscrepancyTask.jsx   ← Burnout: auto-discrepancia
│   ├── DigitSpanTask.jsx         ← Ejecutivas: span dígitos
│   └── SwitchTask.jsx            ← Ejecutivas: cambio de tarea
├── utils/
│   ├── sartScoring.js
│   ├── flankerScoring.js
│   ├── rmetScoring.js
│   ├── ferScoring.js
│   ├── digitSpanScoring.js
│   └── ...
└── data/
    ├── sartConfig.js
    ├── rmetStimuli.js
    ├── ferStimuli.js
    ├── socialScenarios.js
    └── ...
```

### Sistema de scoring combinado

```
Para cada test con complemento de acción:
┌─────────────────────────────────────────────────┐
│  Resultado Likert (auto-reporte)                 │
│  ├─ score total, categoría, dimensiones          │
│  └─ z-score normalizado                          │
│                                                  │
│  Resultado Acción (rendimiento)                  │
│  ├─ métricas objetivas (RT, precisión, span)     │
│  └─ z-score normalizado vs datos normativos      │
│                                                  │
│  Análisis combinado:                             │
│  ├─ Discrepancia Likert-Acción (|z_L - z_A|)    │
│  ├─ Patrón: concordante / discrepante            │
│  └─ Interpretación contextual                    │
└─────────────────────────────────────────────────┘
```

---

## Prioridades de implementación

| Prioridad | Test | Tarea | Tiempo est. | Evidencia | Complejidad |
|-----------|------|-------|-------------|-----------|-------------|
| **1** | TDAH | SART | 6-8 min | Alta | Baja |
| **2** | TDAH + Ejecutivas | Flanker | 8-10 min | Alta | Baja (plugin jsPsych) |
| **3** | Alexitimia | FER | 8-12 min | Alta | Baja |
| **4** | RSD | Escenarios Sociales | 8-12 min | Alta | Muy baja |
| **5** | Ejecutivas | Digit Span | 6-10 min | Muy alta | Media |
| **6** | Burnout | Auto-Discrepancia | 6-8 min | Alta | Muy baja |
| **7** | TEA | RMET | 10-12 min | Alta | Media (requiere imágenes) |
| **8** | TEA | Navon | 8-10 min | Media | Baja |
| **9** | Ejecutivas | Switch Task | 6-10 min | Alta | Media |
| **10** | HSP | Detección en Ruido | 8-10 min | Baja (novedosa) | Media |
| **11** | TDAH | PVT breve | 3-5 min | Alta | Muy baja |
| **12** | Burnout | Predicción Energía | 5 min | Baja (novedosa) | Muy baja |

---

## Referencias clave

1. **Toplak, West & Stanovich (2013)** — "Do performance-based measures and ratings of executive function assess the same construct?" *JCPP*. r = 0.19 correlación mediana.
2. **Gjorup et al. (2025)** — Discrepancy scores between subjective and objective attention assessments. *J Affect Disord*.
3. **Downey & Feldman (1996)** — Validación original del Rejection Sensitivity Questionnaire. *JPSP*.
4. **Prikachin et al. (2009)** — Facial emotion recognition and alexithymia. *Journal of Psychosomatic Research*.
5. **Kang et al.** — SART web vs. laboratory validation.
6. **Cage et al. (2018)** — Autistic masking and self-discrepancy. *JADD*.
7. **NIH Toolbox** — Flanker Inhibitory Control and Attention Test validation (Solomon et al., 2021).
8. **Livingston et al. (2024)** — Integration of speed and accuracy in RMET for individual differences in ToM.
9. **Xiao et al. (2024)** — Attentional processing in conflict contexts and HSP.
10. **Jaeggi et al. (2010)** — N-back task and working memory. *PNAS*.

---

## Conclusión

- **DAT y FAS ya son tests de acción** — los 7 Likert son los que necesitan complemento
- **La ciencia es clara:** auto-reporte y rendimiento miden constructos diferentes (r ~ 0.19)
- **No combinarlos en un solo score** — mostrar lado a lado, flaggear discrepancias
- **Prioridad 1:** SART + Flanker (TDAH/Ejecutivas) y FER (Alexitimia) — más evidencia, implementación más simple
- **HSP es el más débil** — no existen tareas validadas, sería investigación original
- **Tiempo total razonable:** 15-25 min para el complemento de acción (similar a completar el Likert)
