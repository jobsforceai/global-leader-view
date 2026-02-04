import { getCommunicationHealth, getFollowups } from "@/actions/communication";
import {
  CommunicationKpiCards,
  NotContactedTable,
  HighVolumeLowContactTable,
} from "../index";

export async function CommunicationHealthSection() {
  try {
    const [communication7, communication14, communication30, followups] =
      await Promise.all([
        getCommunicationHealth(7),
        getCommunicationHealth(14),
        getCommunicationHealth(30),
        getFollowups(),
      ]);

    const metrics = {
      contactedLast7Days: communication7.summary.contactedLast7Days,
      contactedLast14Days: communication14.summary.contactedLast14Days,
      contactedLast30Days: communication30.summary.contactedLast30Days,
      avgDaysSinceContact: communication14.summary.avgDaysSinceContact,
      overdueFollowups: followups.filter((f) => f.status === "overdue").length,
      totalLeaders: communication14.summary.totalLeaders,
    };

    return (
      <>
        <CommunicationKpiCards
          contactedLast7Days={metrics.contactedLast7Days}
          contactedLast14Days={metrics.contactedLast14Days}
          contactedLast30Days={metrics.contactedLast30Days}
          avgDaysSinceContact={metrics.avgDaysSinceContact || 0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NotContactedTable leaders={communication14.notContacted} />
          <HighVolumeLowContactTable
            leaders={communication14.highVolumeLowContact}
          />
        </div>
      </>
    );
  } catch {
    return (
      <>
        <CommunicationKpiCards
          contactedLast7Days={0}
          contactedLast14Days={0}
          contactedLast30Days={0}
          avgDaysSinceContact={0}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NotContactedTable leaders={[]} />
          <HighVolumeLowContactTable leaders={[]} />
        </div>
      </>
    );
  }
}
