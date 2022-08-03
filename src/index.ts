import { BallModel } from "./common/interfaces.js";
import { getMotiveBallList } from "./motiv/functions.js";
import {
	getStormBallList,
	getRGBallList,
	getGlobalBallList,
} from "./storm/functions.js";

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
	console.log("run complete!");
	console.log(ballList[0]);
	console.log(ballList[15]);
	console.log(ballList[30]);
	console.log(ballList[45]);
};

getBallList();
