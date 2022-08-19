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

const ballList: BallModel[] = [];

const getBallList = async () => {
	console.log("...running");
	// const stormBalls = await getStormBallList();
	// stormBalls.forEach((ball) => ballList.push(ball));
	// console.log("completed storm");
	// const rgBalls = await getRGBallList();
	// rgBalls.forEach((ball) => ballList.push(ball));
	// console.log("completed roto grip");
	// const globalBalls = await getGlobalBallList();
	// globalBalls.forEach((ball) => ballList.push(ball));
	// console.log("completed 900 global");
	// const motivBalls = await getMotiveBallList();
	// motivBalls.forEach((ball) => ballList.push(ball));
	// console.log("completed motiv");
	// const hammerBalls = await getHammerBallList();
	// hammerBalls.forEach((ball) => ballList.push(ball));
	// console.log("completed hammer");
	// const eboniteBalls = await getEboniteBallList();
	// eboniteBalls.forEach((ball) => ballList.push(ball));
	// console.log("completed ebonite");
	const columbiaBalls = await getColumbiaBallList();
	columbiaBalls.forEach((ball) => ballList.push(ball));
	console.log("completed columbia300");
	console.log("run complete!");
	console.log("Balls Acquired:", ballList.length);
	console.log(ballList);
};

getBallList();
