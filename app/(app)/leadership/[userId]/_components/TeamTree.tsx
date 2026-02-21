"use client";

import { useState, useRef, useEffect } from "react";
import { Users, ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LeaderPerformanceDetail } from "@/lib/types";
import { TeamTreeNode } from "./TeamTreeNode";
import { cn } from "@/lib/utils";

type TeamMember = LeaderPerformanceDetail["team"][number];

interface TeamTreeProps {
  leader: LeaderPerformanceDetail["leader"];
  scorecard: LeaderPerformanceDetail["scorecard"];
  team: TeamMember[];
  gapAnalysis: LeaderPerformanceDetail["gapAnalysis"];
}

const INITIAL_DIRECT_SHOW = 10;

export function TeamTree({
  leader,
  scorecard,
  team,
  gapAnalysis,
}: TeamTreeProps) {
  const directMembers = team.filter((m) => m.leg === "direct");
  const indirectMembers = team.filter((m) => m.leg === "indirect");
  const [showAllDirect, setShowAllDirect] = useState(false);
  const [showAllIndirect, setShowAllIndirect] = useState(false);

  const visibleDirect =
    showAllDirect || directMembers.length <= INITIAL_DIRECT_SHOW
      ? directMembers
      : directMembers.slice(0, INITIAL_DIRECT_SHOW);

  if (team.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-1.5">
            <Users className="h-4 w-4" /> Team Tree
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-sm text-muted-foreground py-8">
            No team members
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-1.5">
            <Users className="h-4 w-4" /> Team Tree ({team.length} members)
          </CardTitle>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
              {gapAnalysis.activeTeamMembers} active
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500 inline-block" />
              {gapAnalysis.inactiveTeamMembers} inactive
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto pb-4">
          <div className="inline-flex flex-col items-center min-w-full py-4">
            {/* ROOT NODE */}
            <TeamTreeNode
              name={leader.fullName}
              userId={leader.userId}
              businessVolume={scorecard.businessVolume}
              isPackageActive={leader.isPackageActive}
              isRoot
            />

            {/* Vertical connector from root → direct tier */}
            {directMembers.length > 0 && (
              <div className="w-px h-8 bg-border" />
            )}

            {/* DIRECT MEMBERS ROW */}
            {directMembers.length > 0 && (
              <DirectMembersRow members={visibleDirect} />
            )}

            {/* Show all / show less toggle for direct */}
            {directMembers.length > INITIAL_DIRECT_SHOW && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-xs"
                onClick={() => setShowAllDirect(!showAllDirect)}
              >
                {showAllDirect ? (
                  <>
                    Show Less <ChevronUp className="h-3 w-3 ml-1" />
                  </>
                ) : (
                  <>
                    Show All {directMembers.length} Direct{" "}
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </>
                )}
              </Button>
            )}

            {/* Vertical connector → indirect tier */}
            {indirectMembers.length > 0 && (
              <div className="w-px h-8 bg-border" />
            )}

            {/* INDIRECT MEMBERS (grouped) */}
            {indirectMembers.length > 0 && (
              <div className="border rounded-lg p-4 bg-muted/20 max-w-full">
                <p className="text-xs font-semibold text-muted-foreground mb-3 text-center">
                  Indirect Team ({indirectMembers.length})
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {(showAllIndirect
                    ? indirectMembers
                    : indirectMembers.slice(0, 12)
                  ).map((member) => (
                    <TeamTreeNode
                      key={member.userId}
                      name={member.fullName}
                      userId={member.userId}
                      businessVolume={member.businessVolume}
                      isPackageActive={member.isPackageActive}
                      compact
                    />
                  ))}
                </div>
                {indirectMembers.length > 12 && (
                  <div className="text-center mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs"
                      onClick={() => setShowAllIndirect(!showAllIndirect)}
                    >
                      {showAllIndirect ? (
                        <>
                          Show Less <ChevronUp className="h-3 w-3 ml-1" />
                        </>
                      ) : (
                        <>
                          Show All {indirectMembers.length}{" "}
                          <ChevronDown className="h-3 w-3 ml-1" />
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Direct Members Row with Connecting Lines ──

function DirectMembersRow({ members }: { members: TeamMember[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [railStyle, setRailStyle] = useState<React.CSSProperties>({
    display: "none",
  });

  useEffect(() => {
    const row = rowRef.current;
    if (!row || members.length < 2) {
      setRailStyle({ display: "none" });
      return;
    }

    function measure() {
      const nodes = row!.querySelectorAll<HTMLElement>("[data-tree-node]");
      if (nodes.length < 2) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const rowRect = row!.getBoundingClientRect();

      const firstCenter =
        first.getBoundingClientRect().left +
        first.getBoundingClientRect().width / 2 -
        rowRect.left;
      const lastCenter =
        last.getBoundingClientRect().left +
        last.getBoundingClientRect().width / 2 -
        rowRect.left;

      setRailStyle({
        position: "absolute",
        top: 0,
        left: `${firstCenter}px`,
        width: `${lastCenter - firstCenter}px`,
        height: "1px",
        backgroundColor: "hsl(var(--border))",
      });
    }

    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(row);
    return () => observer.disconnect();
  }, [members.length]);

  return (
    <div ref={rowRef} className="relative flex items-start gap-4 lg:gap-6">
      {/* Horizontal rail */}
      <div style={railStyle} />

      {members.map((member) => (
        <div
          key={member.userId}
          data-tree-node
          className="flex flex-col items-center"
        >
          {/* Vertical stub up to horizontal rail */}
          <div className="w-px h-4 bg-border" />
          <TeamTreeNode
            name={member.fullName}
            userId={member.userId}
            businessVolume={member.businessVolume}
            isPackageActive={member.isPackageActive}
          />
        </div>
      ))}
    </div>
  );
}
