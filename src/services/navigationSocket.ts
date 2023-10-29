/* eslint-disable @typescript-eslint/no-explicit-any */
import { io, Socket } from "socket.io-client";

interface Location {
	latitude: number;
	longitude: number;
}

export class NavigationSocket {
	private socket: Socket;
	private pathIndex: number = 0;
	private enable = false;
	private path: number[][] = [];
	private destination: Location = {
		latitude: 0,
		longitude: 0,
	};
	private origin: Location = {
		latitude: 0,
		longitude: 0,
	};
	private startDate: Date = new Date();

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
		this.startDate = new Date();
		this.destination = end;
		this.origin = start;
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
				userId: "5a1514d5-bfc4-46be-b11b-18e9a4652c4e",
				origin: this.origin,
				destination: this.destination,
				currentLocation: {
					latitude: this.path[this.pathIndex][1],
					longitude: this.path[this.pathIndex][0],
				},
				priority: 3,
				startedAt: this.startDate,
				geometry: this.path,
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
