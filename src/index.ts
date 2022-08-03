import { BallModel } from "./common/interfaces.js";
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
	console.log("run complete!");
	console.log(ballList);
};

getBallList(); 
