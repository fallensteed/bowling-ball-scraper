import fetch from "node-fetch";
import * as cheerio from "cheerio";
import pretty from "pretty";

const getRawData = (url: string) => {
	return fetch(url)
		.then((response) => response.text())
		.then((data) => {
			return data;
		});
};

const stormURL = "https://www.stormbowling.com";
const stormBallsURL = "https://www.stormbowling.com/storm-balls";
const rgBallsURL = "https://www.stormbowling.com/roto-grip-balls";
const globalBallsURL = "https://www.stormbowling.com/900-global-balls";

type CoreType = "symmetrical" | "asymmetrical" | "other";
type CoverType =
	| "solid urethane"
	| "pearl urethane"
	| "solid reactive"
	| "hybrid reactive"
	| "pearl reactive"
	| "pearl polyester"
	| "other";
interface BallModel {
	name: string;
	companyName: string;
	url?: string;
	companyBallId?: string;
	imageUrl?: string;
	description?: string;
	color?: string;
	releaseDate?: Date;
	factoryFinish?: string;
	coreType?: CoreType;
	coreName?: string;
	coverType?: CoverType;
	coverName?: string;
}

const ballList: BallModel[] = [];

const getStormBallList = async () => {
	const stormBallListRawData = await getRawData(stormBallsURL);
	const $ = cheerio.load(stormBallListRawData);
	const productTiles = $(".product-tile");
	const stormBallList: BallModel[] = [];
	productTiles.each((i, el) => {
		const ballName = pretty($(".title", el).text());
		if (ballName)
			stormBallList.push({ name: ballName, companyName: "Storm" });
	});
	productTiles.each((i, el) => {
		const ballUrl = $("a", el).prop("href");
		stormBallList[i].url = stormURL + ballUrl;
	});
	for (let i = 0; i < stormBallList.length; i++) {
		stormBallList[i] = await getStormBallDetails(stormBallList[i]);
	}
	return stormBallList;
};

const getRGBallList = async () => {
	const rgBallListRawData = await getRawData(rgBallsURL);
	const $ = cheerio.load(rgBallListRawData);
	const productTiles = $(".product-tile");
	const rgBallList: BallModel[] = [];
	productTiles.each((i, el) => {
		const ballName = pretty($(".title", el).text());
		if (ballName)
			rgBallList.push({ name: ballName, companyName: "Roto Grip" });
	});
	productTiles.each((i, el) => {
		const ballUrl = $("a", el).prop("href");
		rgBallList[i].url = stormURL + ballUrl;
	});
	for (let i = 0; i < rgBallList.length; i++) {
		rgBallList[i] = await getStormBallDetails(rgBallList[i]);
	}
	return rgBallList;
};

const getGlobalBallList = async () => {
	const globalBallListRawData = await getRawData(globalBallsURL);
	const $ = cheerio.load(globalBallListRawData);
	const productTiles = $(".product-tile");
	const globalBallList: BallModel[] = [];
	productTiles.each((i, el) => {
		const ballName = pretty($(".title", el).text());
		if (ballName)
			globalBallList.push({ name: ballName, companyName: "900 Global" });
	});
	productTiles.each((i, el) => {
		const ballUrl = $("a", el).prop("href");
		globalBallList[i].url = stormURL + ballUrl;
	});
	for (let i = 0; i < globalBallList.length; i++) {
		globalBallList[i] = await getStormBallDetails(globalBallList[i]);
	}
	return globalBallList;
};

const getStormBallDetails = async (ball: BallModel): Promise<BallModel> => {
	if (ball.url) {
		const stormBallDetailRawData = await getRawData(ball.url);
		const $ = cheerio.load(stormBallDetailRawData);
		const image = $(".product-detail .product img");
		const imageURL = stormURL + image.attr("src");
		const description = $(".product-detail .span4 .productDescription")
			.next()
			.text();
		const releaseDateRaw = $(
			".product-detail .span4 .ejs-product-attributes"
		)
			.prev()
			.prev()
			.prev()
			.text();
		const rawDateValue = releaseDateRaw.split(": ")[1];
        console.log("ballname", ball.name)
        console.log("RAW", releaseDateRaw)
        console.log("Raw value", rawDateValue)
		let releaseDate;
		if (rawDateValue) {
			const cleanDate = stormCleanDate(rawDateValue);
			const dateWithTimezone = new Date(cleanDate);
			const timezoneOffset = dateWithTimezone.getTimezoneOffset() * 60000;
			releaseDate = new Date((dateWithTimezone as any) - timezoneOffset);
		}
        console.log("processed", releaseDate)
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
		// const weightblocks = $("#weightblocks").html()
		// console.log(weightblocks)
		ball.imageUrl = imageURL;
		ball.description = description;
		ball.color = color;
		if (releaseDate) ball.releaseDate = releaseDate;
		ball.companyBallId = ballId;
		ball.factoryFinish = factoryFinish;
		ball.coreType = coreType;
		ball.coverName = coverName;
		ball.coverType = coverType;
		return ball;
	} else {
		return ball;
	}
};

const stormCleanDate = (raw: string) => {
	const splitDate = raw.split(" ");
	splitDate[1].replace(/a-z/gi, "");
	return splitDate.join(" ");
};

const stormDetectFactoryFinish = (raw: string) => {
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

const stormDetectCoreType = (raw: string): CoreType => {
	if (raw.includes("asymmetrical")) {
		return "asymmetrical";
	} else if (raw.includes("symmetrical")) {
		return "symmetrical";
	} else {
		return "other";
	}
};

const stormDetectCover = (raw: string): [string, CoverType] => {
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

const getBallList = async () => {
	const stormBalls = await getStormBallList();
	stormBalls.forEach((ball) => ballList.push(ball));
	const rgBalls = await getRGBallList();
	rgBalls.forEach((ball) => ballList.push(ball));
	const globalBalls = await getGlobalBallList();
	globalBalls.forEach((ball) => ballList.push(ball));
	// console.log(ballList);
};

getBallList();
