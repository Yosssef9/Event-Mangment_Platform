import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../../api/api";

export default function TicketScanner() {
  const [qrCodeMessage, setQrCodeMessage] = useState("");
  const [ticketInfo, setTicketInfo] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const scannerRef = useRef(null);
  const qrRegionId = "qr-code-region";

  // Stop and clear scanner safely
  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.warn("Stop warning:", err);
      }
      try {
        await scannerRef.current.clear();
      } catch (err) {
        console.warn("Clear warning:", err);
      }
    }
  };

  // Start scanner for a given camera
  const startScanner = async (cameraId) => {
    await stopScanner(); // stop previous scanner first

    const html5QrCode = new Html5Qrcode(qrRegionId, false);
    scannerRef.current = html5QrCode;

    try {
      await html5QrCode.start(
        { deviceId: { exact: cameraId } },
        { fps: 10, qrbox: { width: 300, height: 300 } },
        async (decodedText) => {
          setQrCodeMessage(decodedText);

          // Fetch ticket info from backend
          try {
            const res = await api.get(`/tickets/${decodedText}`);
            setTicketInfo(res.data);
          } catch (err) {
            setTicketInfo({ error: "Ticket not found" });
          }
        },
        (errorMessage) => {
          if (!errorMessage.includes("NotFoundException"))
            console.warn(errorMessage);
        }
      );

      // Make video fit container
      const container = document.getElementById(qrRegionId);
      const video = container.querySelector("video");
      if (video) {
        video.style.width = "100%";
        video.style.height = "100%";
        video.style.objectFit = "cover";
        video.style.borderRadius = "12px";
      }
    } catch (err) {
      console.error("Camera start error:", err);
    }
  };

  // Get available cameras on mount
  useEffect(() => {
    let isMounted = true;

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (isMounted && devices.length > 0) {
          setCameras(devices);
          setSelectedCamera(devices[0].id);
          startScanner(devices[0].id);
        }
      })
      .catch((err) => console.error("Get cameras error:", err));

    return () => {
      isMounted = false;
      stopScanner(); // cleanup on unmount
    };
  }, []);

  // Handle restart scan
  const handleRestart = async () => {
    setQrCodeMessage("");
    setTicketInfo(null);
    if (selectedCamera) await startScanner(selectedCamera);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        padding: "40px 20px",
        background: "linear-gradient(to bottom, #f5f3ff, #ede9fe)",
      }}
    >
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "800",
          background: "linear-gradient(to right, #7e22ce, #d946ef, #ec4899)",
          WebkitBackgroundClip: "text",
          color: "transparent",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        🎫 Ticket Scanner
      </h1>
      <p
        style={{
          color: "#4b5563",
          fontSize: "1.125rem",
          maxWidth: 500,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        Scan the participant's QR code to verify tickets instantly.
      </p>

      {cameras.length > 1 && (
        <div style={{ marginBottom: 20 }}>
          <label style={{ marginRight: 10, fontWeight: 500 }}>
            Select Camera:
          </label>
          <select
            value={selectedCamera}
            onChange={(e) => {
              setSelectedCamera(e.target.value);
              startScanner(e.target.value);
            }}
            style={{
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid #c4b5fd",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            {cameras.map((cam) => (
              <option key={cam.id} value={cam.id}>
                {cam.label || cam.id}
              </option>
            ))}
          </select>
        </div>
      )}

      <div
        id={qrRegionId}
        style={{
          width: 330,
          height: 330,
          border: "4px dashed #a78bfa",
          borderRadius: 16,
          overflow: "hidden",
          position: "relative",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          background: "#fff",
        }}
      >
        {!qrCodeMessage && (
          <p
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              color: "#9ca3af",
              fontWeight: 500,
            }}
          >
            Point your camera at a QR Code
          </p>
        )}
      </div>

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#7c3aed" }}>
          {qrCodeMessage ? "QR Code Scanned" : "Waiting for scan..."}
        </h2>
        {qrCodeMessage && (
          <p style={{ color: "#4b5563", wordBreak: "break-all" }}>
            {qrCodeMessage}
          </p>
        )}
        {qrCodeMessage && (
          <button
            onClick={handleRestart}
            style={{
              marginTop: 15,
              padding: "10px 20px",
              backgroundColor: "#7c3aed",
              color: "#fff",
              fontWeight: 600,
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "#6b21a8")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "#7c3aed")
            }
          >
            🔄 Restart Scan
          </button>
        )}
      </div>

      {ticketInfo && (
        <div
          style={{
            marginTop: 30,
            maxWidth: 480,
            width: "100%",
            padding: 20,
            borderRadius: 16,
            backdropFilter: "blur(10px)",
            backgroundColor: ticketInfo.error
              ? "rgba(254, 226, 226, 0.6)"
              : "rgba(243, 232, 255, 0.6)",
            border: `2px solid ${ticketInfo.error ? "#f87171" : "#a78bfa"}`,
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          }}
        >
          {ticketInfo.error ? (
            <p
              style={{
                textAlign: "center",
                color: "#b91c1c",
                fontWeight: 600,
                fontSize: "1.125rem",
              }}
            >
              ❌ {ticketInfo.error}
            </p>
          ) : (
            <>
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "1.75rem",
                  fontWeight: 700,
                  color: "#7c3aed",
                  marginBottom: 15,
                }}
              >
                🎟 Ticket Verified
              </h2>
              <p style={{ fontWeight: 500, color: "#4b5563", marginBottom: 5 }}>
                <strong>Ticket ID:</strong> {ticketInfo.ticket.id}
              </p>
              <p style={{ fontWeight: 500, color: "#4b5563", marginBottom: 5 }}>
                <strong>QR Code:</strong> {ticketInfo.ticket.qrCode}
              </p>
              <p style={{ fontWeight: 500, color: "#4b5563", marginBottom: 5 }}>
                <strong>User:</strong> {ticketInfo.ticket.user.name} —{" "}
                {ticketInfo.ticket.user.email}
              </p>
              <p style={{ fontWeight: 500, color: "#4b5563" }}>
                <strong>Event:</strong> {ticketInfo.ticket.event.title}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
