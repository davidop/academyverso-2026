# AcademyVerso · Trazabilidad y cierre

## Alcance y ruta

Preparar dos escenas locales para revisión por separado a partir de la base S01. S11 y S17 no comparten archivos de componente y se delegan en paralelo. El coordinador integra presentation/slides.md y conserva sus números y notas. No tocar S08, S14, la app ni publicar este corte antes de su revisión. Estrategia single-pr para este corte; forecast ~260 líneas.

No se encontró configuración TDD; se mantiene sin RED obligatorio. Runner de integración: npm run build y Chromium Playwright; RDD desactivado globalmente.

## Tareas

- [x] P01 S11: recorrido Issue / Validación / Worker + D1 / Three.js. Mantener la dependencia explícita, reversible en Slidev y legible sin color. Prop clicks.
- [x] P02 S17: logo oficial 144 px, planeta y estrellas compartidos, QR del repo real inmóvil. Entrada breve, estado reducido e impresión.
- [x] P03 Integración del coordinador: 17 escenas, pruebas de las dos rutas, capturas separadas, commits enfocados y URLs de revisión. No push ni PR de estas dos hasta revisar.

Base de previsualización: a3ba077; plan aprobado en presentation/{DESIGN.md,storytelling.md,plan-visual.md}. Maquetas en docs/design/academyverso-mockups.

- P01: 3e4436b. Chromium: tres pasos, retroceso y restauración tras recarga, aviso en Worker y movimiento reducido.
- P02: d62ba1f. Chromium: QR real decodificado, posición fija, foco, logo 144 px, modo reducido, impresión y ajuste móvil.
- P03: build de producción y captura 1280 × 720 de ambas. Riesgo: ninguno fuera de S11/S17; no se editó CSS global ni se publicaron. Preview local 3045; siguientes cambios tras revisión.
