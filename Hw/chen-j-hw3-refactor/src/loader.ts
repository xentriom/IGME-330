import * as main from "./main";

const load = async (): Promise<void> => {
	const data = await main.preload();
	document.title = data.title;

	try {
		main.init();
	}
	catch {
		// ignore
	}
}

load();