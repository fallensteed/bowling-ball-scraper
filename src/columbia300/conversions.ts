import * as cheerio from "cheerio";
import { formatDateWithoutTimezone, getRawData } from "../common/functions.js";
import { BallModel, CoreType, CoverType } from "../common/interfaces.js";
import { columbiaURL } from "./urls.js";
import { BallSpecs } from "../common/interfaces";
import { children } from "cheerio/lib/api/traversing.js";

export const getColumbiaBallDetails = async (
	ball: BallModel
): Promise<BallModel> => {
	if (ball.url) {
		const columbiaBallDetailRawData = await getRawData(ball.url);
		const $ = cheerio.load(columbiaBallDetailRawData);
		const specs: any[] = [];

		// get description
		const description = $("p.p1").text().trim();
		if (!description.match(/specifications/i) && description !== "") {
			ball.description = description;
		}

		// get image url
		const imageElement = $(".photo-zoom-link__initial");
		const imageURLDirty = imageElement.attr("data-src");
		const width = "720";
		const imageURLFixedWidth = imageURLDirty?.replace("{width}", width);
		const imageURLClean = imageURLFixedWidth?.replace("//", "https://");
		if (imageURLClean) ball.imageUrl = imageURLClean;

		const specifications = $(".product-single__description table tr");
		specifications.each((i, el) => {
			const firstTd = $(el).children().first().text();
			const secondTd = $(el).children().next().text();
			if (firstTd.match(/part number/gi)) {
				ball.companyBallId = secondTd.trim();
			} else if (firstTd.match(/color/gi)) {
				ball.color = secondTd.trim();
			} else if (firstTd.match(/coverstock/gi)) {
				ball.coverName = secondTd.trim();
				if (ball.coverName?.match(/poly/gi))
					ball.coverType = "polyurethane";
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
				} else {
					ball.coverType = "unknown";
				}
			} else if (firstTd.match(/finish/gi)) {
				ball.factoryFinish = secondTd.trim();
			}
		});
		ball.coreType = "symmetrical";
		if (ball.coverType !== "polyurethane") {
			let specTable = $("table").next();
			do {
				specTable = specTable.next();
			} while (!specTable.is("table"));
			specTable
				.children()
				.first()
				.each((i, el) => {
					const specTableRow = $("tr", el);
					const weight: number[] = [];
					const rg: number[] = [];
					const diff: number[] = [];
					let intDiff: number[] = [];
					specTableRow.each((i, el) => {
						let child = $(el).children().first();
						let count = 0;
						if (child.text().includes("RG")) {
							child = child.next();
							do {
								count++;
								rg.push(parseFloat(child.text()));
								child = child.next();
							} while (count < weight.length);
						} else if (child.text().includes("DIFF")) {
							child = child.next();
							do {
								count++;
								diff.push(parseFloat(child.text()));
								child = child.next();
							} while (count < weight.length);
						}
						if (child.text().includes("ASY")) {
							ball.coreType = "asymmetrical";
							child = child.next();
							do {
								count++;
								intDiff.push(parseFloat(child.text()));
								child = child.next();
							} while (count < weight.length);
						} else if (child.text().match(/\s/)) {
							child = child.next();
							do {
								weight.push(parseInt(child.text()));
								child = child.next();
							} while (child.text().match(/lb/gi));
						}
					});

					for (let i = 0; i < weight.length; i++) {
						specs.push({
							weight: weight[i],
							rg: rg[i],
							diff: diff[i],
							intDiff: intDiff[i] ? intDiff[i] : null,
						});
					}
					ball.specs = specs;
				});
		}
	}
	console.log(ball);
	return ball;
};
