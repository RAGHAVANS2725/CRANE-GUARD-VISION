import { useState } from "react";
import { Building2, Settings } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export interface Zone {
  id: string;
  name: string;
  location: string;
  cameraUrl?: string;
}

interface ZoneSwitcherProps {
  zones: Zone[];
  activeZone: string;
  onZoneChange: (zoneId: string) => void;
  onZoneUpdate: (zoneId: string, cameraUrl: string) => void;
}

const ZoneSwitcher = ({ zones, activeZone, onZoneChange, onZoneUpdate }: ZoneSwitcherProps) => {
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [cameraUrl, setCameraUrl] = useState("");

  const handleEditZone = (zone: Zone) => {
    setEditingZone(zone);
    setCameraUrl(zone.cameraUrl || "");
  };

  const handleSaveCamera = () => {
    if (editingZone) {
      onZoneUpdate(editingZone.id, cameraUrl);
      setEditingZone(null);
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Building2 className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Crane Zones</h3>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-3">
        {zones.map((zone) => (
          <Button
            key={zone.id}
            variant={activeZone === zone.id ? "default" : "outline"}
            onClick={() => onZoneChange(zone.id)}
            className="flex flex-col items-start h-auto py-3 px-4"
          >
            <span className="font-semibold">{zone.name}</span>
            <span className="text-xs opacity-80">{zone.location}</span>
            {zone.cameraUrl && (
              <span className="text-xs text-success">📹 IP Camera</span>
            )}
          </Button>
        ))}
      </div>

      <Dialog open={!!editingZone} onOpenChange={(open) => !open && setEditingZone(null)}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            onClick={() => handleEditZone(zones.find(z => z.id === activeZone) || zones[0])}
          >
            <Settings className="w-4 h-4 mr-2" />
            Configure Camera
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card">
          <DialogHeader>
            <DialogTitle>Configure Camera for {editingZone?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Camera IP Address / Stream URL</Label>
              <Input
                type="text"
                placeholder="e.g., http://192.168.1.100:8080/video or rtsp://..."
                value={cameraUrl}
                onChange={(e) => setCameraUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to use device camera. Enter IP camera stream URL for external cameras.
              </p>
            </div>
            <Button onClick={handleSaveCamera} className="w-full">
              Save Camera Configuration
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default ZoneSwitcher;
