# Auditoría Científica — 20 Tests de EvaluMind

**Fecha:** 2026-05-17 | **Versión:** 1.0 | **Estado:** Documento de investigación

---

## Resumen Ejecutivo

Se auditaron los 20 tests de EvaluMind contra la literatura científica de referencia. Los tests cubren constructos reales con amplio respaldo académico, pero **ninguno implementa fielmente los instrumentos validados** que los respaldan.

### Clasificación general

| Categoría | Cantidad | Tests |
|---|---|---|
| **A — Alineable** (ajustes menores) | 5 | SART, Flanker, Digit Span, Navon, Switch Task |
| **B — Reconstruible** (cambios significativos) | 11 | TDAH, TEA, HSP, Alexitimia, RSD, Burnout, F. Ejecutivas, DAT, FAS, FER, RMET |
| **C — Original** (sin instrumento validado equivalente) | 4 | Social Scenarios, Self-Discrepancy, Sensory Threshold, Auditory Distraction |

### Prioridades urgentes

| Prioridad | Test | Acción |
|---|---|---|
| 🔴 P0 | DAT | Reemplazar constantes custom por algoritmo GloVe real (Olson et al., 2021) |
| 🔴 P0 | RMET | Usar 36 ítems reales con fotos de Baron-Cohen et al. (2001) — actualmente es texto, no RMET |
| 🔴 P0 | TDAH | Migrar al ASRS-v1.1 de 18 ítems o al ASRS-5 con scoring validado |
| 🟡 P1 | TEA | Migrar al AQ-50 o RAADS-R de 80 ítems con puntos de corte publicados |
| 🟡 P1 | Alexitimia | Migrar al TAS-20 con sus 20 ítems y puntos de corte validados (≤51 / 52-60 / ≥61) |
| 🟡 P1 | FAS | Reemplazar diccionario hardcodeado por scoring COWAT estándar (total words + perseveraciones) y usar normas de Loonstra et al. (2001) ajustadas por edad/educación |
| 🟢 P2 | HSP, RSD, Burnout, F. Ejecutivas | Alinear dimensiones y scoring con HSPS-27, RSQ, CAT-Q y BRIEF-A respectivamente |
| 🟢 P2 | SART, Flanker, Navon, Digit Span, Switch | Documentar fuentes; ajustar thresholds con datos normativos publicados |
| ⚪ P3 | Social Scenarios, Self-Discrepancy, Sensory Threshold, Auditory Distraction | Tests originales — citar marco teórico pero reconocer ausencia de validación |

---

## Fase 1: Mapeo Instrumento Real vs EvaluMind

### TEST 1 — TDAH Adulto (`tdah-adult-v2`)

**Constructo:** Rasgos de TDAH en adultos

**Instrumento validado de referencia:**
- **ASRS-v1.1** (Adult ADHD Self-Report Scale) — Kessler, R.C., Adler, L., Ames, M., et al. (2005). *Psychological Medicine*, 35(2), 245-256. DOI: `10.1017/S0033291704002892`
- Desarrollado por WHO + Harvard Medical School
- 18 ítems basados en criterios DSM-IV-TR
- **ASRS-5** (DSM-5): Ustun et al. (2017), *JAMA Psychiatry*
- **6-item screener:** Sensibilidad 68.7%, Especificidad 99.5%, Kappa 0.76 — supera al instrumento completo de 18 ítems

**Lo que evalúa EvaluMind:**

| Aspecto | ASRS real | EvaluMind |
|---|---|---|
| Ítems | 18 (o 6 screener) | 16 custom |
| Subescalas | Inattention (9) + Hyperactivity-Impulsivity (9) — 2 factores DSM | 3 dimensiones: Inatención (8), Hiperactividad física (3), Impulsividad verbal (5) |
| Escala | 0-4 (Nunca a Muy frecuentemente) | 0-4 |
| Scoring | Suma por subescala. Screener: 4+ ítems en zona clínica | Suma por dimensión con thresholds: Inatención ≥16/32, Hiperactividad ≥6/12, Impulsividad ≥10/20 |
| Categorías | Screening positivo/negativo | Baja/Moderada/Alta probabilidad (0-22, 23-36, 37-64) |
| Validación | Curva ROC contra entrevista clínica (N=154) | Sin validación externa |

**Gaps críticos:**
1. Los 16 ítems no son los del ASRS — son preguntas creadas ad-hoc inspiradas en los criterios
2. La estructura de 3 factores no coincide con los 2 factores DSM del ASRS
3. Los thresholds son arbitrarios (no derivados de curvas ROC)
4. Los puntos de corte de categorías (22, 36) no corresponden a ningún dato normativo publicado
5. No hay mención del ASRS ni cita en el código

**Recomendación:** Categoría B — Migrar al ASRS-5 (18 ítems DSM-5) con scoring validado. Como mínimo, citar el instrumento.

---

### TEST 2 — TEA Adulto (`tea-adult-v1`)

**Constructo:** Rasgos del espectro autista en adultos

**Instrumento validado de referencia:**
- **AQ** (Autism-Spectrum Quotient) — Baron-Cohen, S., Wheelwright, S., Skinner, R., Martin, J., & Clubley, E. (2001). *Journal of Autism and Developmental Disorders*, 31(1), 5-17. DOI: `10.1023/A:1005653411471`
- 50 ítems, 4 opciones (definitivamente/ligeramente de acuerdo/desacuerdo), scoring binario
- Punto de corte: ≥32 (80% de diagnosticados, 2% de controles)
- Normas: AS/HFA M=35.8 (SD=6.5), Controles M=16.4 (SD=6.3)
- **RAADS-R** (alternativa) — Ritvo et al. (2011): 80 ítems, cutoff ≥65

**Lo que evalúa EvaluMind:**

| Aspecto | AQ real | EvaluMind |
|---|---|---|
| Ítems | 50 (scoring binario) | 16 (Likert 0-4) |
| Subescalas | 5 (Social skills, Communication, Imagination, Attention to detail, Attention switching) | 4 custom: Comunicación social, Relaciones, Rutinas/flexibilidad, Sensorial/intereses |
| Scoring | Suma de 50 ítems binarios (0-50) | Suma Likert por dimensión (0-64 total) |
| Categorías | ≥32 clínico | 0-24 baja, 25-40 moderada, 41-64 alta |
| Validación | 4 grupos: AS/HFA, controles, matemáticos, científicos (N=~200) | Sin validación |

**Gaps críticos:**
1. Solo 16 ítems vs 50 del AQ — cobertura reducida
2. Escala Likert 0-4 en vez de scoring binario del AQ
3. Estructura de 4 dimensiones custom no coincide con los 5 factores del AQ (cuya estabilidad factorial ya es debatida)
4. Sin punto de corte validado; nuestros thresholds son arbitrarios
5. No se menciona el AQ ni RAADS-R en el código

**Recomendación:** Categoría B — Migrar al RAADS-R (80 ítems, más completo para adultos) o al AQ-50 con scoring binario estándar.

---

### TEST 3 — Alta Sensibilidad HSP (`hsp-adult-v1`)

**Constructo:** Sensory-Processing Sensitivity (Alta Sensibilidad)

**Instrumento validado de referencia:**
- **HSPS-27** (Highly Sensitive Person Scale) — Aron, E.N. & Aron, A. (1997). *Journal of Personality and Social Psychology*, 73(2), 345-368. DOI: `10.1037/0022-3514.73.2.345`
- 27 ítems, Likert 1-7 (totalmente en desacuerdo a totalmente de acuerdo)
- Originalmente unidimensional; luego modelos de 2, 3 y 4 factores
- Modelo DOES de 4 factores (Aron, 2010): Depth of processing, Overstimulation, Emotional intensity, Sensory sensitivity
- Cutoff: percentil 80 (Aron selecciona el 20% superior)
- Prevalencia poblacional estimada: 15-20%

**Lo que evalúa EvaluMind:**

| Aspecto | HSPS real | EvaluMind |
|---|---|---|
| Ítems | 27 (Likert 1-7) | 16 (Likert 0-4) |
| Subescalas | 4 factores DOES | 4 dimensiones: Procesamiento profundo, Sobrestimulación, Intensidad emocional, Sensibilidad sensorial |
| Scoring | Suma 27-189 | Suma 0-64 con thresholds ≥9 por dimensión |
| Categorías | Percentil 80 | 0-28 promedio, 29-44 moderada, 45-64 marcada |
| Validación | Estudios fMRI (Acevedo et al., 2018), genética (5-HTTLPR) | Sin validación; mención a "Dra. Elaine Aron" solo en recursos |

**Gaps críticos:**
1. 16 ítems vs 27 del HSPS — faltan 11 ítems
2. Escala 0-4 vs 1-7 del original — reduce sensibilidad
3. Las 4 dimensiones están bien alineadas conceptualmente con DOES
4. Sin punto de corte normativo (percentil 80)
5. El código menciona "20-30% de la población" — inconsistente con la literatura (15-20%)

**Recomendación:** Categoría B — Adoptar los 27 ítems del HSPS con escala 1-7 y punto de corte en percentil 80.

---

### TEST 4 — Alexitimia (`alexitimia-adult-v1`)

**Constructo:** Dificultad para identificar y describir emociones

**Instrumento validado de referencia:**
- **TAS-20** (Toronto Alexithymia Scale) — Bagby, R.M., Parker, J.D.A., & Taylor, G.J. (1994). *Journal of Psychosomatic Research*, 38(1), 23-32. DOI: `10.1016/0022-3999(94)90005-1`
- 20 ítems, Likert 1-5
- 3 subescalas: DIF (7 ítems), DDF (5 ítems), EOT (8 ítems)
- 5 ítems inversos (4, 5, 10, 18, 19)
- Puntos de corte: ≤51 = sin alexitimia, 52-60 = posible, ≥61 = alexitimia
- Validado en >30 idiomas. Media hombres ~51.14, mujeres ~48.99

**Lo que evalúa EvaluMind:**

| Aspecto | TAS-20 real | EvaluMind |
|---|---|---|
| Ítems | 20 (Likert 1-5) | 16 (Likert 0-4) |
| Subescalas | 3 (DIF, DDF, EOT) | 4: Identificación emocional, Descripción emocional, Pensamiento externo, Confusión somática |
| Scoring | Suma 20-100 con ítems inversos | Suma 0-64 |
| Categorías | ≤51 / 52-60 / ≥61 | 0-24 baja, 25-40 moderada, 41-64 marcada |
| Validación | >30 traducciones, múltiples estudios | Sin validación; comentario "DIF" en código sugiere conciencia del TAS-20 |

**Gaps críticos:**
1. 16 ítems vs 20 del TAS-20
2. La 4ª dimensión "Confusión somática" no existe en el TAS-20 — es una adición del proyecto
3. Sin ítems inversos (el TAS-20 tiene 5)
4. Puntos de corte no alineados con la literatura (20-100 vs nuestro 0-64)
5. El código referencia "DIF" pero no implementa el TAS-20

**Recomendación:** Categoría B — Adoptar los 20 ítems del TAS-20 con sus 3 subescalas estándar y puntos de corte validados. La dimensión somática puede ser un complemento aparte.

---

### TEST 5 — RSD / Sensibilidad al Rechazo (`rsd-adult-v1`)

**Constructo:** Rejection Sensitive Dysphoria — hipersensibilidad al rechazo

**Instrumento validado de referencia:**
- **RSQ** (Rejection Sensitivity Questionnaire) — Downey, G. & Feldman, S.I. (1996). *Journal of Personality and Social Psychology*, 70(6), 1327-1343. DOI: `10.1037/0022-3514.70.6.1327`
- 18 escenarios. Cada uno: preocupación por rechazo (1-6) × expectativa de rechazo (inversa 1-6). Score = producto promedio
- **A-RSQ** (Adult version) — Berenson et al. (2009)
- Fuertemente asociado con depresión, rumia, TLP (Pearson et al., 2011)
- La RSD no es un diagnóstico DSM — es un fenómeno clínico reconocido (Dr. William Dodson)

**Lo que evalúa EvaluMind:**

| Aspecto | RSQ real | EvaluMind |
|---|---|---|
| Formato | 18 escenarios con doble valoración | 16 afirmaciones Likert 0-4 |
| Métrica | Preocupación × Expectativa (producto) | Suma simple Likert |
| Subescalas | Preocupación + Expectativa (2 factores) | 4 dimensiones: Percepción de rechazo, Intensidad emocional, Evitación anticipatoria, Rumia |
| Scoring | Promedio de productos (1-36 posible) | Suma 0-64 con thresholds ≥9 por dimensión |
| Categorías | Continuo (no hay cutoff estándar) | 0-24 RSD baja, 25-40 moderada, 41-64 marcada |

**Gaps críticos:**
1. Formato completamente diferente: el RSQ usa escenarios con doble valoración (preocupación × expectativa), nosotros usamos afirmaciones Likert
2. La métrica del RSQ (producto) captura la interacción ansiedad-expectativa — nuestra suma no
3. Nuestras 4 dimensiones no mapean a los 2 factores del RSQ
4. No es un trastorno DSM — el código lo aclara correctamente

**Recomendación:** Categoría B — Adoptar el formato de escenarios del A-RSQ con scoring de producto (preocupación × expectativa). El test complementario "Social Scenarios" ya usa un paradigma similar.

---

### TEST 6 — Burnout por Masking (`burnout-masking-v1`)

**Constructo:** Agotamiento por camuflaje de rasgos neurodivergentes

**Instrumento validado de referencia:**
- **CAT-Q** (Camouflaging Autistic Traits Questionnaire) — Hull, L., Mandy, W., Lai, M.C., et al. (2019). *Journal of Autism and Developmental Disorders*, 49(3), 819-833. DOI: `10.1007/s10803-018-3792-6`
- 25 ítems, Likert 1-7
- 3 subescalas: Compensation (9), Masking (8), Assimilation (8)
- 5 ítems inversos
- Rango total: 25-175. Umbral: ≥100 = camuflaje significativo
- Alpha total = 0.94. Test-retest 3 meses buena
- Licencia CC BY 4.0

**Lo que evalúa EvaluMind:**

| Aspecto | CAT-Q real | EvaluMind |
|---|---|---|
| Ítems | 25 (Likert 1-7) | 13 (Likert 0-4) |
| Subescalas | 3 (Compensation, Masking, Assimilation) | 4: Agotamiento físico, Pérdida de identidad, Desconexión emocional, Colapso y recuperación |
| Foco | Evalúa el comportamiento de camuflaje | Evalúa las consecuencias (burnout) del camuflaje |
| Scoring | 25-175, umbral ≥100 | 0-52 con thresholds por dimensión |
| Categorías | Continuo con punto de corte | 0-18 bajo, 19-35 moderado, 36-52 severo |

**Gaps críticos:**
1. El CAT-Q mide **camuflaje** (el comportamiento), nuestro test mide **burnout por camuflaje** (la consecuencia). Son constructos relacionados pero distintos
2. No existe un instrumento validado específico para "burnout por masking" — este es un área emergente
3. Nuestros ítems son clínicamente relevantes pero no validados
4. La estructura de 4 dimensiones es ad-hoc

**Recomendación:** Categoría B — Incorporar el CAT-Q como medida de camuflaje y mantener el test actual como "Burnout" complementario, citando ambos constructos. Aclarar que el burnout por masking es un área sin instrumento gold standard.

---

### TEST 7 — Funciones Ejecutivas (`funciones-ejecutivas-v1`)

**Constructo:** Funcionamiento ejecutivo subjetivo

**Instrumento validado de referencia:**
- **BRIEF-A** (Behavior Rating Inventory of Executive Function - Adult) — Gioia, G.A., Isquith, P.K., Guy, S.C., & Kenworthy, L. Publicado por PAR.
- 75 ítems, escala de frecuencia de 3 puntos
- 2 índices: Behavioral Regulation (BRI) + Metacognition (MI) → Global Executive Composite (GEC)
- T-scores (M=50, SD=10). T≥65 = clínicamente elevado
- **BDEFS** (Barkley Deficits in Executive Functioning Scale) — alternativa de Barkley (2011), 89 ítems

**Lo que evalúa EvaluMind:**

| Aspecto | BRIEF-A real | EvaluMind |
|---|---|---|
| Ítems | 75 (escala frecuencia 3 puntos) | 18 (Likert 0-4) |
| Subescalas | 9 subescalas clínicas → 2 índices → GEC | 4 dimensiones: Inhibición, Memoria de trabajo, Planificación, Flexibilidad cognitiva |
| Scoring | T-scores ajustados por edad/género | Suma 0-72 |
| Categorías | T≥65 clínico | 0-30 preservadas, 31-50 moderadas, 51-72 significativas |
| Validación | Amplia normalización (N=1,500+) | Sin validación |

**Gaps críticos:**
1. 18 ítems vs 75 del BRIEF-A — cobertura muy reducida
2. Sin baremos por edad/género
3. Las 4 dimensiones están bien elegidas conceptualmente (coinciden con dominios ejecutivos clásicos)
4. Sin punto de corte clínico validado
5. La literatura de Toplak et al. (2013) — citada en el proyecto — encuentra que medidas subjetivas y objetivas de FE correlacionan solo r=0.19. Esto valida tener ambos tipos de medida, pero no valida nuestro cuestionario específico

**Recomendación:** Categoría B — Referenciar el BRIEF-A como fuente conceptual. Citar a Toplak et al. (2013) explícitamente en el código y en la UI de resultados. Considerar expandir a más ítems alineados con las 9 subescalas del BRIEF.

---

### TEST 8 — DAT / Asociación Divergente (`dat-v1`)

**Constructo:** Pensamiento divergente / creatividad verbal

**Instrumento validado de referencia:**
- **DAT** (Divergent Association Task) — Olson, J.A., Nahas, J., Chmoulevitch, D., Cropper, S.J., & Webb, M.E. (2021). *Proceedings of the National Academy of Sciences*, 118(25), e2022340118. DOI: `10.1073/pnas.2022340118`
- 10 nouns, 4 minutos. Se usan las primeras 7 palabras válidas
- **Scoring real:** Distancia coseno entre pares de palabras usando embeddings GloVe (Common Crawl, 840B tokens). Promedio de 21 distancias × 100
- Rango: 0-200 (prácticamente 50-95). <50 = pobre; 75-80 = promedio; 95+ = muy alto
- Correlación con AUT (Alternate Uses Task): flexibilidad r=0.51, originalidad r=0.50
- Test-retest 2 semanas: r=0.73
- Código abierto en OSF: osf.io/vjazn

**Lo que evalúa EvaluMind:**

| Aspecto | DAT real (Olson et al., 2021) | EvaluMind |
|---|---|---|
| Entrada | 10 sustantivos, 4 min | 10 palabras (sin restricción de sustantivos) |
| Algoritmo | GloVe cosine distance (pre-entrenado) | Clasificación manual en 15 categorías semánticas → distancias fijas (0.22, 0.50, 0.82, 0.86, 0.91) |
| Fórmula | avg(dist) × 100 | (avgDist × 85) + consistencyBonus |
| Rango | 0-200 (típico 50-95) | 0-100 |
| Categorías | Continuo (no hay cutoffs estándar) | <35 convergente, 35-59 moderado, ≥60 altamente divergente |
| Validación | N=8,572 en 98 países | Sin validación |

**Gaps críticos:**
1. El algoritmo es completamente diferente — usamos categorías fijas con distancias arbitrarias en vez de embeddings semánticos reales (GloVe)
2. Las constantes 0.22, 0.50, 0.82, 0.86, 0.91, factor 85, consistencyBonus 12 son arbitrarias sin validación
3. Nuestro rango (0-100) no es comparable con el DAT real (0-200)
4. La validación de palabras es más restrictiva que el DAT original (prohíbe verbos, nombres propios, palabras funcionales)
5. El DAT original ha sido validado con N=8,572 en 98 países — el nuestro con 0

**Recomendación:** Categoría B — 🔴 **Prioridad urgente.** Implementar el algoritmo GloVe real (modelos pre-entrenados disponibles como TensorFlow.js o descargables). Usar la fórmula exacta de Olson et al. (avg cosine distance × 100). Citar el paper.

---

### TEST 9 — FAS / Fluencia Verbal (`fas-v1`)

**Constructo:** Fluidez verbal fonológica

**Instrumento validado de referencia:**
- **COWAT** (Controlled Oral Word Association Test) — Benton, A.L. (1968). *Neuropsychologia*, 6(1), 53-60
- Letras F, A, S. 60 segundos por letra
- Scoring: suma de palabras válidas en las 3 rondas. Se excluyen nombres propios, números y variaciones morfológicas
- **Metanormas:** Loonstra, A.S., Tarlow, A.R., & Sellers, A.H. (2001). *Applied Neuropsychology*, 8(3), 161-166. DOI: `10.1207/S15324826AN0803_5`
- Datos normativos por edad, género y educación (N=~1,300)
- Media adultos ~35-45 palabras total, SD ~10-12
- Percentiles publicados: ≤29 = déficit para la mayoría de grupos

**Lo que evalúa EvaluMind:**

| Aspecto | COWAT real | EvaluMind |
|---|---|---|
| Letras | F, A, S (fijas) | Aleatoria entre F, A, S (solo una por sesión) |
| Duración | 3 × 60s = 180s total | 1 × 60s |
| Scoring | Conteo simple de palabras | Clasificación en 8 categorías semánticas + ratio de perseveración + flags |
| Categorías | Percentiles por edad/educación | <8 fluidez baja, 8-13 moderada, 12+ y 4+ categorías alta |
| Validación | Normas publicadas (Loonstra et al., 2001) | Diccionario hardcodeado de categorías |

**Gaps críticos:**
1. Solo 1 letra por sesión vs 3 del COWAT — reduce confiabilidad
2. El scoring de categorías semánticas y perseveración es una adición interesante pero no estándar
3. Sin datos normativos ajustados por edad/educación
4. El diccionario de clasificación de palabras es limitado y hardcodeado — no escala
5. Umbrales (8, 13, 12 palabras) no coinciden con las normas publicadas (media 35-45 para 3 letras → ~12-15 por letra)

**Recomendación:** Categoría B — Administrar las 3 letras (F, A, S). Usar scoring COWAT estándar (suma total). Agregar normas de Loonstra et al. (2001). El análisis de categorías puede quedarse como métrica secundaria.

---

### TEST 10 — SART / Atención Sostenida (`sart-v1`)

**Constructo:** Atención sostenida e inhibición de respuesta

**Instrumento validado de referencia:**
- **SART** (Sustained Attention to Response Task) — Robertson, I.H., Manly, T., Andrade, J., Baddeley, B.T., & Yiend, J. (1997). *Neuropsychologia*, 35(6), 747-758. DOI: `10.1016/S0028-3932(97)00015-8`
- Paradigma Go/No-Go: presionar para cada dígito excepto "3"
- 225 trials (25 de cada dígito 1-9), ~11% NoGo
- 5 tamaños de fuente (48-120pt) para variar carga perceptual
- Duración: ~5 minutos (250ms estímulo + 900ms máscara)
- Métricas: comisiones (fallos de inhibición), omisiones (lapsos atencionales), variabilidad RT

**Lo que evalúa EvaluMind:**

| Aspecto | SART real | EvaluMind |
|---|---|---|
| Trials | 225 fijos | Variable (configurable) |
| Timing | 250ms ON, 900ms mask | Controlado por React (menos preciso) |
| NoGo | Dígito 3 (~11%) | Dígito 3 (~25%) |
| Métricas | Comisiones, omisiones, RT variability | Igual + anticipaciones (<100ms) |
| Scoring | Continuo (sin cutoffs estándar) | Composite 0-100 con pesos (50% comisiones, 30% omisiones, 15% RTV, 5% anticipaciones) |
| Validación | Múltiples estudios clínicos | Sin validación |

**Gaps:**
1. Porcentaje de NoGo mayor que el estándar (25% vs 11%) — afecta la tasa base de comisiones
2. Sin variación de tamaño de fuente (carga perceptual constante)
3. Timing menos preciso en navegador (requestAnimationFrame vs hardware)
4. Pesos del composite (50/30/15/5) son arbitrarios
5. RT <100ms como "anticipación" es un criterio estándar aceptable

**Recomendación:** Categoría A — Reducir % NoGo a ~11%. Documentar limitaciones de timing en web. Citar Robertson et al. (1997). Los pesos del composite necesitan validación pero son razonables.

---

### TEST 11 — Flanker / Control Inhibitorio (`flanker-v1`)

**Constructo:** Control de interferencia / inhibición

**Instrumento validado de referencia:**
- **Eriksen Flanker Task** — Eriksen, B.A. & Eriksen, C.W. (1974). *Perception and Psychophysics*, 16(1), 143-149. DOI: `10.3758/BF03203267`
- Flecha central + flechas distractoras (congruentes/incongruentes)
- Efecto Flanker típico: 30-100ms en adultos sanos
- NIH Toolbox Flanker: validado en TDAH y TEA (Solomon et al., 2021)

**Lo que evalúa EvaluMind:**

| Aspecto | Flanker estándar | EvaluMind |
|---|---|---|
| Trials | 100+ recomendado | Configurable |
| Métrica | RT incongruente − RT congruente | Composite: efecto RT (60%) + costo precisión (40%) |
| Scoring | Continuo (ms) | 0-100 con normalización (flankerEffect/150 × 100) |
| Categorías | Sin cutoffs estándar | 0-25 óptima, 26-50 buena, 51-100 reducida |
| Normas | Efecto típico 30-100ms | Nuestro divisor 150ms es razonable |

**Gaps:**
1. Pesos (60/40) arbitrarios pero razonables
2. Divisor 150ms para normalizar el efecto es coherente con literatura (efecto típico 30-100ms)
3. Sin datos normativos propios
4. Timing en navegador limita precisión de RT

**Recomendación:** Categoría A — Citar Eriksen & Eriksen (1974). Ajustar pesos del composite con datos reales de usuarios. Documentar el divisor 150ms.

---

### TEST 12 — Digit Span / Memoria de Trabajo (`digit-span-v1`)

**Constructo:** Memoria de trabajo verbal

**Instrumento validado de referencia:**
- **WAIS-IV Digit Span** — Wechsler, D. (2008). Pearson.
- 3 condiciones: Forward (atención), Backward (MT), Sequencing (MT, añadido en WAIS-IV)
- 2 trials por longitud, empezando en 2 dígitos hasta 9
- Scoring: total de trials correctos → scaled score (M=10, SD=3) ajustado por edad
- Span promedio adultos: 7±2 (forward)

**Lo que evalúa EvaluMind:**

| Aspecto | WAIS-IV Digit Span | EvaluMind |
|---|---|---|
| Condiciones | Forward + Backward + Sequencing | Forward + Backward |
| Trials | 2 por longitud, discontinua tras 2 fallos | 2 por longitud, discontinua en bloque con 0 aciertos |
| Scoring | Suma de trials → scaled score por edad | forwardSpan + (backwardSpan × 2) → max 30 |
| Categorías | Scaled scores (M=10, SD=3) | ≥18 alta, 12-17 moderada, <12 baja |
| Normas | Extensas por grupo etario | Sin normas |

**Gaps:**
1. Falta Sequencing (añadido en WAIS-IV)
2. La fórmula `forwardSpan + (backwardSpan × 2)` da más peso al inverso — es razonable pero no estándar
3. Categorías no ajustadas por edad
4. Sin scaled scores ni percentiles

**Recomendación:** Categoría A — Agregar Sequencing. Citar WAIS-IV. La fórmula de peso doble al backward span es defendible pero debe documentarse. Agregar ajuste etario básico.

---

### TEST 13 — Navon / Procesamiento Local-Global (`navon-v1`)

**Constructo:** Procesamiento global vs local (coherencia central)

**Instrumento validado de referencia:**
- **Navon Figures** — Navon, D. (1977). *Cognitive Psychology*, 9(3), 353-383. DOI: `10.1016/0010-0285(77)90012-3`
- Letras jerárquicas: letra grande (global) compuesta de letras pequeñas (local)
- Efecto de precedencia global: RT más rápido para nivel global en población general
- En TEA: sesgo hacia procesamiento local (weak central coherence)
- Versiones validadas online: L-POST (Torfs et al., 2014); tablet (Ju et al., 2023)

**Lo que evalúa EvaluMind:**

| Aspecto | Navon estándar | EvaluMind |
|---|---|---|
| Trials | 96 típico | Configurable |
| Condiciones | Global-attend + Local-attend + Congruente/Incongruente | Igual |
| Métricas | Precedencia global, interferencia, sesgo local | GlobalAdvantage (ms), LocalBias (precisión), Interferencia |
| Categorías | Continuo | Sesgo local (>0.15), Precedencia global (>200ms), Balanceado |
| Scoring | RT y precisión por condición | Categorización con thresholds fijos |

**Gaps:**
1. Thresholds (>0.15 para local bias, >200ms para global advantage) son arbitrarios
2. Sin datos normativos de referencia
3. La versión web es válida (L-POST validado)

**Recomendación:** Categoría A — Citar Navon (1977) y L-POST (Torfs et al., 2014). Los thresholds necesitan calibración con datos reales.

---

### TEST 14 — Switch Task / Flexibilidad Cognitiva (`switch-task-v1`)

**Constructo:** Flexibilidad cognitiva / costo de cambio de tarea

**Instrumento validado de referencia:**
- **Task Switching paradigm** — Rogers, R.D. & Monsell, S. (1995). *Journal of Experimental Psychology: General*, 124(2), 207-231
- Review: Monsell, S. (2003). *Trends in Cognitive Sciences*, 7(3), 134-140
- Kiesel, A. et al. (2010). *Psychological Bulletin*, 136(5), 849-874
- Switch cost = RT(switch) − RT(repeat). Típico 50-200ms en adultos

**Lo que evalúa EvaluMind:**

| Aspecto | Task Switching estándar | EvaluMind |
|---|---|---|
| Paradigma | Color/Forma alternando (AABBAABB) | Color/Forma alternando |
| Métricas | Switch cost (RT), accuracy cost | Igual |
| Scoring | Continuo (ms) | Composite 0-100: RT cost (50%) + accuracy cost (50%) |
| Categorías | Sin cutoffs estándar | 0-20 alta, 21-45 moderada, 46-100 baja |
| Normalización | Switch cost / 400ms | Switch cost / 400ms |

**Gaps:**
1. Pesos 50/50 arbitrarios
2. Divisor 400ms es generoso (switch cost típico 50-200ms)
3. Sin normas publicadas para población general en versión web

**Recomendación:** Categoría A — Citar Monsell (2003) y Rogers & Monsell (1995). Ajustar divisor con datos empíricos.

---

### TEST 15 — FER / Reconocimiento Emocional (`fer-v1`)

**Constructo:** Reconocimiento de emociones en contextos situacionales

**Instrumento validado de referencia:**
- Paradigmas estándar de reconocimiento emocional con caras (KDEF, Radboud Faces Database, POFA de Ekman)
- Meta-análisis en alexitimia: Prikachin, G.C., Casey, C., & Prikachin, K.M. (2009). *Journal of Psychosomatic Research*
- Déficits específicos en tristeza, miedo, ira con alexitimia (felicidad preservada)

**Lo que evalúa EvaluMind:**

| Aspecto | FER estándar (facial) | EvaluMind |
|---|---|---|
| Estímulos | 60+ fotos de caras | 30 escenarios situacionales textuales |
| Emociones | 6 básicas (Ekman) + neutra | 5 emociones básicas |
| Respuesta | Forced-choice entre emociones | Forced-choice entre opciones |
| Métricas | Precisión total, por emoción, matriz de confusión | Precisión total, por emoción, emociones negativas |
| Categorías | Sin cutoffs universales | ≥80% alto, 60-79% moderado, <60% bajo |

**Gaps críticos:**
1. **No es FER** — usa escenarios textuales, no caras. Es más un test de conocimiento emocional situacional
2. Sin estímulos validados (las caras del KDEF tienen normas publicadas)
3. 30 ítems es razonable pero sin validación
4. Categorías (80/60) arbitrarias

**Recomendación:** Categoría B — Renombrar a "Reconocimiento Emocional Situacional". Citar a Prikachin et al. (2009). Si se quiere FER real, usar KDEF con fotos.

---

### TEST 16 — Self-Discrepancy / Auto-Discrepancia (`self-discrepancy-v1`)

**Constructo:** Brecha entre yo auténtico y yo público (masking)

**Instrumento validado de referencia:**
- **Self-Discrepancy Theory** — Higgins, E.T. (1987). *Psychological Review*, 94(3), 319-340. DOI: `10.1037/0033-295X.94.3.319`
- Dominios: Actual, Ideal, Ought self × Own/Other standpoint
- Medición clásica: Selves Questionnaire (listar atributos libremente) o Adjective Rating List
- **Integrated Self-Discrepancy Index** — Hardin & Lakin (2009)

**Lo que evalúa EvaluMind:**

| Aspecto | Self-Discrepancy clásico | EvaluMind |
|---|---|---|
| Método | Listado libre de atributos o rating de adjetivos | 25 rasgos con doble slider (1-7): público vs auténtico |
| Métrica | Discrepancia entre self-states | |público − privado| promedio |
| Foco | Actual vs Ideal/Ought (Higgins) | Yo público vs Yo auténtico (masking) |
| Validación | Décadas de investigación | Sin validación |

**Gaps críticos:**
1. No mide la discrepancia de Higgins (Actual-Ideal-Ought) sino una brecha público/privado — constructo diferente
2. Los 25 rasgos no están validados
3. Sin punto de corte validado
4. La interpretación como "masking" es una adaptación razonable pero no validada del marco de Higgins

**Recomendación:** Categoría C — Test conceptualmente original. Citar a Higgins (1987) como marco. Reconocer que mide masking (brecha público/privado), no self-discrepancy clásica. Considerar renombrar.

---

### TEST 17 — RMET / Lectura de Estados Mentales (`rmet-v1`)

**Constructo:** Teoría de la mente / cognición social

**Instrumento validado de referencia:**
- **RMET Revised** (Reading the Mind in the Eyes Test) — Baron-Cohen, S., Wheelwright, S., Hill, J., Raste, Y., & Plumb, I. (2001). *Journal of Child Psychology and Psychiatry*, 42(2), 241-251. DOI: `10.1111/1469-7610.00715`
- **36 fotografías** de la región ocular (blanco y negro)
- 4 opciones por ítem (1 correcta, 3 distractores)
- Normas: M=26/36 (SD≈3.5) en población general. Asperger/TEA: M=21.9/36 (SD=6.6)
- Recomendado por NIH RDoC framework para cognición social
- Warrier et al. (2018): GWAS con 80,000 participantes

**Lo que evalúa EvaluMind:**

| Aspecto | RMET real | EvaluMind |
|---|---|---|
| Estímulos | 36 fotos de ojos | 24 descripciones textuales de miradas |
| Opciones | 4 por ítem | 4 por ítem |
| Scoring | Total correcto (0-36) | Precisión % (0-100) |
| Categorías | Continuo (M=26, SD=3.5) | ≥75% alta, 55-74% moderada, <55% baja |
| Validación | 20+ años de investigación | Sin validación |

**Gaps críticos:**
1. 🔴 **No es el RMET.** Usa texto para describir miradas, no las 36 fotografías reales. Es un test de comprensión verbal de estados mentales, no de lectura de mente en ojos
2. 24 ítems vs 36 del RMET real
3. Sin las fotos originales → no se pueden usar las normas publicadas
4. Los estímulos textuales no están validados contra el RMET fotográfico
5. Categorías (75/55) no coinciden con las normas (M=26/36 = 72%, SD≈10%)

**Recomendación:** Categoría B — 🔴 **Prioridad urgente.** Usar las 36 fotos reales del RMET (disponibles con licencia académica) o reconocer explícitamente que es un test textual alternativo no equivalente al RMET y renombrarlo.

---

### TEST 18 — Sensory Threshold / Umbral Sensorial (`sensory-threshold-v1`)

**Constructo:** Umbral de detección sensorial (componente HSP)

**Base teórica:** Marco DOES de Aron (2010) — Low Sensory Threshold. Sin tarea conductual validada específica para HSP.

**Lo que evalúa EvaluMind:**
- Señal visual (cuadrado azul) entre ruido dinámico
- Niveles variables de ruido → se busca el umbral donde la detección cae
- Métricas: tasa de detección, umbral estimado, thresholdPct (0-100)
- Hipótesis: HSP → umbral más bajo (detecta señal con más ruido)

**Gaps críticos:**
1. 🔴 Sin precedente validado en la literatura — es investigación original
2. Sin datos normativos
3. La relación con HSP es teórica (basada en el modelo DOES) pero no validada experimentalmente
4. Es uno de los tests más innovadores del proyecto pero también el menos respaldado

**Recomendación:** Categoría C — Test original. Citar el marco DOES de Aron. Reconocer explícitamente en la UI que es experimental. Considerar colaboración con investigadores para validación.

---

### TEST 19 — Auditory Distraction / Distracción Auditiva (`auditory-distraction-v1`)

**Constructo:** Susceptibilidad a distracción auditiva (componente HSP)

**Base teórica:** Marco DOES de Aron (2010) — Ease of Excitation. Sin tarea validada específica.

**Lo que evalúa EvaluMind:**
- Tarea visual (detección de punto verde) con/sin distractores auditivos
- Métricas: distractionCost = RT(ruido) − RT(silencio) en ms
- Categorías: ≤25 baja, 26-55 moderada, >55 alta distractibilidad

**Gaps críticos:**
1. 🔴 Sin precedente validado — investigación original
2. Sin datos normativos
3. Los tipos de distractores (ruido blanco, tonos, voces) son razonables pero no estandarizados
4. Categorías (25/55) arbitrarias

**Recomendación:** Categoría C — Test original. Mismas consideraciones que Sensory Threshold.

---

### TEST 20 — Social Scenarios / Escenarios Sociales (`social-scenarios-v1`)

**Constructo:** Sesgo de interpretación de rechazo (complemento RSD)

**Base teórica:** Marco de Downey & Feldman (1996). Paradigma de escenarios sociales ambiguos usado en investigación experimental de RSD.

**Lo que evalúa EvaluMind:**
- 16 escenarios sociales ambiguos
- Juicio: ¿rechazo o casualidad? + impacto emocional (1-5) + probabilidad subjetiva (%)
- Métricas: rejectionRatio, meanImpact, biasScore
- Categorías: ≤20% sesgo bajo, 21-45% moderado, >45% alto

**Gaps:**
1. Sin instrumento estándar — cada estudio de RSD usa sus propios escenarios
2. 16 escenarios es razonable pero no validados
3. La metodología de escenarios ambiguos con doble interpretación es consistente con la literatura experimental
4. Categorías (20/45%) arbitrarias
5. Romero-Canyas et al. (2010) reporta d=0.6-1.0 para sesgo de interpretación en RSD

**Recomendación:** Categoría C — Test con base teórica sólida pero sin instrumento gold standard. Citar Downey & Feldman (1996) y Romero-Canyas et al. (2010). Es uno de los tests originales mejor fundamentados.

---

## Tabla de Prioridades

| Prioridad | # | Test | Acción | Esfuerzo estimado |
|---|---|---|---|---|
| 🔴 P0 | 9 | DAT | Implementar GloVe real, citar Olson et al. (2021) | Alto (rearquitectura del scoring) |
| 🔴 P0 | 18 | RMET | Usar 36 fotos reales o renombrar + citar Baron-Cohen et al. (2001) | Alto (requiere assets con licencia) |
| 🔴 P0 | 1 | TDAH | Migrar al ASRS-5 con 18 ítems y scoring validado | Medio (reescritura de ítems) |
| 🟡 P1 | 2 | TEA | Migrar al AQ-50 o RAADS-R | Alto (50-80 ítems nuevos) |
| 🟡 P1 | 4 | Alexitimia | Migrar al TAS-20 con 20 ítems y 3 subescalas | Medio |
| 🟡 P1 | 8 | FAS | 3 letras (no 1), scoring COWAT, normas Loonstra et al. (2001) | Medio |
| 🟢 P2 | 3 | HSP | Alinear con HSPS-27 (27 ítems, Likert 1-7) | Medio |
| 🟢 P2 | 5 | RSD | Migrar a formato A-RSQ (escenarios con doble valoración) | Alto (cambio de paradigma) |
| 🟢 P2 | 6 | Burnout | Incorporar CAT-Q (25 ítems), mantener burnout como complemento | Medio |
| 🟢 P2 | 7 | F. Ejecutivas | Citar BRIEF-A, expandir ítems | Medio |
| 🟢 P2 | 13 | SART | Ajustar % NoGo a 11%, citar Robertson et al. (1997) | Bajo |
| 🟢 P2 | 14 | Flanker | Citar Eriksen & Eriksen (1974), calibrar thresholds | Bajo |
| 🟢 P2 | 15 | Digit Span | Agregar Sequencing, citar WAIS-IV | Bajo |
| 🟢 P2 | 16 | Navon | Citar Navon (1977), calibrar thresholds | Bajo |
| 🟢 P2 | 17 | Switch Task | Citar Monsell (2003), calibrar thresholds | Bajo |
| 🟢 P2 | 12 | FER | Renombrar a "Reconocimiento Emocional Situacional", citar Prikachin et al. (2009) | Bajo |
| ⚪ P3 | 10 | Social Scenarios | Citar Downey & Feldman (1996). Test original bien fundamentado | Bajo (solo documentación) |
| ⚪ P3 | 11 | Self-Discrepancy | Citar Higgins (1987). Reconocer que mide masking, no self-discrepancy | Bajo (solo documentación) |
| ⚪ P3 | 19 | Sensory Threshold | Citar Aron DOES. Marcar como experimental en UI | Bajo (solo documentación) |
| ⚪ P3 | 20 | Auditory Distraction | Citar Aron DOES. Marcar como experimental en UI | Bajo (solo documentación) |

---

## Recomendación transversal

1. **Agregar un bloque de referencias** en cada test (UI de disclaimer + README) con los DOIs correspondientes
2. **Crear `fuentes.md`** con la bibliografía completa del proyecto
3. **Para tests Categoría A:** cambios mínimos de thresholds y agregar citas
4. **Para tests Categoría B:** plan de migración gradual a instrumentos validados
5. **Para tests Categoría C:** documentar como "tests experimentales originales de EvaluMind" con marco teórico citado
6. **Priorizar P0:** DAT, RMET y TDAH son los que más gap tienen entre lo que dicen ser y lo que realmente miden
