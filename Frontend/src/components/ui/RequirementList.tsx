export function RequirementList({ items }: { items: { label: string; met: boolean }[] }) {
  return (
    <ul className="grid grid-cols-1 gap-1 pt-1 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item.label}
          className={`flex items-center gap-1.5 ${item.met ? "font-medium text-green-700" : "text-slate-500"}`}
        >
          <span>{item.met ? "✓" : "○"}</span> {item.label}
        </li>
      ))}
    </ul>
  );
}
