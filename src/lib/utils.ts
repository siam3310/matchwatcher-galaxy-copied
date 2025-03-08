
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { MatchData, MatchStatus } from "./types";
import matchesData from "../data/matches.json";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Get match status based on start and end times
export function getMatchStatus(match: MatchData): MatchStatus {
  const currentTime = new Date().getTime();
  const startTime = new Date(match.startTime).getTime();
  const endTime = new Date(match.endTime).getTime();

  if (currentTime < startTime) {
    return 'upcoming';
  } else if (currentTime >= startTime && currentTime <= endTime) {
    return 'live';
  } else {
    return 'finished';
  }
}

// Get time until match starts
export function getTimeUntilMatch(match: MatchData): string {
  const currentTime = new Date().getTime();
  const startTime = new Date(match.startTime).getTime();
  
  if (currentTime >= startTime) {
    return 'Live now';
  }
  
  const timeRemaining = startTime - currentTime;
  
  // Calculate time components
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  
  // Format the time string
  let timeString = '';
  if (days > 0) {
    timeString += `${days}d `;
  }
  if (hours > 0 || days > 0) {
    timeString += `${hours}h `;
  }
  timeString += `${minutes}m`;
  
  return timeString;
}

// Get detailed time remaining for countdown
export function getMatchTimeRemaining(match: MatchData): string {
  const currentTime = new Date().getTime();
  const startTime = new Date(match.startTime).getTime();
  
  if (currentTime >= startTime) {
    return '0:0:0:0';
  }
  
  const timeRemaining = startTime - currentTime;
  
  // Calculate time components
  const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  
  return `${days}:${hours}:${minutes}:${seconds}`;
}

// Get all matches
export function getAllMatches(): MatchData[] {
  return (matchesData as any).matches;
}

// Get live matches
export function getLiveMatches(): MatchData[] {
  return getAllMatches().filter(match => getMatchStatus(match) === 'live');
}

// Get upcoming matches
export function getUpcomingMatches(): MatchData[] {
  return getAllMatches().filter(match => getMatchStatus(match) === 'upcoming');
}

// Get a match by ID
export function getMatchById(id: string): MatchData | undefined {
  return getAllMatches().find(match => match.id === id);
}
