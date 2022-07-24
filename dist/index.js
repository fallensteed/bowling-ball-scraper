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
const getRawData = (url) => {
    return fetch(url)
        .then((response) => response.text())
        .then((data) => {
        return data;
    });
};
const url = "https://www.stormbowling.com/storm-balls";
const getStormBallList = () => __awaiter(void 0, void 0, void 0, function* () {
    const stormBallListRawData = yield getRawData(url);
    const $ = cheerio.load(stormBallListRawData);
    const productTiles = $("#ProductTiles .product-tile .title");
    console.log(productTiles.text());
});
getStormBallList();
