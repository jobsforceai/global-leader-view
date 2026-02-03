import { GrowthPageClient } from "./_components/GrowthPageClient";
import { getGrowthEvents } from "@/actions/growth";
import { getCampaigns } from "@/actions/campaigns";
import { getAuthTokenValue } from "@/actions/_core";

export default async function GrowthPage() {
  const token = await getAuthTokenValue();
  if (!token) {
    return <GrowthPageClient events={[]} campaigns={[]} />;
  }

  const [events, campaigns] = await Promise.all([
    getGrowthEvents(),
    getCampaigns(),
  ]);

  return <GrowthPageClient events={events} campaigns={campaigns} />;
}
