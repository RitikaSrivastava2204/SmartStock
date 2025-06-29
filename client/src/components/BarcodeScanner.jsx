import { Html5Qrcode, Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useRef, useState } from "react";

export default function BarcodeScanner({ onScanSuccess, onClose }) {
  const [isUploadMode, setIsUploadMode] = useState(false);
  const html5QrCodeRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const playBeep = () => {
    const audio = new Audio(
      "https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg"
    );
    audio.play();
  };

  const startCameraScanner = async () => {
    if (!html5QrCodeRef.current) {
      html5QrCodeRef.current = new Html5Qrcode("reader");
    }

    const qrCode = html5QrCodeRef.current;

    try {
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras.length) throw new Error("No camera found");

      await qrCode.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          playBeep();
          onScanSuccess(decodedText);
          qrCode.stop();
        },
        (error) => {
          // Optional: console.log("Scan error:", error);
        }
      );
    } catch (err) {
      alert("Could not access the camera.");
    }
  };

  const stopCameraScanner = async () => {
    if (html5QrCodeRef.current?.isScanning) {
      await html5QrCodeRef.current.stop();
      await html5QrCodeRef.current.clear();
    }
  };

  useEffect(() => {
    let timeout;
  
    if (!isUploadMode) {
      timeout = setTimeout(() => {
        startCameraScanner();
      }, 200); // small delay fixes camera permission race
    }
  
    return () => {
      clearTimeout(timeout);
      stopCameraScanner();
    };
  }, [isUploadMode]);
  

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    await stopCameraScanner(); // ensure no conflict

    const qrCode = new Html5Qrcode("reader");
    try {
      const result = await qrCode.scanFile(file, true);
      playBeep();
      onScanSuccess(result);
      await qrCode.clear();
    } catch (err) {
      alert("❌ Couldn’t detect barcode in the image.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center border rounded-xl shadow-md p-4 bg-white w-full max-w-md mx-auto space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 text-center">
        {isUploadMode ? "📤 Upload Image to Scan" : "📷 Live Camera Scanner"}
      </h3>

      {/* Scanner container */}
      <div id="reader" className="w-full h-54 rounded border overflow-hidden" />

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-2 justify-center items-center w-full">
        <button
          onClick={() => setIsUploadMode(!isUploadMode)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          {isUploadMode ? "Switch to Camera" : "Upload Image to Scan"}
        </button>

        <button
          onClick={() => {
            stopCameraScanner().then(onClose);
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Close Scanner
        </button>
      </div>

      {/* Upload section */}
      {isUploadMode && (
        <div
          className={`w-full text-center border-2 ${
            dragActive ? "border-indigo-500" : "border-gray-300"
          } border-dashed p-6 rounded-lg transition`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files.length > 0) {
              handleImageUpload({ target: { files: e.dataTransfer.files } });
            }
          }}
        >
          <p className="text-gray-600 mb-2">📁 Drag & drop an image here</p>
          <p className="text-sm text-gray-400 mb-2">or</p>
          <label
            htmlFor="barcode-upload"
            className="px-4 py-2 bg-indigo-600 text-white rounded cursor-pointer hover:bg-indigo-700 transition"
          >
            Choose File
            <input
              id="barcode-upload"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
}
