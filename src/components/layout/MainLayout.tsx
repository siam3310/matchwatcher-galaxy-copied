
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { Toaster } from "@/components/ui/toaster";
import { ModeToggle } from "../theme/ModeToggle";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  // Add a small delay to prevent hydration mismatch
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto py-6 px-4">
        {children}
      </main>
      <footer className="bg-card py-6 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Cricket Match Streams</p>
          <p className="text-sm text-muted-foreground mt-2">All streams are provided as-is and we do not host any content.</p>
        </div>
      </footer>
      <div className="fixed bottom-4 right-4">
        <ModeToggle />
      </div>
      <Toaster />
    </div>
  );
};

export default MainLayout;
