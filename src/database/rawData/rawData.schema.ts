import { model, Schema, Types } from "mongoose";
import { BallModel } from "../../common/interfaces.js";

const schema = new Schema<BallModel>(
	{
		name: { type: String, required: true },
		companyName: { type: String, required: true },
		url: { type: String },
		companyBallId: { type: String },
		imageUrl: { type: String },
		description: { type: String },
		color: { type: String },
		releaseDate: { type: Date },
		factoryFinish: { type: String },
		coreType: { type: String },
		coreName: { type: String },
		coverType: { type: String },
		coverName: { type: String },
		specs: [
			{
				weight: { type: Number },
				rg: { type: Number },
				diff: { type: Number },
				intDiff: { type: Number },
			},
		],
	},
	{ timestamps: true }
);

const RawDataModel = model<BallModel>("RawData", schema);

export default RawDataModel;
