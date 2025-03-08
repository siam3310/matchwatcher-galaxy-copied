
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import MatchStream from "@/components/matches/MatchStream";
import { Button } from "@/components/ui/button";
import { Star, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MatchData, MatchStatus } from "@/lib/types";
import { getMatchById, getMatchStatus } from "@/lib/utils";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/watchlist";

const MatchDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<MatchData | null>(null);
  const [status, setStatus] = useState<MatchStatus | null>(null);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!id) {
      navigate("/not-found");
      return;
    }

    const matchData = getMatchById(id);
    if (!matchData) {
      navigate("/not-found");
      return;
    }

    setMatch(matchData);
    setStatus(getMatchStatus(matchData));
    setIsWatchlisted(isInWatchlist(id));

    // Check match status periodically
    const interval = setInterval(() => {
      if (matchData) {
        const currentStatus = getMatchStatus(matchData);
        setStatus(currentStatus);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [id, navigate]);

  const handleWatchlistToggle = () => {
    if (!match) return;

    if (isWatchlisted) {
      removeFromWatchlist(match.id);
      setIsWatchlisted(false);
      toast({
        title: "Removed from watchlist",
        description: `${match.teams.teamA} vs ${match.teams.teamB} removed from your watchlist`,
      });
    } else {
      addToWatchlist(match.id);
      setIsWatchlisted(true);
      toast({
        title: "Added to watchlist",
        description: `${match.teams.teamA} vs ${match.teams.teamB} added to your watchlist`,
      });
    }
  };

  if (!match) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p>Loading match details...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="text-cricliv-blue"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Match Details</h1>
        </div>
      
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 rounded-lg shadow-sm border mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {status === 'live' && (
                <span className="bg-cricliv-blue text-white text-xs font-medium px-2 py-0.5 rounded animate-pulse">
                  LIVE
                </span>
              )}
              <h1 className="text-2xl font-bold">
                {match.teams.teamA} vs {match.teams.teamB}
              </h1>
            </div>
            <p className="text-muted-foreground">{match.tournament} • {match.venue}</p>
          </div>
          
          <Button
            onClick={handleWatchlistToggle}
            variant={isWatchlisted ? "default" : "outline"}
            className={isWatchlisted ? "bg-yellow-500 hover:bg-yellow-600 border-yellow-500" : "border-cricliv-blue text-cricliv-blue hover:bg-cricliv-blue/10"}
          >
            <Star className="mr-2 h-4 w-4" />
            {isWatchlisted ? "Remove from Watchlist" : "Add to Watchlist"}
          </Button>
        </div>
        
        {status === 'finished' ? (
          <div className="bg-white border rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">This match has ended</h2>
            <p className="text-muted-foreground mb-4">
              The stream is no longer available as the match has concluded.
            </p>
            <Button onClick={() => navigate("/matches")} className="bg-cricliv-blue hover:bg-cricliv-blue/90">
              Browse Other Matches
            </Button>
          </div>
        ) : (
          <MatchStream match={match} />
        )}
      </div>
    </MainLayout>
  );
};

export default MatchDetails;
