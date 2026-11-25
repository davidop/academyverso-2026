#!/usr/bin/env python3
"""Pruebas deterministas de scripts/issue_flow.py con títulos y PRs reales del repositorio."""
from pathlib import Path
import json
import sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
import issue_flow  # noqa: E402
from issue_flow import (  # noqa: E402
    LABELS, classify, closing_refs, is_relay_issue, mention_refs, parse_project_url, plan_close,
    plan_mentions, plan_triage,
)

REPO = "davidop/academyverso-2026"
COSMIC_BODY = "### Tipo de objeto\n\nplaneta\n\n### Alias del explorador\n\nQA\n\n### Nombre del objeto\n\nPythonia"

# --- Clasificación: misiones, fases y backlog técnico (títulos reales #5–#28 y #37)
MISSION = "MISIÓN · Portal interdimensional — Copilot construye · Claude mejora · Codex verifica"
cases = {
    MISSION: ["agent:claude", "agent:codex", "agent:copilot", "mision-portal"],
    "Mision · portal con Copilot y Codex": ["agent:codex", "agent:copilot", "mision-portal"],
    "COPILOT · Misión 1/3 — construir el portal interdimensional desde GitHub Mobile": ["agent:copilot", "mision-portal"],
    "CLAUDE · Misión 2/3 — enriquecer el portal con energía cinematográfica": ["agent:claude", "mision-portal"],
    "CODEX · Misión 3/3 — auditar portal, móvil, regresiones y CI": ["agent:codex", "mision-portal"],
    "[GTA VII · Fase 1] Copilot — viaje entre planetas etiquetados": ["agent:copilot", "gta-vii"],
    "[GTA VII · Fase 2] Claude — identidad visual Vice Nebula / Centinela": ["agent:claude", "gta-vii"],
    "[GTA VII · Fase 3] Codex — misiones ligeras, estrellas y pruebas": ["agent:codex", "gta-vii"],
    "[GTA VII · Fase 4] Gran golpe — ensayo E2E de agentes a GitHub Pages": ["ensayo-e2e", "gta-vii"],
    "[P0][WorldGen] Integración Microsoft Foundry con flag y migración D1 aditiva": ["priority:P0", "worldgen"],
    "[P0][Three.js] Renderer incremental y nacimiento cinematográfico accesible": ["priority:P0", "threejs"],
    "[P2][WorldGen] Evolución autenticada de mundos y versionado seguro": ["priority:P2", "worldgen"],
}
for title, expected in cases.items():
    got = classify(title, "")
    assert got == {"labels": expected, "flow": True}, (title, got)
    assert set(got["labels"]) <= set(LABELS), got

# Objetos cósmicos: solo etiqueta, sin asignación (aunque el título parezca de flujo).
assert classify("planeta: Distrito Neón", COSMIC_BODY) == {"labels": ["cosmic-object"], "flow": False}
assert classify("CODEX · truco", COSMIC_BODY)["flow"] is False
# Issues ajenas al flujo: no se tocan. Mencionar un agente fuera de un prefijo no basta.
assert classify("Duda sobre Claude y Codex", "texto libre") == {"labels": [], "flow": False}
assert classify(None, None) == {"labels": [], "flow": False}


# --- Plan de triage a partir del payload del evento
def issue_event(title, body="", labels=(), assignees=(), state="open"):
    return {"issue": {"number": 26, "html_url": f"https://github.com/{REPO}/issues/26", "title": title,
                      "body": body, "state": state, "labels": [{"name": n} for n in labels],
                      "assignees": [{"login": a} for a in assignees]}}


plan = plan_triage(issue_event("CODEX · Misión 3/3 — auditar"), "davidop")
assert plan == {"number": 26, "url": f"https://github.com/{REPO}/issues/26",
                "labels": ["agent:codex", "mision-portal"], "assignee": "davidop", "flow": True}, plan
# Idempotente al editar: no repite etiquetas ni pisa una asignación manual.
plan = plan_triage(issue_event("CODEX · Misión 3/3", labels=["mision-portal"], assignees=["svg153"]), "davidop")
assert plan["labels"] == ["agent:codex"] and plan["assignee"] is None, plan
plan = plan_triage(issue_event("planeta: X", COSMIC_BODY), "davidop")
assert plan["labels"] == ["cosmic-object"] and plan["assignee"] is None and plan["flow"] is False, plan
assert plan_triage(issue_event("Pregunta suelta"), "davidop") is None
assert plan_triage(issue_event("CODEX · cerrada", state="closed"), "davidop")["assignee"] is None

# --- Referencias de cierre (semántica de palabras clave de GitHub)
assert closing_refs("Closes #7 (cuando se fusione tras CI).", REPO) == [7]  # cuerpo real de la PR #21
assert closing_refs("fixes #26\nResolved: #27\nclose davidop/academyverso-2026#28", REPO) == [26, 27, 28]
assert closing_refs(f"Fixes https://github.com/{REPO}/issues/13", REPO) == [13]
assert closing_refs("Closes other/repo#5 and Fixes https://github.com/other/repo/issues/6", REPO) == []
assert closing_refs("Relacionada con #26; ver PR #23. Prefixes #9, closesx #8", REPO) == []
assert closing_refs("<!-- Closes #1 -->\n```\nFixes #2\n```\n`Resolves #3`\nCloses #4", REPO) == [4]
assert closing_refs(None, REPO) == []


# --- Plan de cierre tras fusionar una PR
def pr_event(base, body, merged=True, number=23):
    return {"repository": {"default_branch": "main"},
            "pull_request": {"number": number, "merged": merged, "title": "BACKUP 1/3", "body": body,
                             "base": {"ref": base}}}


assert plan_close(pr_event("demo/portal-seed-26nov", "Closes #26"), REPO) == [26]
assert plan_close(pr_event("main", "Closes #26"), REPO) == []                     # GitHub ya lo hace
assert plan_close(pr_event("demo/portal-seed-26nov", "Closes #26", merged=False), REPO) == []
assert plan_close(pr_event("demo/portal-seed-26nov", "Fixes #23 y Fixes #26"), REPO) == [26]  # no se cierra a sí misma

# --- Issue de relevo: varios agentes en un solo hilo; una PR de fase no la cierra
def labelled(*names):
    return {"labels": [{"name": n} for n in names]}


assert is_relay_issue(labelled(*classify(MISSION, "")["labels"]))
assert not is_relay_issue(labelled("mision-portal", "agent:codex"))         # misión de un solo agente
assert not is_relay_issue(labelled("agent:copilot", "agent:claude", "gta-vii"))  # sin mision-portal
assert not is_relay_issue({})
# La PR de Copilot puede traer "Fixes #37": plan_close la detecta y run_close comenta en vez de cerrar.
assert plan_close(pr_event("demo/portal-seed-26nov", "Fixes #37", number=38), REPO) == [37]


# --- "Refs #N": el protocolo de la misión pide Refs, no Fixes (PR #88 de Claude: solo "Refs #72").
PR_88_BODY = ("Fase 2 del relevo de agentes sobre `docs/prueba-agentes.md`.\n\n- Añade la columna **Hora**.\n\n"
              "No se modifica ningún otro fichero.\n\nRefs #72")
assert mention_refs(PR_88_BODY, REPO) == [72]
assert closing_refs(PR_88_BODY, REPO) == []                       # Refs nunca cierra
assert mention_refs(f"Ref: #5\nrefs davidop/academyverso-2026#6\nRefs https://github.com/{REPO}/issues/7", REPO) == [5, 6, 7]
assert mention_refs("Prefs #9, refsx #8, `Refs #4`, Refs other/repo#3", REPO) == []
assert plan_mentions(pr_event("demo/prueba-agentes-25nov", PR_88_BODY, number=88), REPO) == [72]
assert plan_mentions(pr_event("main", PR_88_BODY, number=88), REPO) == []
assert plan_mentions(pr_event("demo/prueba-agentes-25nov", PR_88_BODY, merged=False, number=88), REPO) == []
# Si la PR trae Fixes y Refs a la misma Issue, se trata una sola vez (por la vía de cierre).
assert plan_mentions(pr_event("demo/portal-seed-26nov", "Refs #37\n\nFixes #37", number=38), REPO) == []


def run_close_calls(issue_labels, body="Fixes #37"):
    """Ejecuta run_close con un gh simulado y devuelve las llamadas de escritura."""
    calls = []

    def fake_gh(*args, payload=None, token=None, check=True):
        if args[:2] == ("api", f"repos/{REPO}/issues/37"):
            return 0, json.dumps({"state": "open", "labels": [{"name": n} for n in issue_labels]})
        calls.append((args, payload))
        return 0, "{}"

    real_gh, issue_flow.gh = issue_flow.gh, fake_gh
    try:
        event = pr_event("demo/portal-seed-26nov", body, number=38)
        event["pull_request"]["user"] = {"login": "Copilot"}
        issue_flow.run_close(event, REPO)
    finally:
        issue_flow.gh = real_gh
    return calls


relay_calls = run_close_calls(classify(MISSION, "")["labels"])
assert len(relay_calls) == 1 and relay_calls[0][0][-3].endswith("/issues/37/comments"), relay_calls
assert "@" not in relay_calls[0][1]["body"] and "`Copilot`" in relay_calls[0][1]["body"]  # sin menciones
assert not any(payload and payload.get("state") == "closed" for _, payload in relay_calls)
single_calls = run_close_calls(["mision-portal", "agent:codex"])
assert single_calls[-1][1] == {"state": "closed", "state_reason": "completed"}, single_calls
# El agente obedece y escribe solo "Refs #37": el relevo se comenta igual y la Issue sigue abierta.
refs_calls = run_close_calls(classify(MISSION, "")["labels"], body="Refs #37")
assert len(refs_calls) == 1 and refs_calls[0][0][-3].endswith("/issues/37/comments"), refs_calls
assert not any(payload and payload.get("state") == "closed" for _, payload in refs_calls)
# Fixes y Refs a la vez: un solo comentario de relevo, sin cerrar.
both_calls = run_close_calls(classify(MISSION, "")["labels"], body="Refs #37\n\nFixes #37")
assert len(both_calls) == 1 and both_calls[0][0][-3].endswith("/issues/37/comments"), both_calls
# Refs a una Issue que no es de relevo: no se comenta ni se cierra.
assert run_close_calls(["mision-portal", "agent:codex"], body="Refs #37") == []
assert run_close_calls(["documentation"], body="Refs #37") == []

assert parse_project_url("https://github.com/users/davidop/projects/3") == ("davidop", "3")
assert parse_project_url("https://github.com/orgs/acme/projects/12/") == ("acme", "12")
assert parse_project_url("https://github.com/davidop/academyverso-2026") is None

print("PASS: issue flow classifies real titles, assigns only flow Issues, closes only same-repo keyword refs"
      " and keeps the shared mission relay Issue open")
