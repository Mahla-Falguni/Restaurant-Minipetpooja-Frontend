/*
=========================================
FORM CONTROLS — Input, Select, TextArea
Consistent label + control styling used across all module forms.
=========================================
*/

export const Input = ({ label, error, className = "", ...rest }) => {

  return (
    <label className="block">

      {label && (
        <span className="mb-1.5 block text-sm font-medium text-charcoal">
          {label}
        </span>
      )}

      <input
        className={`
          w-full h-10 rounded-lg border px-3 text-sm
          bg-white text-ink placeholder:text-slate/60
          focus:outline-none focus:ring-2 focus:ring-ember/30 focus:border-ember
          ${error ? "border-claret" : "border-line"}
          ${className}
        `}
        {...rest}
      />

      {error && <span className="mt-1 block text-xs text-claret">{error}</span>}

    </label>
  );

};

export const Select = ({ label, error, children, className = "", ...rest }) => {

  return (
    <label className="block">

      {label && (
        <span className="mb-1.5 block text-sm font-medium text-charcoal">
          {label}
        </span>
      )}

      <select
        className={`
          w-full h-10 rounded-lg border px-3 text-sm bg-white text-ink
          focus:outline-none focus:ring-2 focus:ring-ember/30 focus:border-ember
          ${error ? "border-claret" : "border-line"}
          ${className}
        `}
        {...rest}
      >
        {children}
      </select>

      {error && <span className="mt-1 block text-xs text-claret">{error}</span>}

    </label>
  );

};

export const TextArea = ({ label, error, className = "", ...rest }) => {

  return (
    <label className="block">

      {label && (
        <span className="mb-1.5 block text-sm font-medium text-charcoal">
          {label}
        </span>
      )}

      <textarea
        className={`
          w-full rounded-lg border px-3 py-2 text-sm
          bg-white text-ink placeholder:text-slate/60
          focus:outline-none focus:ring-2 focus:ring-ember/30 focus:border-ember
          ${error ? "border-claret" : "border-line"}
          ${className}
        `}
        {...rest}
      />

      {error && <span className="mt-1 block text-xs text-claret">{error}</span>}

    </label>
  );

};