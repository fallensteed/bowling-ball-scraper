import { Schema, model } from "mongoose";

export interface StoreBall {
	name: string;
	category: string;
	brand: string;
	description?: string;
	releaseDate?: Date;
	website?: string;
	picture?: string;
	video?: string;
	price?: number;
	salePrice?: number;
	onSale?: boolean;
	preOrder?: boolean;
	discontinued?: boolean;
	archived?: boolean;
}

const StoreBallSchema = new Schema<StoreBall>({
	name: { type: String },
	category: { type: String },
	brand: { type: String },
	description: { type: String },
	releaseDate: { type: Date },
	website: { type: String },
	picture: { type: String },
	video: { type: String },
	price: { type: Number },
	salePrice: { type: Number, default: null },
	onSale: { type: Boolean, default: false },
	preOrder: { type: Boolean, default: false },
	discontinued: { type: Boolean, default: false },
	archived: { type: Boolean, default: false },
});

const StoreBallModel = model("StoreBall", StoreBallSchema);

export default StoreBallModel;
