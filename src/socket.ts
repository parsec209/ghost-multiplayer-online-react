import { io } from "socket.io-client";

const URL: string = import.meta.env.VITE_AUTH0_API_URL;

export const socket = io(URL, {
  autoConnect: false,
});
