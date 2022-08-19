import * as cheerio from "cheerio";
import pretty from "pretty";
import { BallModel } from "../common/interfaces.js";
import { columbiaBallURL, columbiaURL } from "./urls.js";
import { getRawData } from "../common/functions.js";
import { prototype } from "events";
import { getColumbiaBallDetails } from "./conversions.js";

export const getColumbiaBallList = async () => {
	const columbiaBallListRawData = await getRawData(columbiaBallURL);
	const $ = cheerio.load(columbiaBallListRawData);
	const collection = $(".grid--uniform .grid__item");
	const columbiaBallList: BallModel[] = [];
	collection.each((i, el) => {
		let ballName = pretty($(".grid-product__title", el).text());
		ballName = ballName.replace(/™/, "");
		const ballURLElements = $(
			".grid-product__content > .grid-product__link",
			el
		);
		const ballURL = columbiaURL + ballURLElements.attr("href");
		if (ballName && ballURL)
			columbiaBallList.push({
				name: ballName,
				companyName: "columbia",
				url: ballURL,
			});
	});
	
	for (let i = 0; i < columbiaBallList.length; i++) {
		columbiaBallList[i] = await getColumbiaBallDetails(columbiaBallList[i]);
	}
	return columbiaBallList;
};
