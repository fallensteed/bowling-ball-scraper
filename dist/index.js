var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import fetch from "node-fetch";
import * as cheerio from "cheerio";
import pretty from "pretty";
const getRawData = (url) => {
    return fetch(url)
        .then((response) => response.text())
        .then((data) => {
        return data;
    });
};
const stormURL = "https://www.stormbowling.com/storm-balls";
const ballList = [];
const getStormBallList = () => __awaiter(void 0, void 0, void 0, function* () {
    const stormBallListRawData = yield getRawData(stormURL);
    const $ = cheerio.load(stormBallListRawData);
    const productTiles = $(".product-tile");
    const stormBallList = [];
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
    getBallDetailsTestFunction(ballList[0]);
});
const getBallDetailsTestFunction = (ball) => __awaiter(void 0, void 0, void 0, function* () {
    if (ball.url) {
        const stormBallDetailRawData = yield getRawData(ball.url);
        const $ = cheerio.load(stormBallDetailRawData);
        const span = $(".product-detail > .row-fluid > .span4");
        console.log(span.html());
        // span.each((i, el) => {
        // 	if ($("p", el).text().includes("Release Date"))
        // 		console.log($("p", el).text());
        // });
    }
});
getStormBallList();
