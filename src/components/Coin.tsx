// The Stouchi coin — the brand mark. A small engraved gold coin with the
// Arabic initial (س, the first letter of ستوشي). Used as logo + accents.
export default function Coin({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="coinFace" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#F6D27A" />
          <stop offset="55%" stopColor="#E0A12E" />
          <stop offset="100%" stopColor="#B97A18" />
        </radialGradient>
      </defs>
      {/* rim */}
      <circle cx="24" cy="24" r="23" fill="#9A6412" />
      <circle cx="24" cy="24" r="21" fill="url(#coinFace)" />
      {/* engraved inner ring (dashed, like milled edge motifs) */}
      <circle
        cx="24"
        cy="24"
        r="17"
        fill="none"
        stroke="#8A5A12"
        strokeWidth="1"
        strokeOpacity="0.45"
        strokeDasharray="1.6 2.4"
      />
      {/* the engraved Arabic seen (س) for "Stouchi" */}
      <text
        x="24"
        y="33"
        textAnchor="middle"
        fontFamily="var(--font-arabic), sans-serif"
        fontWeight="700"
        fontSize="22"
        fill="#7A4E0F"
        fillOpacity="0.85"
      >
        س
      </text>
      {/* highlight sheen */}
      <ellipse cx="17" cy="15" rx="8" ry="5" fill="#FFF1C9" fillOpacity="0.45" />
    </svg>
  );
}
