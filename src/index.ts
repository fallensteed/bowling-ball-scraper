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

const stormURL = "https://www.stormbowling.com/storm-balls";

type CoreType = "symmetrical" | "asymmetrical";
type CoverType =
	| "urethane solid"
	| "urethane pearl"
	| "solid reactive"
	| "hybrid reactive"
	| "pearl reactive";
interface BallModel {
	name: string;
	companyName: string;
	url?: string;
	companyBallId?: string;
	imageUrl?: string;
	releaseDate?: Date;
	factoryFinish?: string;
	coreType?: CoreType;
	coreName?: string;
	coverType?: CoverType;
	coverName?: string;
}

const ballList: BallModel[] = [];

const getStormBallList = async () => {
	const stormBallListRawData = await getRawData(stormURL);
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

	// stormBallList.forEach(async (ball) => {
	//     if (ball.url) {
	//         const stormBallDetailRawData = await getRawData(ball.url)
	//         const $ = cheerio.load(stormBallDetailRawData)
	//         const span = $("p")
	//         span.each((i, el) => {
	//             if ($("p", el).text().includes("Release Date")) console.log( $("p", el).text())
	//         })
	//     }
	// })
	stormBallList.forEach((ball) => ballList.push(ball));
    getBallDetailsTestFunction(ballList[0])
};

const getBallDetailsTestFunction = async (ball: BallModel) => {
	if (ball.url) {
		const stormBallDetailRawData = await getRawData(ball.url);
		const $ = cheerio.load(stormBallDetailRawData);
		const span = $(".product-detail > .row-fluid > .span4");
        console.log(span.html())
		// span.each((i, el) => {
		// 	if ($("p", el).text().includes("Release Date"))
		// 		console.log($("p", el).text());
		// });
	}
};

getStormBallList();
