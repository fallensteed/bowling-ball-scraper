import * as cheerio from "cheerio";
import { formatDateWithoutTimezone, getRawData } from "../common/functions.js";
import { BallModel, CoreType, CoverType } from "../common/interfaces.js";
import { hammerURL } from "./urls.js";
import { BallSpecs } from "../common/interfaces";

export const getHammerBallDetails = async (
	ball: BallModel
): Promise<BallModel> => {
	if (ball.url) {
		const hammerBallDetailRawData = await getRawData(ball.url);
		const $ = cheerio.load(hammerBallDetailRawData);

		
        // get description
		const description = $("p").first().next().text();
		if (description && description.slice(0, 1) !== "\n")
			ball.description = description;
		
		// get image url
        const imageElement = $(".photo-zoom-link__initial")
        const imageURLDirty = imageElement.attr("data-src")
        const width = "720"
        const imageURLFixedWidth = imageURLDirty?.replace("{width}", width)
        const imageURLClean = imageURLFixedWidth?.replace("//", "https://")
        if (imageURLClean) ball.imageUrl = imageURLClean

        const descriptions = $(".product-single__description ul li")
        descriptions.each((i, el) => {
            const strongText = $("strong", el).text()
            const spanText = $("span", el).text()
            console.log(strongText)
            if (strongText.match(/part number/gi)) {ball.companyBallId = spanText.trim()}
            else if (strongText.match(/color/gi)) {ball.color = spanText.trim()}
            else if (strongText.match(/coverstock/gi)) {ball.coverName = spanText.trim()}
            else if (strongText.match(/core/gi)) {ball.coreName = spanText.trim()}
        })

		// // get item number
        // const partNumberEl = $(".product-single__description ul li").first().next().text()
        // const partNumber = partNumberEl.slice(13).trim()
        // if (partNumber) ball.companyBallId = partNumber

		// // get release date (n/a)

		// // get color
        // const colorEl = $(".product-single__description ul li").first().next().next().text()
        // const color = colorEl.slice(6).trim()
        

		// setup core/cover details

		// get core name

		// get core type

		// get cover name

		// get cover type

		// get factory finish

		// get specs
	}
	return ball;
};
