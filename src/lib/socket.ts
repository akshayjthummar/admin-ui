import { io } from "socket.io-client";

const socket = io("http://localhost:5504", {
  transports: ["websocket"],
  reconnection: true,
});
socket.on("connect", () => {
  console.log("connected socket", socket.id);
});

socket.on("disconnect", () => {
  console.log("Disconnected", socket.id);
});

export default socket;
