import { useState } from "react";
import { Button } from "./ui/button";
import { Scan } from "lucide-react";

interface ManualScanButtonProps {
  onScan: () => void;
  isScanning: boolean;
}

const ManualScanButton = ({ onScan, isScanning }: ManualScanButtonProps) => {
  return (
    <Button
      onClick={onScan}
      disabled={isScanning}
      className="bg-primary hover:bg-primary/90"
      size="lg"
    >
      <Scan className={`w-5 h-5 mr-2 ${isScanning ? 'animate-spin' : ''}`} />
      {isScanning ? 'Scanning...' : 'Manual Scan'}
    </Button>
  );
};

export default ManualScanButton;
