
import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MatchData } from "@/lib/types";
import { getUpcomingMatches, getMatchTimeRemaining } from "@/lib/utils";

const UpcomingEventWidget = () => {
  const [nextMatch, setNextMatch] = useState<MatchData | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  useEffect(() => {
    // Get upcoming matches and find the next one
    const upcomingMatches = getUpcomingMatches();
    if (upcomingMatches.length > 0) {
      // Sort by start time (ascending)
      const sortedMatches = [...upcomingMatches].sort((a, b) => 
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
      setNextMatch(sortedMatches[0]);
    }
  }, []);

  useEffect(() => {
    if (!nextMatch) return;

    const updateRemainingTime = () => {
      const remaining = getMatchTimeRemaining(nextMatch);
      setTimeRemaining(remaining);
    };

    updateRemainingTime();
    const timer = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(timer);
  }, [nextMatch]);

  if (!nextMatch) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-cricliv-purple/20 to-cricliv-blue/20 border-cricliv-blue/10 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-cricliv-purple" />
          Next Big Match
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <h3 className="font-semibold text-xl">{nextMatch.teams.teamA} vs {nextMatch.teams.teamB}</h3>
          <p className="text-sm text-muted-foreground">{nextMatch.tournament}</p>
          
          <div className="pt-2">
            <div className="text-sm text-muted-foreground mb-1">Starts in:</div>
            <div className="grid grid-cols-4 gap-1 text-center">
              <div className="bg-white/70 dark:bg-black/20 rounded p-1">
                <div className="text-lg font-semibold text-cricliv-purple" id="days">
                  {timeRemaining.split(':')[0] || '0'}
                </div>
                <div className="text-xs text-muted-foreground">Days</div>
              </div>
              <div className="bg-white/70 dark:bg-black/20 rounded p-1">
                <div className="text-lg font-semibold text-cricliv-purple" id="hours">
                  {timeRemaining.split(':')[1] || '0'}
                </div>
                <div className="text-xs text-muted-foreground">Hours</div>
              </div>
              <div className="bg-white/70 dark:bg-black/20 rounded p-1">
                <div className="text-lg font-semibold text-cricliv-purple" id="mins">
                  {timeRemaining.split(':')[2] || '0'}
                </div>
                <div className="text-xs text-muted-foreground">Mins</div>
              </div>
              <div className="bg-white/70 dark:bg-black/20 rounded p-1">
                <div className="text-lg font-semibold text-cricliv-purple" id="secs">
                  {timeRemaining.split(':')[3] || '0'}
                </div>
                <div className="text-xs text-muted-foreground">Secs</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingEventWidget;
