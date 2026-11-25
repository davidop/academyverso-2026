# Prompts para GitHub Mobile — portal interdimensional AcademyVerso

**Charla:** 26/11/2026 · David Oliva + Sergio Valverde · público mixto 25–50 personas.  
**Objetivo:** una misión evolutiva, no tres tareas independientes: Copilot construye → Claude enriquece → Codex verifica. El público aporta dos mundos por GitHub Issue.  
**Issue de la misión:** una sola, [#37](https://github.com/davidop/academyverso-2026/issues/37). Se asigna por relevo a cada agente; cada fase abre su propia PR con `Refs #37` (sin `Closes`) y los ponentes cierran la Issue al terminar Codex. El relevo paso a paso está en el [guion](guion-demo.md#relevo-en-una-sola-issue).

> No atribuir a los agentes la referencia preparada en [PR #22](https://github.com/davidop/academyverso-2026/pull/22) ni las PR de respaldo #23–#25: estas son de ChatGPT. Para demostrar ejecución de los coding agents, usar sesiones y PR **nuevas, reales y rastreables**.

## Prerrequisitos y rama de seguridad

1. Probar en ambos teléfonos el acceso a **GitHub Mobile**, al repositorio y a las herramientas de agentes. No confundir **modelo Claude** en selector con **Claude coding agent**, ni modelo OpenAI con **Codex coding agent**.
2. Usar **`demo/portal-seed-26nov`** como rama base de la demostración, creada antes de integrar el portal en `main`. No dar permisos a los agentes para aplicar cambios directamente en producción.
3. Cada agente debe abrir una **PR dirigida a la rama de demo**, revisar diff y checks antes de integrarla; la siguiente misión hereda exactamente el resultado anterior.
4. En cualquier momento se puede abandonar la cadena de código en la rama aislada y utilizar el portal estable ya probado en `main`. Indicar cuándo se muestra una referencia preparada.

## 1 · Copilot — construir (15:15–15:23)

**[Issue #37 · fase 1](https://github.com/davidop/academyverso-2026/issues/37)** · [Respaldo #23](https://github.com/davidop/academyverso-2026/pull/23)

```text
Somos dos ponentes de AcademyVerso 2026 y dirigimos esta tarea desde GitHub Mobile.
Trabaja en davidop/academyverso-2026, crea una rama a partir de
demo/portal-seed-26nov y abre una PR contra esa rama (nunca main).

El público ha creado planetas mediante Issues reales. Construye un portal
interdimensional Three.js que permita elegir DOS mundos distintos ya existentes,
con selector origen/destino legible en móvil y un viaje de cámara suave entre
ambos. No inventes contribuciones; si D1 tiene menos de dos mundos, desactiva
el portal. Con modo demo muestra claramente que son ejemplos.
Conserva la navegación, botón de regreso, teclado, formulario, Issue URLs,
accesibilidad, y prefers-reduced-motion (salto inmediato).
No cambies Worker, D1, Foundry, claves ni configuración de despliegue.
Añade tests deterministas para selección y ruta; documenta lo ejecutado.
Abre PR para revisión humana, sin fusionar automáticamente.
En la descripción de la PR escribe "Refs #37". No uses Closes ni Fixes.
```

**Qué enseñar al público:** Issue real, agente real trabajando, diff propuesto, revisión humana. Si no termina, anunciar explícitamente «Vamos a utilizar nuestra referencia preparada con ChatGPT» y pasar a #23.

## 2 · Claude — enriquecer (15:23–15:31)

**[Issue #37 · fase 2](https://github.com/davidop/academyverso-2026/issues/37)** · [Respaldo #24](https://github.com/davidop/academyverso-2026/pull/24)

```text
Parte del resultado que acaba de dejar Copilot en la rama
demo/portal-seed-26nov o del respaldo #23 declarado como tal.
NO vuelvas a implementar el portal desde cero.

Dale personalidad cinematográfica: dos anillos energéticos diferenciados,
destellos y partículas ligeras, estética espacial original y un tránsito
legible. Mantén buen contraste de textos, targets táctiles, reduced-motion,
LOD básico y compatibilidad con móvil. Evita recursos protegidos de GTA,
modelos remotos, efectos de alto consumo y cambios en Worker/D1.
Entrega antes/después con capturas auténticas y PR revisable que compare
contra la misma rama de ensayo. No atribuyas una referencia preparada
a una sesión Claude que no haya ocurrido.
En la descripción de la PR escribe "Refs #37". No uses Closes ni Fixes.
```

**Qué enseñar:** antes/después del código de la fase 1 en la misma rama. Si no hay acceso a Claude partner agent, explicarlo sin confundirlo con un modelo de Copilot, y enseñar #24 como respaldo.

## 3 · Codex — verificar (15:31–15:40)

**[Issue #37 · fase 3](https://github.com/davidop/academyverso-2026/issues/37)** · [Respaldo #25](https://github.com/davidop/academyverso-2026/pull/25)

```text
Parte de la rama demo que conserva los cambios de Copilot y Claude
o sus respaldos declarados. Valida el portal y abre una PR con los tests.

Comprobar: cero mundos, uno, duplicados, origen=destino, ID desaparecido
durante el polling de D1, selección estable, viaje en tres fases, llegada,
regreso en mitad del vuelo, prefers-reduced-motion, accesibilidad de controles
y sin fugas de geometrías Three.js. Añade tests de funciones puras y un
smoke Playwright/WebGL en viewport Android y escritorio, si el entorno permite
ejecutarlo. Con 50 objetos sintéticos no confundas stress con participación
real ni inventes FPS de dispositivos físicos. En la PR enlaza los logs reales
de GitHub Actions y registra lo que NO se ha validado.
No toques Worker, secretos ni rama main. Revisión antes de merge.
En la descripción de la PR escribe "Refs #37". No uses Closes ni Fixes.
```

**Qué enseñar:** test añadido, ejecución real en Actions, diff/observaciones y un fallo corregido si aparece.

## Cómo alternan David y Sergio

- **David** introduce Copilot y ejecuta la misión 1; **Sergio** cuenta qué va cambiando en la Issue y controla Slidev.
- **Sergio** lanza la fase Claude y explica el antes/después; **David** compara los efectos en AcademyVerso.
- **David** inicia Codex y explica seguridad/calidad; **Sergio** abre Actions y muestra las evidencias.
- En cada fase intercambiar roles durante algunos minutos y dejar claro quién ejecuta móvil y quién narra.

## Políticas de contingencia

**Límite de decisión:** 15:23, 15:31, 15:40; no esperar indefinidamente.  
**Respaldo en orden:** #23 → #24 → #25. PRs apiladas contra `demo/portal-seed-26nov`; al usar respaldo, comprobar primero base, conflictos y CI. La versión de escena estable puede enseñarse desde `main` independientemente de las ramas de ensayo.  
**Panel Slidev MissionBoard:** estado operado manualmente; «VERIFICADA» solo con un enlace o log auténtico.  
**Backend:** Foundry opcional y desactivado por defecto; crear y mostrar aportaciones requiere Worker/D1. Sin integración real, no prometer sincronización instantánea.

Guion: [55 minutos](guion-demo.md) · [GO/NO-GO](runbook-go-no-go-26nov.md) · [Activar agentes](activar-agentes.md).
