import { useEffect, useState } from "react";
import { Shield } from "lucide-react";

const SafetyLogo = ({ onComplete }: { onComplete: () => void }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background animate-fade-in">
      <div className="relative animate-pulse-glow">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
        <div className="relative flex flex-col items-center gap-4 p-8">
          <div className="relative">
            <Shield className="w-32 h-32 text-primary" strokeWidth={1.5} />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-20 h-20">
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fill-primary text-2xl font-bold"
                  style={{ fontFamily: 'monospace' }}
                >
                  🏗️
                </text>
              </svg>
            </div>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold text-primary tracking-wider">
              CRANE SAFETY
            </h1>
            <p className="text-lg text-muted-foreground tracking-wide">
              Worker Protection System
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyLogo;
