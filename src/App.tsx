/* eslint-disable @typescript-eslint/no-explicit-any */
import "./App.css";
import Map, { Layer, Marker } from "react-map-gl";
import { useContext } from "react";
import { SocketContext } from "./context/SocketContext";
const token = import.meta.env.VITE_MAPBOX_KEY;

function App() {
	const { usersLive, liveControllers } = useContext(SocketContext)!;
	const colors: any = {
		"0": "#0090AF",
		"1": "#276B07",
		"2": "#CCAB00",
		"3": "#9E0606",
	};

	return (
		<div className='container'>
			<div className='map-container'>
				<Map
					mapLib={import("mapbox-gl")}
					initialViewState={{
						longitude: -47.061312,
						latitude: -22.917846,
						zoom: 10,
					}}
					mapboxAccessToken={token}
					style={{ width: "100%", height: "100%" }}
					mapStyle='mapbox://styles/mapbox/streets-v9'
				>
					<>
						<Layer type='line' paint={{}} />
						{console.log(usersLive)}
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
							Object.values(liveControllers).map((controller, index) => (
								<>
									<Marker
										longitude={controller!.longitude ?? 0}
										latitude={controller!.latitude ?? 0}
										anchor='bottom'
									>
										<div
											className='controller'
											style={{
												backgroundColor: index === 0 ? "#E30000" : "#ec5c08",
											}}
										/>
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
			<p>'TEEE'</p>
		</div>
	);
}

export default App;
