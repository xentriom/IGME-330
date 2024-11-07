import * as main from "./main.js";

const load = async () => {
	const data = await main.preload();
	document.title = data.title;

	main.init();
}

load();