export default function InfoGrid({ items }) {
  return (
    <div className="info-grid">
      {items.map((item) => (
        <article key={item.label} className="metric-card">
          <p>{item.label}</p>
          <strong>{item.value}</strong>
          {item.hint ? <span>{item.hint}</span> : null}
        </article>
      ))}
    </div>
  );
}
