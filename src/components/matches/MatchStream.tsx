
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MatchData } from "@/lib/types";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CustomVideoPlayer from "./CustomVideoPlayer";

interface MatchStreamProps {
  match: MatchData;
}

const MatchStream = ({ match }: MatchStreamProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        {/* Video Player */}
        <div className="aspect-video relative bg-black flex items-center justify-center">
          <CustomVideoPlayer sources={match.sources} />
        </div>
        
        <div className="p-4 bg-white">
          {/* Match Title */}
          <h2 className="text-xl font-semibold mb-2">{match.teams.teamA} vs {match.teams.teamB}</h2>
          <p className="text-muted-foreground mb-4">{match.tournament} • {match.venue}</p>
          
          <Alert className="bg-cricliv-lightblue/30 border-cricliv-blue/30 text-cricliv-blue/90">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Streaming information</AlertTitle>
            <AlertDescription>
              We provide multiple stream sources. If one isn't working, try another one.
            </AlertDescription>
          </Alert>
        </div>
      </div>
      
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="info" className="flex-1">Match Info</TabsTrigger>
          <TabsTrigger value="chat" className="flex-1">Comments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="bg-white p-4 rounded-lg mt-2 border">
          <h3 className="font-semibold text-lg mb-2">Match Details</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Match Type:</span> {match.additionalInfo?.matchType || 'N/A'}</p>
            <p><span className="font-medium">Tournament Stage:</span> {match.additionalInfo?.round || 'N/A'}</p>
            <p><span className="font-medium">Description:</span> {match.additionalInfo?.description || 'No additional information available.'}</p>
          </div>
        </TabsContent>
        
        <TabsContent value="chat" className="bg-white p-4 rounded-lg mt-2 border">
          <div className="h-[400px] overflow-hidden rounded border">
            <iframe 
              src="https://www.comments.com" 
              className="w-full h-full" 
              title="Comments"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MatchStream;
