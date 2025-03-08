
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import MatchGrid from "@/components/matches/MatchGrid";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MatchData } from "@/lib/types";
import { getAllMatches, getMatchStatus } from "@/lib/utils";
import { getWatchlist, clearWatchlist } from "@/lib/watchlist";

const Watchlist = () => {
  const [watchlistMatches, setWatchlistMatches] = useState<MatchData[]>([]);
  const { toast } = useToast();

  // Load watchlist matches
  useEffect(() => {
    updateWatchlistMatches();
    
    // Update periodically to refresh match statuses
    const interval = setInterval(updateWatchlistMatches, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const updateWatchlistMatches = () => {
    const watchlistIds = getWatchlist();
    const allMatches = getAllMatches();
    
    // Filter matches that are in the watchlist and not finished
    const matches = allMatches
      .filter(match => watchlistIds.includes(match.id))
      .filter(match => getMatchStatus(match) !== 'finished');
    
    setWatchlistMatches(matches);
  };

  const handleClearWatchlist = () => {
    clearWatchlist();
    setWatchlistMatches([]);
    toast({
      title: "Watchlist cleared",
      description: "All matches have been removed from your watchlist",
    });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">My Watchlist</h1>
            <p className="text-muted-foreground">
              Matches you want to watch
            </p>
          </div>
          
          {watchlistMatches.length > 0 && (
            <Button 
              variant="outline" 
              onClick={handleClearWatchlist}
              className="text-destructive border-destructive hover:bg-destructive/10"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Watchlist
            </Button>
          )}
        </div>
        
        {watchlistMatches.length > 0 ? (
          <MatchGrid matches={watchlistMatches} />
        ) : (
          <div className="bg-card border rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground mb-4">
              Add matches to your watchlist by clicking the star icon on any match card.
            </p>
            <Button onClick={() => window.location.href = "/matches"}>
              Browse Matches
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Watchlist;
