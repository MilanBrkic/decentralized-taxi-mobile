import { SERVER_HOST, SERVER_PORT, SOCKET_PORT } from "@env";

export const Config = {
  SERVER_URL: `http://${SERVER_HOST}:${SERVER_PORT}`,
  SOCKET_URL: `ws://${SERVER_HOST}:${SOCKET_PORT}`,
};
