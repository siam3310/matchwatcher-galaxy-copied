
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
        <section className="bg-gradient-to-r from-cricliv-blue to-cricliv-blue/70 text-white p-6 md:p-10 rounded-2xl shadow-md mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-8">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome to CRICLIV</h1>
              <p className="text-lg opacity-90 mb-6">
                Watch live cricket matches for free. No subscription, no signup required.
                Just click and enjoy the game!
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/matches">
                  <Button size="lg" variant="secondary" className="text-cricliv-blue font-medium">
                    Browse Matches
                  </Button>
                </Link>
                <Link to="/faq">
                  <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/3 mt-6 md:mt-0">
              <UpcomingEventWidget />
            </div>
          </div>
        </section>

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-title text-cricliv-blue">Live Matches</h2>
            <Link to="/matches">
              <Button variant="outline" size="sm" className="border-cricliv-blue text-cricliv-blue hover:bg-cricliv-blue/10">
                View All
              </Button>
            </Link>
          </div>
          
          {liveMatches.length > 0 ? (
            <MatchGrid matches={liveMatches} />
          ) : (
            <div className="bg-white border rounded-lg p-8 text-center">
              <h3 className="text-xl font-semibold mb-2">No Live Matches Right Now</h3>
              <p className="text-muted-foreground mb-4">Check back later or browse upcoming matches</p>
              <Link to="/matches">
                <Button className="bg-cricliv-blue hover:bg-cricliv-blue/90">View Upcoming Matches</Button>
              </Link>
            </div>
          )}
        </section>
        
        <Separator className="my-10" />
        
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="section-title text-cricliv-blue">Upcoming Matches</h2>
            <Link to="/matches">
              <Button variant="outline" size="sm" className="border-cricliv-blue text-cricliv-blue hover:bg-cricliv-blue/10">
                View All
              </Button>
            </Link>
          </div>
          
          <MatchGrid 
            matches={upcomingMatches} 
            emptyMessage="No upcoming matches scheduled at the moment." 
          />
        </section>
        
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <div className="glass-card p-6">
            <h2 className="section-title text-cricliv-blue">Did You Know?</h2>
            <CricketTrivia />
          </div>
          
          <div className="glass-card p-6">
            <h2 className="section-title text-cricliv-blue">How to Watch</h2>
            <div className="space-y-4">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Browse live or upcoming matches</li>
                <li>Click on a match to view details</li>
                <li>Select your preferred streaming source</li>
                <li>Enjoy the match for free!</li>
              </ol>
              <div className="mt-4">
                <Link to="/faq">
                  <Button variant="secondary" size="sm" className="bg-cricliv-lightblue text-cricliv-blue hover:bg-cricliv-lightblue/80">
                    Read our FAQ
                  </Button>
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
