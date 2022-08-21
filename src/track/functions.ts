import * as cheerio from "cheerio";
import pretty from "pretty";
import { BallModel } from "../common/interfaces.js";
import { trackBallsURL, trackURL } from "./urls.js";
import { getRawData } from "../common/functions.js";
import { prototype } from "events";
import { getTrackBallDetails } from "./conversions.js";

export const getTrackBallList = async () => {
	const trackBallListRawData = await getRawData(trackBallsURL);
	const $ = cheerio.load(trackBallListRawData);
	const collection = $(".grid--uniform .grid__item");
	const trackBallList: BallModel[] = [];
	collection.each((i, el) => {
		let ballName = pretty($(".grid-product__title", el).text());
		ballName = ballName.replace(/™/, "");
		const ballURLElements = $(
			".grid-product__content > .grid-product__link",
			el
		);
		const ballURL = trackURL + ballURLElements.attr("href");
		if (ballName && ballURL)
			trackBallList.push({
				name: ballName,
				companyName: "track",
				url: ballURL,
			});
	});

	for (let i = 0; i < trackBallList.length; i++) {
		trackBallList[i] = await getTrackBallDetails(trackBallList[i]);
	}
	return trackBallList;
};
