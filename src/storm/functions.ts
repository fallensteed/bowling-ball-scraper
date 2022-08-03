import * as cheerio from "cheerio";
import pretty from "pretty";
import { BallModel } from "../common/interfaces.js";
import { stormBallsURL, stormURL, rgBallsURL, globalBallsURL } from "./urls.js";
import { getRawData } from "../common/functions.js";
import { getStormBallDetails } from "./conversions.js";

export const getStormBallList = async () => {
	const stormBallListRawData = await getRawData(stormBallsURL);
	const $ = cheerio.load(stormBallListRawData);
	const productTiles = $(".product-tile");
	const stormBallList: BallModel[] = [];
	productTiles.each((i, el) => {
		const ballName = pretty($(".title", el).text());
		if (ballName)
			stormBallList.push({ name: ballName, companyName: "Storm" });
	});
	productTiles.each((i, el) => {
		const ballUrl = $("a", el).prop("href");
		stormBallList[i].url = stormURL + ballUrl;
	});
	for (let i = 0; i < stormBallList.length; i++) {
		stormBallList[i] = await getStormBallDetails(stormBallList[i]);
	}
	return stormBallList;
};

export const getRGBallList = async () => {
	const rgBallListRawData = await getRawData(rgBallsURL);
	const $ = cheerio.load(rgBallListRawData);
	const productTiles = $(".product-tile");
	const rgBallList: BallModel[] = [];
	productTiles.each((i, el) => {
		const ballName = pretty($(".title", el).text());
		if (ballName)
			rgBallList.push({ name: ballName, companyName: "Roto Grip" });
	});
	productTiles.each((i, el) => {
		const ballUrl = $("a", el).prop("href");
		rgBallList[i].url = stormURL + ballUrl;
	});
	for (let i = 0; i < rgBallList.length; i++) {
		rgBallList[i] = await getStormBallDetails(rgBallList[i]);
	}
	return rgBallList;
};

export const getGlobalBallList = async () => {
	const globalBallListRawData = await getRawData(globalBallsURL);
	const $ = cheerio.load(globalBallListRawData);
	const productTiles = $(".product-tile");
	const globalBallList: BallModel[] = [];
	productTiles.each((i, el) => {
		const ballName = pretty($(".title", el).text());
		if (ballName)
			globalBallList.push({ name: ballName, companyName: "900 Global" });
	});
	productTiles.each((i, el) => {
		const ballUrl = $("a", el).prop("href");
		globalBallList[i].url = stormURL + ballUrl;
	});
	for (let i = 0; i < globalBallList.length; i++) {
		globalBallList[i] = await getStormBallDetails(globalBallList[i]);
	}
	return globalBallList;
};
