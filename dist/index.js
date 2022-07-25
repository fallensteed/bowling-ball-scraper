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
const stormURL = "https://www.stormbowling.com";
const stormBallsURL = "https://www.stormbowling.com/storm-balls";
const rgBallsURL = "https://www.stormbowling.com/roto-grip-balls";
const globalBallsURL = "https://www.stormbowling.com/900-global-balls";
const ballList = [];
const getStormBallList = () => __awaiter(void 0, void 0, void 0, function* () {
    const stormBallListRawData = yield getRawData(stormBallsURL);
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
    for (let i = 0; i < stormBallList.length; i++) {
        stormBallList[i] = yield getStormBallDetails(stormBallList[i]);
    }
    return stormBallList;
});
const getRGBallList = () => __awaiter(void 0, void 0, void 0, function* () {
    const rgBallListRawData = yield getRawData(rgBallsURL);
    const $ = cheerio.load(rgBallListRawData);
    const productTiles = $(".product-tile");
    const rgBallList = [];
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
        rgBallList[i] = yield getStormBallDetails(rgBallList[i]);
    }
    return rgBallList;
});
const getGlobalBallList = () => __awaiter(void 0, void 0, void 0, function* () {
    const globalBallListRawData = yield getRawData(globalBallsURL);
    const $ = cheerio.load(globalBallListRawData);
    const productTiles = $(".product-tile");
    const globalBallList = [];
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
        globalBallList[i] = yield getStormBallDetails(globalBallList[i]);
    }
    return globalBallList;
});
const getStormBallDetails = (ball) => __awaiter(void 0, void 0, void 0, function* () {
    if (ball.url) {
        const stormBallDetailRawData = yield getRawData(ball.url);
        const $ = cheerio.load(stormBallDetailRawData);
        const image = $(".product-detail .product img");
        const imageURL = stormURL + image.attr("src");
        const description = $(".product-detail .span4 .productDescription")
            .next()
            .text();
        const releaseDateRaw = $(".product-detail .span4 .ejs-product-attributes")
            .prev()
            .prev()
            .prev()
            .text();
        const rawDateValue = releaseDateRaw.split(": ")[1];
        console.log("ballname", ball.name);
        console.log("RAW", releaseDateRaw);
        console.log("Raw value", rawDateValue);
        let releaseDate;
        if (rawDateValue) {
            const cleanDate = stormCleanDate(rawDateValue);
            const dateWithTimezone = new Date(cleanDate);
            const timezoneOffset = dateWithTimezone.getTimezoneOffset() * 60000;
            releaseDate = new Date(dateWithTimezone - timezoneOffset);
        }
        console.log("processed", releaseDate);
        const companyBallIdRaw = $(".product-detail .span4 .ejs-product-attributes > .attribute-title").text();
        const ballId = companyBallIdRaw.split(": ")[1];
        const colorRaw = $(".product-detail .span4 .ejs-product-attributes div .color").text();
        const color = colorRaw.split(": ")[1];
        const techSpecs = $(".spec-icon-div");
        const factoryFinishRaw = techSpecs.children().next().next().attr("src");
        const factoryFinish = stormDetectFactoryFinish(factoryFinishRaw);
        const coreTypeRaw = techSpecs
            .children()
            .next()
            .next()
            .next()
            .next()
            .attr("src");
        const coreType = stormDetectCoreType(coreTypeRaw);
        const coverRaw = techSpecs
            .children()
            .next()
            .next()
            .next()
            .next()
            .next()
            .attr("src");
        const coverAnalyzed = stormDetectCover(coverRaw);
        const coverName = coverAnalyzed[0];
        const coverType = coverAnalyzed[1];
        // const weightblocks = $("#weightblocks").html()
        // console.log(weightblocks)
        ball.imageUrl = imageURL;
        ball.description = description;
        ball.color = color;
        if (releaseDate)
            ball.releaseDate = releaseDate;
        ball.companyBallId = ballId;
        ball.factoryFinish = factoryFinish;
        ball.coreType = coreType;
        ball.coverName = coverName;
        ball.coverType = coverType;
        return ball;
    }
    else {
        return ball;
    }
});
const stormCleanDate = (raw) => {
    const splitDate = raw.split(" ");
    splitDate[1].replace(/a-z/gi, "");
    return splitDate.join(" ");
};
const stormDetectFactoryFinish = (raw) => {
    if (raw.includes("1000") || raw.includes("1k")) {
        return "1000 Abralon";
    }
    else if (raw.includes("2000") || raw.includes("2k")) {
        return "2000 Abralon";
    }
    else if (raw.includes("3000") || raw.includes("3k")) {
        return "3000 Abralon";
    }
    else if (raw.includes("4k_fast")) {
        return "4K-Fast";
    }
    else if (raw.includes("4000") || raw.includes("4k")) {
        return "4000 Abralon";
    }
    else if (raw.includes("1500" && "Polished")) {
        return "1500 Grit Polish";
    }
    else if (raw.includes("3500" && "Polished")) {
        return "3500 Grit Polish";
    }
    else {
        return "Other";
    }
};
const stormDetectCoreType = (raw) => {
    if (raw.includes("asymmetrical")) {
        return "asymmetrical";
    }
    else if (raw.includes("symmetrical")) {
        return "symmetrical";
    }
    else {
        return "other";
    }
};
const stormDetectCover = (raw) => {
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
        if (coverName === "U1S")
            coverType = "pearl urethane";
        if (coverName === "Polyester")
            coverType = "pearl polyester";
    }
    else if (coverType === "h" || coverType === "H") {
        coverType = "hybrid reactive";
    }
    else {
        coverType = "solid reactive";
        if (coverName === "U1S")
            coverType = "solid urethane";
        if (coverName === "Controll Urethane")
            coverType = "solid urethane";
    }
    return [coverName, coverType];
};
const getBallList = () => __awaiter(void 0, void 0, void 0, function* () {
    const stormBalls = yield getStormBallList();
    stormBalls.forEach((ball) => ballList.push(ball));
    const rgBalls = yield getRGBallList();
    rgBalls.forEach((ball) => ballList.push(ball));
    const globalBalls = yield getGlobalBallList();
    globalBalls.forEach((ball) => ballList.push(ball));
    // console.log(ballList);
});
getBallList();
