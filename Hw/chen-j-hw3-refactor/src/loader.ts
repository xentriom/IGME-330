import * as main from "./main";

const load = async (): Promise<void> => {
	const data = await main.preload();
	document.title = data.title;

	main.init();
}

load();