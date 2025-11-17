import { useEffect, useRef } from "react";

interface CameraFeedProps {
  zoneId: string;
  zoneName: string;
  cameraUrl?: string;
  onFrame: (imageData: string) => void;
}

export default function CameraFeed({ zoneId, zoneName, cameraUrl, onFrame }: CameraFeedProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!cameraUrl) return;

    const interval = setInterval(() => {
      if (!imgRef.current || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = imgRef.current.width;
      canvas.height = imgRef.current.height;

      ctx.drawImage(imgRef.current, 0, 0);

      const base64 = canvas.toDataURL("image/jpeg");
      onFrame(base64);
    }, 1500); // every 1.5 sec to avoid rate limit

    return () => clearInterval(interval);
  }, [cameraUrl, onFrame]);

  return (
    <div className="bg-card rounded-xl p-4 shadow-md">
      <h2 className="text-lg font-semibold mb-3">{zoneName} — Live Camera</h2>

      {!cameraUrl ? (
        <p className="text-muted-foreground">Camera not configured for this zone.</p>
      ) : (
        <>
          <img
            ref={imgRef}
            src={`${cameraUrl}/video`}     // IMPORTANT FIX
            alt="Camera Feed"
            className="w-full h-[400px] object-cover rounded-lg border border-border"
          />

          <canvas ref={canvasRef} className="hidden"></canvas>
        </>
      )}
    </div>
  );
}
