import { BallModel } from "../../common/interfaces.js";
import RawDataModel from "./rawData.schema.js";

export const deleteAllData = async () => {
	const result = await RawDataModel.deleteMany();
	console.log(result);
	return result;
};

export const saveRawData = async (balls: BallModel[]) => {
	const result = await RawDataModel.insertMany(balls);
	return result;
};
