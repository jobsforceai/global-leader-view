import { getCommunicationHealth, getFollowups } from "@/actions/communication";
import { getWeakMarkets } from "@/actions/bi";
import { CommunicationMiniKpis, WeakAlertsCompact } from "../index";

export async function CeoCommunicationSection() {
  try {
    const [communication7, communication14, communication30, followups, weakMarkets] =
      await Promise.all([
        getCommunicationHealth(7),
        getCommunicationHealth(14),
        getCommunicationHealth(30),
        getFollowups(),
        getWeakMarkets(),
      ]);

    const communicationMetrics = {
      contactedLast7Days: communication7.summary.contactedLast7Days,
      contactedLast14Days: communication14.summary.contactedLast14Days,
      contactedLast30Days: communication30.summary.contactedLast30Days,
      overdueFollowups: followups.filter((f) => f.status === "overdue").length,
      totalLeaders: communication14.summary.totalLeaders,
    };

    const weakAlerts = weakMarkets
      .filter((market) => market.severity !== "low")
      .slice(0, 4);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CommunicationMiniKpis
          contactedLast7Days={communicationMetrics.contactedLast7Days}
          contactedLast14Days={communicationMetrics.contactedLast14Days}
          contactedLast30Days={communicationMetrics.contactedLast30Days}
          overdueFollowups={communicationMetrics.overdueFollowups}
        />
        <WeakAlertsCompact alerts={weakAlerts} />
      </div>
    );
  } catch {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CommunicationMiniKpis
          contactedLast7Days={0}
          contactedLast14Days={0}
          contactedLast30Days={0}
          overdueFollowups={0}
        />
        <WeakAlertsCompact alerts={[]} />
      </div>
    );
  }
}
