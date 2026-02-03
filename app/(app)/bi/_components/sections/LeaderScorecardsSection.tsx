import { getLeaderScorecards } from "@/actions/bi";
import { getDateRange } from "@/lib/date";
import { LeaderScorecards } from "../index";

export async function LeaderScorecardsSection() {
  const { startDate, endDate } = getDateRange(30);

  try {
    const leaderScorecards = await getLeaderScorecards(startDate, endDate);
    return <LeaderScorecards leaders={leaderScorecards} />;
  } catch {
    return <LeaderScorecards leaders={[]} />;
  }
}
