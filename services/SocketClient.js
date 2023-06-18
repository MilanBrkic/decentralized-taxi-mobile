import { Config } from "../Config";
import { Alert } from "react-native";
import { convertAlgoToReadable } from "./Utils";
import { locationService } from "./LocationService";

export class SocketClient {
  static instance;
  socket;
  isReconnecting;
  user;
  navigation;
  events = new Map();

  constructor(user, navigation) {
    if (SocketClient.instance) {
      return SocketClient.instance;
    }
    this.user = user;
    this.navigation = navigation;
    this.isReconnecting = false;
    this.connect();
  }

  static getInstance(user, navigation) {
    if (!SocketClient.instance) {
      SocketClient.instance = new SocketClient(user, navigation);
      this.initEvents(SocketClient.instance);
    }
    return SocketClient.instance;
  }

  static initEvents(instance) {
    instance.events.set(MessageType.RideArranged, (data) => {
      const ride = data.ride;
      const bid = ride.bids.find((bid) => bid.username === this.user.username);
      Alert.alert(
        "Bid Accepted",
        `Your bid was accepted by ${
          ride.passenger.username
        } with amount ${convertAlgoToReadable(bid.amount)}`
      );

      this.navigation.navigate("RideArrangedPage", {
        user: this.user,
        rideId: data.ride._id,
      });
    });
  }

  connect() {
    // Create a new WebSocket client and connect to the server
    this.socket = new WebSocket(Config.SOCKET_URL);

    this.socket.onopen = () => {
      const data = {
        type: "connection",
        data: { username: this.user.username },
      };
      this.socket.send(JSON.stringify(data));
      console.log("Socket connected!");
      this.isReconnecting = false;
    };

    this.socket.onmessage = (e) => {
      let message;
      try {
        message = JSON.parse(e.data);
      } catch (error) {
        console.log("Unsupported message format", e);
        return;
      }

      const event = this.events.get(message.type);
      if (event) {
        event(message.data);
      } else {
        console.log(
          `Unsupported message type ${message.type} for user ${this.user.username}`
        );
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

  close() {
    SocketClient.instance = null;
    this.socket.close();
  }
}

export const MessageType = {
  Bid: "bid",
  RideRequested: "ride_requested",
  RideCanceled: "ride_canceled",
  RideDeployed: "ride_deployed",
  RideArranged: "ride_arranged",
  RideTimeout: "ride_timeout",
  GetLocation: "get_location",
  ReturnDriverLocation: "return_driver_location",
  SubscribeToDriverLocation: "subscribe_to_driver_location",
};
