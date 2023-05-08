import { Config } from "../Config";

export class SocketClient {
  static instance;
  socket;
  isReconnecting;

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
      console.log("Socket message received:", e);
    };

    this.socket.onerror = (e) => {
      console.log("Socket error:", e.message);
      if (!this.isReconnecting) {
        this.reconnect();
      }
    };
  }

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
