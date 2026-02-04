import { getLeaderScorecards } from "@/actions/bi";
import { getDateRange } from "@/lib/date";
import { LeaderScorecardsSearch } from "../LeaderScorecardsSearch";

export async function LeaderScorecardsSection() {
  const { startDate, endDate } = getDateRange(30);

  try {
    const leaderScorecards = await getLeaderScorecards(startDate, endDate, {
      limit: 50,
    });
    return (
      <LeaderScorecardsSearch
        initialLeaders={leaderScorecards}
        startDate={startDate}
        endDate={endDate}
      />
    );
  } catch {
    return (
      <LeaderScorecardsSearch
        initialLeaders={[]}
        startDate={startDate}
        endDate={endDate}
      />
    );
  }
}
