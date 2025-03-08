
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-card shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            CricketStream
          </Link>
          <div className="flex space-x-6">
            <Link
              to="/"
              className="font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/matches"
              className="font-medium hover:text-primary transition-colors"
            >
              All Matches
            </Link>
            <Link
              to="/watchlist"
              className="font-medium hover:text-primary transition-colors"
            >
              My Watchlist
            </Link>
            <Link
              to="/faq"
              className="font-medium hover:text-primary transition-colors"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
