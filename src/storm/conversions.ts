import * as cheerio from "cheerio";
import { formatDateWithoutTimezone, getRawData } from "../common/functions.js";
import { BallModel, CoreType, CoverType } from "../common/interfaces.js";
import { stormURL } from "./urls.js";
import { BallSpecs } from "./../common/interfaces";

export const getStormBallDetails = async (
	ball: BallModel
): Promise<BallModel> => {
	if (ball.url) {
		const stormBallDetailRawData = await getRawData(ball.url);
		const $ = cheerio.load(stormBallDetailRawData);
		const image = $(".product-detail .product img");
		const imageURL = stormURL + image.attr("src");
		const description = $(".product-detail .span4 .productDescription")
			.next()
			.text();
		let rawDate: null | string = null;
		let tryCount = 0;
		let htmlCheck = $(".product-detail .span4 .productDescription")
			.next()
			.next();
		do {
			tryCount++;
			const dateCheck = htmlCheck.text();
			if (
				dateCheck.match(/available/gi) ||
				dateCheck.match(/release/gi)
			) {
				rawDate = dateCheck.split(": ")[1];
			} else {
				htmlCheck = htmlCheck.next();
			}
		} while (rawDate === null && tryCount < 10);
		let releaseDate;
		if (rawDate) {
			const processedDate_1 = rawDate.replace(/th|st|nd|rd/gi, "");
			releaseDate = formatDateWithoutTimezone(processedDate_1);
		}
		const companyBallIdRaw = $(
			".product-detail .span4 .ejs-product-attributes > .attribute-title"
		).text();
		const ballId = companyBallIdRaw.split(": ")[1];
		const colorRaw = $(
			".product-detail .span4 .ejs-product-attributes div .color"
		).text();
		const color = colorRaw.split(": ")[1];
		const techSpecs = $(".spec-icon-div");
		const factoryFinishRaw = techSpecs.children().next().next().attr("src");
		const factoryFinish = stormDetectFactoryFinish(
			factoryFinishRaw as string
		);
		const coreTypeRaw = techSpecs
			.children()
			.next()
			.next()
			.next()
			.next()
			.attr("src");
		const coreType = stormDetectCoreType(coreTypeRaw as string);
		const coverRaw = techSpecs
			.children()
			.next()
			.next()
			.next()
			.next()
			.next()
			.attr("src");
		const coverAnalyzed = stormDetectCover(coverRaw as string);
		const coverName = coverAnalyzed[0];
		const coverType = coverAnalyzed[1];

		let weightLi = $("#weightblocks li");
		const specs: BallSpecs[] = [];
		let count = 0;
		do {
			const weight = parseInt(weightLi.attr("data-weight") as string);
			// console.log("weight children next first", weightLi.children().next().first().next().next().text())
			const rg = parseFloat(
				weightLi.children().next().first().next().next().next().text()
			);
			const diff = parseFloat(
				weightLi
					.children()
					.next()
					.first()
					.next()
					.next()
					.next()
					.next()
					.next()
					.text()
			);
			let intDiff = null;
			if (weightLi.html()?.match(/psa/gi)) {
				intDiff = parseFloat(
					weightLi
						.children()
						.next()
						.first()
						.next()
						.next()
						.next()
						.next()
						.next()
						.next()
						.next()
						.text()
				);
			}
			specs.push({ weight: weight, rg: rg, diff: diff, intDiff: intDiff });
			weightLi = weightLi.next();
			count++;
		} while (weightLi.html());

		// console.log(weightblocks)
		ball.imageUrl = imageURL;
		ball.description = description;
		ball.color = color;
		if (!isNaN(releaseDate?.valueOf() as number))
			ball.releaseDate = releaseDate;
		ball.companyBallId = ballId;
		ball.factoryFinish = factoryFinish;
		ball.coreType = coreType;
		ball.coverName = coverName;
		ball.coverType = coverType;
		ball.specs = specs;
		return ball;
	} else {
		return ball;
	}
};

export const stormCleanDate = (raw: string) => {
	const splitDate = raw.split(" ");
	splitDate[1].replace(/a-z/gi, "");
	return splitDate.join(" ");
};

export const stormDetectFactoryFinish = (raw: string) => {
	if (raw.includes("1000") || raw.includes("1k")) {
		return "1000 Abralon";
	} else if (raw.includes("2000") || raw.includes("2k")) {
		return "2000 Abralon";
	} else if (raw.includes("3000") || raw.includes("3k")) {
		return "3000 Abralon";
	} else if (raw.includes("4k_fast")) {
		return "4K-Fast";
	} else if (raw.includes("4000") || raw.includes("4k")) {
		return "4000 Abralon";
	} else if (raw.includes("1500" && "Polished")) {
		return "1500 Grit Polish";
	} else if (raw.includes("3500" && "Polished")) {
		return "3500 Grit Polish";
	} else {
		return "Other";
	}
};

export const stormDetectCoreType = (raw: string): CoreType => {
	if (raw.includes("asymmetrical")) {
		return "asymmetrical";
	} else if (raw.includes("symmetrical")) {
		return "symmetrical";
	} else {
		return "other";
	}
};

export const stormDetectCover = (raw: string): [string, CoverType] => {
	let coverName = "";
	let coverType = "";
	const srcWithoutPng = raw.split(".")[0];
	const cover = srcWithoutPng.split("cover_")[1];
	coverName =
		cover.split("_")[0] !== "RG"
			? cover.split("_")[0]
			: cover.split("_")[1];
	coverType =
		cover.split("_")[0] !== "RG"
			? cover.split("_")[1]
			: cover.split("_")[2];
	switch (coverName) {
		case "controll":
			coverName = "Controll Urethane";
		case "r2x":
			coverName = "R2X";
		case "nex":
			coverName = "NeX";
		case "r3s":
			coverName = "R3S";
		case "r2s":
			coverName = "R2S";
		case "u1s":
			coverName = "U1S";
		case "reactor":
			coverName = "Reactor";
		case "poly":
			coverName = "Polyester";
	}
	if (coverType === "p" || coverType === "P") {
		coverType = "pearl reactive";
		if (coverName === "U1S") coverType = "pearl urethane";
		if (coverName === "Polyester") coverType = "pearl polyester";
	} else if (coverType === "h" || coverType === "H") {
		coverType = "hybrid reactive";
	} else {
		coverType = "solid reactive";
		if (coverName === "U1S") coverType = "solid urethane";
		if (coverName === "Controll Urethane") coverType = "solid urethane";
	}
	return [coverName, coverType as CoverType];
};
