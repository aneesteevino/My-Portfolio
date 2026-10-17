# Public repository review — 11 October 2026

Reviewed the repository inventory available through the connected GitHub account
and the public profile at https://github.com/AneesTeevino. Biography and project
claims still come from the supplied résumé; repository visibility alone is not
treated as permission to publish private implementation details.

| Project | Evidence reviewed | Decision / caveat |
| --- | --- | --- |
| PakWheels AI | README, tree, backend/main.py in https://github.com/aneesteevino/PakWheels-AI-RAG-Car-Intelligence-System | Strong résumé match: natural-language search, FAISS, vehicle data. Code link only. Hosted inference was not available to validate. The static mounts before `/style.css` and `/app.js` routes deserve repair before a live demo is promoted. |
| Pakistani Legal Assistant | README, tree, backend/app/main.py in https://github.com/aneesteevino/Pakistani-Legal-Assistant | Résumé-matched code showcase. Advertised frontend returned HTTP 404; backend status timed out. No live-demo link. Repository describes TF-IDF retrieval; résumé copy is retained without claiming vector embeddings here. |
| Pakistan Travel RAG System | README, tree, CI file location in https://github.com/aneesteevino/pakistan-travel-rag | Résumé-matched architecture/code showcase. Actual README entry point is Streamlit; portfolio does not invent a live URL. Inference requires external keys; not certified as running. |
| AI Resume Builder | Résumé and https://github.com/aneesteevino/AI-resume-builder README | The public repo is Next.js/OpenAI, while résumé project is Python/FastAPI with several models. Similar name alone is insufficient to attach that repository to the employer project. Résumé entry retained without repo link. |
| AI Career Assistant | Résumé; public inventory | No unambiguous matching public repo found. Entry retained as résumé work without a guessed URL. |
| TDC AI Chat Service | Résumé; public inventory | No unambiguous public repo found. Entry retained as résumé work without a guessed URL. |
| FlashGenius | README, Python generation service, TypeScript API client, live page, POST `/api/generate` | Frontend returned 200, but a valid study-notes generation request returned Internal Server Error. README says Anthropic; implementation uses Gemini. Excluded from portfolio pending fixes. |
| MUET FM | https://github.com/aneesteevino/muet-fm-nextjs README/tree, live homepage | Homepage returned 200. Broadcast and end-to-end functional behavior were not verified. Keep as résumé experience; do not yet promote as a verified working project. |

Coursework, basic clones, forks, empty repositories, and untested additions were
not promoted. The six résumé entries are displayed as work descriptions with
illustrative interfaces. They are **not** labelled as certified production-ready
applications. Fixing unrelated repositories is outside this portfolio build.

No repository name, description, or approved profile record matching a snake
species detection project was found in the connected inventory or scoped GitHub
search on 15 October 2026. The chatbot therefore identifies that project as
unverified and does not expose or infer private development details.

To strengthen a future launch, restore the Legal Assistant demo, repair and run
Pakwheels' static serving and inference flow, repair FlashGenius generation, and
confirm which résumé-builder repo belongs to the résumé project. API credentials
should only be configured in those projects' private deployment settings.
