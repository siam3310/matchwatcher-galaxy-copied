
import MatchCard from "./MatchCard";
import { MatchData } from "@/lib/types";

interface MatchGridProps {
  matches: MatchData[];
  emptyMessage?: string;
}

const MatchGrid = ({ matches, emptyMessage = "No matches found" }: MatchGridProps) => {
  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
};

export default MatchGrid;
