import type { ReactNode } from "react";

export function FormField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  showError,
  placeholder,
  type = "text",
  autoComplete,
  mono = false,
  multiline = false,
  rows,
  disabled,
  required = false,
}: {
  id: string;
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error: string | null;
  showError: boolean;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  mono?: boolean;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  required?: boolean;
}) {
  const invalid = showError && Boolean(error);
  const className = `mt-1.5 w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 disabled:bg-slate-100 ${
    mono ? "font-mono " : ""
  }${invalid ? "border-rose-400 focus:border-rose-500 focus:ring-rose-200" : "border-slate-300 focus:border-slate-800 focus:ring-slate-200"}`;

  return (
    <div>
      <label htmlFor={id} className="block text-xs font-bold uppercase tracking-wide text-slate-700">
        {label} {required && <span className="text-rose-500">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          name={id}
          rows={rows}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          className={className}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          disabled={disabled}
          className={className}
        />
      )}
      {invalid && <p className="mt-1 text-xs font-semibold text-rose-600">{error}</p>}
    </div>
  );
}
