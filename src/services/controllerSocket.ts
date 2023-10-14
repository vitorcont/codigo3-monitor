import { io, Socket } from "socket.io-client";

export class ControllerSocket {
	private socket: Socket;

	constructor(token: string) {
		this.socket = io(
			`https://conti-server.com.br/codigo3/socket-services/controller`,
			{
				path: "/codigo3/socket-services",
				transports: ["websocket"],
			},
		);
		this.socket.on("success", () => {
			this.socket.emit("syncController", { token });
		});
	}

	closeConnection() {
		this.socket.close();
	}
}
