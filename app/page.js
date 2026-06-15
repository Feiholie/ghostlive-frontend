"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(
  process.env.NEXT_PUBLIC_API_URL ||
    "https://ghostlive-ai-mvp-production.up.railway.app"
);

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState("disconnected");
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    socket.on("status", (newStatus) => {
      setStatus(newStatus);
    });

    socket.on("new_chat", (data) => {
      setLogs((prev) => [...prev, data]);
    });

    socket.on("ai_response", (data) => {
      if (data.audio) {
        const audio = new Audio(
          "data:audio/mp3;base64," + data.audio
        );
        audio.play();
      }
    });

    return () => {
      socket.off("status");
      socket.off("new_chat");
      socket.off("ai_response");
    };
  }, []);

  const connect = () => {
    if (!username) return;
    socket.emit("connect_tiktok", username);
  };

  return (
    <main style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>GhostLive AI Dashboard</h1>

      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Masukkan Username TikTok"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "8px",
            width: "250px",
            marginRight: "10px",
          }}
        />

        <button
          onClick={connect}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          Connect
        </button>
      </div>

      <p style={{ marginTop: "20px" }}>
        Status: <strong>{status}</strong>
      </p>

      <div
        style={{
          marginTop: "20px",
          border: "1px solid #ccc",
          padding: "10px",
          height: "400px",
          overflowY: "auto",
        }}
      >
        {logs.length === 0 ? (
          <p>Belum ada chat masuk...</p>
        ) : (
          logs.map((log, i) => (
            <p key={i}>
              <strong>{log.nickname}</strong>: {log.comment}
            </p>
          ))
        )}
      </div>
    </main>
  );
}
