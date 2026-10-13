import logos from "@/lib/brands.json";
import { SKILL_GROUPS } from "@/lib/data";
export const BRAND: Record<string, string> = logos;
export const CONCEPT: Record<string, string> = {
  sql: "database",
  faiss: "database",
  vector: "search",
  embeddings: "network",
  rag: "search",
  prompt: "text",
  agent: "network",
  agents: "network",
  tools: "code",
  orchestration: "network",
  recommendations: "search",
  rest: "code",
  microservices: "network",
  oauth: "lock",
  webhooks: "network",
  llms: "text",
  transformers: "network",
  llama: "network",
  openai: "network",
  groq: "network",
  autogen: "network",
};
export const isBrand = (key: string) => Boolean(BRAND[key]);
export function skillKey(name: string) {
  return (
    SKILL_GROUPS.flatMap((g) => g.skills).find(
      (s) => s.name === name || s.aliases?.includes(name),
    )?.key ?? name.toLowerCase()
  );
}
export default function TechLogo({
  name,
  logoKey,
  size = 24,
  decorative = false,
}: {
  name: string;
  logoKey?: string;
  size?: number;
  decorative?: boolean;
}) {
  const key = logoKey ?? skillKey(name);
  const type = CONCEPT[key] ?? "code";
  if (isBrand(key))
    return (
      <img
        src={BRAND[key]}
        width={size}
        height={size}
        style={{ width: size, height: size, objectFit: "contain" }}
        alt={decorative ? "" : `${name} logo`}
        loading="lazy"
      />
    );
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={decorative || undefined}
      role={decorative ? undefined : "img"}
    >
      {!decorative && <title>{name}</title>}
      {type === "database" ? (
        <>
          <ellipse cx="24" cy="11" rx="14" ry="6" />
          <path d="M10 11v25c0 8 28 8 28 0V11M10 23c0 8 28 8 28 0" />
        </>
      ) : type === "network" ? (
        <>
          <circle cx="24" cy="24" r="7" />
          <circle cx="9" cy="9" r="4" />
          <circle cx="39" cy="11" r="4" />
          <circle cx="11" cy="39" r="4" />
          <circle cx="39" cy="38" r="4" />
          <path d="m12 12 7 7m10 0 7-5m-7 15 7 6m-17-5-5 6" />
        </>
      ) : type === "search" ? (
        <>
          <circle cx="21" cy="21" r="13" />
          <path d="m31 31 11 11M15 21h12m-6-6v12" />
        </>
      ) : type === "text" ? (
        <>
          <rect x="9" y="5" width="30" height="38" rx="4" />
          <path d="M17 15h14M17 23h14M17 31h9" />
        </>
      ) : type === "lock" ? (
        <>
          <rect x="10" y="21" width="28" height="23" rx="4" />
          <path d="M16 21V12a8 8 0 0 1 16 0v9M24 29v7" />
        </>
      ) : (
        <>
          <path d="m16 12-12 12 12 12m16-24 12 12-12 12M28 7l-8 34" />
        </>
      )}
    </svg>
  );
}
