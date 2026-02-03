import { getTopRegions, getTopPerformers } from "@/actions/bi";
import { getDateRange } from "@/lib/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopRegionsChart, TopPerformersTable } from "../index";

export async function CeoTopRegionsSection() {
  const { startDate, endDate } = getDateRange(30);

  try {
    const [topRegions, topPerformers] = await Promise.all([
      getTopRegions(startDate, endDate),
      getTopPerformers(startDate, endDate),
    ]);

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Top Growth Regions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <TopRegionsChart data={topRegions} />
          </CardContent>
        </Card>
        <TopPerformersTable leaders={topPerformers} />
      </div>
    );
  } catch {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Top Growth Regions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <TopRegionsChart data={[]} />
          </CardContent>
        </Card>
        <TopPerformersTable leaders={[]} />
      </div>
    );
  }
}
