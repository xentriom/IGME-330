import * as main from "./main.js";

window.onload = async ()=>{
	const data = await main.preload();
	document.title = data.title;
	
	main.init();
}