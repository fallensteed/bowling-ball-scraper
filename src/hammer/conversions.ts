import * as cheerio from "cheerio";
import { formatDateWithoutTimezone, getRawData } from "../common/functions.js";
import { BallModel, CoreType, CoverType } from "../common/interfaces.js";
import { hammerURL } from "./urls.js";
import { BallSpecs } from '../common/interfaces';


export const getHammerBallDetails = async (
	ball: BallModel
): Promise<BallModel> => {
	if (ball.url) {
		const hammerBallDetailRawData = await getRawData(ball.url);
		const $ = cheerio.load(hammerBallDetailRawData);

        const product = $(".product-single__description")
        // get description
        const description = $("p").first().next().text()
        ball.description = description
        // console.log(description)

        // get image url

        // get item number

        // get release date

        // get color (n/a)

        // setup core/cover details
        
        // get core name
        
        // get core type

        // get cover name

        // get cover type

        // get factory finish

        // get specs
	}
	return ball;
};
