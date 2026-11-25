# AcademyVerso · Base de movimiento

## Objetivo y alcance

Primer corte del rediseño autorizado: archivar las ocho maquetas ya revisadas, introducir una gramática visual reutilizable y sustituir S01. Integrar el portal S08 ya probado solo si cabe en un corte propio revisable; mantener su QR y añadir los destellos pedidos. No cambiar app, Worker, permisos, CI ni hacer merge. Una única textura WebP es el planeta de misión: variar encuadre, no reemplazar la identidad de la ilustración. Logo oficial de 144 px en lienzo de 1280 px, no el logo dibujado en la maqueta.

## Ruta y entrega

Ruta directa para la base: el coordinador diseña, implementa y verifica S01 antes de repartir cambios. Las escenas posteriores son cortes separados: S11 y S17 se pueden asignar en paralelo con archivos propios; S14 espera el plano S13 para preservar el recorrido. Entrega de este corte en una PR contra la rama de planificación mientras la PR #1 siga pendiente. Estrategia single-pr para el corte de base; forecast ~300 líneas de código/documentos, excluidos WebP. Si la fase siguiente supera el umbral, resolver la cadena antes de su siguiente commit.

No se encontró configuración TDD en la rama de destino; no se activa TDD por inferencia. Checks funcionales: npm run build en presentation, Node y Chromium Playwright para inspeccionar rutas, estados, recursos y modo reducido. RDD global desactivado; verificación ordinaria.

## Tareas

- [x] F01 · Archivar las ocho maquetas como WebP, con procedencia, ID, tamaño y política de uso. No usar imágenes de slide completa en el runtime.
- [x] F02 · Crear la base compartida (logo real reducido, planeta, estrellas) y montar S01. Verificar 16:9, proyección, móvil, entrada, retroceso, acceso directo, estado reducido e impresión.
- [x] F03 · Publicar corte verificable para revisión mediante GitHub; no mezclarlo. Preparar handoff para S11/S17 con API del kit, criterios y archivos disjuntos.

## Evidencia y próximo paso

Estado inicial: rama aislada codex/academyverso-motion-foundation desde b8f5407 (PR #1), piloto A1 original en bcd4c36 permanece intacto. Tras este corte, implementar el resto por escenas y compartir capturas de código.

F01: be60fb0. Ocho originales convertidos a WebP de 1280 × 720, relación 16:9 comprobada al decodificar, sin incorporar archivos al runtime.

F02: a3ba077 (remoto b3a4766). Build Slidev y DESIGN.md lint limpios; Chromium comprobó logo 144 px, tres imágenes locales, entrada, PageDown/PageUp, recarga, reducción, impresión y móvil. S17 intacta. Riesgo: ninguno fuera de S01; no se modificó el estilo global ni la aplicación.

F03: PR #2 en borrador abierta sobre rama de planificación con sus dos commits verificados por árbol Git. Los borradores S11/S17 se preparan fuera de este corte en codex/academyverso-scenes-preview. Sin merge.
