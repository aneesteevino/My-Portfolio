# Robo Cat retrieval audit — 15 October 2026

## Confirmed baseline failures

| Prompt | Baseline | Root cause | Correct behavior |
| --- | --- | --- | --- |
| Have you worked with AI agents and automation? | Unsupported fallback | Exact skill regex matched neither plural “agents” nor automation concepts | Answer from résumé responsibilities and verified Agentic AI/n8n skills |
| What is his current career goal? | Unsupported fallback | No career-direction intent or verified partial-answer path | State the documented technical direction and clearly mark the exact personal goal as unstated |
| What responsibilities has he handled as an AI Engineer? | Unsupported fallback | Experience intent recognized a narrow employment vocabulary only | Return the current AI Engineer responsibility bullets |
| Give an example of a problem he solved. | Unsupported fallback | No problem/solution intent | Use the documented PakWheels AI search problem, architecture, scale, and outcome |
| Snake species detection project | Unsupported fallback | No matching résumé, portfolio, or approved repository record | Explain that it is not verified public portfolio work and disclose no private details |

The deterministic router ran before provider phrasing, so a generic fallback also
left Gemini and Groq without relevant verified context. The response renderer split
only real newline characters, which exposed provider `\\n` sequences. Sources,
evidence links, and contact actions were rendered by independent loops, allowing
duplicates and visually joined actions.

## Implemented coverage

- Normalized intents now cover plural and paraphrased agentic AI, automation,
  career direction, responsibilities, and documented problem/solution questions.
- Finance business questions use transferable RAG, retrieval, and automation
  evidence while explicitly stating that finance-sector experience is unverified.
- Partially verified questions answer the supported portion and label the unknown.
- The local fallback preserves the same evidence boundary when both providers fail.
- Standard Markdown headings, emphasis, lists, and safe links render without raw
  escape characters; source and contact URLs are deduplicated.
- Unrelated general knowledge and prompt-injection requests remain blocked.

## Regression expectations

The Playwright suite covers greetings, short agentic queries, semantic paraphrases,
skills, projects, experience, education, career direction, responsibilities,
problem examples, e-commerce and finance qualification, unknown commercial facts,
unrelated questions, prompt injection, multi-turn project context, Markdown,
citations, contact actions, chat scrolling, and mobile skill-family activation.

The remaining limitation is intentional: the snake species project cannot be
presented until Muhammad Anees approves an authoritative public summary or project
record. Exact rates, salary expectations, availability, timelines, and budgets also
remain direct-discussion items because the approved sources do not state them.
