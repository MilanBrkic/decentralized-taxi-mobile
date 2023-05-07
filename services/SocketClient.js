export class SocketClient {
  static instance;
  socket;
  constructor(username) {
    if (SocketClient.instance) {
      return SocketClient.instance;
    }
    // Create a new WebSocket client and connect to the server
    this.socket = new WebSocket("ws://192.168.1.3:8080");

    this.socket.onopen = () => {
      const data = { type: "connection", data: { username } };
      this.socket.send(JSON.stringify(data));
      console.log("Socket connected!");
    };

    this.socket.onclose = (e) => {
      console.log("Socket closed:", e.reason);
    };

    this.socket.onmessage = (e) => {
      console.log("Socket message received:", e.data);
    };

    this.socket.onerror = (e) => {
      console.log("Socket error:", e.message);
    };
  }

  static getInstance(username) {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient(username);
    }
    return SocketClient.instance;
  }
}
