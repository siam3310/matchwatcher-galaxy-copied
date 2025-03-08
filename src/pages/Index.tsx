
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MainLayout from "@/components/layout/MainLayout";
import MatchGrid from "@/components/matches/MatchGrid";
import UpcomingEventWidget from "@/components/home/UpcomingEventWidget";
import CricketTrivia from "@/components/home/CricketTrivia";
import { getLiveMatches, getUpcomingMatches } from "@/lib/utils";
import { MatchData } from "@/lib/types";

const Index = () => {
  const [liveMatches, setLiveMatches] = useState<MatchData[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<MatchData[]>([]);

  useEffect(() => {
    // Fetch initial data
    updateMatchData();

    // Set up interval to refresh data every minute
    const interval = setInterval(updateMatchData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const updateMatchData = () => {
    setLiveMatches(getLiveMatches());
    
    // Get upcoming matches and limit to 3 for the homepage
    const upcoming = getUpcomingMatches();
    setUpcomingMatches(upcoming.slice(0, 3));
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <section>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h1 className="text-3xl font-bold">Welcome to CricketStream</h1>
            <p className="text-muted-foreground">Free live cricket streaming</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <p className="text-lg">
                Watch live cricket matches for free. No subscription, no signup required.
                Just click and enjoy the game!
              </p>
            </div>
            <div className="md:col-span-1">
              <UpcomingEventWidget />
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">Live Matches</h2>
            <Link to="/matches">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          {liveMatches.length > 0 ? (
            <MatchGrid matches={liveMatches} />
          ) : (
            <div className="bg-card border rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No Live Matches Right Now</h3>
              <p className="text-muted-foreground mb-4">Check back later or browse upcoming matches</p>
              <Link to="/matches">
                <Button>View Upcoming Matches</Button>
              </Link>
            </div>
          )}
        </section>
        
        <Separator />
        
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title">Upcoming Matches</h2>
            <Link to="/matches">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          <MatchGrid 
            matches={upcomingMatches} 
            emptyMessage="No upcoming matches scheduled at the moment." 
          />
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="section-title">Did You Know?</h2>
            <CricketTrivia />
          </div>
          
          <div>
            <h2 className="section-title">How to Watch</h2>
            <div className="bg-card p-4 rounded-lg border">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Browse live or upcoming matches</li>
                <li>Click on a match to view details</li>
                <li>Select your preferred streaming source</li>
                <li>Enjoy the match for free!</li>
              </ol>
              <div className="mt-4">
                <Link to="/faq">
                  <Button variant="secondary" size="sm">Read our FAQ</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
