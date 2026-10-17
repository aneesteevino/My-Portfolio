"""Download self-hosted fonts and unmodified brand SVGs. Build-time only."""
from pathlib import Path
from urllib.request import Request, urlopen
import json
import shutil

ROOT = Path(__file__).resolve().parents[1]

def get(url, path):
    path.parent.mkdir(parents=True, exist_ok=True)
    with urlopen(Request(url, headers={"User-Agent": "PortfolioAssetBuilder/1.0"}), timeout=60) as response:
        path.write_bytes(response.read())
    print(path.relative_to(ROOT))

fonts = {
    "inter-tight-latin-wght-normal.woff2": "@fontsource-variable/inter-tight/files/inter-tight-latin-wght-normal.woff2",
    "jetbrains-mono-latin-wght-normal.woff2": "@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
    "instrument-serif-latin-400-normal.woff2": "@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2",
    "instrument-serif-latin-400-italic.woff2": "@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2",
}
for filename, source in fonts.items():
    get("https://cdn.jsdelivr.net/npm/" + source, ROOT / "src/fonts" / filename)
for family, folder in [("Inter-Tight", "intertight"), ("Instrument-Serif", "instrumentserif"), ("JetBrains-Mono", "jetbrainsmono")]:
    get(f"https://raw.githubusercontent.com/google/fonts/main/ofl/{folder}/OFL.txt", ROOT / f"src/fonts/{family}-OFL.txt")

# All paths refer to original variants. Logos that are not available are represented
# by a neutral, labelled concept glyph, never a fabricated brand mark.
devicons = {"python":"python", "typescript":"typescript", "javascript":"javascript", "fastapi":"fastapi", "nodejs":"nodejs", "express":"express", "mongodb":"mongodb", "postgresql":"postgresql", "mysql":"mysql", "supabase":"supabase", "nextjs":"nextjs", "react":"react", "tailwindcss":"tailwindcss", "docker":"docker", "github":"github", "vscode":"vscode"}
brands = {}
for key, slug in devicons.items():
    url=f"https://raw.githubusercontent.com/devicons/devicon/master/icons/{slug}/{slug}-original.svg"
    get(url, ROOT / f"public/logos/{key}.svg")
    brands[key] = {"src":f"/logos/{key}.svg", "source":url}
simple = {"langchain":("langchain","1C3C3C"), "langgraph":("langgraph","1C3C3C"), "crewai":("crewai","FF5A50"), "claude":("claude","D97757"), "ollama":("ollama","000000"), "n8n":("n8n","EA4B71"), "shadcn":("shadcnui","000000"), "copilot":("githubcopilot","000000"), "windsurf":("windsurf","0B100F"), "gemini":("googlegemini","8E75B2")}
for key,(slug,color) in simple.items():
    url=f"https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/{slug}.svg"
    try:
        with urlopen(url, timeout=30) as response: svg=response.read().decode()
        svg=svg.replace("<svg ",f'<svg fill="#{color}" ',1)
        (ROOT / f"public/logos/{key}.svg").write_text(svg,encoding="utf-8")
        brands[key]={"src":f"/logos/{key}.svg", "source":url}
    except Exception as exc:
        print(f"No verified logo for {key}: {exc}")
get("https://raw.githubusercontent.com/devicons/devicon/master/LICENSE", ROOT / "public/logos/LICENSE-devicon.txt")
get("https://raw.githubusercontent.com/simple-icons/simple-icons/develop/LICENSE.md", ROOT / "public/logos/LICENSE-simple-icons.txt")
# OpenAI and Groq are not in current Devicon / Simple Icons collections.
for key in ["openai", "groq"]:
    url=f"https://raw.githubusercontent.com/lobehub/lobe-icons/master/packages/static-svg/icons/{key}.svg"
    get(url, ROOT / f"public/logos/{key}.svg")
    brands[key]={"src":f"/logos/{key}.svg", "source":url}
get("https://raw.githubusercontent.com/lobehub/lobe-icons/master/LICENSE", ROOT / "public/logos/LICENSE-lobe-icons.txt")
(ROOT / "public/logos/sources.json").write_text(json.dumps(brands,indent=2),encoding="utf-8")
(ROOT / "src/lib/brands.json").write_text(json.dumps({k:v["src"] for k,v in brands.items()},indent=2),encoding="utf-8")
shutil.copyfile(ROOT / "Resume.pdf",ROOT / "public/resume.pdf")
