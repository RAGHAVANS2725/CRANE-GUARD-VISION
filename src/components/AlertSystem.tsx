import { useEffect, useRef } from "react";
import { AlertTriangle, Users, Weight } from "lucide-react";
import { Card } from "./ui/card";

interface AlertSystemProps {
  humanDetected: boolean;
  humanCount: number;
  weightOverload: boolean;
  currentWeight: number;
  maxWeight: number;
}

const AlertSystem = ({
  humanDetected,
  humanCount,
  weightOverload,
  currentWeight,
  maxWeight
}: AlertSystemProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element for alert beep
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Using a simple oscillator for beep sound
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.3;
    }
  }, []);

  useEffect(() => {
    if (humanDetected || weightOverload) {
      playAlertSound();
    }
  }, [humanDetected, weightOverload]);

  const playAlertSound = () => {
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    gainNode.gain.value = 0.3;
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.2);
    
    // Repeat beep
    setTimeout(() => {
      if (humanDetected || weightOverload) {
        const osc2 = audioContext.createOscillator();
        osc2.connect(gainNode);
        osc2.frequency.value = 800;
        osc2.type = 'sine';
        osc2.start(audioContext.currentTime);
        osc2.stop(audioContext.currentTime + 0.2);
      }
    }, 300);
  };

  const hasAlert = humanDetected || weightOverload;

  return (
    <div className="space-y-4">
      {/* Main Alert Status */}
      <Card
        className={`p-6 border-2 transition-all ${
          hasAlert
            ? "border-destructive bg-destructive/10 animate-alert-pulse"
            : "border-success bg-success/10"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {hasAlert ? (
              <AlertTriangle className="w-12 h-12 text-destructive" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
            )}
            <div>
              <h3 className={`text-2xl font-bold ${hasAlert ? "text-destructive" : "text-success"}`}>
                {hasAlert ? "⚠️ DANGER - STOP OPERATION" : "✓ SAFE TO PROCEED"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {hasAlert ? "Unsafe conditions detected" : "All systems operational"}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Human Detection Alert */}
      {humanDetected && (
        <Card className="p-4 border-2 border-destructive bg-destructive/10 animate-slide-in">
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-destructive" />
            <div className="flex-1">
              <h4 className="font-bold text-destructive">HUMANS IN PATH</h4>
              <p className="text-sm text-destructive-foreground">
                {humanCount} {humanCount === 1 ? "person" : "people"} detected in crane operation zone
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Weight Overload Alert */}
      {weightOverload && (
        <Card className="p-4 border-2 border-destructive bg-destructive/10 animate-slide-in">
          <div className="flex items-center gap-3">
            <Weight className="w-8 h-8 text-destructive" />
            <div className="flex-1">
              <h4 className="font-bold text-destructive">WEIGHT OVERLOAD</h4>
              <p className="text-sm text-destructive-foreground">
                Current: {currentWeight}kg | Maximum: {maxWeight}kg
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Safe Operation Message */}
      {!hasAlert && (
        <Card className="p-4 border-2 border-success bg-success/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-success-foreground">
              ✓
            </div>
            <div>
              <h4 className="font-bold text-success">CLEAR TO TRANSFER</h4>
              <p className="text-sm text-success-foreground">
                No hazards detected - Operation authorized
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default AlertSystem;
