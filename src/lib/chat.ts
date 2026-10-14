import {
  PROFILE,
  PROJECTS,
  SKILL_GROUPS,
  EXPERIENCE,
  EDUCATION,
  CERTIFICATIONS,
  CHAT,
} from "./data";
export type Answer = {
  text: string;
  sources: { label: string; href: string }[];
  topic?: string;
};
const normal = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const has = (q: string, term: string) => ` ${q} `.includes(` ${normal(term)} `);
const resume = [{ label: CHAT.resumeSource, href: PROFILE.resume }];
const aliases: Record<string, string[]> = {
  pakwheels: ["pakwheels", "cars", "car", "vehicle"],
  legal: ["legal", "law"],
  travel: ["travel", "itinerary", "itineraries"],
  resume: ["resume builder", "cv builder", "ats"],
  career: ["career assistant", "career roadmap", "job recommendations"],
  chat: ["tdc chat", "chat service", "microservice"],
};

function businessValue(q: string): Answer {
  const lines = [
    "Based on his verified experience, Anees can contribute by:",
    "• Building grounded AI assistants and RAG systems with semantic or vector search, source attribution, and context engineering.",
    "• Connecting OpenAI, Claude, Gemini, and Groq through Python, FastAPI, Node.js, TypeScript, REST APIs, and intelligent model routing.",
    "• Automating repeatable workflows with n8n, webhooks, microservices, and database-backed pipelines.",
    "• Shipping the supporting product experience with Next.js, React, Tailwind CSS, SQL, MongoDB, and PostgreSQL.",
  ];
  if (/\b(search|catalog|ecommerce|e commerce|marketplace|recommend|discovery|sales)\b/.test(q))
    lines.push("For product discovery or commerce, his PakWheels AI work shows semantic search across 77,000+ listings and recommendation-system skills.");
  if (/\b(support|service|chatbot|assistant|knowledge|faq|customer)\b/.test(q))
    lines.push("For support or internal knowledge, his chat-service and RAG experience fits grounded assistants, knowledge sync, and multi-model routing.");
  if (/\b(recruit|hiring|hr|career|resume|cv|employee)\b/.test(q))
    lines.push("For hiring workflows, his AI Resume Builder and Career Assistant cover role-specific rewriting, ATS scoring, recommendations, and career roadmaps.");
  if (/\b(legal|law)\b/.test(q))
    lines.push("For legal information workflows, his Pakistani Legal Assistant demonstrates citation-grounded retrieval, confidence scoring, and source attribution across five law domains.");
  if (/\b(travel|tourism|hotel|destination)\b/.test(q))
    lines.push("For travel products, his Pakistan Travel RAG System demonstrates semantic search over destination, hotel, and activity data for context-aware itineraries.");
  if (/\b(health|healthcare|medical|finance|financial|real estate|property|education|school)\b/.test(q))
    lines.push("His portfolio does not document a project in that specific domain, so domain expertise should be validated separately; the transferable fit is AI retrieval, automation, APIs, and product engineering.");
  lines.push("The strongest hiring evidence is his current AI Engineer work and six shipped portfolio systems. For a precise fit assessment, share the project’s users, data sources, current stack, and main bottleneck.");
  return {
    text: lines.join("\n\n"),
    sources: [
      { label: CHAT.workSource, href: "#work" },
      { label: CHAT.skillsSource, href: "#skills" },
      ...resume,
    ],
    topic: "business-value",
  };
}
/** Extractive answers only: user input never becomes instructions or generated claims. */
export function answerQuestion(input: string, previousTopic?: string): Answer {
  const q = normal(input);
  const fallback = {
    text: CHAT.fallback,
    sources: [{ label: CHAT.contactSource, href: "#contact" }],
  };
  if (!q || input.length > 500)
    return input.length > 500 ? { text: CHAT.limit, sources: [] } : fallback;
  // Never infer private, evaluative or time-sensitive facts from neighbouring matches.
  if (
    /\b(salary|age|birthday|birth|married|religion|politic|address|home|password|secret|available|availability|rate|pricing|hobbies|hobby|favourite|favorite|best|worst|guarantee|ignore|pretend|invent|instructions|system prompt)\b/.test(
      q,
    )
  )
    return fallback;
  if (/^(hi|hello|hey|salam|assalamualaikum|thanks|thank you)$/.test(q))
    return { text: CHAT.intro, sources: [] };
  if (
    /\b(weather|forecast|temperature|prime minister|president|pm of|capital of|currency|exchange rate|stock|crypto|bitcoin|cricket|football|sports|score|recipe|movie|song|news|election|politics)\b/.test(q)
  )
    return fallback;
  if (
    /\b(why (should|would).*hire|hire (him|anees|you)|contribute|contribution|benefit|valuable|value to|business|startup|organisation|organization|our company|my company|our team|my team|our project|my project|running project|client|services|consult|solve|solution|grow|growth|improve|help (us|me|our|my)|fit for|suitable for|what can (he|anees|you) do|how (can|could) (he|anees|you))\b/.test(q)
  )
    return businessValue(q);
  const matched = PROJECTS.filter((p) =>
    [p.title, ...(aliases[p.id] || [])].some((a) => has(q, a)),
  );
  const followup =
    /^(tell me more|more|what (tech|technology|stack) does (it|that) use|what about (its )?(tech|stack)|its (tech|stack)|repo|github link|link|features|details)$/.test(
      q,
    );
  const projects = matched.length
    ? matched
    : followup
      ? PROJECTS.filter((p) => p.id === previousTopic)
      : [];
  if (projects.length)
    return {
      text: projects
        .map(
          (p) =>
            `${p.title}\n${p.description}\n\nFeatures: ${p.features.join(" · ")}\nTechnologies: ${p.tech.join(", ")}`,
        )
        .join("\n\n"),
      sources: [
        { label: CHAT.resumeSource, href: PROFILE.resume },
        ...projects.flatMap((p) =>
          p.github ? [{ label: `${p.title} · GitHub`, href: p.github }] : [],
        ),
      ],
      topic: projects.length === 1 ? projects[0].id : undefined,
    };
  if (/\b(contact|email|phone|reach|linkedin|github)\b/.test(q))
    return {
      text: `${PROFILE.name}\n${PROFILE.email}\n${PROFILE.phone}`,
      sources: [
        { label: "Email", href: `mailto:${PROFILE.email}` },
        { label: "GitHub", href: PROFILE.github },
        { label: "LinkedIn", href: PROFILE.linkedin },
      ],
    };
  if (
    /\b(education|study|studied|studying|university|degree|cgpa|gpa|graduate|graduation|college)\b/.test(
      q,
    )
  )
    return {
      text: EDUCATION.map(
        (e) => `${e.title}\n${e.place}\n${e.date}\n${e.details.join("\n")}`,
      ).join("\n\n"),
      sources: resume,
    };
  if (
    /\b(certification|certifications|certificate|certificates|course|courses)\b/.test(
      q,
    )
  )
    return {
      text: CERTIFICATIONS.map(
        (c) => `${c.title}\n${c.issuer} · ${c.year}`,
      ).join("\n\n"),
      sources: resume,
    };
  if (
    /\b(experience|internship|intern|employment|employer|company|companies|job|jobs|deft|current role|work history)\b/.test(
      q,
    ) ||
    /where.*work/.test(q)
  )
    return {
      text: EXPERIENCE.map(
        (e) => `${e.title} · ${e.place}\n${e.date}\n${e.details.join("\n")}`,
      ).join("\n\n"),
      sources: resume,
    };
  const skills = SKILL_GROUPS.flatMap((g) => g.skills).filter((s) =>
    [s.name, ...(s.aliases || [])].some((a) => has(q, a)),
  );
  if (skills.length)
    return {
      text: skills
        .map((s) => {
          const related = PROJECTS.filter((p) =>
            p.tech.some((t) =>
              [s.name, ...(s.aliases || [])].some(
                (a) => normal(a) === normal(t),
              ),
            ),
          );
          return `${s.name} is listed in Anees’s portfolio skills.${related.length ? `\nProjects: ${related.map((p) => p.title).join(", ")}.` : ""}`;
        })
        .join("\n\n"),
      sources: [{ label: CHAT.skillsSource, href: "#skills" }, ...resume],
    };
  if (
    /\b(skill|skills|stack|technologies|languages|tools|frameworks)\b/.test(q)
  )
    return {
      text: SKILL_GROUPS.map(
        (g) => `${g.family}: ${g.skills.map((s) => s.name).join(", ")}`,
      ).join("\n\n"),
      sources: [{ label: CHAT.skillsSource, href: "#skills" }, ...resume],
    };
  if (/\b(project|projects|built|build|portfolio|work)\b/.test(q))
    return {
      text: PROJECTS.map((p) => `${p.title} — ${p.description}`).join("\n\n"),
      sources: [{ label: CHAT.workSource, href: "#work" }, ...resume],
    };
  if (/\b(resume|cv|download)\b/.test(q))
    return { text: `${PROFILE.name} · ${PROFILE.role}`, sources: resume };
  if (
    /\b(about anees|about muhammad|who is (anees|muhammad anees)|introduce anees|introduction|professional summary|specialize|specializes|specialization|his role|anees role)\b/.test(q)
  )
    return {
      text: `${PROFILE.name} · ${PROFILE.role}\n\n${PROFILE.resumeSummary}`,
      sources: resume,
    };
  return fallback;
}
