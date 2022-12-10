import * as cheerio from "cheerio";
import { formatDateWithoutTimezone, getRawData } from "../common/functions.js";
import { BallModel, CoreType, CoverType } from "../common/interfaces.js";
import { trackURL } from "./urls.js";
import { BallSpecs } from "../common/interfaces";

export const getTrackBallDetails = async (
	ball: BallModel
): Promise<BallModel> => {
	if (ball.url) {
		const trackBallDetailRawData = await getRawData(ball.url);
		const $ = cheerio.load(trackBallDetailRawData);
		const specs: BallSpecs[] = [];

		// get description
		const description = $("p.p1").first().text().trim();
		// if (description && description.slice(0, 1) !== "\n")

		if (!description.match(/specifications/i) && description !== "") {
			ball.description = description;
		}

		// get image url
		const imageElement = $(".photoswipe__image");
		const imageURLDirty = imageElement.attr("data-src");
		const width = "720";
		const imageURLFixedWidth = imageURLDirty?.replace("{width}", width);
		const imageURLClean = imageURLFixedWidth?.replace("//", "https://");
		if (imageURLClean) ball.imageUrl = imageURLClean;

		const specifications = $(".product-block table tr");
		specifications.each((i, el) => {
			const firstTd = $(el).children().first().text();
			const secondTd = $(el).children().next().text();
			if (firstTd.match(/part number/gi)) {
				ball.companyBallId = secondTd.trim();
			} else if (firstTd.match(/color/gi)) {
				ball.color = secondTd.trim();
			} else if (firstTd.match(/coverstock/gi)) {
				ball.coverName = secondTd.trim();
			} else if (firstTd.match(/core/gi)) {
				ball.coreName = secondTd.trim();
			} else if (firstTd.match(/cover type/gi)) {
				if (secondTd.match(/pearl.*reactive/gi)) {
					ball.coverType = "pearl reactive";
				} else if (secondTd.match(/hybrid.*reactive/gi)) {
					ball.coverType = "hybrid reactive";
				} else if (secondTd.match(/solid.*reactive/gi)) {
					ball.coverType = "solid reactive";
				} else if (secondTd.match(/pearl.*urethane/gi)) {
					ball.coverType = "pearl urethane";
				} else if (secondTd.match(/solid.*urethane/gi)) {
					ball.coverType = "solid urethane";
				} else if (secondTd.match(/poly/gi)) {
					ball.coverType = "polyurethane";
				} else {
					ball.coverType = "unknown";
				}
			} else if (firstTd.match(/finish/gi)) {
				ball.factoryFinish = secondTd.trim();
			} else if (firstTd.match(/weight/gi)) {
				if (secondTd.match(/asy/gi)) {
					ball.coreType = "asymmetrical";
				} else {
					ball.coreType = "symmetrical";
				}
			} else if (firstTd.match(/[0-9][0-9]/g)) {
				const weight = parseInt(firstTd);
				const rg = parseFloat($(el).children().first().next().text());
				const diff = parseFloat(
					$(el).children().first().next().next().text()
				);
				let intDiff = null;
				if ($(el).children().first().next().next().next().text()) {
					intDiff = parseFloat(
						$(el).children().first().next().next().next().text()
					);
					ball.coreType = "asymmetrical";
				}
				if (weight && rg && diff)
					specs.push({
						weight: weight,
						rg: rg,
						diff: diff,
						intDiff: intDiff,
					});
			}
			ball.specs = specs;
		});
	}
	return ball;
};
