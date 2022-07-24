import fetch from "node-fetch";
import * as cheerio from "cheerio";

const getRawData = (url: string) => {
	return fetch(url)
		.then((response) => response.text())
		.then((data) => {
			return data;
		});
};

const url = "https://www.stormbowling.com/storm-balls";

const getStormBallList = async () => {
	const stormBallListRawData = await getRawData(url);
	const $ = cheerio.load(stormBallListRawData)
    const productTiles = $("#ProductTiles .product-tile .title")
    console.log(productTiles.text())
};

getStormBallList();
