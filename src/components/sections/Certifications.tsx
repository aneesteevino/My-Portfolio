import { COPY, CERTIFICATIONS } from "@/lib/data";
import SectionHeading from "../ui/SectionHeading";
export default function Certifications() {
  if (!CERTIFICATIONS.length) return null;
  return (
    <section
      id="certifications"
      className="section certifications-section"
      aria-labelledby="certifications-heading"
    >
      <div className="container cert-grid">
        <div className="cert-heading">
          <SectionHeading
            index="04"
            tag={COPY.certifications.tag}
            heading={COPY.certifications.heading}
            accent={COPY.certifications.accent}
            id="certifications-heading"
          />
          <p className="cert-count eyebrow">
            {String(CERTIFICATIONS.length).padStart(2, "0")}{" "}
            {COPY.certifications.count}
          </p>
        </div>
        <ol className="cert-list">
          {CERTIFICATIONS.map((c, i) => (
            <li
              key={c.title}
              className="cert-row rv"
              tabIndex={c.url ? undefined : 0}
            >
              {c.url ? (
                <a href={c.url} target="_blank" rel="noreferrer">
                  <CertContent cert={c} index={i} />
                </a>
              ) : (
                <CertContent cert={c} index={i} />
              )}
            </li>
          ))}
        </ol>
      </div>
      <style href="certifications-styles" precedence="components">{`
  .certifications-section{background:#fff;border-block:1px solid var(--line)}.cert-grid{display:grid;grid-template-columns:1fr 1.5fr;gap:75px}.cert-heading{align-self:start;position:sticky;top:120px}.cert-heading .section-heading{font-size:clamp(44px,4.5vw,64px)}.cert-count{margin-top:28px;color:var(--mute);font-size:9px}.cert-list{list-style:none;padding:0;margin:45px 0 0}.cert-row{position:relative;border-block:1px solid var(--line);isolation:isolate;padding:30px 22px;display:grid;grid-template-columns:28px 1fr 30px;gap:22px;align-items:center;overflow:hidden}.cert-row::before{content:"";position:absolute;inset:0;background:var(--ink);z-index:-1;transform:scaleX(0);transform-origin:left;transition:transform .65s var(--ease)}.cert-row:hover::before,.cert-row:focus::before,.cert-row:focus-within::before{transform:scaleX(1)}.cert-row,.cert-row .eyebrow,.cert-row p{transition:color .5s var(--ease)}.cert-row:hover,.cert-row:hover .eyebrow,.cert-row:hover p,.cert-row:focus,.cert-row:focus .eyebrow,.cert-row:focus p,.cert-row:focus-within,.cert-row:focus-within .eyebrow,.cert-row:focus-within p{color:#fff}.cert-row a{display:contents}.cert-row h3{font-size:25px;font-weight:500;letter-spacing:-.025em;line-height:1.2}.cert-row p{font-size:12px;margin-top:11px;color:var(--mute)}.cert-arrow{font-size:26px;opacity:0;transform:translateX(-10px);transition:opacity .5s var(--ease),transform .5s var(--ease)}.cert-row:hover .cert-arrow,.cert-row:focus .cert-arrow,.cert-row:focus-within .cert-arrow{opacity:1;transform:none}
  @media(max-width:700px){.cert-grid{grid-template-columns:1fr;gap:35px}.cert-heading{position:static}.cert-list{margin:0}.cert-row{padding:28px 12px;gap:12px;grid-template-columns:20px 1fr 20px}.cert-row h3{font-size:23px}.cert-row p{font-size:11px}}
  `}</style>
    </section>
  );
}
function CertContent({
  cert,
  index,
}: {
  cert: (typeof CERTIFICATIONS)[number];
  index: number;
}) {
  return (
    <>
      <span className="eyebrow">{String(index + 1).padStart(2, "0")}</span>
      <div>
        <h3>{cert.title}</h3>
        <p>
          {cert.issuer} · {cert.year}
        </p>
      </div>
      {cert.url && (
        <span className="cert-arrow" aria-hidden="true">
          ↗
        </span>
      )}
    </>
  );
}
