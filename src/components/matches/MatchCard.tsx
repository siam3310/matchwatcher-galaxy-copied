
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MatchData, MatchStatus } from "@/lib/types";
import { formatDate, getMatchStatus, getTimeUntilMatch } from "@/lib/utils";
import { addToWatchlist, removeFromWatchlist, isInWatchlist } from "@/lib/watchlist";

interface MatchCardProps {
  match: MatchData;
}

const MatchCard = ({ match }: MatchCardProps) => {
  const [status, setStatus] = useState<MatchStatus>(getMatchStatus(match));
  const [timeUntil, setTimeUntil] = useState(getTimeUntilMatch(match));
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const { toast } = useToast();

  // Update match status and time remaining periodically
  useEffect(() => {
    const checkStatus = () => {
      setStatus(getMatchStatus(match));
      setTimeUntil(getTimeUntilMatch(match));
    };

    // Check initially and then every minute
    checkStatus();
    const interval = setInterval(checkStatus, 60000);

    return () => clearInterval(interval);
  }, [match]);

  // Check if match is in watchlist
  useEffect(() => {
    setIsWatchlisted(isInWatchlist(match.id));
  }, [match.id]);

  const handleWatchlistToggle = () => {
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

  if (status === 'finished') {
    return null; // Don't show finished matches
  }

  return (
    <div className={`match-card ${status === 'live' ? 'match-card-live' : 'match-card-upcoming'}`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg">{match.teams.teamA} vs {match.teams.teamB}</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleWatchlistToggle}
            className={isWatchlisted ? "text-yellow-500" : "text-muted-foreground"}
          >
            <Star className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="mb-3">
          <p className="text-sm text-muted-foreground">{match.tournament}</p>
          <p className="text-sm text-muted-foreground">{match.venue}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            {status === 'live' ? (
              <Badge variant="destructive" className="animate-pulse">LIVE NOW</Badge>
            ) : (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{formatDate(match.startTime)}</span>
              </div>
            )}
          </div>
          
          <Link to={`/match/${match.id}`}>
            <Button variant={status === 'live' ? "default" : "outline"} size="sm">
              {status === 'live' ? 'Watch Now' : 'View Details'}
            </Button>
          </Link>
        </div>
        
        {status === 'upcoming' && (
          <div className="mt-3 pt-3 border-t text-sm text-center">
            <span className="text-muted-foreground">Starts in: </span>
            <span className="font-medium">{timeUntil}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
