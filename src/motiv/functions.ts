import * as cheerio from "cheerio";
import pretty from "pretty";
import { BallModel } from "../common/interfaces.js";
import { motivBallsURL, motivURL } from "./urls.js";
import { getRawData } from "../common/functions.js";
import { convertMotivURL, getMotivBallDetails } from "./conversions.js";

export const getMotiveBallList = async () => {
	const motivBallListRawData = await getRawData(motivBallsURL);
	const $ = cheerio.load(motivBallListRawData);
	const productIndex = $(".product-index ul li");
	const motivBallList: BallModel[] = [];
	productIndex.each((i, el) => {
		const ballName = pretty($(".title", el).text());
		if (ballName)
			motivBallList.push({ name: ballName, companyName: "Motiv" });
	});
	productIndex.each((i, el) => {
		const ballUrl = $("a", el).first().prop("href");
		motivBallList[i].url = motivURL + convertMotivURL(ballUrl as string);
	});
	for (let i = 0; i < motivBallList.length; i++) {
		motivBallList[i] = await getMotivBallDetails(motivBallList[i]);
	}
	return motivBallList;
};
