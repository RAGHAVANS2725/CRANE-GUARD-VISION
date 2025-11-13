import { useState, useCallback } from "react";
import SafetyLogo from "@/components/SafetyLogo";
import CameraFeed from "@/components/CameraFeed";
import AlertSystem from "@/components/AlertSystem";
import WeightMonitor from "@/components/WeightMonitor";
import ZoneSwitcher from "@/components/ZoneSwitcher";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Shield } from "lucide-react";

const ZONES = [
  { id: "zone1", name: "Zone A", location: "East Sector" },
  { id: "zone2", name: "Zone B", location: "West Sector" },
  { id: "zone3", name: "Zone C", location: "North Sector" },
  { id: "zone4", name: "Zone D", location: "South Sector" },
];

const Index = () => {
  const [showLogo, setShowLogo] = useState(true);
  const [activeZone, setActiveZone] = useState("zone1");
  const [humanDetected, setHumanDetected] = useState(false);
  const [humanCount, setHumanCount] = useState(0);
  const [currentWeight, setCurrentWeight] = useState(5000);
  const [maxWeight, setMaxWeight] = useState(10000);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleFrameCapture = useCallback(async (imageData: string) => {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('detect-humans', {
        body: { imageData }
      });

      if (error) throw error;

      const result = data as {
        humanDetected: boolean;
        humanCount: number;
        confidence: number;
        details: string;
      };

      console.log('Detection result:', result);

      setHumanDetected(result.humanDetected);
      setHumanCount(result.humanCount);

      if (result.humanDetected && result.humanCount > 0) {
        toast({
          title: "⚠️ Human Detected",
          description: `${result.humanCount} ${result.humanCount === 1 ? 'person' : 'people'} in crane path`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Detection error:', error);
      toast({
        title: "Detection Error",
        description: "Unable to analyze camera feed",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [isAnalyzing, toast]);

  const weightOverload = currentWeight > maxWeight;

  if (showLogo) {
    return <SafetyLogo onComplete={() => setShowLogo(false)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">CRANE SAFETY SYSTEM</h1>
              <p className="text-sm text-muted-foreground">Real-time Worker Protection Monitor</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-lg">
            <div className={`w-3 h-3 rounded-full ${isAnalyzing ? 'bg-primary animate-pulse' : 'bg-success'}`} />
            <span className="text-sm font-medium">
              {isAnalyzing ? 'ANALYZING...' : 'ACTIVE'}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Camera Feed - Takes up 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <CameraFeed
              zoneId={activeZone}
              zoneName={ZONES.find(z => z.id === activeZone)?.name || "Unknown"}
              onFrame={handleFrameCapture}
            />
            
            <AlertSystem
              humanDetected={humanDetected}
              humanCount={humanCount}
              weightOverload={weightOverload}
              currentWeight={currentWeight}
              maxWeight={maxWeight}
            />
          </div>

          {/* Control Panel */}
          <div className="space-y-6">
            <ZoneSwitcher
              zones={ZONES}
              activeZone={activeZone}
              onZoneChange={setActiveZone}
            />
            
            <WeightMonitor
              currentWeight={currentWeight}
              maxWeight={maxWeight}
              onCurrentWeightChange={setCurrentWeight}
              onMaxWeightChange={setMaxWeight}
            />
          </div>
        </div>

        {/* Footer Info */}
        <footer className="pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>Crane Safety System v1.0 | AI-Powered Human Detection Active</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
