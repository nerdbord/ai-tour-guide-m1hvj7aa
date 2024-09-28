"use client";
import React, { useState, useRef, useEffect } from "react";

export const CapturePicture: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isCameraActive]);

  const startCamera = () => {
    if (videoRef.current) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
          setCameraError(null);
        })
        .catch((err) => {
          console.error("Failed to access camera:", err);
          setCameraError("No camera available or permission denied.");
        });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleCancel = () => {
    setImage(null);
    setIsCameraActive(true); // Re-enable the camera
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        setImage(canvasRef.current.toDataURL("image/png"));
        setIsCameraActive(false); // Disable the camera after capturing image
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-full ">
      {/* Header */}
      <div className="flex  justify-between items-center h-12 w-full">
        <div className="flex items-center">
          <p className="text-xl font-medium p-4">Capture Document</p>
        </div>
      </div>

      {/* Camera Section */}
      <div className="flex-grow flex items-center justify-center w-full relative">
        {image ? (
          <img
            src={image}
            alt="Captured"
            className="w-full h-full object-cover p-4"
          />
        ) : cameraError ? (
          <div className="p-4 max-w-full max-h-full">
            <p>{cameraError}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover p-4"
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 justify-center items-center  w-full px-4 pb-6">
        {image ? (
          <div className="flex items-center w-full justify-evenly pt-2 pb-10">
            <button
              onClick={handleCancel}
              className="rounded-full flex items-center justify-center w-32 px-8 py-4 border"
            >
              <p className="px-2">Retake</p>
            </button>
          </div>
        ) : (
          <div className="flex items-center w-full justify-evenly pt-2 pb-10">
            <button
              onClick={captureImage}
              className="rounded-full flex items-center justify-center w-32 px-8 py-4 border"
            >
              <p className="px-2">Capture</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
