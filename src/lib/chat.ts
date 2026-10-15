import {
  PROFILE,
  PROJECTS,
  SKILL_GROUPS,
  EXPERIENCE,
  EDUCATION,
  CERTIFICATIONS,
  CHAT,
  type Project,
} from "./data";

export type AnswerSource = { label: string; href: string };
export type AnswerEvidence = { claim: string; sources: AnswerSource[] };
export type Answer = {
  text: string;
  sources: AnswerSource[];
  evidence?: AnswerEvidence[];
  topic?: string;
  intents?: string[];
  kind?: "answer" | "greeting" | "unknown" | "refusal" | "business";
};

const normal = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
const has = (question: string, term: string) =>
  (" " + question + " ").includes(" " + normal(term) + " ");
const resumeSource: AnswerSource = {
  label: CHAT.resumeSource,
  href: PROFILE.resume,
};
const contactSources: AnswerSource[] = [
  { label: "Email Anees", href: "mailto:" + PROFILE.email },
  { label: "Call Anees", href: PROFILE.phoneHref },
  { label: "LinkedIn", href: PROFILE.linkedin },
];
const aliases: Record<string, string[]> = {
  pakwheels: ["pakwheels", "cars", "car", "vehicle"],
  legal: ["legal assistant", "legal", "law"],
  travel: ["travel rag", "travel", "itinerary", "itineraries"],
  resume: ["resume builder", "cv builder", "ats"],
  career: ["career assistant", "career roadmap", "job recommendations"],
  chat: ["tdc ai chat", "chat service", "microservice"],
};

function projectSource(project: Project): AnswerSource[] {
  return project.github
    ? [{ label: project.title + " repository", href: project.github }]
    : [resumeSource];
}

function projectText(project: Project) {
  return (
    project.title +
    "\n" +
    project.description +
    "\n\nKey capabilities\n" +
    project.features.map((feature) => "• " + feature).join("\n") +
    "\n\nStack\n" +
    project.tech.join(", ")
  );
}

function matchedProjects(question: string) {
  return PROJECTS.filter((project) =>
    [project.title, ...(aliases[project.id] || [])].some((alias) =>
      has(question, alias),
    ),
  );
}

function projectEvidence(project: Project): AnswerEvidence {
  return { claim: project.description, sources: projectSource(project) };
}

function compareProjects(question: string, previousTopic?: string): Answer {
  const matched = matchedProjects(question);
  const previous = PROJECTS.find((project) => project.id === previousTopic);
  const strongest = /\b(strongest|best|standout|most impressive)\b/.test(question);
  const primary = strongest
    ? PROJECTS.find((project) => project.id === "pakwheels")!
    : previous ?? matched[0] ?? PROJECTS[0];
  const comparison =
    matched.find((project) => project.id !== primary.id) ??
    PROJECTS.find(
      (project) => project.id === "legal" && project.id !== primary.id,
    ) ??
    PROJECTS.find((project) => project.id !== primary.id)!;
  const opening = strongest
    ? "“Strongest” depends on the criterion. For demonstrated scale and search performance, PakWheels AI is the clearest standout."
    : primary.title + " and " + comparison.title + " demonstrate different strengths.";
  return {
    kind: "answer",
    intents: ["comparison", "project"],
    topic: primary.id,
    text:
      opening +
      "\n\n" +
      primary.title +
      "\n" +
      primary.description +
      "\n\nCompared with " +
      comparison.title +
      "\n" +
      comparison.description +
      "\n\nThe evidence supports choosing " +
      primary.title +
      " for scale and natural-language search, while " +
      comparison.title +
      " is stronger evidence for citation-grounded, higher-trust retrieval.",
    sources: [...projectSource(primary), ...projectSource(comparison)],
    evidence: [projectEvidence(primary), projectEvidence(comparison)],
  };
}

function hiringAnswer(): Answer {
  const pakwheels = PROJECTS.find((project) => project.id === "pakwheels")!;
  const chat = PROJECTS.find((project) => project.id === "chat")!;
  return {
    kind: "business",
    intents: ["business-fit", "experience"],
    text:
      "Why consider Anees\n" +
      "• He works as an AI Engineer building multi-model AI services, RAG pipelines, knowledge sync, and intelligent routing.\n" +
      "• His portfolio shows delivery across Python, FastAPI, Node.js, TypeScript, databases, and React.\n" +
      "• PakWheels AI demonstrates semantic search across 77,000+ listings with sub-second natural-language queries.\n" +
      "• His legal assistant demonstrates citation-grounded retrieval, confidence scoring, and source attribution.\n\n" +
      "The strongest case is practical AI product delivery rather than a generic tool list. Team fit, availability, and employment terms require a conversation.\n\n" +
      "Contact Anees to discuss the role and expected outcomes.",
    sources: contactSources,
    evidence: [
      {
        claim:
          "Current AI Engineer work includes multi-model services, RAG pipelines, knowledge sync, and intelligent routing.",
        sources: [resumeSource],
      },
      projectEvidence(pakwheels),
      projectEvidence(chat),
    ],
  };
}

function businessQualification(question: string): Answer {
  const pakwheels = PROJECTS.find((project) => project.id === "pakwheels")!;
  const legal = PROJECTS.find((project) => project.id === "legal")!;
  const chat = PROJECTS.find((project) => project.id === "chat")!;
  const ecommerce =
    /\b(ecommerce|e commerce|marketplace|catalog|order|retail)\b/.test(question);
  const support =
    /\b(customer|support|help center|knowledge|assistant|rag|chatbot)\b/.test(
      question,
    );
  const finance =
    /\b(finance|financial|fintech|bank|banking|investment|accounting|insurance)\b/.test(
      question,
    );
  const fit =
    finance
      ? "Partial fit based on transferable AI engineering evidence. The portfolio does not verify professional finance-sector experience, so domain and compliance fit require discovery."
      : ecommerce && support
      ? "Strong technical fit for a discovery-led MVP; domain-specific production fit should be validated."
      : "Promising technical fit, with the exact scope and domain requirements still to validate.";
  const proposedScope = finance
    ? "• Permission-aware document Q&A over approved policies, reports, and internal knowledge.\n" +
      "• Search across reports with citations and source links.\n" +
      "• A knowledge assistant with controlled tools for approved workflows.\n" +
      "• Human review, evaluation, audit logging, and escalation for sensitive answers."
    : "• Permission-aware ingestion for help-center and order data.\n" +
      "• Retrieval with citations and order lookup through controlled tools.\n" +
      "• Support chat with human escalation and feedback capture.\n" +
      "• Evaluation set, hallucination checks, logging, and basic monitoring.";
  const discovery = finance
    ? "• Which documents, users, permissions, retention rules, and review requirements apply?\n" +
      "• Which workflows may be automated, and which require a qualified human decision?"
    : "• Which support channels, order systems, user roles, languages, and escalation rules are required?\n" +
      "• What data can be indexed, and what must remain live behind authenticated APIs?";
  return {
    kind: "business",
    intents: ["business-fit", "project", "skills", "contact"],
    topic: "business-fit",
    text:
      "Fit assessment\n" +
      fit +
      "\n\nVerified evidence\n" +
      "• PakWheels AI: semantic search over 77,000+ listings with sub-second natural-language queries.\n" +
      "• Pakistani Legal Assistant: citation-grounded RAG with confidence scoring and source attribution.\n" +
      "• TDC AI work: MongoDB-backed RAG, knowledge sync, prompt/context engineering, and multi-model routing.\n" +
      "• Full-stack delivery with FastAPI, Node.js, TypeScript, React, databases, APIs, and automation.\n\n" +
      "Proposed MVP — not completed portfolio work\n" +
      proposedScope +
      "\n\n" +
      "Discovery questions\n" +
      discovery +
      "\n\n" +
      "Key risks\nData quality, permissions, PII and sensitive data, hallucinations, evaluation coverage, compliance review, human escalation, and integration complexity.\n\n" +
      "Timeline and budget\nThe portfolio does not verify an exact timeline, rate, or budget. Those require discovery and access to the current stack.\n\n" +
      "Contact Anees with the goal, users, data sources, integrations, deadline, budget range, and success criteria.",
    sources: contactSources,
    evidence: [
      projectEvidence(pakwheels),
      projectEvidence(legal),
      projectEvidence(chat),
      {
        claim:
          "Current experience includes MongoDB-backed RAG, knowledge sync, prompt/context engineering, and multi-model services.",
        sources: [resumeSource],
      },
    ],
  };
}

function agentAutomationAnswer(): Answer {
  return {
    kind: "answer",
    intents: ["skills", "experience", "agentic-ai", "automation"],
    text:
      "Yes. Anees’s verified work covers AI agents and automation.\n\n" +
      "• At The Deft Crew, he built agent-based workflows, recommendation systems, multi-model routing, RAG pipelines, and a knowledge-sync pipeline.\n" +
      "• His documented stack includes Agentic AI, multi-agent collaboration, tool calling, LLM orchestration, n8n, webhooks, and REST APIs.\n" +
      "• His AI Career Assistant orchestrates OpenAI, Gemini, Claude, and Groq through a unified API.\n\n" +
      "The portfolio verifies those capabilities; it does not claim outcomes or automation deployments beyond the documented work.",
    sources: [resumeSource, { label: CHAT.skillsSource, href: "#skills" }],
    evidence: [
      {
        claim:
          "Current AI Engineer responsibilities include agent-based workflows, multi-model services, RAG, knowledge sync, and recommendation systems.",
        sources: [resumeSource],
      },
    ],
  };
}

function careerDirectionAnswer(): Answer {
  return {
    kind: "answer",
    intents: ["profile", "career-direction", "education"],
    text:
      "Anees’s exact personal career goal is not stated as a separate verified claim. His documented direction is AI engineering focused on LLM-powered applications, agentic workflows, RAG systems, automation, and scalable AI products.\n\n" +
      "He currently works as an AI Engineer and is completing a B.S. in Artificial Intelligence through 2027. For a specific long-term goal, contact him directly.",
    sources: [resumeSource, ...contactSources],
    evidence: [
      { claim: PROFILE.careerDirection, sources: [resumeSource] },
    ],
  };
}

function responsibilitiesAnswer(): Answer {
  const current = EXPERIENCE[0];
  return {
    kind: "answer",
    intents: ["experience", "responsibilities"],
    text:
      "As an AI Engineer at The Deft Crew, Anees has handled:\n" +
      current.details.map((detail) => "• " + detail).join("\n"),
    sources: [resumeSource],
    evidence: [
      {
        claim: "AI Engineer responsibilities at The Deft Crew.",
        sources: [resumeSource],
      },
    ],
  };
}

function problemExampleAnswer(): Answer {
  const project = PROJECTS.find((item) => item.id === "pakwheels")!;
  return {
    kind: "answer",
    intents: ["project", "problem-solution"],
    topic: project.id,
    text:
      "One documented example is PakWheels AI.\n\n" +
      "Problem\nUsers needed natural-language search across a large vehicle inventory.\n\n" +
      "Approach\nAnees built semantic search with FAISS and Sentence Transformers, exposed through FastAPI, with Groq LLaMA 3 in the stack.\n\n" +
      "Verified outcome\nThe project searches 77,000+ listings and documents sub-second natural-language queries.",
    sources: projectSource(project),
    evidence: [projectEvidence(project)],
  };
}

function snakeProjectAnswer(): Answer {
  return {
    kind: "unknown",
    intents: ["project", "unverified-project"],
    text:
      "A snake species detection project is not part of Anees’s verified public portfolio, résumé, or approved GitHub project record. I can’t describe its implementation or present it as completed work without an authoritative public record.\n\nYou can ask about PakWheels AI, the Pakistani Legal Assistant, Pakistan Travel RAG, AI Resume Builder, AI Career Assistant, or TDC AI Chat Service.",
    sources: [resumeSource, { label: "GitHub profile", href: PROFILE.github }],
  };
}

function contactAnswer(includeInquiry: boolean): Answer {
  return {
    kind: "answer",
    intents: ["contact", ...(includeInquiry ? ["inquiry-guidance"] : [])],
    text: includeInquiry
      ? PROFILE.email +
        "\n" +
        PROFILE.phone +
        "\n\nFor a useful project inquiry, include:\n" +
        "• Project goal\n• Target users\n• Data sources\n• Current stack\n" +
        "• Desired integrations\n• Deadline\n• Approximate budget range\n• Success criteria"
      : PROFILE.email + "\n" + PROFILE.phone,
    sources: contactSources,
    evidence: [
      {
        claim:
          "Verified contact details: " + PROFILE.email + " and " + PROFILE.phone + ".",
        sources: [resumeSource],
      },
    ],
  };
}

function unknownAnswer(): Answer {
  return {
    kind: "unknown",
    intents: ["unknown", "contact"],
    text:
      "Anees’s exact rate, salary expectation, and current availability are not verified in the portfolio, so I won’t guess.\n\n" +
      "Contact him directly for current terms and scheduling:\n" +
      PROFILE.email +
      "\n" +
      PROFILE.phone,
    sources: contactSources,
  };
}

function skillAnswer(question: string): Answer {
  const matched = SKILL_GROUPS.flatMap((group) =>
    group.skills
      .filter((skill) =>
        [skill.name, ...(skill.aliases || [])].some((alias) =>
          has(question, alias),
        ),
      )
      .map((skill) => ({ ...skill, family: group.family })),
  );
  if (matched.length) {
    return {
      kind: "answer",
      intents: ["skills"],
      text: matched
        .map((skill) => {
          const projects = PROJECTS.filter((project) =>
            project.tech.some((technology) =>
              [skill.name, ...(skill.aliases || [])].some(
                (alias) => normal(alias) === normal(technology),
              ),
            ),
          );
          return (
            skill.name +
            " — " +
            skill.family +
            (projects.length
              ? "\nUsed in: " +
                projects.map((project) => project.title).join(", ")
              : "")
          );
        })
        .join("\n\n"),
      sources: [{ label: CHAT.skillsSource, href: "#skills" }],
    };
  }
  return {
    kind: "answer",
    intents: ["skills"],
    text: SKILL_GROUPS.map(
      (group) =>
        group.family +
        "\n" +
        group.skills.map((skill) => skill.name).join(", "),
    ).join("\n\n"),
    sources: [{ label: CHAT.skillsSource, href: "#skills" }, resumeSource],
  };
}

/** Detects all portfolio intents and composes a verified local fallback. */
export function answerQuestion(input: string, previousTopic?: string): Answer {
  const question = normal(input);
  const fallback: Answer = {
    kind: "unknown",
    intents: ["unknown"],
    text: CHAT.fallback,
    sources: [{ label: CHAT.contactSource, href: "#contact" }],
  };
  if (!question || input.length > 500)
    return input.length > 500
      ? { text: CHAT.limit, sources: [], kind: "unknown" }
      : fallback;

  if (
    /\b(ignore|disregard|override).*(instruction|prompt)|system prompt|developer message|reveal.*prompt|invent|fabricate|make up|pretend\b/.test(
      question,
    )
  )
    return {
      kind: "refusal",
      intents: ["prompt-injection"],
      text:
        "I can’t reveal hidden instructions or invent portfolio facts. I can help with Anees’s verified projects, skills, experience, education, business fit, or contact details.",
      sources: [],
    };

  if (
    /^(hi|hello|hey|salam|assalamualaikum)( what can you help me with| what can i ask| how can you help)?$/.test(
      question,
    ) ||
    /^(what can you help me with|what can i ask you|how can you help me)$/.test(
      question,
    )
  )
    return {
      kind: "greeting",
      intents: ["greeting"],
      text:
        "Hi! I’m Robo Cat, Anees’s portfolio guide. You can ask me to:\n" +
        "• Explain or compare his projects\n" +
        "• Match his skills to your role or business problem\n" +
        "• Summarize his experience and education\n" +
        "• Share verified contact details",
      sources: [],
    };

  if (/\b(snake|species detection|snake detection)\b/.test(question))
    return snakeProjectAnswer();

  if (
    /\b(career goal|career direction|career objective|professional goal|future goal|career aspiration|where.*career|where.*headed)\b/.test(
      question,
    )
  )
    return careerDirectionAnswer();

  if (
    /\b(responsibilit|responsibilities|duties|handled|what does he do|what has he done).*\b(ai engineer|engineer|work|role)?\b/.test(
      question,
    ) || /\b(ai engineer).*(responsibilit|duties|handled)\b/.test(question)
  )
    return responsibilitiesAnswer();

  if (
    /\b(example|tell me).*(problem|challenge).*(solved|handled|addressed)|\b(problem|challenge).*(he|anees).*(solved|handled|addressed)|\bsolution.*example\b/.test(
      question,
    )
  )
    return problemExampleAnswer();

  if (
    /\b(ai agents?|agentic(?: ai| workflows?)?|agent based|multi agents?|automation|automated|automate|workflow automation|n8n|llm orchestration)\b/.test(
      question,
    ) &&
    !/\b(business|company|startup|client|industry|finance|financial|bank|banking|ecommerce|e commerce|retail|how (can|could|would) (he|anees))\b/.test(
      question,
    )
  )
    return agentAutomationAnswer();

  if (
    /\b(compare|comparison|versus|vs|best project|standout project|most impressive project)\b|strongest.*project/.test(
      question,
    )
  )
    return compareProjects(question, previousTopic);

  if (
    /\b(why (should|would) (we|i|our company).*hire|why hire|should (we|i).*hire|good hire)\b/.test(
      question,
    )
  )
    return hiringAnswer();

  if (
    /\b(business|company|startup|client|customer support|help center|mvp|scope|proposal|grow|growth|contribute|benefit|project fit|good fit|running project|how (can|could|would) (he|anees)|timeline|budget)\b/.test(
      question,
    )
  )
    return businessQualification(question);

  if (
    /\b(rate|salary|salary expectation|availability|available|next monday|pricing|hourly|cost to hire|birthday|age|married|religion|address|home|password|secret)\b/.test(
      question,
    )
  )
    return unknownAnswer();

  if (
    /\b(weather|forecast|temperature|prime minister|president|pm of|capital of|currency|exchange rate|stock|crypto|bitcoin|cricket|football|sports|score|recipe|movie|song|news|election|politics)\b/.test(
      question,
    )
  )
    return fallback;

  const wantsInquiry =
    /\b(project inquiry|inquiry|what should i include|proposal details|contact.*include)\b/.test(
      question,
    );
  const wantsContact =
    /\b(contact|email|phone|reach|linkedin|github|call him)\b/.test(question);
  if (wantsContact || wantsInquiry) return contactAnswer(wantsInquiry);

  const projects = matchedProjects(question);
  const previous = PROJECTS.find((project) => project.id === previousTopic);
  const followupStack =
    /\b(what|which).*(stack|tech|technology)|stack does it use|tech does it use\b/.test(
      question,
    );
  const followupWhy =
    /\bwhy.*useful|what.*useful|why does (it|that) matter|benefit of (it|that)\b/.test(
      question,
    );
  if ((followupStack || followupWhy) && previous) {
    return {
      kind: "answer",
      intents: ["project", followupStack ? "skills" : "business-fit"],
      topic: previous.id,
      text: followupStack
        ? previous.title + " uses " + previous.tech.join(", ") + "."
        : previous.title +
          " is useful because it delivers: " +
          previous.features.join(", ") +
          ". " +
          previous.description,
      sources: projectSource(previous),
      evidence: [projectEvidence(previous)],
    };
  }
  if (projects.length) {
    const project = projects[0];
    return {
      kind: "answer",
      intents: ["project"],
      topic: project.id,
      text: projectText(project),
      sources: projectSource(project),
      evidence: [projectEvidence(project)],
    };
  }

  const intents: string[] = [];
  if (
    /\b(skill|skills|stack|technologies|languages|tools|frameworks|python|typescript|javascript|rag|fastapi|react|node|agents?|agentic|automation|n8n|orchestration)\b/.test(
      question,
    )
  )
    intents.push("skills");
  if (
    /\b(experience|internship|intern|employment|employer|job|jobs|deft|current role|work history)\b/.test(
      question,
    ) || /where.*work/.test(question)
  )
    intents.push("experience");
  if (
    /\b(education|study|studied|studying|university|degree|cgpa|gpa|graduate|graduation|college)\b/.test(
      question,
    )
  )
    intents.push("education");
  if (/\b(certifications?|certificates?|credentials?|courses?)\b/.test(question))
    intents.push("certifications");
  if (/\b(project|projects|built|build|portfolio work)\b/.test(question))
    intents.push("projects");
  if (
    /\b(about anees|about muhammad|who is (anees|muhammad anees)|introduce anees|professional summary|specialize|specialization|his role|anees role)\b/.test(
      question,
    )
  )
    intents.push("profile");

  const sections: string[] = [];
  const sources: AnswerSource[] = [];
  if (intents.includes("profile")) {
    sections.push(
      PROFILE.name + " · " + PROFILE.role + "\n" + PROFILE.resumeSummary,
    );
    sources.push(resumeSource);
  }
  if (intents.includes("skills")) {
    const answer = skillAnswer(question);
    sections.push(answer.text);
    sources.push(...answer.sources);
  }
  if (intents.includes("experience")) {
    sections.push(
      EXPERIENCE.map(
        (entry) =>
          entry.title +
          " · " +
          entry.place +
          "\n" +
          entry.date +
          "\n" +
          entry.details.join("\n"),
      ).join("\n\n"),
    );
    sources.push(resumeSource);
  }
  if (intents.includes("education")) {
    sections.push(
      EDUCATION.map(
        (entry) =>
          entry.title +
          "\n" +
          entry.place +
          "\n" +
          entry.date +
          "\n" +
          entry.details.join("\n"),
      ).join("\n\n"),
    );
    sources.push(resumeSource);
  }
  if (intents.includes("certifications")) {
    sections.push(
      CERTIFICATIONS.map(
        (item) =>
          item.title +
          "\n" +
          item.issuer +
          (item.year ? " · " + item.year : ""),
      ).join("\n\n"),
    );
    sources.push(
      resumeSource,
      ...CERTIFICATIONS.flatMap((item) =>
        item.url ? [{ label: item.title, href: item.url }] : [],
      ),
    );
  }
  if (intents.includes("projects")) {
    sections.push(
      PROJECTS.map(
        (project) => project.title + " — " + project.description,
      ).join("\n\n"),
    );
    sources.push({ label: CHAT.workSource, href: "#work" });
  }
  if (/\b(resume|cv|download)\b/.test(question))
    return {
      text: PROFILE.name + " · " + PROFILE.role,
      sources: [resumeSource],
      intents: ["resume"],
      kind: "answer",
    };

  return sections.length
    ? {
        kind: "answer",
        intents,
        text: sections.join("\n\n"),
        sources: sources.filter(
          (source, index, all) =>
            all.findIndex((item) => item.href === source.href) === index,
        ),
      }
    : fallback;
}
