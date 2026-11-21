# GTA VII: Grand Terraforming Agents — misión comunitaria

> Concepto paródico original para AcademyVerso 2026. **No afiliado a Rockstar Games.** No usar logotipos, personajes ni imágenes de GTA. No sustituye la charla oficial ni convierte la web en un juego comercial.

## Historia

El próximo universo se construye, no se juega. El público elige una de dos rutas: **Vice Nebula** (metrópolis orbital neón) o **Colonia Centinela** (colonia segura con drones y cúpulas). Cada asistente contribuye una idea espacial desde GitHub Mobile o el formulario web, y un agente de programación propone mejoras al repositorio. El público ve objetos reales aparecer en la galaxia Three.js.

## Recorrido para participantes

1. Abrir [Grand Terraforming Agents](https://davidop.github.io/academyverso-2026/#grand-terraforming-agents).
2. Elegir **Vice Nebula** o **Colonia Centinela**. La web prepara un objeto planeta (nombre y descripción son editables). Introducir un alias no identificativo y confirmar una sola vez. También hay enlaces específicos de GitHub Mobile con el formulario de Issue precargado.
3. No eliminar el primer marcador de la descripción: `[GTA:VICE-NEBULA]` o `[GTA:COLONIA-CENTINELA]`. Debe estar al principio de la primera línea para que el contador lo reconozca.
4. La creación se convierte en GitHub Issue, pasa por GitHub Actions si procede, se registra en D1 y aparece en el universo 3D. El proceso puede tardar por el arranque del workflow.
5. Abrir la ficha del objeto, comprobar su Issue y comparar **creaciones acumuladas por escenario**. Son aportaciones, **no votos únicos**: una misma persona puede enviar varias ideas.

## Contrato técnico, sin migración

- No hay nuevo endpoint ni tabla D1. Los objetos conservan `type, name, alias, description, issue_number, issue_url` y las validaciones anteriores.
- La identificación de la misión depende del prefijo estable en **`description`**. `web/terraforming.mjs` concentra opciones, generación de formularios y conteo determinista.
- `web/app.js` utiliza las mismas respuestas de `/api/objects`; contadores y distintivos solo muestran la información presente en D1. El modo demo no fabrica votos.
- La UI crea planetas asociados a cada misión con colores neón originales en Three.js. La rama de Fase 1 incorpora navegación de cámara al destino y regreso, pendiente de integrar y ensayar. **No crea ciudades explorables, carreras ni una mecánica real de cinco estrellas**.
- La ruta GitHub Mobile precarga `tipo`, `nombre`, `descripcion` y deja libre el `alias` para la aportación. Al crear una Issue desde el formulario genérico sin marcador, aparece en el universo, pero **no suma a ninguna misión**.
- La visualización debe admitir un universo vacío, datos antiguos y descripciones no etiquetadas. Los secretos siguen solo en Cloudflare y GitHub Actions.

## Ensayo E2E antes de la conferencia

- [ ] Navegar desde Android y desde ordenador a la misión.
- [ ] Crear una aportación real a Vice Nebula y confirmar Issue, D1, contador y cierre automático de Issue.
- [ ] Crear una aportación real a Colonia Centinela y confirmar el otro contador.
- [ ] Verificar que una Issue genérica no altera los contadores de misión.
- [ ] Tras integrar PR Fase 1: abrir ficha GTA, viajar en 3D, regresar durante el vuelo y tras el aterrizaje; repetir en móvil, teclado y reducción de movimiento.
- [ ] Confirmar que objetos sin marcador GTA no muestran el botón de viaje y que una galaxia vacía no causa errores.
- [ ] Revisar CI en verde y evitar crear duplicados si hay error visual post-envío.
- [ ] Probar la presentación Slidev, el iframe y el enlace a la sección.
- [ ] Confirmar el estado real de agentes Copilot, Claude Code y Codex, incluyendo permisos y políticas.

## Alcance de los agentes (futuro, no demostrado por el formulario)

**Copilot** construye navegación al mundo elegido; **Claude** enriquece experiencia y efectos visuales; **Codex** agrega evaluación de calidad, pruebas de teclado, consistencia de datos y regresión. Cada propuesta debería llegar como PR trazable y ser integrada con intervención humana. Los prompts listos están en [prompts-agentes.md](prompts-agentes.md).

**Extensiones posconferencia:** mapa 3D de ciudades, misiones puntuables, niveles de búsqueda, transporte entre mundos y un desafío en la comunidad GitHub Spain. No forman parte de la release actual.
