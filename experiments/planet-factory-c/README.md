# Planet Factory C (#97) - opción principal
PoC manual, aislada. Copilot/Gemini interpreta, modera y diseña; Claude Code/Haiku construye WorldSpecV1; Codex/Luna revisa. Modelo fijo candidato, disponibilidad y endpoint no comprobados. Los engines Claude/Codex usan el proveedor Copilot mediante prefijo copilot/. El token actual del triaje no prueba compatibilidad de esos endpoints. Verificar catálogo, crédito, engine y model.resolution de cada fase con gh aw audit/logs. Los modelos pueden fallar; no sustituirlos silenciosamente.

No se cambia el triage en producción: al integrar, el primer engine reemplazará el rol de interpretación de cosmic-object-triage (conservar guardarraíles, autor de App y verificación HMAC). No disparar planet:ready hasta completar construcción/revisión y validación. Por ahora no hay eventos issues, ningún token D1/R2 ni publicación. El resultado es un candidato JSON temporal. Los artefactos post-steps son candidatos no fiables, no safe outputs de publicación; solo datos sintéticos sin datos privados. El coordinador ejecuta gates fuera del agente y no ejecuta código generado.

## Activar preview
El CI de la PR instala gh-aw v1.2.3 y genera los tres locks y coordinador como artefacto. No están versionados aún porque no disponemos del compilador en el entorno de edición; NO fabricarlos ni editar locks manualmente. En una rama aislada, descargar el artefacto validado o ejecutar:
```sh
gh extension install github/gh-aw --pin v1.2.3
for f in .github/workflows/planet-c-{design,build,review}.md; do gh aw compile "$f"; done
cp experiments/planet-factory-c/coordinator.yml .github/workflows/planet-factory-c.yml
node --test experiments/planet-factory-c/contract.test.mjs
```
Revisar los locks, permisos, red, secrets y los nombres de artefactos de workflow_call (pueden llevar prefijo). Versionarlos en la rama y registrar el workflow manual en un repo de ensayo; GitHub exige que workflow_dispatch exista en default branch. No fusionar con main solo para habilitar el ensayo. Revisar que cada gate falla si el artefacto falta/está duplicado o no corresponde al run. El coordinador pasa explícitamente solo COPILOT_GITHUB_TOKEN; no hereda secretos. Se desactivan creación de issues y reportes automáticos de fallo/detección (sin desactivar la detección). CI comprueba que ningún lock solicite permisos write. Inspeccionar locks antes de ejecutar. Nunca usar contenido público real en esta PoC. 

El fixture exige fidelidad visual; V1 no permite color individual por elemento, aunque el anillo usa el color secundario global y puede aproximarse. Consultar builder.mjs. Un rechazo por limitaciones reales es un resultado válido. Para probar un rechazo inequívoco, usar en una rama de ensayo el fixture de reloj de arena y serpiente mecánica, no admitirlo artificialmente. Comparar modelos con mismo fixture y registrar coste/latencia. Siguiente paso #101: GLB exportado por sandbox y D1 para metadatos, R2 opcional para producción; no modificar app/Worker ahora.
