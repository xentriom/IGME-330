import * as main from "./main.js";

window.onload = async ()=>{
	// preload data and set title
	const data = await main.preload();
	document.title = data.title;
	
	main.init();
}