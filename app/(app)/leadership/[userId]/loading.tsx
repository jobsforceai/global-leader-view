export default function LeaderDetailSkeleton() {
  return (
    <div className="space-y-6 mt-15 animate-pulse">
      {/* Back + Header */}
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 bg-muted rounded" />
        <div>
          <div className="h-6 w-48 bg-muted rounded" />
          <div className="h-4 w-64 bg-muted rounded mt-2" />
        </div>
      </div>

      {/* Gap banner */}
      <div className="h-16 bg-muted rounded-lg" />

      {/* Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded-lg" />
        ))}
      </div>

      {/* Chart */}
      <div className="h-52 bg-muted rounded-lg" />

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-48 bg-muted rounded-lg" />
        <div className="h-48 bg-muted rounded-lg" />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-32 bg-muted rounded-lg" />
        <div className="h-32 bg-muted rounded-lg" />
      </div>

      {/* Tree */}
      <div className="h-64 bg-muted rounded-lg" />
    </div>
  );
}
