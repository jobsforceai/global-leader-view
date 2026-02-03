import { getWeakMarkets } from "@/actions/bi";
import { WeakMarketsTable } from "../index";

export async function WeakMarketsSection() {
  try {
    const markets = await getWeakMarkets();
    return <WeakMarketsTable markets={markets} />;
  } catch {
    return <WeakMarketsTable markets={[]} />;
  }
}
