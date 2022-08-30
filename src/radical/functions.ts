import * as cheerio from "cheerio";
import pretty from "pretty";
import { BallModel } from "../common/interfaces.js";
import { getRawData } from "../common/functions.js";
import { getRadicalBallDetails } from "./conversions.js";
import { radicalBallURL } from "./urls.js";

export const getRadicalBallList = async () => {
	const radicalBallListRawData = await getRawData(radicalBallURL);
	const $ = cheerio.load(radicalBallListRawData);
	const entries = $(".c-tile--product");
	const radicalBallList: BallModel[] = [];
	entries.each((i, el) => {
		let ballName = pretty($(".c-tile__meta-title", el).first().text());
        ballName = ballName.replace(/™/, "");
		const ballURL = $(".c-tile__overlay a", el).attr("href");
		const ballImage = $(".c-tile__media img").attr("src");
		if (ballName && ballURL)
			radicalBallList.push({
				name: ballName,
				companyName: "radical",
				url: ballURL,
				imageUrl: ballImage,
			});
	});

    for (let i = 0; i < radicalBallList.length; i++) {
		radicalBallList[i] = await getRadicalBallDetails(radicalBallList[i]);
	}

	return radicalBallList;
};
