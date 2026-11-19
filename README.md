# 🚀 AcademyVerso 2026 — programa con IA desde tu móvil

> **Un universo. 50 exploradores. Tres agentes de IA.**
>
> Proyecto de demostración de **David Oliva y Sergio Valverde** para **AcademyVerso 2026** (26/11/2026, 15:00–15:55). Se basa en los recursos gráficos originales entregados por AcademyVerso.

[![CI](https://github.com/davidop/academyverso-2026/actions/workflows/ci.yml/badge.svg)](https://github.com/davidop/academyverso-2026/actions/workflows/ci.yml)

## 🎮 ¿Cómo funciona?

1. Un participante abre **GitHub Mobile** y crea una **GitHub Issue** usando el formulario `🪐 Crear objeto del AcademyVerso`.
2. Elige **tipo**, **alias**, **nombre** y una descripción en lenguaje natural.
3. La automatización valida la Issue, la registra en Cloudflare D1 y el planeta aparece en el universo Three.js (sondeo cada 5 s). **El tiempo total depende del arranque de GitHub Actions; no es instantáneo garantizado.**
4. Quien no tenga GitHub usa un **formulario web**; un Worker con token **servidor** crea la Issue y actualiza D1, sin exponer credenciales.
5. **Copilot, Claude y Codex** trabajan sobre el código del mismo proyecto, con sesiones reales desde GitHub Mobile y PRs revisables. Son agentes distintos del modelo que se escoge dentro del chat de Copilot.

## 🔗 Enlaces

- [Presentación web interactiva en Slidev](https://davidop.github.io/academyverso-2026/presentation/) · [Código](presentation/README.md)
- [Repositorio](https://github.com/davidop/academyverso-2026)
- [Crear objeto desde GitHub Mobile](https://github.com/davidop/academyverso-2026/issues/new?template=crear-objeto.yml)
- [Universo 3D publicado en GitHub Pages](https://davidop.github.io/academyverso-2026/)
- [Guion de los ponentes](docs/guion-demo.md)
- [Guía para activar Copilot, Claude y Codex](docs/activar-agentes.md)
- [Configuración y despliegue](docs/despliegue.md)
- [Seguridad / moderación](docs/seguridad.md)
- [Prompts para agentes](docs/prompts-agentes.md)

## 🛠️ Arquitectura

```mermaid
flowchart TD
    M[GitHub Mobile] --> I[GitHub Issues]
    F[Formulario web accesible] --> W[Cloudflare Worker - API]
    W --> I
    I --> A[GitHub Actions: validar y notificar]
    A --> W
    W --> D[(Cloudflare D1)]
    W -. IA opcional .-> AI[Workers AI: enriquecer descripción]
    D --> W
    W --> B[GitHub Pages + Three.js]
    C[Copilot / Claude / Codex] --> P[Pull Requests revisables]
    P --> B
```

**GitHub Pages** sirve la web; **Cloudflare Workers + D1** resuelven el registro seguro y la sincronización. El navegador nunca recibe el token de GitHub. El motor 3D funciona incluso antes de configurar el backend, mostrando **seis objetos de ejemplo identificados como modo demostración**; este modo **no admite envíos** y no debe confundirse con funcionamiento en producción.

## 🚦 Estado de implantación

| Módulo | Estado en el código | Requiere configuración externa |
|---|---|---|
| Galaxy Three.js, navegación, fichas accesibles | Implementado | Acceso a CDN de Three.js |
| Formulario GitHub Issue | Implementado | Habilitar Issues, etiqueta `cosmic-object` |
| Formulario web alternativo | Implementado | Desplegar Worker y configurar `API_BASE` |
| Sincronización multiusuario | Implementado (polling) | Worker + Cloudflare D1 + secreto de Actions |
| Filtros, rate limit y ocultación | Implementado | Desplegar Worker y credenciales |
| Enriquecimiento IA | Opcional; hook implementado | Binding Workers AI; revisar cuotas/costes |
| GitHub Pages | Workflow incluido | Activar Pages → Source: GitHub Actions |
| Copilot / Claude / Codex | Guion + prompts incluidos | Verificar acceso, planes y permisos manualmente |
| Viajes interplanetarios | Reservado para demo de agentes | PRs reales o respaldo identificado |

## ✅ Comprobación local

```bash
cd worker
npm test
npm run check
cd ..
node --check web/app.js
```

Para ver la web, sirve `web/` mediante un servidor local (`python -m http.server 8000 -d web`). Necesita conectividad para descargar Three.js de jsDelivr.

## 🧑‍🚀 Quiénes presentan

- **David Oliva** — Microsoft MVP · Microsoft Specialist.
- **Sergio Valverde** — GitHub Star · Platform Engineer en Lunik · Organizador de GitHub Community Spain. [Perfil de ponente](https://sessionize.com/svg153) · [LinkedIn](https://es.linkedin.com/in/svg153)

## 📝 Reglas

Los participantes no tienen acceso de escritura a `main`. Las Issues son aportaciones de datos; los agentes sólo proponen cambios de código mediante PR. Todas las peticiones se validan. Se aplican términos, controles y límites de los proveedores. Sin garantías de coste cero para uso de agentes ni Workers AI: verificar los planes antes de activar.

**Licencia:** MIT (ver LICENSE). Gráficos AcademyVerso: materiales aportados para esta presentación; no cubiertos por MIT ni autorizados para reutilizaciones ajenas al evento.
