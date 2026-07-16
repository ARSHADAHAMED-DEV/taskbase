export default function PageHead({
  kicker,
  title,
  right,
}: {
  kicker: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="phead">
      <div>
        <p className="kick">{kicker}</p>
        <h1>{title}</h1>
      </div>
      {right && <div className="right">{right}</div>}
    </div>
  );
}
