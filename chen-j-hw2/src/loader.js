import * as main from "./main.js";

window.onload = async ()=>{
	console.log("window.onload called");


	const select = document.querySelector("#select-track");
	const response = await fetch("data/av-data.json");
	const data = await response.json();

	// Set the title of the page
	document.title = data.title;

	// Load the tracks into the select
	for (let track of data.data) {
		let option = document.createElement("option");
		option.value = track.path;
		option.innerHTML = track.name;
		select.appendChild(option);
	}
	
	// 2 - start up app
	main.init();
}