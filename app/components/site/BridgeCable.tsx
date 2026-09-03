export default function BridgeCable() {
  return (
    <svg
      className="cable"
      viewBox="0 0 1120 90"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path d="M0 10 L1120 10" strokeWidth={2} opacity={0.35} />
      <path
        d="M20 10 C 20 70, 260 70, 260 10"
        fill="none"
        strokeWidth={1.4}
        opacity={0.6}
      />
      <path
        d="M280 10 C 280 78, 560 78, 560 10"
        fill="none"
        strokeWidth={1.4}
        opacity={0.6}
      />
      <path
        d="M580 10 C 580 78, 860 78, 860 10"
        fill="none"
        strokeWidth={1.4}
        opacity={0.6}
      />
      <path
        d="M880 10 C 880 70, 1100 70, 1100 10"
        fill="none"
        strokeWidth={1.4}
        opacity={0.6}
      />
      <circle cx={20} cy={10} r={3.5} />
      <circle cx={260} cy={10} r={3.5} />
      <circle cx={280} cy={10} r={3.5} />
      <circle cx={560} cy={10} r={3.5} />
      <circle cx={580} cy={10} r={3.5} />
      <circle cx={860} cy={10} r={3.5} />
      <circle cx={880} cy={10} r={3.5} />
      <circle cx={1100} cy={10} r={3.5} />
    </svg>
  );
}
