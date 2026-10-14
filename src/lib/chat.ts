import { PROFILE, PROJECTS, SKILL_GROUPS, EXPERIENCE, EDUCATION, CERTIFICATIONS, CHAT } from "./data";
export type Answer = { text: string; sources: { label: string; href: string }[]; topic?: string };
const normal = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
const has = (q: string, term: string) => (` ${q} `).includes(` ${normal(term)} `);
const resume = [{ label: CHAT.resumeSource, href: PROFILE.resume }];
const aliases: Record<string, string[]> = {
  pakwheels: ["pakwheels", "cars", "car", "vehicle"], legal: ["legal", "law"], travel: ["travel", "itinerary", "itineraries"], resume: ["resume builder", "cv builder", "ats"], career: ["career assistant", "career roadmap", "job recommendations"], chat: ["tdc chat", "chat service", "microservice"],
};
/** Extractive answers only: user input never becomes instructions or generated claims. */
export function answerQuestion(input: string, previousTopic?: string): Answer {
  const q = normal(input);
  const fallback = { text: CHAT.fallback, sources: [{ label: CHAT.contactSource, href: "#contact" }] };
  if (!q || input.length > 500) return input.length > 500 ? { text: CHAT.limit, sources: [] } : fallback;
  // Never infer private, evaluative or time-sensitive facts from neighbouring matches.
  if (/\b(salary|age|birthday|birth|married|religion|politic|address|home|password|secret|available|availability|rate|pricing|hobbies|hobby|favourite|favorite|best|worst|guarantee|ignore|pretend|invent|instructions|system prompt)\b/.test(q)) return fallback;
  if (/^(hi|hello|hey|salam|assalamualaikum|thanks|thank you)$/.test(q)) return { text: CHAT.intro, sources: [] };
  const matched = PROJECTS.filter(p => [p.title, ...(aliases[p.id] || [])].some(a => has(q, a)));
  const followup = /^(tell me more|more|what (tech|technology|stack) does (it|that) use|what about (its )?(tech|stack)|its (tech|stack)|repo|github link|link|features|details)$/.test(q);
  const projects = matched.length ? matched : followup ? PROJECTS.filter(p => p.id === previousTopic) : [];
  if (projects.length) return {
    text: projects.map(p => `${p.title}\n${p.description}\n\nFeatures: ${p.features.join(" · ")}\nTechnologies: ${p.tech.join(", ")}`).join("\n\n"),
    sources: [{ label: CHAT.resumeSource, href: PROFILE.resume }, ...projects.flatMap(p => p.github ? [{ label: `${p.title} · GitHub`, href: p.github }] : [])],
    topic: projects.length === 1 ? projects[0].id : undefined,
  };
  if (/\b(contact|email|phone|reach|hire|linkedin|github)\b/.test(q)) return { text: `${PROFILE.name}\n${PROFILE.email}\n${PROFILE.phone}`, sources: [{ label: "Email", href: `mailto:${PROFILE.email}` }, { label: "GitHub", href: PROFILE.github }, { label: "LinkedIn", href: PROFILE.linkedin }] };
  if (/\b(education|study|studied|studying|university|degree|cgpa|gpa|graduate|graduation|college)\b/.test(q)) return { text: EDUCATION.map(e => `${e.title}\n${e.place}\n${e.date}\n${e.details.join("\n")}`).join("\n\n"), sources: resume };
  if (/\b(certification|certifications|certificate|certificates|course|courses)\b/.test(q)) return { text: CERTIFICATIONS.map(c => `${c.title}\n${c.issuer} · ${c.year}`).join("\n\n"), sources: resume };
  if (/\b(experience|internship|intern|employment|employer|company|companies|job|jobs|deft|current role|work history)\b/.test(q) || /where.*work/.test(q)) return { text: EXPERIENCE.map(e => `${e.title} · ${e.place}\n${e.date}\n${e.details.join("\n")}`).join("\n\n"), sources: resume };
  const skills = SKILL_GROUPS.flatMap(g => g.skills).filter(s => [s.name, ...(s.aliases || [])].some(a => has(q, a)));
  if (skills.length) return { text: skills.map(s => {
    const related = PROJECTS.filter(p => p.tech.some(t => [s.name, ...(s.aliases || [])].some(a => normal(a) === normal(t))));
    return `${s.name} is listed in Anees’s portfolio skills.${related.length ? `\nProjects: ${related.map(p => p.title).join(", ")}.` : ""}`;
  }).join("\n\n"), sources: [{ label: CHAT.skillsSource, href: "#skills" }, ...resume] };
  if (/\b(skill|skills|stack|technologies|languages|tools|frameworks)\b/.test(q)) return { text: SKILL_GROUPS.map(g => `${g.family}: ${g.skills.map(s => s.name).join(", ")}`).join("\n\n"), sources: [{ label: CHAT.skillsSource, href: "#skills" }, ...resume] };
  if (/\b(project|projects|built|build|portfolio|work)\b/.test(q)) return { text: PROJECTS.map(p => `${p.title} — ${p.description}`).join("\n\n"), sources: [{ label: CHAT.workSource, href: "#work" }, ...resume] };
  if (/\b(resume|cv|download)\b/.test(q)) return { text: `${PROFILE.name} · ${PROFILE.role}`, sources: resume };
  if (/\b(who|about|introduce|introduction|summary|specialize|specializes|specialization|role)\b/.test(q)) return { text: `${PROFILE.name} · ${PROFILE.role}\n\n${PROFILE.resumeSummary}`, sources: resume };
  return fallback;
}
