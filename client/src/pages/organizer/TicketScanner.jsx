import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import api from "../../api/api";
import { useLocation } from "react-router-dom";

export default function TicketScanner() {
  const [qrCodeMessage, setQrCodeMessage] = useState("");
  const [ticketInfo, setTicketInfo] = useState(null);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [scanned, setScanned] = useState(false); // track if already scanned
  const scannerRef = useRef(null);
  const qrRegionId = "qr-code-region";
  const location = useLocation();
  const event = location.state?.event;

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
          if (scanned) return; // stop multiple scans
          setScanned(true); // mark as scanned
          setQrCodeMessage(decodedText);

          // Stop scanner immediately
          await stopScanner();

          // Fetch ticket info from backend
          try {
            const res = await api.get(
              `/ticket/scanTicket/${event.id}/${decodedText}`
            );
            console.log("res", res);
            setTicketInfo(res.data);
          } catch (err) {
            console.log("err", err);

            setTicketInfo({
              success: false,
              error: err?.response?.data?.message || "Ticket not found",
            });
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
    setScanned(false); // allow scanning again
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
      ></div>
      {!qrCodeMessage && (
        <p
          style={{
            color: "#9ca3af",
            fontWeight: 500,
            textAlign: "center",
            marginTop: 10,
          }}
        >
          Point your camera at a QR Code
        </p>
      )}

      <div style={{ marginTop: 20, textAlign: "center" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, color: "#7c3aed" }}>
          {qrCodeMessage ? "QR Code Scanned" : "Waiting for scan..."}
        </h2>

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
            padding: 25,
            borderRadius: 20,
            backdropFilter: "blur(10px)",
            backgroundColor: ticketInfo.error
              ? "rgba(254, 226, 226, 0.8)"
              : "rgba(220, 252, 231, 0.9)",
            border: `2px solid ${ticketInfo.error ? "#f87171" : "#22c55e"}`,
            boxShadow: ticketInfo.error
              ? "0 8px 24px rgba(248, 113, 113, 0.2)"
              : "0 8px 24px rgba(34, 197, 94, 0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {ticketInfo.error ? (
            <>
              <div
                style={{
                  fontSize: "2rem",
                  color: "#b91c1c",
                  marginBottom: 10,
                }}
              >
                ❌
              </div>
              <p
                style={{
                  textAlign: "center",
                  color: "#b91c1c",
                  fontWeight: 600,
                  fontSize: "1.25rem",
                }}
              >
                {ticketInfo.error}
              </p>
            </>
          ) : (
            <>
              <div
                style={{
                  fontSize: "2.5rem",
                  color: "#16a34a",
                  marginBottom: 10,
                }}
              >
                ✅
              </div>
              <h2
                style={{
                  textAlign: "center",
                  fontSize: "1.8rem",
                  fontWeight: 700,
                  color: "#16a34a",
                  marginBottom: 15,
                }}
              >
                Ticket Verified
              </h2>

              <div style={{ width: "100%", textAlign: "center" }}>
                <p
                  style={{
                    fontWeight: 500,
                    color: "#166534",
                    marginBottom: 5,
                  }}
                >
                  <strong>Ticket ID:</strong> {ticketInfo.ticket.id}
                </p>

                <p
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "8px",
                    fontWeight: 500,
                    color: "#166534",
                    marginBottom: 5,
                  }}
                >
                  <strong>QR Code:</strong>
                  <span
                    style={{
                      display: "inline-block",
                      maxWidth: "250px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      backgroundColor: "#d1fae5",
                      color: "#065f46",
                    }}
                    title={ticketInfo.ticket.qrCode} // tooltip to show full QR code
                  >
                    {ticketInfo.ticket.qrCode}
                  </span>
                </p>

                <p
                  style={{
                    fontWeight: 500,
                    color: "#166534",
                    marginBottom: 5,
                  }}
                >
                  <strong>User:</strong> {ticketInfo.ticket.user.name} —{" "}
                  {ticketInfo.ticket.user.email}
                </p>

                <p style={{ fontWeight: 500, color: "#166534" }}>
                  <strong>Event:</strong> {ticketInfo.ticket.event.title}
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
