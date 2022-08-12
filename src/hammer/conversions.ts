import * as cheerio from "cheerio";
import { formatDateWithoutTimezone, getRawData } from "../common/functions.js";
import { BallModel, CoreType, CoverType } from "../common/interfaces.js";
import { hammerURL } from "./urls.js";
import { BallSpecs } from "../common/interfaces";

export const getHammerBallDetails = async (
	ball: BallModel
): Promise<BallModel> => {
	if (ball.url) {
        console.log("Ball Name:", ball.name)
		const hammerBallDetailRawData = await getRawData(ball.url);
		const $ = cheerio.load(hammerBallDetailRawData);

		// get description
		const description = $("p").first().next().text();
		if (description && description.slice(0, 1) !== "\n")
			ball.description = description;

		// get image url
		const imageElement = $(".photo-zoom-link__initial");
		const imageURLDirty = imageElement.attr("data-src");
		const width = "720";
		const imageURLFixedWidth = imageURLDirty?.replace("{width}", width);
		const imageURLClean = imageURLFixedWidth?.replace("//", "https://");
		if (imageURLClean) ball.imageUrl = imageURLClean;

		const descriptions = $(".product-single__description ul li");
		descriptions.each((i, el) => {
			const strongText = $("strong", el).text();
			const spanText = $("span", el).text();
			if (strongText.match(/part number/gi)) {
                console.log("strongText:", strongText)
                console.log("spanText:", spanText)
				ball.companyBallId = spanText.trim();
			} else if (strongText.match(/color/gi)) {
				ball.color = spanText.trim();
			} else if (strongText.match(/coverstock/gi)) {
				ball.coverName = spanText.trim();
			} else if (strongText.match(/core type/gi)) {
                console.log("strongText:", strongText)
                console.log("spanText:", spanText)
				ball.coreType = spanText.trim().match(/asymmetric/gi)
					? "asymmetrical"
					: "symmetrical";
			} else if (strongText.match(/core/gi)) {
				ball.coreName = spanText.trim();
			} else if (strongText.match(/cover type/gi)) {
                console.log("strongText:", strongText)
                console.log("spanText:", spanText)
				switch (spanText.trim()) {
					case "Pearl Reactive":
						ball.coverType = "pearl reactive";
					case "Hybrid Reactive":
						ball.coverType = "hybrid reactive";
					case "Solid Reactive":
						ball.coverType = "solid reactive";
					case "Pearl Urethane":
						ball.coverType = "pearl urethane";
					case "Solid Urethane":
						ball.coverType = "solid urethane";
					case "Polyester":
						ball.coverType = "polyurethane";
					default:
						ball.coverType = "other";
				}
			} else if (strongText.match(/finish/gi)) {
				ball.factoryFinish = spanText.trim();
			}
		});

		const specs: BallSpecs[] = [];
		const specsEl = $(".spec-weights li");
		specsEl.each((i, el) => {
			const text = $(el).text();
			const weight = parseInt(text.slice(0, 3));
			const rgStart = text.indexOf("(");
			const rgEnd = text.indexOf(")");
			const rg = parseFloat(text.substring(rgStart + 1, rgEnd));
			const diffStart = text.indexOf("(", rgEnd);
			const diffEnd = text.indexOf(")", diffStart);
			const diff = parseFloat(text.substring(diffStart + 1, diffEnd));
			let intDiff = null;
			if (text.match(/asy/gi)) {
				const asyStart = text.indexOf("(", diffEnd);
				const asyEnd = text.indexOf(")", asyStart);
				const asy = text.substring(asyStart + 1, asyEnd);
				intDiff = parseFloat(asy);
			}
			specs.push({
				weight: weight,
				rg: rg,
				diff: diff,
				intDiff: intDiff,
			});
		});
		ball.specs = specs;
	}
	return ball;
};
