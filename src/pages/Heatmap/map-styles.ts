import type { HeatmapLayer } from "react-map-gl";

const MAX_ZOOM_LEVEL = 18;

export const heatmapLayer: HeatmapLayer = {
	id: "heatmap",
	maxzoom: MAX_ZOOM_LEVEL,
	type: "heatmap",
	paint: {
		// Increase the heatmap weight based on frequency and property magnitude
		"heatmap-weight": ["interpolate", ["linear"], ["get", "mag"], 0, 0, 6, 1],
		// Increase the heatmap color weight weight by zoom level
		// heatmap-intensity is a multiplier on top of heatmap-weight
		"heatmap-intensity": [
			"interpolate",
			["linear"],
			["zoom"],
			0,
			1,
			MAX_ZOOM_LEVEL,
			2,
		],
		// Color ramp for heatmap.  Domain is 0 (low) to 1 (high).
		// Begin color ramp at 0-stop with a 0-transparancy color
		// to create a blur-like effect.
		//!
		"heatmap-color": [
			"interpolate",
			["linear"],
			["heatmap-density"],
			0,
			"rgba(33,102,172,0)",
			1,
			"rgb(103,169,207)",
			3,
			"rgb(209,229,240)",
			5,
			"rgb(253,219,199)",
			10,
			"rgb(239,138,98)",
			20,
			"rgb(255,201,101)",
		],
		//!
		// Adjust the heatmap radius by zoom level
		"heatmap-radius": [
			"interpolate",
			["linear"],
			["zoom"],
			0,
			2,
			MAX_ZOOM_LEVEL,
			10,
		],
		// Transition from heatmap to circle layer by zoom level
		"heatmap-opacity": [
			"interpolate",
			["linear"],
			["zoom"],
			7,
			1,
			MAX_ZOOM_LEVEL,
			1,
		],
	},
};