/* eslint-disable @typescript-eslint/no-explicit-any */
import "./App.css";
import Map, { Marker } from "react-map-gl";
import { useContext, useEffect, useState } from "react";
import TrafficIcon from "./assets/ic_traffic.svg";
import DirectionsIcon from "./assets/ic_direction.svg";

import { SocketContext } from "./context/SocketContext";
import { NavigationSocket } from "./services/navigationSocket";
const token = import.meta.env.VITE_MAPBOX_KEY;

function App() {
	const { usersLive, liveControllers } = useContext(SocketContext)!;
	const [allControllers, setAllControllers] = useState<models.ControllerDB[]>(
		[],
	);
	const [inactiveControllers, setInactiveControllers] = useState<
		models.ControllerDB[]
	>([]);
	const colors: any = {
		"0": "#0090AF",
		"1": "#276B07",
		"2": "#CCAB00",
		"3": "#9E0606",
	};

	const clientAmFatPa = async () => {
		const data = new NavigationSocket();
		data.startTrip(
			{
				latitude: -22.747644,
				longitude: -47.298809,
			},
			{
				latitude: -22.731442,
				longitude: -47.318446,
			},
		);
		data.startEmitingLocation(1000);
	};

	const clientAmFatSdd = async () => {
		const data = new NavigationSocket();
		data.startTrip(
			{
				latitude: -22.747644,
				longitude: -47.298809,
			},
			{
				latitude: -22.733683,
				longitude: -47.326557,
			},
		);
		data.startEmitingLocation(1000);
	};

	const fetchAllControllers = async () => {
		const data = await fetch(
			`${import.meta.env.VITE_USER_API_URL}/controller`,
			{ method: "GET" },
		);
		const body = await data.json();

		setAllControllers(body as any);
	};

	useEffect(() => {
		fetchAllControllers();
	}, []);

	useEffect(() => {
		if (liveControllers && allControllers) {
			const allInactiveControllers = allControllers.filter((dbController) => {
				if (
					!Object.values(liveControllers).find(
						(live) =>
							live?.latitude === dbController.latitude &&
							live.longitude === dbController.longitude,
					)
				) {
					return true;
				}

				return false;
			});
			setInactiveControllers(allInactiveControllers);
		}
	}, [liveControllers]);

	return (
		<div className='container'>
			<div className='map-container'>
				<Map
					mapLib={import("mapbox-gl")}
					initialViewState={{
						longitude: -47.061312,
						latitude: -22.917846,
						zoom: 12,
					}}
					mapboxAccessToken={token}
					style={{ width: "100%", height: "100%" }}
					mapStyle='mapbox://styles/mapbox/streets-v9'
				>
					<>
						{!!usersLive &&
							Object.values(usersLive).map((loc) => (
								<>
									{loc?.currentLocation && (
										<Marker
											longitude={loc?.currentLocation?.longitude ?? 0}
											latitude={loc?.currentLocation?.latitude ?? 0}
											anchor='bottom'
										>
											<div
												className='dot'
												style={{
													backgroundColor: colors[loc.priority ?? 0],
												}}
											/>
										</Marker>
									)}
								</>
							))}
						{!!liveControllers &&
							Object.values(liveControllers).map((controller) => (
								<>
									<Marker
										longitude={controller!.longitude ?? 0}
										latitude={controller!.latitude ?? 0}
										anchor='bottom'
									>
										<div style={{ display: "flex", flexDirection: "row" }}>
											<div
												className='controller'
												style={{
													backgroundColor: controller?.interrupted
														? "#22801f"
														: "#ec5c08",
												}}
											>
												<img src={TrafficIcon} width={18} height={18} />
											</div>
											{controller?.interrupted &&
												controller?.bearingRequested && (
													<img
														src={DirectionsIcon}
														width={38}
														height={38}
														style={{
															rotate: `${controller?.bearingRequested}deg`,
														}}
													/>
												)}
										</div>
									</Marker>
								</>
							))}
						{inactiveControllers.map((controller) => (
							<>
								<Marker
									longitude={controller!.longitude ?? 0}
									latitude={controller!.latitude ?? 0}
									anchor='bottom'
								>
									<div style={{ display: "flex", flexDirection: "row" }}>
										<div
											className='controller'
											style={{
												backgroundColor: "#595959",
											}}
										>
											<img src={TrafficIcon} width={18} height={18} />
										</div>
									</div>
								</Marker>
							</>
						))}
					</>
					<Marker longitude={-100} latitude={40} anchor='top'>
						<div
							className='dot'
							style={{
								backgroundColor: colors[1],
							}}
						/>
					</Marker>
				</Map>
			</div>
			<button
				onClick={() => {
					clientAmFatPa();
				}}
			>
				Teste Americana NS.Fatima - Ardito
			</button>
			<button
				onClick={() => {
					clientAmFatSdd();
				}}
			>
				Teste Americana NS.Fatima - Saudade
			</button>
			<p>'TEEE'</p>
		</div>
	);
}

export default App;
