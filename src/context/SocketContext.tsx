import { createContext, useEffect, useMemo, useState } from "react";
import io, { Socket } from "socket.io-client";
import { ControllerSocket } from "../services/controllerSocket";
import { NavigationSocket } from "../services/navigationSocket";

interface ISocketProvider {
	children: React.ReactNode;
}

export interface SocketState {
	controllerSocket: Socket | null;
	navigationSocket: Socket | null;
	usersLive: models.IUserMapper | null;
	liveControllers: models.IControllerMapper | null;
}

export const SocketContext = createContext<SocketState | null>(null);

export const SocketProvider = (props: ISocketProvider) => {
	const [controllerSocketState, setControllerSocketState] =
		useState<Socket | null>(null);
	const [navigationSocketState, setNavigationSocketState] =
		useState<Socket | null>(null);

	const [usersLive, setUsersLive] = useState<models.IUserMapper | null>(null);
	const [liveControllers, setLiveControllers] =
		useState<models.IControllerMapper | null>(null);

	const socketConnect = () => {
		const controllerSocket = io(
			`${import.meta.env.VITE_SOCKET_API_URL}/controller`,
			{
				path: "/codigo3/socket-services",
				transports: ["websocket"],
			},
		);
		const navigationSocket = io(
			`${import.meta.env.VITE_SOCKET_API_URL}/navigation`,
			{
				path: "/codigo3/socket-services",
				transports: ["websocket"],
			},
		);

		navigationSocket.on("usersLocations", (data) => {
			setUsersLive(data);
		});
		controllerSocket.on("activeControllers", (data) => {
			setLiveControllers(data);
		});

		setNavigationSocketState(navigationSocket);
		setControllerSocketState(controllerSocket);
	};

	const getUsersLocation = () => {
		setTimeout(() => {
			navigationSocketState?.emit("getUsersLocations");
			getUsersLocation();
		}, 1000);
	};

	useEffect(() => {
		socketConnect();
	}, []);

	useEffect(() => {
		if (navigationSocketState) {
			getUsersLocation();
			// userTestClient();
		}
	}, [navigationSocketState]);

	useEffect(() => {
		if (controllerSocketState) {
			controllerSocketState?.emit("getControllers");
			new ControllerSocket("fatima1");
			new ControllerSocket("fatima2");
			new ControllerSocket("fatima3");
			new ControllerSocket("fatima4");
			new ControllerSocket("fatima5");
			new ControllerSocket("saudade1");
			new ControllerSocket("paulista1");
		}
	}, [controllerSocketState]);

	const values = useMemo(
		() => ({
			controllerSocket: controllerSocketState,
			navigationSocket: navigationSocketState,
			usersLive,
			liveControllers,
		}),
		[controllerSocketState, navigationSocketState, usersLive, liveControllers],
	);

	return (
		<SocketContext.Provider value={values}>
			{props.children}
		</SocketContext.Provider>
	);
};
