import * as cheerio from "cheerio";
import pretty from "pretty";
import { BallModel } from "../common/interfaces.js";
import { eboniteBallURL, eboniteURL } from "./urls.js";
import { getRawData } from "../common/functions.js";
import { prototype } from "events";
import { getEboniteBallDetails } from "./conversions.js";
// import {  } from "./conversions.js";

export const getEboniteBallList = async () => {
	const eboniteBallListRawData = await getRawData(eboniteBallURL);
	const $ = cheerio.load(eboniteBallListRawData);
	const collection = $(".grid--uniform .grid__item");
	const eboniteBallList: BallModel[] = [];
	collection.each((i, el) => {
		let ballName = pretty($(".grid-product__title", el).text());
		ballName = ballName.replace(/™/, "");
		const ballURLElements = $(
			".grid-product__content > .grid-product__link",
			el
		);
		const ballURL = eboniteURL + ballURLElements.attr("href");
		if (ballName && ballURL)
			eboniteBallList.push({
				name: ballName,
				companyName: "Ebonite",
				url: ballURL,
			});
	});
	
	for (let i = 0; i < eboniteBallList.length; i++) {
		eboniteBallList[i] = await getEboniteBallDetails(eboniteBallList[i]);
	}
	return eboniteBallList;
};
