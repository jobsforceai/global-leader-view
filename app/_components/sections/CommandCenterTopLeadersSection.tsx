import { getTopLeaders } from "@/actions/bi";
import { getDateRange } from "@/lib/date";
import { CommandCenterTopLeadersToggle } from "@/app/_components/CommandCenterTopLeadersToggle";

export async function CommandCenterTopLeadersSection() {
  const { startDate, endDate } = getDateRange(30);

  try {
    const [
      topLeaders,
      teamTopLeaders,
      lifetimeTopLeaders,
      lifetimeTeamTopLeaders,
    ] = await Promise.all([
      getTopLeaders(startDate, endDate, "self"),
      getTopLeaders(startDate, endDate, "team"),
      getTopLeaders(undefined, undefined, "self", "lifetime"),
      getTopLeaders(undefined, undefined, "team", "lifetime"),
    ]);

    return (
      <CommandCenterTopLeadersToggle
        periodSelf={topLeaders}
        periodTeam={teamTopLeaders}
        lifetimeSelf={lifetimeTopLeaders}
        lifetimeTeam={lifetimeTeamTopLeaders}
      />
    );
  } catch {
    return (
      <CommandCenterTopLeadersToggle
        periodSelf={[]}
        periodTeam={[]}
        lifetimeSelf={[]}
        lifetimeTeam={[]}
      />
    );
  }
}
