export const makeGeoJSON = (
	data: {
		name: string;
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
					id: feature.name,
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
