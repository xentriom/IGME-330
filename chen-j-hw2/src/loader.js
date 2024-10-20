import * as main from "./main.js";

window.onload = async ()=>{
	console.log("window.onload called");

	const data = await main.preload();

	// Set the title of the page
	document.title = data.title;
	
	// 2 - start up app
	main.init();
}