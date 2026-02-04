import { getCalls, getWeeklyCallsMetrics } from "@/actions/calls";
import { getWeeklyBoardData, getWeeklySummary } from "@/actions/communication";
import {
  CallsSummaryMetrics,
  WeeklyCallsTable,
} from "../index";
import { WeeklyBoardTable } from "../WeeklyBoardTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export async function CommunicationCallsSection() {
  try {
    const [weeklyCalls, weeklyCallsMetrics, weeklyBoardData, weeklySummary] =
      await Promise.all([
        getCalls(),
        getWeeklyCallsMetrics(),
        getWeeklyBoardData(),
        getWeeklySummary(),
      ]);

    return (
      <>
        <CallsSummaryMetrics
          attendancePercent={weeklyCallsMetrics.attendancePercent}
          lastWeekAttendancePercent={
            weeklyCallsMetrics.lastWeekAttendancePercent
          }
          noShowCount={weeklyCallsMetrics.noShowCount}
          missedConsecutiveCount={weeklyCallsMetrics.missedConsecutiveCount}
        />

        <WeeklyCallsTable calls={weeklyCalls} />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Weekly Status Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {weeklySummary ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total Leaders</p>
                  <p className="text-lg font-semibold">
                    {weeklySummary.totalLeaders}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Contacted</p>
                  <p className="text-lg font-semibold">
                    {weeklySummary.contacted}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Needs Follow-up</p>
                  <p className="text-lg font-semibold">
                    {weeklySummary.statusCounts.NEED_FOLLOWUP}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Not Contacted</p>
                  <p className="text-lg font-semibold">
                    {weeklySummary.statusCounts.NOT_CONTACTED}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Weekly summary unavailable
              </p>
            )}
          </CardContent>
        </Card>

        <WeeklyBoardTable
          leaders={weeklyBoardData.leaders}
          weekStart={weeklyBoardData.weekStart}
        />
      </>
    );
  } catch {
    return (
      <>
        <CallsSummaryMetrics
          attendancePercent={0}
          lastWeekAttendancePercent={0}
          noShowCount={0}
          missedConsecutiveCount={0}
        />

        <WeeklyCallsTable calls={[]} />

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Weekly Status Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">
              Weekly summary unavailable
            </p>
          </CardContent>
        </Card>

        <WeeklyBoardTable leaders={[]} weekStart={new Date().toISOString()} />
      </>
    );
  }
}
