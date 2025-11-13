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
    let audioContext: AudioContext | null = null;
    let intervalId: NodeJS.Timeout | null = null;

    const initAudio = () => {
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    initAudio();

    // Continuous beep when alert is active
    if ((humanDetected || weightOverload) && audioContext) {
      playAlertSound(audioContext);
      intervalId = setInterval(() => {
        playAlertSound(audioContext!);
      }, 1500); // Beep every 1.5 seconds
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [humanDetected, weightOverload]);

  const playAlertSound = (audioContext: AudioContext) => {
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
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 800;
      osc2.type = 'sine';
      gain2.gain.value = 0.3;
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.2);
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
