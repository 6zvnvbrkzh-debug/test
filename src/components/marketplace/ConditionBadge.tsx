import type { Condition } from "@/lib/mock-data";

const conditionStyles: Record<Condition, string> = {
  NEW: "border-primary/30 text-primary",
  OPEN_BOX: "border-border text-foreground",
  USED: "border-border text-muted-foreground",
  FOR_PARTS: "border-destructive/30 text-destructive",
};

const conditionLabels: Record<Condition, string> = {
  NEW: "Neu",
  OPEN_BOX: "Geöffnet",
  USED: "Gebraucht",
  FOR_PARTS: "Ersatzteile",
};

export function ConditionBadge({ condition }: { condition: Condition }) {
  return (
    <span
      className={`inline-flex items-center border px-1.5 py-0.5 text-[10px] uppercase tracking-wider font-medium rounded-sm ${conditionStyles[condition]}`}
    >
      {conditionLabels[condition]}
    </span>
  );
}