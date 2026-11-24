#!/usr/bin/env python3
"""Flujo de Issues de AcademyVerso.

Dos subcomandos, cada uno usado por un workflow:

* ``triage`` (.github/workflows/issue-triage.yml): clasifica una Issue por su
  título, le pone las etiquetas del flujo, la asigna a la persona responsable
  y, si se ha configurado, la añade a un GitHub Project.
* ``close`` (.github/workflows/close-linked-issues.yml): cuando se fusiona una
  PR en una rama que NO es la rama por defecto (p. ej. ``demo/portal-seed-26nov``),
  cierra las Issues que la PR enlaza con ``Closes #N`` / ``Fixes #N`` /
  ``Resolves #N``. GitHub solo lo hace por sí mismo al fusionar en ``main``.

Las decisiones son funciones puras (probadas en scripts/test_issue_flow.py);
solo ``main()`` habla con la API de GitHub a través de la CLI ``gh``.
Con ``DRY_RUN=1`` imprime las llamadas en lugar de ejecutarlas.
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys

COSMIC_MARKERS = ("### Tipo de objeto", "### Alias del explorador")

# Nombre → (color sin '#', descripción). Solo se crean si faltan; nunca se
# sobrescriben etiquetas ya personalizadas en el repositorio.
LABELS = {
    "cosmic-object": ("1d76db", "Objeto creado por el público; la ingesta D1 lo registra y lo cierra"),
    "agent:copilot": ("6e40c9", "Flujo de agentes: GitHub Copilot"),
    "agent:claude": ("d97757", "Flujo de agentes: Claude"),
    "agent:codex": ("10a37f", "Flujo de agentes: Codex"),
    "mision-portal": ("fbca04", "Misión en directo del portal interdimensional (26/11)"),
    "gta-vii": ("e99695", "GTA VII · Grand Terraforming Agents"),
    "ensayo-e2e": ("c5def5", "Ensayo de extremo a extremo antes del evento"),
    "worldgen": ("0e8a16", "Motor WorldGen y mundos procedurales"),
    "threejs": ("5319e7", "Renderizado Three.js"),
    "priority:P0": ("b60205", "Prioridad P0: bloquea el evento"),
    "priority:P1": ("d93f0b", "Prioridad P1"),
    "priority:P2": ("f9d0c4", "Prioridad P2"),
}

_AGENT_PREFIX = re.compile(r"(COPILOT|CLAUDE|CODEX)\s*·", re.I)
_AGENT_WORD = re.compile(r"\b(copilot|claude|codex)\b", re.I)

_KEYWORD = r"(?:close[sd]?|fix(?:e[sd])?|resolve[sd]?)"
_SHORT_REF = re.compile(
    rf"(?<![\w-]){_KEYWORD}:?\s+(?:(?P<owner>[\w.-]+)/(?P<name>[\w.-]+))?#(?P<num>\d+)\b", re.I
)
_URL_REF = re.compile(
    rf"(?<![\w-]){_KEYWORD}:?\s+https://github\.com/(?P<owner>[\w.-]+)/(?P<name>[\w.-]+)/issues/(?P<num>\d+)\b",
    re.I,
)
# Texto que GitHub no muestra o que es código: no debe cerrar nada.
_IGNORED = re.compile(r"<!--.*?-->|```.*?```|~~~.*?~~~|`[^`\n]*`", re.S)


def classify(title: str | None, body: str | None) -> dict:
    """Decide las etiquetas de una Issue y si pertenece al flujo de trabajo.

    ``flow`` es True para las Issues de misiones, fases y backlog técnico, que
    se asignan a la persona responsable. Los objetos cósmicos solo se
    etiquetan: los crea el público y la ingesta D1 los cierra.
    """
    title = (title or "").strip()
    body = body or ""
    if all(marker in body for marker in COSMIC_MARKERS):
        return {"labels": ["cosmic-object"], "flow": False}

    labels: set[str] = set()
    prefix = _AGENT_PREFIX.match(title)
    if prefix:
        labels.update({"mision-portal", f"agent:{prefix.group(1).lower()}"})
    if re.match(r"\[GTA VII\b", title, re.I):
        labels.add("gta-vii")
        phase = re.search(r"Fase\s*(\d+)", title, re.I)
        if phase and phase.group(1) == "4":
            labels.add("ensayo-e2e")
        agent = _AGENT_WORD.search(title)
        if agent:
            labels.add(f"agent:{agent.group(1).lower()}")
    for priority in re.findall(r"\[(P[0-2])\]", title, re.I):
        labels.add(f"priority:{priority.upper()}")
    if re.search(r"\[WorldGen\]", title, re.I):
        labels.add("worldgen")
    if re.search(r"\[Three\.?js\]", title, re.I):
        labels.add("threejs")
    return {"labels": sorted(labels), "flow": bool(labels)}


def plan_triage(event: dict, default_assignee: str) -> dict | None:
    """Acciones pendientes para el evento ``issues``; None si no aplica."""
    issue = event.get("issue") or {}
    if not issue or issue.get("pull_request"):
        return None
    decision = classify(issue.get("title"), issue.get("body"))
    if not decision["labels"]:
        return None
    present = {label["name"] for label in issue.get("labels") or []}
    assignee = None
    if decision["flow"] and default_assignee and issue.get("state", "open") == "open" and not issue.get("assignees"):
        assignee = default_assignee
    return {
        "number": issue["number"],
        "url": issue["html_url"],
        "labels": [name for name in decision["labels"] if name not in present],
        "assignee": assignee,
        "flow": decision["flow"],
    }


def closing_refs(text: str | None, repo: str) -> list[int]:
    """Números de Issue de ``repo`` que el texto cierra con las palabras clave de GitHub."""
    clean = _IGNORED.sub(" ", text or "")
    found: set[int] = set()
    for pattern in (_SHORT_REF, _URL_REF):
        for match in pattern.finditer(clean):
            owner, name = match.group("owner"), match.group("name")
            if owner and f"{owner}/{name}".lower() != repo.lower():
                continue
            found.add(int(match.group("num")))
    return sorted(found)


def plan_close(event: dict, repo: str) -> list[int]:
    """Issues a cerrar tras fusionar una PR en una rama que no es la de por defecto."""
    pr = event.get("pull_request") or {}
    if not pr.get("merged"):
        return []
    default_branch = (event.get("repository") or {}).get("default_branch", "main")
    if pr.get("base", {}).get("ref") == default_branch:
        return []  # GitHub ya cierra de forma nativa al fusionar en la rama por defecto.
    refs = closing_refs(f"{pr.get('title') or ''}\n{pr.get('body') or ''}", repo)
    return [number for number in refs if number != pr.get("number")]


def parse_project_url(url: str) -> tuple[str, str] | None:
    """``https://github.com/users/<owner>/projects/<n>`` → (owner, n)."""
    match = re.fullmatch(r"https://github\.com/(?:users|orgs)/([\w.-]+)/projects/(\d+)/?", (url or "").strip())
    return (match.group(1), match.group(2)) if match else None


# ---------------------------------------------------------------- GitHub I/O

DRY_RUN = os.getenv("DRY_RUN") == "1"


def gh(*args: str, payload: dict | None = None, token: str | None = None, check: bool = True) -> tuple[int, str]:
    if DRY_RUN:
        print("DRY_RUN gh", " ".join(args), json.dumps(payload, ensure_ascii=False) if payload else "")
        return 0, "{}"
    env = dict(os.environ)
    if token:
        env["GH_TOKEN"] = token
    result = subprocess.run(
        ["gh", *args],
        input=json.dumps(payload) if payload is not None else None,
        text=True,
        capture_output=True,
        env=env,
    )
    if result.returncode and check:
        # stderr de gh no contiene el token; se muestra acotado para diagnosticar.
        sys.stderr.write(result.stderr[:600])
        raise SystemExit(f"gh {' '.join(args[:2])} falló con código {result.returncode}")
    return result.returncode, result.stdout


def ensure_labels(repo: str, names: list[str]) -> None:
    _, out = gh("label", "list", "--repo", repo, "--limit", "500", "--json", "name", "--jq", ".[].name")
    existing = set(out.split())
    for name in names:
        if name not in existing:
            color, description = LABELS[name]
            # --force: si otra ejecución simultánea la acaba de crear, no falla
            # (solo se llega aquí si faltaba, así que no pisa etiquetas personalizadas).
            gh("label", "create", name, "--repo", repo, "--color", color, "--description", description, "--force")


def run_triage(event: dict, repo: str) -> None:
    default_assignee = os.getenv("TRIAGE_ASSIGNEE") or repo.split("/")[0]
    plan = plan_triage(event, default_assignee)
    if plan is None:
        print("Issue fuera del flujo definido: no se modifica.")
        return
    number = plan["number"]
    if plan["labels"]:
        ensure_labels(repo, plan["labels"])
        gh("api", "--method", "POST", f"repos/{repo}/issues/{number}/labels", "--input", "-",
           payload={"labels": plan["labels"]})
        print(f"#{number}: etiquetas añadidas {plan['labels']}")
    if plan["assignee"]:
        _, out = gh("api", "--method", "POST", f"repos/{repo}/issues/{number}/assignees", "--input", "-",
                    payload={"assignees": [plan["assignee"]]})
        assigned = {user.get("login", "").lower() for user in json.loads(out or "{}").get("assignees", [])}
        if DRY_RUN or plan["assignee"].lower() in assigned:
            print(f"#{number}: asignada a {plan['assignee']}")
        else:
            print(f"::warning::GitHub ignoró la asignación a '{plan['assignee']}': debe ser colaborador del repositorio.")

    project_url = os.getenv("PROJECT_URL", "")
    if plan["flow"] and project_url:
        project = parse_project_url(project_url)
        token = os.getenv("PROJECT_TOKEN", "")
        if not project:
            raise SystemExit("ACADEMYVERSO_PROJECT_URL no tiene el formato https://github.com/users/<owner>/projects/<n>")
        if not token:
            print("::warning::Falta el secreto ACADEMYVERSO_PROJECT_TOKEN: la Issue no se añade al Project.")
            return
        owner, project_number = project
        gh("project", "item-add", project_number, "--owner", owner, "--url", plan["url"], token=token)
        print(f"#{number}: añadida al Project {owner}/{project_number}")


def run_close(event: dict, repo: str) -> None:
    pr = event.get("pull_request") or {}
    numbers = plan_close(event, repo)
    if not numbers:
        print("La PR no enlaza Issues con Closes/Fixes/Resolves, o no aplica: sin cambios.")
        return
    base = pr.get("base", {}).get("ref", "?")
    for number in numbers:
        code, out = gh("api", f"repos/{repo}/issues/{number}", check=False)
        if code:
            print(f"::warning::#{number} no existe o no es accesible; se omite.")
            continue
        issue = json.loads(out)
        if issue.get("pull_request"):
            print(f"#{number} es una PR, no una Issue; se omite.")
            continue
        if issue.get("state") == "closed":
            print(f"#{number} ya estaba cerrada.")
            continue
        gh("api", "--method", "POST", f"repos/{repo}/issues/{number}/comments", "--input", "-", payload={
            "body": (f"Cerrada automáticamente: la PR #{pr.get('number')} se fusionó en `{base}` y la enlaza "
                     "con una palabra clave de cierre. GitHub solo cierra Issues por sí mismo al fusionar en la "
                     "rama por defecto.")})
        gh("api", "--method", "PATCH", f"repos/{repo}/issues/{number}", "--input", "-",
           payload={"state": "closed", "state_reason": "completed"})
        print(f"#{number}: cerrada (PR #{pr.get('number')} -> {base})")


def main(argv: list[str]) -> None:
    if len(argv) != 2 or argv[1] not in {"triage", "close"}:
        raise SystemExit("Uso: issue_flow.py triage|close  (lee GITHUB_EVENT_PATH y GITHUB_REPOSITORY)")
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")  # consolas Windows (cp1252) en pruebas locales
    with open(os.environ["GITHUB_EVENT_PATH"], encoding="utf-8") as handle:
        event = json.load(handle)
    repo = os.environ["GITHUB_REPOSITORY"]
    (run_triage if argv[1] == "triage" else run_close)(event, repo)


if __name__ == "__main__":
    main(sys.argv)
