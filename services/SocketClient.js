import { Config } from "../Config";

export class SocketClient {
  static instance;
  socket;
  isReconnecting;
  events = new Map();

  constructor(username) {
    if (SocketClient.instance) {
      return SocketClient.instance;
    }
    this.username = username;
    this.isReconnecting = false;
    this.connect();
  }

  static getInstance(username) {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient(username);
    }
    return SocketClient.instance;
  }

  connect() {
    // Create a new WebSocket client and connect to the server
    this.socket = new WebSocket(Config.SOCKET_URL);

    this.socket.onopen = () => {
      const data = { type: "connection", data: { username: this.username } };
      this.socket.send(JSON.stringify(data));
      console.log("Socket connected!");
      this.isReconnecting = false;
    };

    this.socket.onclose = (e) => {
      console.log("Socket closed:", e.reason);
      if (!this.isReconnecting) {
        this.reconnect();
      }
    };

    this.socket.onmessage = (e) => {
      let data;
      try {
        data = JSON.parse(e.data);
      } catch (error) {
        console.log("Unsupported message format", e);
        return;
      }

      const event = this.events.get(data.type);
      if (event) {
        event(data);
      } else {
        console.log("Unsupported message type", data.type);
      }
    };

    this.socket.onerror = (e) => {
      console.log("Socket error:", e.message);
      if (!this.isReconnecting) {
        this.reconnect();
      }
    };
  }

  addEventHandler = (type, eventHandlers) => {
    this.events.set(type, eventHandlers);
  };

  removeEventHandler = (type) => {
    this.events.delete(type);
  };

  reconnect() {
    this.isReconnecting = true;
    setTimeout(() => {
      this.connect();
    }, 3000); // wait for 3 seconds before attempting to reconnect
  }

  send(data) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      this.reconnect();
      alert("Socket not open, unable to send message");
    }
  }
}

export const MessageType = {
  Bid: "bid",
  RideRequested: "ride_requested",
  RideCanceled: "ride_canceled",
};
