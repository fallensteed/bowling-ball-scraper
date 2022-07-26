import { getColumbiaBallList } from "./columbia300/functions.js";
import { BallModel } from "./common/interfaces.js";
import { getEboniteBallList } from "./ebonite/functions.js";
import { getHammerBallList } from "./hammer/functions.js";
import { getMotiveBallList } from "./motiv/functions.js";
import {
	getStormBallList,
	getRGBallList,
	getGlobalBallList,
} from "./storm/functions.js";
import { getTrackBallList } from "./track/functions.js";
import { getDV8BallList } from "./dv8/functions.js";
import { getRadicalBallList } from "./radical/functions.js";
import { getBrunswickBallList } from "./brunswick/functions.js";

import "dotenv/config";
import mongoose from "mongoose";
import { MONGO_URI } from "./config/index.js";
import {
	deleteAllData,
	saveRawData,
} from "./database/rawData/rawData.functions.js";

const ballList: BallModel[] = [];

const getBallList = async () => {
	console.log("...running");
	const stormBalls = await getStormBallList();
	stormBalls.forEach((ball) => ballList.push(ball));
	console.log("completed storm");
	const rgBalls = await getRGBallList();
	rgBalls.forEach((ball) => ballList.push(ball));
	console.log("completed roto grip");
	const globalBalls = await getGlobalBallList();
	globalBalls.forEach((ball) => ballList.push(ball));
	console.log("completed 900 global");
	const motivBalls = await getMotiveBallList();
	motivBalls.forEach((ball) => ballList.push(ball));
	console.log("completed motiv");
	const hammerBalls = await getHammerBallList();
	hammerBalls.forEach((ball) => ballList.push(ball));
	console.log("completed hammer");
	const eboniteBalls = await getEboniteBallList();
	eboniteBalls.forEach((ball) => ballList.push(ball));
	console.log("completed ebonite");
	const columbiaBalls = await getColumbiaBallList();
	columbiaBalls.forEach((ball) => ballList.push(ball));
	console.log("completed columbia300");
	const trackBalls = await getTrackBallList();
	trackBalls.forEach((ball) => ballList.push(ball));
	console.log("completed track");
	const dv8Balls = await getDV8BallList();
	dv8Balls.forEach((ball) => ballList.push(ball));
	console.log("completed dv8");
	const radicalBalls = await getRadicalBallList();
	radicalBalls.forEach((ball) => ballList.push(ball));
	console.log("completed radical");
	const brunswickBalls = await getBrunswickBallList();
	brunswickBalls.forEach((ball) => ballList.push(ball));
	console.log("completed brunswick");
	console.log("run complete!");
	console.log("Balls Acquired:", ballList.length);
	return ballList;
};

(async () => {
	try {
		if (!MONGO_URI) {
			return new Error("No MONGO_URI");
		}
		await mongoose.connect(MONGO_URI);
		console.log("MongoDB Connected");

		const ballList = await getBallList();
		const response1 = await deleteAllData();
		console.log("Status: Ball List Cleared");
		const response2 = await saveRawData(ballList);
		console.log("Status: Balls Saved to Database");
	} catch (err) {
		console.log(err);
	}
})();
