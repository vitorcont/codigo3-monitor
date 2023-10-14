/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";

export class NavigationSocket {
	private socket: Socket;
	private pathIndex: number = 0;
	private enable = false;
	private path: number[][] = [];

	constructor() {
		this.socket = io(`${import.meta.env.VITE_SOCKET_API_URL}/navigation`, {
			path: "/codigo3/socket-services",
			transports: ["websocket"],
		});
		this.socket.emit("registerUser", {
			userId: "5a1514d5-bfc4-46be-b11b-18e9a4652c4e",
		});
		this.socket.on("tripPath", (route: any) => {
			this.enable = true;
			this.pathIndex = 0;
			this.path = route.routes[0].geometry.coordinates;
		});
	}

	async startTrip(
		start: { latitude: number; longitude: number },
		end: { latitude: number; longitude: number },
	) {
		await this.socket.emitWithAck("startTrip", {
			origin: {
				latitude: start.latitude,
				longitude: start.longitude,
			},
			destination: {
				latitude: end.latitude,
				longitude: end.longitude,
			},
			priority: 3,
		});
	}

	startEmitingLocation(timespace: number) {
		if (!this.enable) {
			setTimeout(() => {
				this.startEmitingLocation(timespace);
			}, 2000);
			return;
		}
		if (this.pathIndex < this.path.length) {
			this.socket.emit("updateLocation", {
				latitude: this.path[this.pathIndex][1],
				longitude: this.path[this.pathIndex][0],
			});
			this.pathIndex = this.pathIndex + 1;
			setTimeout(() => {
				this.startEmitingLocation(timespace);
			}, timespace);
		} else {
			this.socket.emit("endTrip", {});
			setTimeout(() => {
				this.closeConnection();
			}, 5000);
		}
	}

	closeConnection() {
		this.socket.close();
	}
}
