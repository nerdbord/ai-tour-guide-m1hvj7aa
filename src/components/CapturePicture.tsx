"use client";
import React, { useState, useRef, useEffect } from "react";

export const CapturePicture: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

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
    stopCamera();
    startCamera();
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
        stopCamera(); // Stop camera after capturing image
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-purple-50">
      {/* Header */}
      <div className="bg-white h-16 w-full"></div>
      <div className="flex gap-32 justify-between items-center bg-white h-12 w-full">
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
            className="max-h-full max-w-full p-4"
          />
        ) : cameraError ? (
          <div className="p-4 max-w-full max-h-full">
            <p>{cameraError}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 justify-center items-center bg-white w-full px-4 pb-6">
        {image ? (
          <div className="flex items-center w-full justify-evenly pt-2 pb-10">
            <button
              onClick={handleCancel}
              className="rounded-full flex items-center justify-center w-32 px-8 py-4 border border-purple-900 text-purple-900"
            >
              <p className="px-2">Retake</p>
            </button>
          </div>
        ) : (
          <div className="flex items-center w-full justify-evenly pt-2 pb-10">
            <button
              onClick={captureImage}
              className="rounded-full w-32 px-8 py-4 border border-purple-900 bg-purple-900 text-white flex items-center justify-center"
            >
              <p className="px-2">Capture</p>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
