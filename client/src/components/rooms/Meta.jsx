export default function Meta({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
      {children}
    </span>
  );
}
