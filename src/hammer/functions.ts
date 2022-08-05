import * as cheerio from "cheerio";
import pretty from "pretty";
import { BallModel } from "../common/interfaces.js";
import { hammerBallsURL, hammerURL } from "./urls.js";
import { getRawData } from "../common/functions.js";
// import {  } from "./conversions.js";

export const getHammereBallList = async () => {
	const hammerBallListRawData = await getRawData(hammerBallsURL);
	const $ = cheerio.load(hammerBallListRawData);
	const collection = $(".grid--collection grid-product");
	const hammerBallList: BallModel[] = [];
	collection.each((i, el) => {
        console.log(el.name)
		const ballName = pretty(
			$(".grid-product__meta grid-product__title", el).text()
		);
        console.log(ballName)
		if (ballName)
			hammerBallList.push({ name: ballName, companyName: "Hammer" });
	});
	// collection.each((i, el) => {
	// 	const ballUrl = $(".grid-product__link", el).first().prop("href");
    //     console.log(ballUrl)
	// 	hammerBallList[i].url = hammerURL + ballUrl;
	// });
	// for (let i = 0; i < hammerBallList.length; i++) {
	// 	hammerBallList[i] = await gethammerBallDetails(hammerBallList[i]);
	// }
	return hammerBallList;
};
