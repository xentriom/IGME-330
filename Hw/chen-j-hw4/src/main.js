import * as map from "./map.js";
import * as ajax from "./ajax.js";
import * as storage from "./storage.js";
import * as firebase from "./firebase.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let favoriteIds = ["p20", "p79", "p180", "p43"];
let geojson;

// II. Functions
const setupUI = () => {
	// NYS Zoom 5.2
	document.querySelector("#button-nys-zoom").onclick = () => {
		map.setZoomLevel(5.2);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatNYS);
	};

	// NYS isometric view
	document.querySelector("#button-nys-iso").onclick = () => {
		map.setZoomLevel(5.5);
		map.setPitchAndBearing(45, 0);
		map.flyTo(lnglatNYS);
	};

	// World zoom 0
	document.querySelector("#button-usa-zoom").onclick = () => {
		map.setZoomLevel(3);
		map.setPitchAndBearing(0, 0);
		map.flyTo(lnglatUSA);
	};

	// event listener for favourite and delete buttons
	document.querySelector("#details-2").addEventListener("click", (event) => {
		const button = event.target.closest("button");
		if (!button) return;

		const { id, action } = button.dataset;
		if (action === "favourite") {
			handleFavourite(id);
		} else if (action === "delete") {
			handleDelete(id);
		}
	});

	refreshFavorites();
};

const showFeatureDetails = (id) => {
	const feature = getFeatureById(id);

	// check if selected is favourited
	const favourited = storage.readFromLocalStorage().includes(id);

	// title
	document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;

	// address, phone, website, favourite, delete
	document.querySelector("#details-2").innerHTML = `
		<p><strong>Address:</strong> ${feature.properties.address}</p>
		<p><strong>Phone:</strong> <a href="tel:${feature.properties.phone}">${feature.properties.phone}</a></p>
		<p><strong>Website:</strong> <a href="${feature.properties.url}" target="_blank">${feature.properties.url}</a></p>
		${loadButtons(id, favourited)}
	`;

	// description
	document.querySelector("#details-3").innerHTML = feature.properties.description;
};

const getFeatureById = (id) => {
	return geojson.features.find(feature => feature.id === id);
};

const refreshFavorites = () => {
	const favoritesContainer = document.querySelector("#favorites-list");
	favoritesContainer.innerHTML = "";

	// get favourites from local storage
	const favourites = storage.readFromLocalStorage();

	for (const id of favourites) {
		favoritesContainer.appendChild(createFavoriteElement(id));
	}
};

const createFavoriteElement = (id) => {
	const feature = getFeatureById(id);
	const a = document.createElement("a");

	a.className = "panel-block";
	a.id = feature.id;

	a.onclick = () => {
		showFeatureDetails(a.id);
		map.setZoomLevel(6);
		map.flyTo(feature.geometry.coordinates);
	};

	a.innerHTML = `
		<span class="panel-icon">
			<i class="fas fa-map-pin"></i>
		</span>
		${feature.properties.title}
	`;
	return a;
};

const loadButtons = (id, favourited) => {
	return `
	<div class="buttons">
		<button data-id="${id}" data-action="favourite" class="button is-info" ${favourited ? "disabled" : ""}>
			<span class="icon"><i class="fas fa-star"></i></span>
			<span>Favourite</span>
		</button>
		<button data-id="${id}" data-action="delete" class="button is-danger" ${favourited ? "" : "disabled"}>
			<span class="icon"><i class="fas fa-trash"></i></span>
			<span>Delete</span>
		</button>
	</div>
	`;
};

const handleFavourite = (id) => {
	storage.writeToLocalStorage(String(id));
	firebase.updateLikeCount(String(id), true);
	showFeatureDetails(id);
	refreshFavorites();
};

const handleDelete = (id) => {
	storage.removeFromLocalStorage(String(id));
	firebase.updateLikeCount(String(id), false);
	showFeatureDetails(id);
	refreshFavorites();
};

const init = () => {
	map.initMap(lnglatNYS);
	firebase.initApp();
	ajax.downloadFile("data/parks.geojson", (str) => {
		geojson = JSON.parse(str);
		map.addMarkersToMap(geojson, showFeatureDetails);
		setupUI();
	});
};

init();