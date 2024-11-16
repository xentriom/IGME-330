import * as map from "./map.js";
import * as ajax from "./ajax.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let geojson;

// II. Functions
const setupUI = () => {
	// NYS Zoom 5.2
	document.querySelector("#btn1").onclick = () => {
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatUSA);
	};

	// NYS isometric view
	document.querySelector("#btn2").onclick = () => {
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45, 0);
		map.flyTo(lnglatUSA);
	};

	// World zoom 0
	document.querySelector("#btn3").onclick = () => {
		map.setZoomLevel(3);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatUSA);
	};

};

const showFeatureDetails = (id) => {
	const feature = getFeatureById(id);

	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;
	document.querySelector("#details-2").innerHTML = `
		<p><strong>Address:</strong> ${feature.properties.address}</p>
		<p><strong>Phone:</strong> <a href="tel:${feature.properties.phone}">${feature.properties.phone}</a></p>
		<p><strong>Website:</strong> <a href="${feature.properties.url}" target="_blank">${feature.properties.url}</a></p>
	`;
	document.querySelector("#details-3").innerHTML = feature.properties.description;
};

const getFeatureById = (id) => {
    return geojson.features.find(feature => feature.id === id);
};

const init = () => {
	map.initMap(lnglatNYS);
	setupUI();
	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		console.log(geojson);
		map.addMarkersToMap(geojson, showFeatureDetails);
		setupUI();
	});
};

init();