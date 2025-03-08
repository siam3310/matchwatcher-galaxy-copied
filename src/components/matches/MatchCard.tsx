
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Star, Users } from "lucide-react";
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

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    <Link to={`/match/${match.id}`} className="block h-full">
      <div className={`match-card ${status === 'live' ? 'match-card-live' : 'match-card-upcoming'} h-full flex flex-col`}>
        <div className="p-4 flex flex-col h-full">
          {/* Status badge - Made non-clickable by removing any onClick and pointer events */}
          <div className="mb-3">
            {status === 'live' ? (
              <div className="inline-block">
                <Badge className="bg-cricket-ball text-white animate-pulse flex items-center gap-1 pointer-events-none">
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
                  LIVE NOW
                </Badge>
              </div>
            ) : (
              <Badge variant="outline" className="text-cricliv-blue border-cricliv-blue pointer-events-none">UPCOMING</Badge>
            )}
          </div>
          
          {/* Teams */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="font-semibold text-lg flex-1">
              {match.teams.teamA} <span className="text-muted-foreground">vs</span> {match.teams.teamB}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleWatchlistToggle}
              className={isWatchlisted ? "text-yellow-500" : "text-muted-foreground"}
            >
              <Star className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Tournament & Venue */}
          <div className="mb-3 flex-grow">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-4 w-4" /> {match.tournament}
            </p>
            <p className="text-sm text-muted-foreground">{match.venue}</p>
          </div>
          
          {/* Time & Action */}
          <div className="mt-auto">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground mb-3">
              <Clock className="h-4 w-4" />
              <span>{formatDate(match.startTime)}</span>
            </div>
            
            <Button 
              variant={status === 'live' ? "default" : "outline"} 
              className={status === 'live' ? "w-full bg-cricket-ball hover:bg-cricket-ball/90" : "w-full border-cricliv-blue text-cricliv-blue hover:bg-cricliv-blue/10"}
            >
              {status === 'live' ? 'Watch Now' : 'View Details'}
            </Button>
            
            {status === 'upcoming' && (
              <div className="mt-3 pt-3 border-t text-sm text-center">
                <span className="text-muted-foreground">Starts in: </span>
                <span className="font-medium">{timeUntil}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;
