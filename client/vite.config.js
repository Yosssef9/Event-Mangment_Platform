import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // exposes to your LAN
    port: 5173, // optional, default port
    allowedHosts: ["dce64ce81b0a.ngrok-free.app"],
  },
});
