export default function SectionHeading({
  index,
  tag,
  heading,
  accent,
  id,
}: {
  index: string;
  tag: string;
  heading: string;
  accent: string;
  id?: string;
}) {
  return (
    <header className="rv">
      <p className="eyebrow section-tag">
        {index} — {tag}
      </p>
      <h2 id={id} className="section-heading">
        {heading} <em>{accent}</em>
      </h2>
    </header>
  );
}
