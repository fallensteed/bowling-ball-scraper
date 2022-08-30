import * as cheerio from "cheerio";
import pretty from "pretty";
import { BallModel } from "../common/interfaces.js";
import { getRawData } from "../common/functions.js";
import { getBrunswickBallDetails } from "./conversions.js";
import { brunswickBallURL } from "./urls.js";

export const getBrunswickBallList = async () => {
	const brunswickBallListRawData = await getRawData(brunswickBallURL);
	const $ = cheerio.load(brunswickBallListRawData);
	const entries = $(".c-tile--product");
	const brunswickBallList: BallModel[] = [];
	entries.each((i, el) => {
		let ballName = pretty($(".c-tile__meta-title", el).first().text());
        ballName = ballName.replace(/™/, "");
		const ballURL = $(".c-tile__overlay a", el).attr("href");
		const ballImage = $(".c-tile__media img").attr("src");
		if (ballName && ballURL)
			brunswickBallList.push({
				name: ballName,
				companyName: "brunswick",
				url: ballURL,
				imageUrl: ballImage,
			});
	});

    for (let i = 0; i < brunswickBallList.length; i++) {
		brunswickBallList[i] = await getBrunswickBallDetails(brunswickBallList[i]);
	}

	return brunswickBallList;
};
