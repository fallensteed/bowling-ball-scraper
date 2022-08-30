import * as cheerio from "cheerio";
import pretty from "pretty";
import { BallModel } from "../common/interfaces.js";
import { hammerBallsURL, hammerURL } from "./urls.js";
import { getRawData } from "../common/functions.js";
import { getHammerBallDetails } from "./conversions.js";

export const getHammerBallList = async () => {
	const hammerBallListRawData = await getRawData(hammerBallsURL);
	const $ = cheerio.load(hammerBallListRawData);
	const collection = $(".grid--collection .grid__item");
	const hammerBallList: BallModel[] = [];
	collection.each((i, el) => {
		let ballName = pretty($(".grid-product__title", el).text());
		ballName = ballName.replace(/™/, "");
		const ballURLElements = $(
			".grid-product__content > .grid-product__link",
			el
		);
		const ballURL = hammerURL + ballURLElements.attr("href");
		if (ballName && ballURL)
			hammerBallList.push({
				name: ballName,
				companyName: "Hammer",
				url: ballURL,
			});
	});

	for (let i = 0; i < hammerBallList.length; i++) {
		hammerBallList[i] = await getHammerBallDetails(hammerBallList[i]);
	}
	return hammerBallList;
};
