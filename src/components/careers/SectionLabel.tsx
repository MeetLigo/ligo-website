/**
 * Small serif label sitting on a hairline rule, the way an editorial careers
 * page opens each band. `tone` picks the rule/label color for dark or cream bands.
 */
export function SectionLabel({ children, tone = "dark" }: { children: React.ReactNode; tone?: "dark" | "cream" }) {
  const cls =
    tone === "dark"
      ? "border-[#FAF6EF]/[0.22] text-[#FAF6EF]/[0.8]"
      : "border-ink/[0.22] text-ink/[0.7]";
  return <div className={`border-b pb-3 font-serif text-[17px] font-medium tracking-[-0.005em] ${cls}`}>{children}</div>;
}
