
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

const cricketFacts = [
  "The longest cricket match ever played lasted 14 days.",
  "The highest individual score in Test cricket is 400 not out, by Brian Lara.",
  "The first international cricket match was played between the USA and Canada in 1844.",
  "The oldest international cricket ground is in Hambledon, England.",
  "Cricket balls are made of cork wrapped in leather.",
  "The fastest recorded cricket delivery was 161.3 km/h (100.23 mph) by Shoaib Akhtar.",
  "The shortest Test match ever played lasted for only 58 overs.",
  "The longest six in cricket history is believed to be 158 meters, hit by Shahid Afridi.",
  "India's Sachin Tendulkar holds the record for most runs in international cricket.",
  "Sir Don Bradman's Test batting average of 99.94 is considered the greatest achievement in any major sport."
];

const CricketTrivia = () => {
  const [fact, setFact] = useState<string>("");

  useEffect(() => {
    // Set a random fact initially
    const randomFact = cricketFacts[Math.floor(Math.random() * cricketFacts.length)];
    setFact(randomFact);

    // Change fact every 15 seconds
    const interval = setInterval(() => {
      const newFact = cricketFacts[Math.floor(Math.random() * cricketFacts.length)];
      setFact(newFact);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-accent">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Info className="h-5 w-5" />
          Cricket Trivia
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="italic text-muted-foreground">{fact}</p>
      </CardContent>
    </Card>
  );
};

export default CricketTrivia;
