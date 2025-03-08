
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import MatchGrid from "@/components/matches/MatchGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getAllMatches, getLiveMatches, getUpcomingMatches } from "@/lib/utils";
import { MatchData } from "@/lib/types";

const AllMatches = () => {
  const [liveMatches, setLiveMatches] = useState<MatchData[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<MatchData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLiveMatches, setFilteredLiveMatches] = useState<MatchData[]>([]);
  const [filteredUpcomingMatches, setFilteredUpcomingMatches] = useState<MatchData[]>([]);

  useEffect(() => {
    // Update match data initially
    updateMatchData();
    
    // Set up interval to refresh data periodically
    const interval = setInterval(updateMatchData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Filter matches when search query changes
    if (searchQuery.trim() === "") {
      setFilteredLiveMatches(liveMatches);
      setFilteredUpcomingMatches(upcomingMatches);
    } else {
      const query = searchQuery.toLowerCase();
      
      setFilteredLiveMatches(liveMatches.filter(match => 
        match.teams.teamA.toLowerCase().includes(query) ||
        match.teams.teamB.toLowerCase().includes(query) ||
        match.tournament.toLowerCase().includes(query)
      ));
      
      setFilteredUpcomingMatches(upcomingMatches.filter(match => 
        match.teams.teamA.toLowerCase().includes(query) ||
        match.teams.teamB.toLowerCase().includes(query) ||
        match.tournament.toLowerCase().includes(query)
      ));
    }
  }, [searchQuery, liveMatches, upcomingMatches]);

  const updateMatchData = () => {
    const live = getLiveMatches();
    const upcoming = getUpcomingMatches();
    
    setLiveMatches(live);
    setUpcomingMatches(upcoming);
    setFilteredLiveMatches(live);
    setFilteredUpcomingMatches(upcoming);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">All Matches</h1>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search matches, teams, tournaments..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-md mx-auto">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="live" className="flex-1">Live ({filteredLiveMatches.length})</TabsTrigger>
            <TabsTrigger value="upcoming" className="flex-1">Upcoming ({filteredUpcomingMatches.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {filteredLiveMatches.length > 0 && (
              <div className="mb-8">
                <h2 className="section-title">Live Matches</h2>
                <MatchGrid matches={filteredLiveMatches} />
              </div>
            )}
            
            {filteredUpcomingMatches.length > 0 && (
              <div>
                <h2 className="section-title">Upcoming Matches</h2>
                <MatchGrid matches={filteredUpcomingMatches} />
              </div>
            )}
            
            {filteredLiveMatches.length === 0 && filteredUpcomingMatches.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-2">No matches found for "{searchQuery}"</p>
                <p className="text-sm text-muted-foreground">Try a different search or check back later</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="live" className="mt-6">
            <MatchGrid 
              matches={filteredLiveMatches} 
              emptyMessage={
                searchQuery 
                  ? `No live matches found for "${searchQuery}"` 
                  : "No live matches at the moment"
              } 
            />
          </TabsContent>
          
          <TabsContent value="upcoming" className="mt-6">
            <MatchGrid 
              matches={filteredUpcomingMatches} 
              emptyMessage={
                searchQuery 
                  ? `No upcoming matches found for "${searchQuery}"` 
                  : "No upcoming matches scheduled"
              } 
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AllMatches;
