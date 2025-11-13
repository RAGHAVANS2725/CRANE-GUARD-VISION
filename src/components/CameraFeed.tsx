import { useEffect, useRef, useState } from "react";
import { Camera, AlertTriangle, CheckCircle } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

interface CameraFeedProps {
  zoneId: string;
  zoneName: string;
  cameraUrl?: string;
  onFrame: (imageData: string) => void;
}

const CameraFeed = ({ zoneId, zoneName, cameraUrl, onFrame }: CameraFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let stream: MediaStream | null = null;
    let intervalId: NodeJS.Timeout;

    const startCamera = async () => {
      try {
        if (cameraUrl) {
          // Use IP camera stream
          if (videoRef.current) {
            videoRef.current.src = cameraUrl;
            videoRef.current.srcObject = null;
            setIsActive(true);
            setError("");

            // Capture frames every 5 seconds for analysis
            intervalId = setInterval(() => {
              captureFrame();
            }, 5000);
          }
        } else {
          // Use device camera
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "environment"
            },
            audio: false
          });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            setIsActive(true);
            setError("");

            // Capture frames every 5 seconds for analysis
            intervalId = setInterval(() => {
              captureFrame();
            }, 5000);
          }
        }
      } catch (err) {
        console.error("Camera error:", err);
        setError("Unable to access camera. Please check permissions or camera URL.");
        setIsActive(false);
      }
    };

    const captureFrame = () => {
      if (videoRef.current && canvasRef.current) {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert to base64 for AI analysis
          const imageData = canvas.toDataURL("image/jpeg", 0.8);
          onFrame(imageData);
        }
      }
    };

    startCamera();

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [zoneId, cameraUrl, onFrame]);

  return (
    <Card className="relative overflow-hidden border-2 border-primary/30 bg-card">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
          <Camera className="w-3 h-3 mr-1" />
          {zoneName}
        </Badge>
        {isActive ? (
          <Badge className="bg-success/80 backdrop-blur-sm">
            <CheckCircle className="w-3 h-3 mr-1" />
            LIVE
          </Badge>
        ) : (
          <Badge variant="destructive" className="backdrop-blur-sm">
            <AlertTriangle className="w-3 h-3 mr-1" />
            OFFLINE
          </Badge>
        )}
      </div>

      <div className="relative aspect-video bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center text-destructive-foreground p-4">
              <AlertTriangle className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {!isActive && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80">
            <div className="text-center text-muted-foreground">
              <Camera className="w-12 h-12 mx-auto mb-2 animate-pulse" />
              <p className="text-sm">Initializing camera...</p>
            </div>
          </div>
        )}
      </div>

      {/* Grid overlay for visual feedback */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 opacity-20">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="border border-primary" />
          ))}
        </div>
      </div>
    </Card>
  );
};

export default CameraFeed;
