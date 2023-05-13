import {
  SERVER_HOST,
  SERVER_PORT,
  SOCKET_PORT,
  GOOGLE_MAPS_API_KEY,
} from "@env";

export const Config = {
  SERVER_URL: `http://${SERVER_HOST}:${SERVER_PORT}`,
  SOCKET_URL: `ws://${SERVER_HOST}:${SOCKET_PORT}`,
  GOOGLE_MAPS_API_KEY,
};
