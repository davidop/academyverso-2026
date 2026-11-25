---
version: beta
name: AcademyVerso · Escenas de misión sobre la plantilla oficial
description: Reglas para añadir movimiento y componentes al deck del evento sin salir de la plantilla Academyverso (tema Eventekki).
colors:
  background: "#DBD6FC"
  stageDeep: "#1F2139"
  surface: "#F2F4D9"
  text: "#243837"
  primary: "#B1FA63"
  secondary: "#5EBEBB"
  accent: "#FE7833"
  qrPaper: "#FFFFFF"
  qrInk: "#000000"
typography:
  display:
    fontFamily: "CHANEY, Unbounded, Host Grotesk, Arial"
    fontSize: 64px
    fontWeight: 900
    lineHeight: 1.04
  headline:
    fontFamily: "Host Grotesk, Arial"
    fontSize: 50px
    fontWeight: 800
    lineHeight: 1.08
  body:
    fontFamily: "Host Grotesk, Arial"
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.35
  telemetry:
    fontFamily: "JetBrains Mono, Consolas"
    fontSize: 15px
    fontWeight: 800
    letterSpacing: 1px
spacing:
  stageInsetX: 88px
  stageInsetY: 34px
  footerReserve: 100px
  clusterGap: 26px
  qrQuietZone: 16px
rounded:
  small: 2px
  card: 4px
components:
  stageLight:
    backgroundColor: "{colors.background}"
    textColor: "{colors.text}"
  stageSpace:
    backgroundColor: "{colors.stageDeep}"
    textColor: "{colors.background}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
  qr:
    backgroundColor: "{colors.qrPaper}"
    textColor: "{colors.qrInk}"
    rounded: "{rounded.small}"
    padding: "{spacing.qrQuietZone}"
---

# AcademyVerso · Escenas de misión

## Overview

El deck del evento sigue `Template Academyverso.potx` (tema Eventekki): tres layouts locales (`cover`, `default`, `space`), footer de patrocinadores `AvFooter.vue` y paleta lavanda/lima. Este documento rige **cómo se añade movimiento e interactividad** a esa base sin romperla; no propone rediseñar la plantilla ni la app Three.js.

Antes de este corte existía un sistema navy/menta propio (portada, planeta y horizonte propios). Se retiró al integrar la plantilla: la marca, la portada y el cierre pertenecen al material oficial del evento.

## Colors

Lavanda `#DBD6FC` como lienzo claro, verde `#243837` como tinta y estructura, crema `#F2F4D9` para tarjetas, lima `#B1FA63` para acción y foco, naranja `#FE7833` para una advertencia o un evento puntual. Navy `#1F2139` para las escenas espaciales. QR negro puro sobre blanco puro; nunca aplicar degradado al código.

No introducir colores fuera de los tokens `--av-*` de `style.css`. El color nunca es la única señal: los estados llevan además texto, posición o `aria-current`.

## Typography

Titulares con Host Grotesk; en escenas espaciales y rótulos grandes, CHANEY o Unbounded (sustituto abierto). Consolas o JetBrains Mono solo para rótulos técnicos. Valores en coordenadas del lienzo: 50 px para titular habitual, 44 px en versión compacta, 64 px para la portada. Texto accionable no baja de 18 px; el mínimo real lo fija la prueba de proyección.

## Layout

Lienzo 1280 × 720. `layouts/*.vue` aplican `.av-slide` con `padding: 34px 88px 0` y `AvFooter` ocupa los últimos 100 px a sangre. Por eso: los componentes de escena no pueden usar `position: absolute; inset: 0`, y cualquier contenido propio deja al menos 104 px libres abajo. Las escenas espaciales usan `layout: space`; las de contenido, `default` (lavanda).

## Elevation & Depth

Profundidad por sombra de píxel (`6px 6px 0`), recorte y contraste. Máximo tres planos en una composición. El footer y los logos no se cubren con tarjetas ni con fundidos.

## Motion & Micro-interaction

Una pulsación cambia un hecho o el foco, nunca solo añade ornamento. CSS/SVG primero. Sin autoplay de la charla: al volver, saltar o recargar se recupera el fotograma. Con movimiento reducido se conserva el contenido con cambios instantáneos; impresión y exportación usan un fotograma legible.

**Duraciones de referencia:** corte con fundido 220 ms; revelado 440 ms; apertura de portal (iris) 950 ms; movimiento reducido 0 ms. Para revelado e iris: `cubic-bezier(.22, 1, .36, 1)`.

## Voice & Content Strategy

Español claro y técnico. No inventar cifras, trazas, logos ni estados de CI. Identificar explícitamente muestra, ejecución real o respaldo. La Issue de la misión es una sola (#37) con relevo de agentes; cada fase abre su PR con `Refs #37`.

## Components

- **`AvFooter` (plantilla):** obligatorio. Nunca taparlo; al posicionar arte decorativo, comprobar que los logos Eventekki, Tajamar, V-Valley e insignia quedan legibles.
- **`ContributionPortal` (S03):** QR inmóvil con margen blanco de al menos cuatro módulos; apertura reversible con `data-open`; destellos decorativos lejos del QR y sin parpadeo.
- **`LiveUniverse` (S06):** marco del iframe con estado de carga y enlace de respaldo permanente; el movimiento pertenece a la app, no al deck.
- **`MissionTrace` (S13):** cinco marcas con `aria-current`, progreso en lima y aviso de conexión pendiente; legible sin color.
- **`SpeakerPortrait` (S09):** retratos locales en WebP dentro de `.speaker-photo`, con handle visible; no depender de avatares remotos.
- **`QrPortal`:** un solo componente para los dos QR (Issue y hub de sesión); etiqueta accesible y foco visible.

## Do's and Don'ts

**Sí:** reutilizar la plantilla y sus assets, mantener el orden de lectura, anotar la procedencia de lo añadido y verificar la captura a 1280 × 720.

**No:** componer escenas a sangre sobre el layout, cambiar la plantilla por motivos de estilo, publicar avances sin validación ni atribuir a los agentes trabajo preparado.

Formato de referencia: [especificación DESIGN.md de Google Labs](https://github.com/google-labs-code/design.md/blob/main/docs/spec.md). La guía por escena vive en [plan-visual.md](plan-visual.md).