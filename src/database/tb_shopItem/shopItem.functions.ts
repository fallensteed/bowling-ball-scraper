import { BallModel } from "../../common/interfaces";
import StoreBallModel, { StoreBall } from "./shopItem.schema";

export const deleteAllShopItemData = async () => {
	const result = await StoreBallModel.deleteMany();
	console.log(result);
	return result;
};

export const saveShopItemData = async (balls: BallModel[]) => {
	const shopBalls: StoreBall[] = [];
	for (let ball in balls) {
		const newShopBall: StoreBall = {
            name: balls[ball].name,
            brand: balls[ball].companyName,
            category: "bowling ball",
        }
	}

	const result = await StoreBallModel.insertMany(balls);
	return result;
};
