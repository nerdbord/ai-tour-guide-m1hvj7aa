/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useRef, useEffect } from "react";

export const CapturePicture: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
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
  }, []);

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
      }
    }
  };

  const handleCancel = () => {
    setImage(null);
    if (videoRef.current) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream?.getTracks() || [];
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="h-16 w-full"></div>

      {/* Camera Section */}
      <div className="flex-grow flex items-center justify-center w-full h-4/5 relative">
        {loading ? (
          <p>Loading...</p>
        ) : image ? (
          <img src={image} alt="Captured" className=" px-4" />
        ) : cameraError ? (
          <div className="p-4 max-w-full ">
            <p>{cameraError}</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full px-4 object-cover"
              autoPlay
              playsInline
              muted
            />
            <canvas ref={canvasRef} className="hidden" />
          </>
        )}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 justify-center items-center w-full px-4 pb-6">
        {image ? (
          <div className="flex items-center w-full justify-evenly pt-5 pb-10">
            <button
              onClick={handleCancel}
              className="rounded-full w-32 px-8 py-4 border text-center"
            >
              <p>Retake</p>
            </button>
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <button
              onClick={captureImage}
              className="rounded-full h-20 w-20 flex justify-center items-center"
            >
              Capture
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
