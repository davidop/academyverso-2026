# AcademyVerso · Plan visual y de movimiento

**Guion aprobado; composición visual en revisión.** El [guion narrativo](storytelling.md) define qué cuenta la escena; [DESIGN.md](DESIGN.md) fija la marca, la escala y las reglas de movimiento. Las cuatro imágenes aprobadas son anclas de estilo, no un fondo que se exporta sin editar.

> **Nota tras integrar main:** el deck pasa a 20 escenas. La tabla siguiente conserva los IDs S01–S17 del corte de rediseño; el mapa a los números actuales de Slidev está en [storytelling.md](storytelling.md).

## Escena a escena

La última columna describe el cambio de estado y cómo enlaza con la siguiente escena. «Corte» significa sin transición larga ni clicks extra.

| Escena | Encuadre y capas para la imagen de revisión | Movimiento y salida |
| --- | --- | --- |
| S01 · Portada | Logo oficial, título grande, astronauta original y horizonte violeta. | La pregunta entra por una máscara corta; corte sobre la palabra «móvil» a S02. |
| S02 · Idea | Dos frases en el mismo punto, con cursor primero y marca de encargo después. Sin dos tarjetas. | Un clic sustituye «escríbeme código» por «encárgate del cambio». El cursor queda como punto de partida de S03. |
| S03 · Misión | Plano ancho de la galaxia; planeta del portal como ancla. Ilustración o captura real rotulada, según corresponda. | El punto abre el plano, se señalan un par de mundos y el escenario se estabiliza. Cortar a las caras. |
| S04 · Tripulación | Dos retratos existentes con nombres grandes y línea de misión compartida. | Aparición breve de ambos, sin pasos que retrasen la presentación. Corte limpio al móvil. |
| S05 · Consola · A3 | Órbita menta de la imagen aprobada, móvil en origen, testigo naranja y planeta recortado. | El pulso lleva la tarea al agente y al PR, hace una parada explícita en revisión humana y solo entonces llega al resultado. Etiquetas quedan legibles al parar. |
| S06 · Agentes | Tres nombres con verbos grandes, sobre el mismo arte; no tres columnas de tarjetas. | Tres focos controlados o un único relevo breve. Sale por coincidencia con el verbo del siguiente rótulo. |
| S07 · Preparación | Móvil con captura real de ensayo, sin datos sensibles; tres indicaciones en el margen. | Resaltar repo, agente y rama sobre una toma estable. Cortar al portal; no desplazar QR con una transición. |
| S08 · Portal · A1 | Usar el piloto: logo oficial, planeta y QR real. Añadir dos o tres estrellas pequeñas entre anillos como en la referencia. | Iris reversible de ~950 ms. Una estrella puede responder a la apertura una vez. QR quieto y operativo antes, durante y después. |
| S09 · Imaginación · A2 | Titular protagonista, línea de señal y nombres «Neón-42 · Anillos de cristal · Tres lunas». | La línea dibuja tres hitos y se queda quieta. Corte por el planeta violeta hacia una vista real. |
| S10 · Galaxia | Área central sin distracciones para app real o respaldo rotulado. | Marco estático. El movimiento pertenece a la app; no ejecutar otra animación detrás. Corte a la Issue. |
| S11 · Trazabilidad | La misma Issue cruza un recorrido con cuatro marcas: registro, validación, datos, universo. | Cada clic enfoca el paso; separar con texto si la integración está pendiente. La marca de registro cambia a primera marca de película. |
| S12 · Relevo · A4 | Tira inclinada de la referencia con tres fotogramas y el mismo viaje; nombres en HTML. | Cortes alineados por el planeta y el destino: construir, mejorar, validar. Salir sobre el primer fotograma, que S13 amplía. |
| S13 · Construir | Origen/destino y una trayectoria sin vestir; etiqueta de PR real o de respaldo. | Un clic muestra «Viajar aquí» y el recorrido ilustrado; detener al pasar a la demo. |
| S14 · Mejorar | Mismo plano y trayecto que S13, con estela, feedback y llegada claros. | Comparación antes/después con recorte en el mismo punto, no dos vídeos corriendo. La estela pasa a línea de comprobación. |
| S15 · Validar | Vista de comprobación sobria; destacar un caso de teclado, retorno o movimiento reducido. | Mostrar evidencia observada o maqueta etiquetada; animar el foco, no simular el éxito de CI. |
| S16 · Resultado | Ventana de demo estable con salida separada a la app y una frase de criterio. | Viajar/volver en la app o clip de respaldo. Sin arranque automático ni interrupciones para esperar agentes. |
| S17 · Cierre | Logo, titular, QR del repo y horizonte de la apertura en segundo plano. | Revelado de fondo corto sin mover el QR. El estado final se queda en pantalla para preguntas. |

## Cómo revisar 17 escenas sin generar 17 fondos

- **Primero, reutilizar:** S05 ← A3, S08 ← A1/piloto, S09 ← A2, S12 ← A4. Revisarlas con marca real y sin fecha de maqueta. El fotograma de S08 puede salir directamente del piloto una vez ajustadas las estrellas.
- **Capas de proyecto:** logo, astronauta y fondo existentes; planeta WebP del piloto; fotos ya usadas con nombres verificados; capturas nuevas solo para móvil, app y CI con datos adecuados para proyección. No se recrean pantallas de producto con texto inventado.
- **Capas vectoriales:** estrellas, órbitas, línea de señal, tira de película, estela y marcadores salen de SVG/CSS. Para una estrella simple, redibujar suele ser más fiel que recortar píxeles pegados al fondo. Reservar extracción por máscara/Python para un recorte con bordes limpios que pueda inspeccionarse; si hay textura solapada o halos, regenerar el objeto aislado. No extraer marcas ni QR de una maqueta.
- **Generación acotada:** si la tira necesita ilustraciones, crear un mismo plano base y las variantes que realmente cambian. El planeta y el fondo se comparten; no generar un halo, una estrella o un planeta por slide. Para la primera revisión general, preparar **cuatro fotogramas**. Después, usar el render del código como vista de revisión de cada escena; reservar otra generación para un problema concreto de composición. Para S05, S08 y S12 añadir un fotograma inicial/final o una nota de beat; no renderizar fotogramas intermedios por deporte.
- **Paralelo tras el visto bueno del texto:** por un lado inventario, SVG y capas aisladas reutilizables; por otro composición de las imágenes de revisión. Una misma persona integra proporciones y tokens para evitar que las 17 escenas parezcan estilos diferentes.

## Referencias y qué se toma de ellas

| Referencia | Aplicación aquí |
| --- | --- |
| [Beatdeck, de Borja Pérez](https://github.com/borjaperfra/beatdeck) | Un clic por cambio narrativo; estado recuperable y escenario fijo. Se toma el patrón, no se migra a React. |
| [Every Slide Is Code · movimiento](https://github.com/kiselas/every-slide-is-code/blob/main/05-motion.md) y [transiciones](https://github.com/kiselas/every-slide-is-code/blob/main/06-transitions.md) | Diseñar estados de reposo y transiciones que mantengan el mismo objeto. Comparar posiciones y revisar los fotogramas inicial/final, no solo el resultado final. |
| [Google Labs · DESIGN.md](https://github.com/google-labs-code/design.md) | Archivo autocontenido con tokens y decisiones de marca. Basta con pasarlo al agente explícitamente; usar Stitch o su skill no es requisito. |
| [Deck Design System](https://github.com/svg153/skills/blob/main/skills/deck-design-system/SKILL.md) | Extraer y conservar marca, tipografía y recursos, y verificar por captura. La skill parte de PPTX; no sustituye el runtime de movimiento. |
| [Image to Slide](https://github.com/svg153/skills/pull/102) · PR integrada | Usar su enfoque de capas editables desde una imagen y una especificación común. Su salida HTML/PPTX no se adopta como motor: aquí existe un deck Slidev y se cambia la dirección visual. |
| [HyperFrames](https://github.com/heygen-com/hyperframes) | Referencia para componer y comprobar segundo inicial, intermedio y final. Reservarlo para un clip o una necesidad que justifique otro renderizador. |

## Qué se aprueba y qué se entrega

1. **Guion y sistema visual:** propuesta aprobada para arrancar la revisión visual. Esta PR documenta el acuerdo y la preparación del repositorio; no sustituye ninguna escena.
2. **Cuatro fotogramas de conjunto:** S01 (portada), S11 (trazabilidad), S14 (mejora del viaje) y S17 (cierre). Validar jerarquía, continuidad y legibilidad; compartir las maquetas fuera de la rama de producción. Las cuatro direcciones ya aceptadas (A1–A4) siguen asignadas a S08, S09, S05 y S12.
3. **Implementación con revisión escena a escena:** al validar el conjunto, conservar rutas, notas y navegación de Slidev. Las siguientes propuestas visuales pueden ser capturas del código, sin esperar otra generación raster. Preparar capas compartidas en paralelo cuando las escenas sean independientes. CSS/SVG primero; solo añadir WAAPI/GSAP si una prueba lo justifica. No usar HyperFrames en la navegación por clic; considerarlo solo para un clip o una necesidad demostrada.
4. **PR de implementación:** build, capturas de cada escena, revisión de texto/contraste, mando y teclado en ambos sentidos, salto y recarga, vista del ponente, QR decodificado, móvil, movimiento reducido, impresión y plan sin red. Verificar que app, permisos y despliegue no cambian. Adjuntar pruebas para David; no hacer merge en nombre de los ponentes.
