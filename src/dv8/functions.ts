import * as cheerio from "cheerio";
import pretty from "pretty";
import { BallModel } from "../common/interfaces.js";
import { getRawData } from "./../common/functions.js";
import { getDV8BallDetails } from "./conversions.js";
import { dv8BallURL } from "./urls.js";

export const getDV8BallList = async () => {
	const dv8BallListRawData = await getRawData(dv8BallURL);
	const $ = cheerio.load(dv8BallListRawData);
	const entries = $(".c-tile--product");
	const dv8BallList: BallModel[] = [];
	entries.each((i, el) => {
		let ballName = pretty($(".c-tile__meta-title", el).first().text());
        ballName = ballName.replace(/™/, "");
		const ballURL = $(".c-tile__overlay a", el).attr("href");
		const ballImage = $(".c-tile__media img").attr("src");
		if (ballName && ballURL)
			dv8BallList.push({
				name: ballName,
				companyName: "DV8",
				url: ballURL,
				imageUrl: ballImage,
			});
	});

    for (let i = 0; i < dv8BallList.length; i++) {
		dv8BallList[i] = await getDV8BallDetails(dv8BallList[i]);
	}

	return dv8BallList;
};
