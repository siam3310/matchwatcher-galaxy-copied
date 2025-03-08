
// Functions to manage the watchlist using local storage

const WATCHLIST_KEY = 'cricket-watchlist';

// Initialize watchlist from local storage
export function getWatchlist(): string[] {
  const watchlist = localStorage.getItem(WATCHLIST_KEY);
  return watchlist ? JSON.parse(watchlist) : [];
}

// Add a match to the watchlist
export function addToWatchlist(matchId: string): void {
  const watchlist = getWatchlist();
  if (!watchlist.includes(matchId)) {
    watchlist.push(matchId);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }
}

// Remove a match from the watchlist
export function removeFromWatchlist(matchId: string): void {
  const watchlist = getWatchlist();
  const updatedWatchlist = watchlist.filter(id => id !== matchId);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist));
}

// Check if a match is in the watchlist
export function isInWatchlist(matchId: string): boolean {
  const watchlist = getWatchlist();
  return watchlist.includes(matchId);
}

// Clear the entire watchlist
export function clearWatchlist(): void {
  localStorage.removeItem(WATCHLIST_KEY);
}
