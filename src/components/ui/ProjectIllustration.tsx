import { COPY, type Project } from "@/lib/data";
export default function ProjectIllustration({ project }: { project: Project }) {
  const labels = COPY.work.labels[project.illustration];
  return (
    <figure
      className={`project-illustration illustration-${project.illustration}`}
    >
      <div className="mini-window" aria-hidden="true">
        <div className="mini-toolbar">
          <span />
          <span />
          <span />
          <small>{labels[0]}</small>
        </div>
        {project.illustration === "plan" ? (
          <>
            <div className="mini-plan">
              <svg
                viewBox="0 0 180 200"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
              >
                <rect x="10" y="10" width="160" height="180" strokeWidth="2" />
                <path d="M10 52h160M10 112h160M10 124h160M70 10v42M118 52v60M60 124v66M118 124v66M130 124v34h40" />
                <path d="M118 62h52M118 72h52M118 82h52M118 92h52M118 102h52" strokeWidth=".8" />
                <path d="M86 52a12 12 0 0 1 12-12M70 30a12 12 0 0 0 12 12" strokeWidth=".8" />
                <text x="40" y="34" fontSize="7" fill="currentColor" stroke="none" textAnchor="middle">PORCH</text>
                <text x="120" y="34" fontSize="7" fill="currentColor" stroke="none" textAnchor="middle">DRAWING</text>
                <text x="64" y="84" fontSize="7" fill="currentColor" stroke="none" textAnchor="middle">LIVING / DINING</text>
                <text x="35" y="160" fontSize="7" fill="currentColor" stroke="none" textAnchor="middle">BED</text>
                <text x="89" y="160" fontSize="7" fill="currentColor" stroke="none" textAnchor="middle">BED</text>
                <text x="150" y="176" fontSize="6" fill="currentColor" stroke="none" textAnchor="middle">KITCHEN</text>
              </svg>
            </div>
            <p className="mini-metric">{labels[1]}</p>
            <p className="mini-caption">{labels[2]}</p>
          </>
        ) : project.illustration === "resume" ? (
          <div className="mini-document">
            <span className="document-orbit">✳</span>
            <div className="skeleton-lines">
              <i />
              <i />
              <i />
            </div>
            <div className="document-divider" />
            <p>{labels[1]}</p>
            <div className="skeleton-lines short">
              <i />
              <i />
              <i />
              <i />
            </div>
            <span className="mini-tag">{labels[2]} ↗</span>
            <span className="mini-tag">{labels[3]} ↓</span>
          </div>
        ) : project.illustration === "travel" ? (
          <>
            <div className="mini-map">
              <svg viewBox="0 0 220 170">
                <path
                  d="M30 135C65 140 45 40 100 65S140 160 186 30"
                  fill="none"
                  stroke="#b3b0a9"
                  strokeWidth="1"
                  strokeDasharray="4 5"
                />
                <circle cx="30" cy="135" r="6" fill="#222" />
                <circle cx="100" cy="65" r="6" fill="#222" />
                <circle cx="186" cy="30" r="6" fill="#222" />
              </svg>
              <span className="map-label a">{labels[1]}</span>
              <span className="map-label b">{labels[2]}</span>
              <span className="map-label c">{labels[3]}</span>
            </div>
            <div className="skeleton-lines">
              <i />
              <i />
            </div>
          </>
        ) : project.illustration === "legal" ? (
          <>
            <div className="legal-symbol">
              <svg
                width="90"
                height="90"
                viewBox="0 0 90 90"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
              >
                <path d="M45 12v60M25 73h40M13 27h64M25 27 12 52h26zm40 0L52 52h26zM12 52c0 13 26 13 26 0M52 52c0 13 26 13 26 0" />
                <circle cx="45" cy="15" r="4" fill="white" />
              </svg>
            </div>
            <div className="mini-citation">
              <span>↗</span>
              <p>{labels[1]}</p>
            </div>
            <div className="mini-citation">
              <span>✓</span>
              <p>{labels[2]}</p>
            </div>
            <div className="skeleton-lines">
              <i />
              <i />
            </div>
          </>
        ) : (
          <>
            <div className="mini-chat">
              <div className="chat-bubble small">
                <i />
                <i />
              </div>
              <div className="chat-bubble">
                <span className="mini-ai">✳</span>
                <p>{labels[1]}</p>
                <i />
                <i />
                <i />
              </div>
            </div>
            <div className="routing-diagram">
              <span>○</span>
              <i />
              <span>✳</span>
              <i />
              <span>○</span>
            </div>
            <p className="mini-caption">{labels[2]}</p>
          </>
        )}
      </div>
      <figcaption className="eyebrow">{COPY.work.illustration}</figcaption>
      <style href="projectillustration-styles" precedence="components">{`
  .project-illustration{margin:0;display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:0;width:100%;height:100%;padding:16px;background:#f1f0ed;border-radius:18px;overflow:hidden}.mini-window{width:100%;max-width:280px;min-height:270px;background:#fff;border:1px solid #dedcd7;border-radius:12px;box-shadow:0 15px 28px -20px #0005;transform:rotate(-4deg);color:#494949;transition:transform .8s var(--ease)}.project-panel:hover .mini-window{transform:rotate(0deg) translateY(-5px)}.mini-toolbar{height:33px;border-bottom:1px solid #eceae6;display:flex;align-items:center;gap:4px;padding:0 12px}.mini-toolbar>span{width:4px;height:4px;border-radius:50%;background:#c9c6c1}.mini-toolbar small{margin-left:8px;font-family:var(--font-mono);font-size:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.mini-plan{padding:16px 22px 6px;color:#3d3d3d}.mini-plan svg{width:100%;height:auto;max-height:190px}.mini-metric{font-family:var(--font-mono);font-size:9px;text-align:center;margin:4px 0 0}.project-illustration figcaption{font-size:7px;color:#686761;margin-top:28px;letter-spacing:.14em}.mini-document{padding:23px}.document-orbit{display:block;font-size:30px;margin-bottom:13px}.skeleton-lines{display:grid;gap:7px;padding:13px 18px}.mini-document .skeleton-lines{padding:0}.skeleton-lines i,.chat-bubble i{height:4px;background:#e6e4df;display:block;border-radius:2px}.skeleton-lines i:nth-child(2){width:72%}.skeleton-lines i:nth-child(3){width:90%}.skeleton-lines.short i{height:3px}.document-divider{height:1px;background:#eee;margin:20px 0}.mini-document p{font-size:8px;margin-bottom:12px}.mini-tag{display:inline-block;padding:6px;border:1px solid #eee;border-radius:4px;font-size:6px;margin:20px 3px 0 0}.mini-map{position:relative;padding:18px}.mini-map svg{width:100%}.map-label{position:absolute;background:white;padding:5px;font-size:7px;box-shadow:0 2px 12px #0001;border-radius:4px}.map-label.a{left:9%;top:69%}.map-label.b{left:35%;top:29%}.map-label.c{right:0;top:8%}.legal-symbol{display:grid;place-items:center;padding:24px 0 12px}.mini-citation{display:flex;gap:10px;align-items:center;margin:9px 18px;padding:10px 12px;background:#f5f4f1;border-radius:6px;font-size:9px}.mini-citation span{font-size:13px}.mini-chat{padding:18px}.chat-bubble{background:#f1f0ed;border-radius:9px;padding:13px;display:grid;gap:7px;font-size:9px;margin-top:12px}.chat-bubble.small{width:70%;margin-left:auto;background:#e7e6e2}.mini-ai{font-size:22px}.routing-diagram{display:flex;align-items:center;justify-content:center;padding:0 30px;gap:10px}.routing-diagram span{border:1px solid #ddd;border-radius:8px;padding:8px}.routing-diagram i{width:20px;height:1px;background:#ddd}.mini-caption{text-align:center;font-size:8px;margin:12px 0 22px}
  `}</style>
    </figure>
  );
}
