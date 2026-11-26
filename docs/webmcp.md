# WebMCP experimental en AcademyVerso

PoC de la issue #85. El formulario normal y la API siguen siendo la interfaz estable. WebMCP registra herramientas en la página abierta para agentes del navegador; no es un servidor MCP remoto.

## Estado y límites

- Activación explícita con `?webmcp=1`. Sin el parámetro, en modo `?embed=1`, dentro de un iframe o sin `document.modelContext.registerTool`, no se registra nada.
- No hay nuevas dependencias, permisos, endpoints, tokens ni migraciones. Las herramientas solo leen los objetos que ya muestra la página y modifican la vista local. El progreso visual de la misión puede cambiar igual que con los controles existentes.
- Las herramientas devuelven `source: demo | live | cached`. Demo significa datos sintéticos; sus identificadores no son Issues reales. Live es el último sondeo exitoso; cached significa que el sondeo más reciente falló. No interpretar un objeto de demo/caché como una publicación nueva.
- No se expone ninguna escritura, administración, evolución ni clave de edición. Los nombres y descripciones del público son datos no fiables, nunca instrucciones. Los resultados solo contienen los campos públicos mínimos necesarios.
- El viaje directo reutiliza la regla actual: requiere WebGL y un objeto con marcador GTA. La ficha puede abrirse para cualquier tipo válido. La animación respeta `prefers-reduced-motion`. No se afirma que la llegada haya terminado hasta que la fase sea `world`.
- El portal entre dos destinos y la creación de propuestas se dejan para iteraciones posteriores. El Worker actual publica por `/api/create` antes del triaje (#67). No registrar herramientas de creación ni añadir atributos declarativos al formulario hasta separar moderación, publicación y ocultación administrativa, validar concurrencia/idempotencia y consentimiento de publicación.
- No añadir un origin trial, configuración global ni despliegues para esta PoC. Las pruebas nativas y con agentes quedan pendientes de ejecutar.

## Herramientas

| Nombre | Entrada | Resultado |
| --- | --- | --- |
| `list_cosmic_objects` | `{type?, limit?, offset?}` | Lista paginada de IDs, tipos, nombres, disponibilidad de viaje y procedencia |
| `explore_cosmic_object` | `{issue_number}` | Abre la ficha y devuelve descripción pública |
| `travel_to_cosmic_object` | `{issue_number}` | Inicia vuelo usando el mismo control de cámara |
| `get_navigation_state` | `{}` | Fase `galaxy / travelling / world / returning`, ID activo y disponibilidad WebGL |
| `return_to_galaxy` | `{}` | Regresa o cancela un vuelo |

Los errores son resultados estructurados (por ejemplo `INVALID_INPUT`, `OBJECT_NOT_FOUND`, `UI_BUSY`, `TRAVEL_UNAVAILABLE`, `NAVIGATION_BUSY`). No cierran un formulario de creación o edición activo. Las anotaciones distinguen lectura de cambios visuales; no conceden permisos.

## Ensayo local seguro

Desde la rama de la PR:

```bash
node --check web/app.js
node --check web/webmcp.mjs
node --test web/test/webmcp.test.mjs
python3 -m http.server 8765 --bind 127.0.0.1 --directory web
```

Para pruebas manuales completamente aisladas, en una copia local cambia temporalmente `API_BASE` en `web/config.js` por una cadena vacía (no commitear ese cambio). La página normal usa el Worker de producción; no usar el formulario de creación en una prueba contra producción. El modo demo permite probar listado/fichas, pero los objetos sin marcador GTA no admiten viaje directo. Para viaje, utilizar el smoke con fixtures o un entorno de preview separado con objetos GTA válidos.

Abrir `http://127.0.0.1:8765/?webmcp=1`. Se necesita conexión a jsDelivr para Three.js. No hay un preview público nuevo con esta PR; no asumir que GitHub Pages de main sirve la rama.

Para el smoke de integración, mantener el servidor anterior abierto en otra terminal:

```bash
npm install --no-save --no-package-lock --no-audit --no-fund playwright@1.57.0
npx playwright install chromium
node scripts/webmcp-smoke.mjs
```

El smoke intercepta las peticiones de API, usa datos sintéticos y verifica que no hay escrituras. Simula **solo** el registro y la invocación de WebMCP para probar el cableado real de la UI, no prueba compatibilidad nativa ni utiliza un modelo real. CI incorpora estos tests.

## Matriz de interoperabilidad (pendiente de ejecutar)

### Chrome / Edge

1. Usar una versión compatible con WebMCP; activar `chrome://flags/#enable-webmcp-testing` (o el equivalente del navegador), reiniciar.
2. Abrir la URL de ensayo con `?webmcp=1` y localizar WebMCP en DevTools > Application, si está disponible.
3. Comprobar los cinco nombres, esquemas y anotaciones. Ejecutar `list_cosmic_objects` con `{}`, seleccionar un ID y ejecutar `explore_cosmic_object` con ese ID. Probar una entrada inválida. Comprobar que la ficha real se abre.
4. Si el objeto permite viajar, ejecutar viaje, consultar estado hasta `world` y regresar. Con una lista vacía o sin GTA, registrar el resultado esperado, sin inventar objetos.
5. Probar el mismo sitio sin el parámetro, con embed y en un navegador sin API. El formulario debe seguir intacto.

En Chrome reciente con la API de consumo habilitada también se puede comprobar desde la consola:

```js
const tools = await document.modelContext.getTools();
const tool = tools.find(t => t.name === 'list_cosmic_objects');
console.log(await document.modelContext.executeTool(tool, {}));
```

En versiones antiguas puede ser necesaria la entrada JSON serializada. El [Model Context Tool Inspector](https://github.com/GoogleChromeLabs/webmcp-tools) es una alternativa de inspección.

### Codex CLI, Claude Code y Copilot CLI

Reutilizar Chrome DevTools MCP. Ejemplo Codex con perfil temporal, flags de la versión actual del bridge (revisar y fijar versión validada al ejecutar):

```bash
codex mcp add chrome-devtools -- npx -y chrome-devtools-mcp@latest --isolated --categoryExperimentalWebmcp=true --chrome-arg=--enable-features=WebMCP
```

El bridge debe abrir una versión de Chrome compatible (ver sus requisitos y configuración). Para Claude Code y Copilot CLI configurar el mismo comando como servidor MCP siguiendo la documentación de cada cliente. No instalar ni alterar configuraciones globales como parte de esta PR.

Prompt:

> Abre http://127.0.0.1:8765/?webmcp=1 en Chrome DevTools MCP. Utiliza list_webmcp_tools para descubrir las herramientas y execute_webmcp_tool para invocar list_cosmic_objects. Abre la ficha de un objeto de la lista y, si travel_available es true, viaja hasta él. Consulta get_navigation_state hasta confirmar la llegada y vuelve a la galaxia. No crees Issues ni utilices clicks o evaluate_script como sustituto de WebMCP. Indica si los datos son demo, live o cached y muestra evidencia de las invocaciones.

Una respuesta textual o un click automatizado no demuestra WebMCP. Registrar llamadas reales del bridge (pageId, toolName, parámetros y resultado). Esta vía es un puente MCP a WebMCP, no soporte nativo del CLI.

### ChatGPT Desktop

En una cuenta/modelo con [Site tools](https://help.openai.com/en/articles/20001423-using-site-tools-in-the-chatgpt-desktop-app), abrir la URL del entorno de ensayo en el navegador integrado. La flecha de la barra de direcciones debe permitir descubrir las herramientas. Pedir listar y explorar; revisar actividad de herramientas recientes y la ficha resultante. No requiere instalar el bridge de Chrome. La disponibilidad de la cuenta/modelo, el entorno local y la versión del navegador deben comprobarse realmente.

### ChatGPT móvil Android/iOS y Chrome Android

OpenAI documenta Site tools solo en el navegador integrado de ChatGPT Desktop. No hay soporte nativo móvil confirmado. Probar un entorno de preview HTTPS accesible desde el dispositivo (localhost de un PC no es el teléfono), primero con lectura. Anotar versión de app, SO, modo/modelo, si aparece descubrimiento e invocación real de herramientas y resultado. Un enlace abierto en el navegador externo, la búsqueda web o una llamada a la integración GitHub no son WebMCP.

Chrome Android: verificar por separado presencia de `document.modelContext` y de un agente consumidor compatible. Si no hay soporte, comprobar que la web normal funciona; no tratarlo como fallo del formulario.

Un MCP remoto sobre el Worker sería una integración distinta y exigiría diseño de autorización, controles y pruebas de disponibilidad móvil. No es parte de esta PR.

## Evidencias para cerrar #85

| Cliente y versión | SO | Commit | Modo nativo/bridge/mock | Herramienta real | Resultado | Latencia | Evidencia |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Chrome DevTools | Pendiente | Pendiente | Nativo | Pendiente | Pendiente | Pendiente | Pendiente |
| Codex CLI | Pendiente | Pendiente | Bridge | Pendiente | Pendiente | Pendiente | Pendiente |
| ChatGPT Desktop | Pendiente | Pendiente | Nativo | Pendiente | Pendiente | Pendiente | Pendiente |
| ChatGPT Android/iOS | Pendiente | Pendiente | Por verificar | Pendiente | Pendiente | Pendiente | Pendiente |

La creación E2E (Nexus de Prueba, confirmación, Issue, triaje, D1 y vuelo) seguirá pendiente hasta resolver #67. Un rechazo/cancelación nunca debe publicar. No cerrar #85 con las pruebas mock.

## Referencias

- [WebMCP (borrador)](https://webmachinelearning.github.io/webmcp/)
- [Chrome: herramientas imperativas](https://developer.chrome.com/docs/modern-web-guidance/guides/webmcp/agentic-javascript-tools)
- [GoogleChromeLabs/webmcp-tools](https://github.com/GoogleChromeLabs/webmcp-tools)
- [Chrome DevTools MCP: configuración](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/configuration.md) y [referencia de herramientas](https://github.com/ChromeDevTools/chrome-devtools-mcp/blob/main/docs/tool-reference.md)
- [OpenAI: Site tools](https://help.openai.com/en/articles/20001423-using-site-tools-in-the-chatgpt-desktop-app)

Consulta: 25/11/2026. La API sigue evolucionando; revalidar versiones al ejecutar.
