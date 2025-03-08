
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchData, MatchSource } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface MatchStreamProps {
  match: MatchData;
}

const MatchStream = ({ match }: MatchStreamProps) => {
  const [activeSource, setActiveSource] = useState<MatchSource>(match.sources[0]);

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg overflow-hidden shadow-lg">
        <div className="aspect-video relative bg-black flex items-center justify-center">
          {activeSource ? (
            activeSource.type === 'video' ? (
              <video 
                src={activeSource.url} 
                controls 
                className="w-full h-full" 
                autoPlay
              />
            ) : (
              <iframe
                src={activeSource.url}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            )
          ) : (
            <div className="text-white">No stream available</div>
          )}
        </div>
        
        <div className="p-4 bg-card">
          <h2 className="text-xl font-semibold mb-2">{match.teams.teamA} vs {match.teams.teamB}</h2>
          <p className="text-muted-foreground mb-4">{match.tournament} • {match.venue}</p>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Streaming information</AlertTitle>
            <AlertDescription>
              We provide multiple stream sources. If one isn't working, try another one.
            </AlertDescription>
          </Alert>
          
          <Separator className="my-4" />
          
          <div>
            <h3 className="font-semibold mb-3">Stream Sources</h3>
            <div className="flex flex-wrap gap-2">
              {match.sources.map((source) => (
                <Button
                  key={source.id}
                  variant={source.id === activeSource.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveSource(source)}
                >
                  {source.name}
                  {source.quality && ` (${source.quality})`}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="info" className="flex-1">Match Info</TabsTrigger>
          <TabsTrigger value="analysis" className="flex-1">Analysis</TabsTrigger>
          <TabsTrigger value="chat" className="flex-1">Live Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="bg-card p-4 rounded-lg mt-2">
          <h3 className="font-semibold text-lg mb-2">Match Details</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Match Type:</span> {match.additionalInfo?.matchType || 'N/A'}</p>
            <p><span className="font-medium">Tournament Stage:</span> {match.additionalInfo?.round || 'N/A'}</p>
            <p><span className="font-medium">Description:</span> {match.additionalInfo?.description || 'No additional information available.'}</p>
          </div>
        </TabsContent>
        <TabsContent value="analysis" className="bg-card p-4 rounded-lg mt-2">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Match analysis will be available during the match.</p>
          </div>
        </TabsContent>
        <TabsContent value="chat" className="bg-card p-4 rounded-lg mt-2">
          <div className="text-center py-8">
            <p className="text-muted-foreground">Live chat feature coming soon!</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchStream;
