import {
  SERVER_HOST,
  SERVER_PORT,
  GOOGLE_MAPS_API_KEY,
  SOCKET_URL,
} from "@env";

export const Config = {
  SERVER_URL: `http://${SERVER_HOST}${SERVER_PORT ? `:${SERVER_PORT}` : ""}`,
  SOCKET_URL: `${SOCKET_URL}${SERVER_HOST}${
    SERVER_PORT ? `:${SERVER_PORT}` : ""
  }`,
  GOOGLE_MAPS_API_KEY,
};
