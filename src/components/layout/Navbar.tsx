
import { Link } from "react-router-dom";
import { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "../theme/ModeToggle";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/matches?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-cricliv-blue">
            CRICLIV
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link
              to="/"
              className="font-medium hover:text-cricliv-blue transition-colors"
            >
              Home
            </Link>
            <Link
              to="/matches"
              className="font-medium hover:text-cricliv-blue transition-colors"
            >
              All Matches
            </Link>
            <Link
              to="/watchlist"
              className="font-medium hover:text-cricliv-blue transition-colors"
            >
              My Watchlist
            </Link>
            <Link
              to="/faq"
              className="font-medium hover:text-cricliv-blue transition-colors"
            >
              FAQ
            </Link>

            {showSearch ? (
              <form onSubmit={handleSearch} className="relative flex items-center">
                <Input
                  type="text"
                  placeholder="Search matches..."
                  className="w-64 pr-8 focus:ring-cricliv-blue"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Button 
                  type="submit" 
                  size="icon" 
                  variant="ghost" 
                  className="absolute right-0"
                >
                  <Search className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearch(false)}
                  className="ml-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearch(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            <ModeToggle />
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="mr-2"
            >
              <Search className="h-5 w-5" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-8">
                  <Link
                    to="/"
                    className="font-medium text-xl hover:text-cricliv-blue transition-colors"
                  >
                    Home
                  </Link>
                  <Link
                    to="/matches"
                    className="font-medium text-xl hover:text-cricliv-blue transition-colors"
                  >
                    All Matches
                  </Link>
                  <Link
                    to="/watchlist"
                    className="font-medium text-xl hover:text-cricliv-blue transition-colors"
                  >
                    My Watchlist
                  </Link>
                  <Link
                    to="/faq"
                    className="font-medium text-xl hover:text-cricliv-blue transition-colors"
                  >
                    FAQ
                  </Link>
                  <div className="mt-4">
                    <ModeToggle />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="md:hidden pb-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search matches..."
                className="w-full pr-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-0 top-0"
              >
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
