
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import MatchGrid from "@/components/matches/MatchGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getAllMatches, getLiveMatches, getUpcomingMatches } from "@/lib/utils";
import { MatchData } from "@/lib/types";

const AllMatches = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get('search') || "";

  const [liveMatches, setLiveMatches] = useState<MatchData[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<MatchData[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [filteredLiveMatches, setFilteredLiveMatches] = useState<MatchData[]>([]);
  const [filteredUpcomingMatches, setFilteredUpcomingMatches] = useState<MatchData[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Update match data initially
    updateMatchData();
    
    // Set up interval to refresh data periodically
    const interval = setInterval(updateMatchData, 60000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Update the URL when search query changes
    if (searchQuery) {
      navigate(`/matches?search=${encodeURIComponent(searchQuery)}`, { replace: true });
    } else {
      navigate('/matches', { replace: true });
    }

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
  }, [searchQuery, liveMatches, upcomingMatches, navigate]);

  const updateMatchData = () => {
    const live = getLiveMatches();
    const upcoming = getUpcomingMatches();
    
    setLiveMatches(live);
    setUpcomingMatches(upcoming);
    
    // Update filtered matches when all matches are updated
    if (searchQuery.trim() === "") {
      setFilteredLiveMatches(live);
      setFilteredUpcomingMatches(upcoming);
    } else {
      const query = searchQuery.toLowerCase();
      
      setFilteredLiveMatches(live.filter(match => 
        match.teams.teamA.toLowerCase().includes(query) ||
        match.teams.teamB.toLowerCase().includes(query) ||
        match.tournament.toLowerCase().includes(query)
      ));
      
      setFilteredUpcomingMatches(upcoming.filter(match => 
        match.teams.teamA.toLowerCase().includes(query) ||
        match.teams.teamB.toLowerCase().includes(query) ||
        match.tournament.toLowerCase().includes(query)
      ));
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
          <h1 className="text-3xl font-bold text-cricliv-blue">All Matches</h1>
          <form onSubmit={handleSearch} className="w-full md:w-auto md:min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search teams, tournaments..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
        
        <div className="p-0 bg-white rounded-lg shadow-sm border">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full grid grid-cols-3 rounded-none bg-cricliv-lightgray/50">
              <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-cricliv-blue font-medium">
                All Matches
              </TabsTrigger>
              <TabsTrigger value="live" className="data-[state=active]:bg-white data-[state=active]:text-cricliv-blue font-medium">
                Live ({filteredLiveMatches.length})
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-white data-[state=active]:text-cricliv-blue font-medium">
                Upcoming ({filteredUpcomingMatches.length})
              </TabsTrigger>
            </TabsList>
            
            <div className="p-4 md:p-6">
              <TabsContent value="all" className="mt-0">
                {filteredLiveMatches.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4 text-cricliv-blue">Live Matches</h2>
                    <MatchGrid matches={filteredLiveMatches} />
                  </div>
                )}
                
                {filteredUpcomingMatches.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4 text-cricliv-blue">Upcoming Matches</h2>
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
              
              <TabsContent value="live" className="mt-0">
                <MatchGrid 
                  matches={filteredLiveMatches} 
                  emptyMessage={
                    searchQuery 
                      ? `No live matches found for "${searchQuery}"` 
                      : "No live matches at the moment"
                  } 
                />
              </TabsContent>
              
              <TabsContent value="upcoming" className="mt-0">
                <MatchGrid 
                  matches={filteredUpcomingMatches} 
                  emptyMessage={
                    searchQuery 
                      ? `No upcoming matches found for "${searchQuery}"` 
                      : "No upcoming matches scheduled"
                  } 
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default AllMatches;
