export const makeGeoJSON = (
	data: {
		value: number;
		latitude: number;
		longitude: number;
	}[],
) => {
	return {
		type: "FeatureCollection",
		features: data.map((feature) => {
			return {
				type: "Feature",
				properties: {
					id: Math.ceil(Math.random() * 999999),
					value: feature.value,
				},
				geometry: {
					type: "Point",
					coordinates: [feature.latitude, feature.longitude],
				},
			};
		}),
	};
};
