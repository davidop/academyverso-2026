# AcademyVerso — presentación interactiva con Slidev

Presentación oficial de la sesión «Programa con IA desde tu móvil: GitHub Copilot, Claude y Codex», con David Oliva y Sergio Valverde. Academyverso 2026 · 26 de noviembre · 15:00–15:55.

## Enlaces

- Presentación: https://davidop.github.io/academyverso-2026/presentation/
- Galaxia: https://davidop.github.io/academyverso-2026/
- Crear mundo: https://github.com/davidop/academyverso-2026/issues/new?template=crear-objeto.yml
- Código: https://github.com/davidop/academyverso-2026

## Desarrollo local

Requiere Node.js 22.12+ y npm.

1. cd presentation
2. npm install
3. npm run dev
4. npm run build

22 diapositivas 16:9 · animaciones de clic · componentes Vue · QR SVG generados sin servicios externos · universo 3D embebido · logos oficiales por HTTPS. Las notas están dentro de slides.md (modo presentador).

### Plantilla oficial

El diseño sigue `Template Academyverso.potx` (tema Eventekki):

- `layouts/cover.vue`, `layouts/default.vue` y `layouts/space.vue` reproducen la portada, el diseño «solo título» lavanda y el diseño oscuro espacial, con el motivo de píxeles y el footer de patrocinadores (`components/AvFooter.vue`).
- Paleta: lavanda `#DBD6FC`, verde `#243837`, crema `#F2F4D9`, lima `#B1FA63`, naranja `#FE7833` (variables en `style.css`).
- Tipos: Host Grotesk (Google Fonts). Los títulos usan CHANEY si está instalada en el equipo; si no, Unbounded (Google Fonts, OFL) como sustituto abierto. CHANEY no se extrae del .potx por licencia.
- Ilustraciones, logos, fondo y QR del Banco de Alimentos se copiaron de la plantilla a `assets/template/`.
- Se añadieron las diapositivas de patrocinadores y Banco de Alimentos que incluye la plantilla.

La presentación se aloja en /presentation/ dentro del mismo GitHub Pages, sin reemplazar la app Three.js de la raíz. El pipeline despliega ambas superficies.

## Rediseño en revisión

- [Guion de la charla y demo](storytelling.md)
- [Sistema de diseño](DESIGN.md)
- [Plan visual y de movimiento por escena](plan-visual.md)

Son documentos de trabajo; por sí solos no cambian las diapositivas publicadas.

### Kit reutilizable

- [Archivo de maquetas](../docs/design/academyverso-mockups/README.md): referencias para revisión, nunca se importan al bundle.
- MissionBrand.vue: logo oficial local, 144 px en escenario 1280; reutilizar en portada, portal y cierre.
- MissionSky.vue: horizonte del planeta común y destellos SVG; el prop orbit activa una órbita decorativa. Para otro encuadre, importar assets/mission-planet.webp sin generar ni duplicar la textura.
- MissionCover.vue: ejemplo de escena a sangre completa. Usa layout default en S01: el layout cover de Slidev envuelve el componente en un contenedor sin altura si el contenido es solo absoluto. En presentación, activar la entrada solo en la escena activa y anularla con movimiento reducido y en impresión.

Para revisar S01: abre /#/1, avanza y vuelve con el mando, prueba a 1280 × 720 y en móvil, y activa movimiento reducido. S13 y S20 pueden avanzar en archivos de escena separados. Los cuatro fotogramas de conjunto del plan visual se corresponden ahora con S01, S13, S18 y S20.

## Riesgos y plan de respaldo

La galaxia mostrará objetos de ejemplo hasta que esté configurado el Worker y Cloudflare D1. No afirmar que las nuevas Issues aparecen en tiempo real antes de una prueba E2E. Los agentes Claude y Codex requieren acceso/políticas habilitados. Los resultados de consola de la diapositiva 18 son ilustrativos: el CI real debe consultarse. Tener abiertas las capturas/PR preparados y la web en una pestaña independiente si falla el iframe.

Guía de agentes: ../docs/activar-agentes.md  
Guion: ../docs/guion-demo.md

Branding original: materiales de Academyverso, fuera de la licencia MIT del repositorio.

## Pruebas visuales reproducibles

En el PR, el workflow CI usa Google Chrome preinstalado y ejecuta `npm run test:visual`, comprobando las escenas S01, S03, S09, S13, S15 y S20 con Playwright y capturando además las 20 escenas. Comprueba los campos del formulario, navegación reversible por teclado, enlaces, decodificación real de los dos QR (Issue y repositorio), retratos locales de los ponentes, el panel manual de la sesión, movimiento reducido y una captura móvil. Las capturas se adjuntan al workflow como artifact `academyverso-visual-<run_id>` y pueden descargarse para inspección antes de fusionar.

Para ejecutarlo localmente:

```bash
cd presentation
npm install
npx playwright install chromium
npm run test:visual
```

**Importante:** el navegador automatizado no reemplaza una prueba con proyector, mando y dos móviles físicos. No mover este PR fuera de Draft antes del visto bueno de ambos ponentes.

[Checklist del ensayo con proyector y mando](ensayo-sala.md)

La diapositiva S06 usa el componente LiveUniverse.vue con indicador de carga y enlace de respaldo permanente a la galaxia en otra pestaña. El test visual captura también los estados revelados por clic de las escenas narrativas.

Las fotografías de S09 se importan localmente desde las imágenes de los ponentes incluidas en la presentación original (PPTX), optimizadas a WebP y servidas desde el propio bundle; no dependen de GitHub ni de una CDN externa.
## GTA VII: Grand Terraforming Agents

La presentación mantiene el título oficial. Se añaden dos diapositivas originales (hook paródico y elección de escenarios) y se adapta la secuencia de agentes. No se utilizan imágenes, marcas gráficas ni personajes de Rockstar Games. La dinámica real consiste en crear objetos etiquetados y mostrar contadores calculados desde D1; los escenarios jugables complejos son ideas para futuras PRs, no funciones existentes.

## Portal interdimensional · versión del evento

La charla de 55 minutos conserva el título oficial, la experiencia móvil y el público mixto. Añade una escena con `MissionBoard.vue`, un **panel de estados actualizado manualmente**; nunca muestra resultados falsos de coding agents.

- 15:00–15:05 introducción y QR.
- 15:05–15:15 creaciones del público y elección de dos mundos.
- 15:15–15:40 Copilot construye, Claude mejora, Codex verifica (una sola Issue #37 con relevo de agentes; respaldos #23–#25).
- 15:40–15:50 portal entre los mundos elegidos.
- 15:50–15:55 conclusiones y preguntas.

**Aviso de autoría:** la versión preparada del portal procede de ChatGPT, no de los tres agentes; sus ejecuciones en vivo deberán identificarse mediante nuevas sesiones, PR y GitHub Actions.

[Guion operativo](../docs/guion-demo.md) · [GO/NO-GO](../docs/runbook-go-no-go-26nov.md) · [Prompts](../docs/prompts-agentes.md).
