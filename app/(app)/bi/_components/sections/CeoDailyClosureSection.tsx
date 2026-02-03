import { getDailyClosure } from "@/actions/bi";
import { DailyClosureCard } from "../DailyClosureCard";

export async function CeoDailyClosureSection() {
  try {
    const dailyClosure = await getDailyClosure(
      new Date().toISOString().slice(0, 10)
    );

    if (!dailyClosure) {
      return null;
    }

    return <DailyClosureCard data={dailyClosure} />;
  } catch {
    return null;
  }
}
