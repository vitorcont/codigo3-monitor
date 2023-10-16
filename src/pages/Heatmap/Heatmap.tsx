/* eslint-disable @typescript-eslint/no-explicit-any */
import "./Heatmap.css";
import MapGL, { Source, Layer } from "react-map-gl";
import { useEffect, useState } from "react";
import { heatmapLayer } from "./map-styles";
import { dateDiff } from "../../services/date";
import { makeGeoJSON } from "../../services/mapMasks";

const token = import.meta.env.VITE_MAPBOX_KEY;

function Heatmap() {
	const [travels, setTravels] = useState(null);
	const fetchAllTravels = async () => {
		const data = await fetch(`${import.meta.env.VITE_USER_API_URL}/travel`, {
			method: "GET",
		});
		const body: models.ITravel[] = await data.json();
		const preFeature = body.map((travel, index) => {
			const timeDiff = Math.ceil(dateDiff(travel.departedAt, travel.arrivedAt));

			const array = [];
			for (let i = 0; i < timeDiff; i++) {
				array.push({
					name: `Feature ${index + 1 + i}`,
					longitude: travel.destinationLatitude,
					latitude: travel.destinationLongitude,
					value: 10,
				});
			}
			return array;
		});

		console.log(preFeature);
		const treated = makeGeoJSON(preFeature.flat());
		setTravels(treated);
	};

	useEffect(() => {
		/* global fetch */
		fetch("https://docs.mapbox.com/mapbox-gl-js/assets/earthquakes.geojson")
			.then((resp) => resp.json())
			.then((json) => {
				// Note: In a real application you would do a validation of JSON data before doing anything with it,
				// but for demonstration purposes we ingore this part here and just trying to select needed data...
				console.log(json);
				setTravels(json);
			})
			.catch((err) => console.error("Could not load data", err)); // eslint-disable-line
	}, []);

	useEffect(() => {
		// fetchAllTravels();
	}, []);

	return (
		<div className='container'>
			<div className='map-container'>
				<MapGL
					mapLib={import("mapbox-gl")}
					initialViewState={{
						longitude: -47.061312,
						latitude: -22.917846,
						zoom: 12,
					}}
					mapboxAccessToken={token}
					style={{ width: "100%", height: "100%" }}
					// mapStyle='mapbox://styles/mapbox/streets-v9'
					mapStyle='mapbox://styles/mapbox/dark-v9'
				>
					<>
						{travels && (
							<Source type='geojson' data={travels}>
								<Layer {...heatmapLayer} />
							</Source>
						)}
					</>
				</MapGL>
			</div>
			<div className='sim-wrapper'></div>
		</div>
	);
}

export default Heatmap;
