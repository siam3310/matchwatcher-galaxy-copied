
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
    <div className="min-h-screen bg-cricliv-lightgray/30 text-foreground">
      <Navbar />
      <main className="container mx-auto py-6 px-4 md:py-8">
        {children}
      </main>
      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">&copy; {new Date().getFullYear()} CRICLIV - Free Cricket Streaming</p>
          <p className="text-sm text-muted-foreground mt-2">All streams are provided as-is and we do not host any content.</p>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default MainLayout;
