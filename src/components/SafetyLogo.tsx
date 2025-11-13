import { useEffect, useState } from "react";
import { Shield, AlertTriangle, HardHat } from "lucide-react";

interface SafetyLogoProps {
  onComplete: () => void;
}

const SafetyLogo = ({ onComplete }: SafetyLogoProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 300);
          return 100;
        }
        return prev + 2;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-warning via-background to-black flex items-center justify-center z-50">
      <div className="text-center space-y-8 animate-fade-in">
        <div className="relative">
          {/* Outer safety shield */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield className="w-40 h-40 text-warning animate-pulse" strokeWidth={2} />
          </div>
          
          {/* Inner hard hat icon */}
          <div className="relative flex items-center justify-center h-40">
            <HardHat className="w-20 h-20 text-primary animate-bounce" strokeWidth={2.5} />
          </div>
          
          {/* Warning triangles */}
          <div className="absolute -top-4 -left-4">
            <AlertTriangle className="w-8 h-8 text-destructive animate-pulse" />
          </div>
          <div className="absolute -top-4 -right-4">
            <AlertTriangle className="w-8 h-8 text-destructive animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-warning tracking-wider drop-shadow-lg">
            CRANE SAFETY SYSTEM
          </h1>
          <p className="text-primary text-lg font-semibold">
            Worker Protection & Monitoring
          </p>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Shield className="w-4 h-4" />
            <span className="text-sm">AI-Powered Safety Detection</span>
          </div>
        </div>

        <div className="w-64 mx-auto space-y-2">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-warning via-primary to-success transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Initializing Safety Systems...
          </p>
        </div>
      </div>
    </div>
  );
};

export default SafetyLogo;
