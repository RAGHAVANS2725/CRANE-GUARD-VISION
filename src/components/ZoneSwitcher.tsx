import { Building2 } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface Zone {
  id: string;
  name: string;
  location: string;
}

interface ZoneSwitcherProps {
  zones: Zone[];
  activeZone: string;
  onZoneChange: (zoneId: string) => void;
}

const ZoneSwitcher = ({ zones, activeZone, onZoneChange }: ZoneSwitcherProps) => {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3 mb-4">
        <Building2 className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Crane Zones</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {zones.map((zone) => (
          <Button
            key={zone.id}
            variant={activeZone === zone.id ? "default" : "outline"}
            onClick={() => onZoneChange(zone.id)}
            className="flex flex-col items-start h-auto py-3 px-4"
          >
            <span className="font-semibold">{zone.name}</span>
            <span className="text-xs opacity-80">{zone.location}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default ZoneSwitcher;
