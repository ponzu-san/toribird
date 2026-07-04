export type Mood = "genki" | "normal" | "low" | "vet";

export const MOOD_OPTIONS: { value: Mood; label: string; emoji: string }[] = [
  { value: "genki", label: "元気", emoji: "😊" },
  { value: "normal", label: "普通", emoji: "😐" },
  { value: "low", label: "元気なし", emoji: "😔" },
  { value: "vet", label: "通院", emoji: "🏥" },
];

export function getMoodLabel(mood: Mood): string {
  return MOOD_OPTIONS.find(o => o.value === mood)?.label ?? mood;
}

export type ParrotSex = "male" | "female" | "unknown";

export type SubscriptionPlan = "free" | "plus";
