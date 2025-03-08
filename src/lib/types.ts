
// Match data types
export interface MatchSource {
  id: string;
  name: string;
  url: string;
  type: 'video' | 'iframe';
  quality?: 'HD' | 'SD' | 'Mobile';
}

export interface MatchData {
  id: string;
  teams: {
    teamA: string;
    teamB: string;
    teamALogo?: string;
    teamBLogo?: string;
  };
  tournament: string;
  venue: string;
  startTime: string; // Format: "MM/DD/YYYY HH:MM" (24-hour)
  endTime: string; // Format: "MM/DD/YYYY HH:MM" (24-hour)
  sources: MatchSource[];
  additionalInfo?: {
    matchType?: string;
    round?: string;
    description?: string;
  };
}

export type MatchStatus = 'live' | 'upcoming' | 'finished';
