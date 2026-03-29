interface HoneypotFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/**
 * Invisible honeypot field to trap bots.
 * Hidden via CSS so real users never see or fill it.
 */
export function HoneypotField({ value, onChange }: HoneypotFieldProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "-9999px",
        top: "-9999px",
        width: 0,
        height: 0,
        overflow: "hidden",
        opacity: 0,
        pointerEvents: "none",
        tabIndex: -1,
      } as React.CSSProperties}
    >
      <label htmlFor="website_url">Website</label>
      <input
        id="website_url"
        name="website_url"
        type="text"
        autoComplete="off"
        tabIndex={-1}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
