import * as cheerio from "cheerio";
import pretty from "pretty";
import { getRawData } from "../common/functions.js";
import { BallModel } from "../common/interfaces.js";
import { BallSpecs } from "../common/interfaces.js";

export const getRadicalBallDetails = async (
	ball: BallModel
): Promise<BallModel> => {
	if (ball.url) {
		const detailRawData = await getRawData(ball.url);
		const $ = cheerio.load(detailRawData);
		let spec: BallSpecs = { weight: 15, rg: 0, diff: 0, intDiff: null };
		const statsTable = $("table.c-stats tr");
		statsTable.each((i, el) => {
			const rowName = $("td", el).first().text();
			const rowData = $("td", el).first().next().text();

			if (rowName.match(/part number/gi)) {
				ball.companyBallId = pretty(rowData);
			} else if (rowName.match(/color/gi)) {
				ball.color = pretty(rowData);
			} else if (rowName.match(/core/gi)) {
				if (rowData.includes("Standard 3-Piece")) {
					ball.coreName = pretty(rowData);
					ball.coreType = "symmetrical";
				} else {
					if (rowData.match(/asymmetric/gi)) {
						ball.coreType = "asymmetrical";
					} else if (rowData.match(/symmetric/gi)) {
						ball.coreType = "symmetrical";
					} else {
						ball.coreType = "unknown";
					}
					const coreNameRaw = pretty(rowData);
					const firstIndex = coreNameRaw.indexOf("(");
					const lastIndex = coreNameRaw.indexOf(")");
					ball.coreName = coreNameRaw.substring(
						firstIndex + 1,
						lastIndex
					);
				}
			} else if (rowName.match(/coverstock/gi)) {
				ball.coverName = pretty(rowData);
				if (ball.coverName.match(/poly/gi))
					ball.coverType = "polyurethane";
			} else if (rowName.match(/cover type/gi)) {
				if (rowData.match(/pearl reactive/gi)) {
					ball.coverType = "pearl reactive";
				} else if (rowData.match(/hybrid reactive/gi)) {
					ball.coverType = "hybrid reactive";
				} else if (rowData.match(/solid reactive/gi)) {
					ball.coverType = "solid reactive";
				} else if (rowData.match(/pearl urethane/gi)) {
					ball.coverType = "pearl urethane";
				} else if (rowData.match(/solid urethane/gi)) {
					ball.coverType = "solid urethane";
				} else if (rowData.match(/polyester/gi)) {
					ball.coverType = "polyurethane";
				} else {
					ball.coverType = "unknown";
				}
			} else if (rowName.match(/finish/gi)) {
				ball.factoryFinish = pretty(rowData);
			} else if (rowName.match(/rg/gi)) {
				const stringIndexRG = rowData.indexOf("(");
				spec.rg = parseFloat(rowData.slice(0, stringIndexRG));
			} else if (rowName.match(/int/gi)) {
				const stringIndexAsy = rowData.indexOf("(");
				spec.intDiff = parseFloat(rowData.slice(0, stringIndexAsy));
			} else if (rowName.match(/diff/gi)) {
				const stringIndexDiff = rowData.indexOf("(");
				spec.diff = parseFloat(rowData.slice(0, stringIndexDiff));
			}
		});
		if (spec.rg !== 0) {
			ball.specs = [ spec ]
		}
	}
	return ball;
};
