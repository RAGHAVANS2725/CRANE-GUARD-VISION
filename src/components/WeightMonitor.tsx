import { useState } from "react";
import { Weight, Settings } from "lucide-react";
import { Card } from "./ui/card";
import { Slider } from "./ui/slider";
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

interface WeightMonitorProps {
  currentWeight: number;
  maxWeight: number;
  onCurrentWeightChange: (weight: number) => void;
  onMaxWeightChange: (weight: number) => void;
}

const WeightMonitor = ({
  currentWeight,
  maxWeight,
  onCurrentWeightChange,
  onMaxWeightChange
}: WeightMonitorProps) => {
  const [tempMaxWeight, setTempMaxWeight] = useState(maxWeight);
  const weightPercentage = (currentWeight / maxWeight) * 100;
  const isOverload = currentWeight > maxWeight;

  const handleMaxWeightSave = () => {
    onMaxWeightChange(tempMaxWeight);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Weight className={`w-6 h-6 ${isOverload ? "text-destructive" : "text-primary"}`} />
          <h3 className="text-lg font-semibold">Weight Monitor</h3>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card">
            <DialogHeader>
              <DialogTitle>Weight Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Maximum Crane Capacity (kg)</Label>
                <Input
                  type="number"
                  value={tempMaxWeight}
                  onChange={(e) => setTempMaxWeight(Number(e.target.value))}
                  min="100"
                  max="100000"
                  step="100"
                />
                <p className="text-xs text-muted-foreground">
                  Set the maximum safe lifting capacity for this crane
                </p>
              </div>
              <Button onClick={handleMaxWeightSave} className="w-full">
                Save Configuration
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Weight Display */}
      <div className="space-y-4">
        <div className="flex justify-between items-baseline">
          <span className="text-sm text-muted-foreground">Current Load</span>
          <span className={`text-3xl font-bold ${isOverload ? "text-destructive" : "text-foreground"}`}>
            {currentWeight} kg
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Load Percentage</span>
            <span className={`font-medium ${isOverload ? "text-destructive" : "text-foreground"}`}>
              {weightPercentage.toFixed(1)}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="h-4 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                isOverload ? "bg-destructive" : weightPercentage > 80 ? "bg-warning" : "bg-success"
              }`}
              style={{ width: `${Math.min(weightPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between text-sm text-muted-foreground">
          <span>0 kg</span>
          <span>Max: {maxWeight} kg</span>
        </div>

        {/* Current Weight Slider */}
        <div className="space-y-2 pt-4 border-t border-border">
          <Label className="text-sm">Adjust Current Load</Label>
          <Slider
            value={[currentWeight]}
            onValueChange={([value]) => onCurrentWeightChange(value)}
            min={0}
            max={maxWeight * 1.5}
            step={50}
            className="py-4"
          />
          <p className="text-xs text-muted-foreground">
            Slide to simulate different load weights
          </p>
        </div>
      </div>

      {/* Status Indicator */}
      {isOverload && (
        <div className="p-3 bg-destructive/20 border border-destructive rounded-lg">
          <p className="text-sm font-medium text-destructive">
            ⚠️ OVERLOAD WARNING: Reduce load immediately
          </p>
        </div>
      )}
    </Card>
  );
};

export default WeightMonitor;
