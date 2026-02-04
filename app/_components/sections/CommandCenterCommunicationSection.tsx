import { getCommunicationHealth, getFollowups } from "@/actions/communication";
import { CommunicationHealthCard } from "@/components/cards";

export async function CommandCenterCommunicationSection() {
  try {
    const [communication7, communication14, communication30, followups] =
      await Promise.all([
        getCommunicationHealth(7),
        getCommunicationHealth(14),
        getCommunicationHealth(30),
        getFollowups(),
      ]);

    const overdueFollowups = followups.filter(
      (followup) => followup.status === "overdue"
    ).length;

    const communicationMetrics = {
      contactedLast7Days: communication7.summary.contactedLast7Days,
      contactedLast14Days: communication14.summary.contactedLast14Days,
      contactedLast30Days: communication30.summary.contactedLast30Days,
      overdueFollowups,
      totalLeaders: communication14.summary.totalLeaders,
      avgDaysSinceContact: communication14.summary.avgDaysSinceContact,
    };

    return <CommunicationHealthCard metrics={communicationMetrics} />;
  } catch {
    return (
      <CommunicationHealthCard
        metrics={{
          contactedLast7Days: 0,
          contactedLast14Days: 0,
          contactedLast30Days: 0,
          overdueFollowups: 0,
          totalLeaders: 0,
          avgDaysSinceContact: 0,
        }}
      />
    );
  }
}
