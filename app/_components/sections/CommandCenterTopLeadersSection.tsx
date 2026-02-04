import { getTopLeaders } from "@/actions/bi";
import { getDateRange } from "@/lib/date";
import { TopLeadersCard } from "@/components/cards";

export async function CommandCenterTopLeadersSection() {
  const { startDate, endDate } = getDateRange(30);

  try {
    const [topLeaders, teamTopLeaders] = await Promise.all([
      getTopLeaders(startDate, endDate, "self"),
      getTopLeaders(startDate, endDate, "team"),
    ]);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopLeadersCard
          leaders={topLeaders}
          title="Top Leaders (Self Volume)"
        />
        <TopLeadersCard
          leaders={teamTopLeaders}
          title="Top Leaders (Team Volume)"
        />
      </div>
    );
  } catch {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopLeadersCard leaders={[]} title="Top Leaders (Self Volume)" />
        <TopLeadersCard leaders={[]} title="Top Leaders (Team Volume)" />
      </div>
    );
  }
}
