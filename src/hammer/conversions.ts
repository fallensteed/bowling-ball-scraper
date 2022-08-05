// import * as cheerio from "cheerio";
// import { formatDateWithoutTimezone, getRawData } from "../common/functions.js";
// import { BallModel, CoreType, CoverType } from "../common/interfaces.js";
// import { motivURL } from "./urls.js";
// import { BallSpecs } from '../common/interfaces';

// export const convertMotivURL = (url: string): string => {
// 	const newUrl = url.slice(1);
// 	return newUrl;
// };

// export const getMotivBallDetails = async (
// 	ball: BallModel
// ): Promise<BallModel> => {
// 	if (ball.url) {
// 		const motivBallDetailRawData = await getRawData(ball.url);
// 		const $ = cheerio.load(motivBallDetailRawData);

//         // get description
//         const description = $(".wysiwyg p").first().text()
//         ball.description = description

//         // get image url
// 		const imageURL = $(".image-scroll-wrapper ul li").attr("data-url");
// 		ball.imageUrl = motivURL + convertMotivURL(imageURL as string)

//         // get item number
//         const itemNumber = $(".item-number span").text()
//         ball.companyBallId = itemNumber

//         // get release date
//         const releaseDateRaw = $(".release-date").text()
//         const releaseDate = formatDateWithoutTimezone(releaseDateRaw)
//         if (!isNaN(releaseDate?.valueOf() as number))
// 			ball.releaseDate = releaseDate;

//         // get color (n/a)

//         // setup core/cover details
//         const productSpecs = $(".product-specifications ul li")
        
//         // get core name
//         const coreName = productSpecs.children().first().next().text()
//         ball.coreName = coreName
        
//         // get core type
//         let coreType: CoreType
//         if (coreName.match(/asymmetrical|asymmetric/ig)) {
//             coreType = "asymmetrical"
//         } else if (coreName.match(/symmetrical|symmetric|symmetic/ig)) {
//             coreType = "symmetrical"
//         } else {
//             coreType = "other"
//         }
//         ball.coreType = coreType

//         // get cover name
//         const coverName = productSpecs.next().children().first().next().text()
//         ball.coverName = coverName

//         // get cover type
//         let coverType: CoverType
//         if (coverName.match(/pearl reactive/ig)) {
//             coverType = "pearl reactive"
//         } else if (coverName.match(/hybrid reactive/ig)) {
//             coverType = "hybrid reactive"
//         } else if (coverName.match(/solid reactive/ig)) {
//             coverType = "solid reactive"
//         } else if (coverName.match(/mcp/ig)) {
//             coverType = "pearl microcell"
//         } else if (coverName.match(/hfs/ig)) {
//             coverType = "solid reactive"
//         } else if (coverName.match(/solid urethane/ig)) {
//             coverType = "solid urethane"
//         } else if (coverName.match(/poly/ig)) {
//             coverType = "polyurethane"
//         } else {
//             coverType = "other"
//         }
//         ball.coverType = coverType

//         // get factory finish
//         const factoryFinish = productSpecs.next().next().children().first().next().text()
//         ball.factoryFinish = factoryFinish

//         // get specs
//         let productWeights = $(".product-specifications-by-weight ul li")
//         const specs: BallSpecs[] = []
//         let count = 0
//         do {
//             count++;
//             const weight = parseInt(productWeights.first().children().next().first().text())
//             const rg = parseFloat(productWeights.first().children(".value").first().text())
//             const diff = parseFloat(productWeights.first().children(".value").first().next().next().text())
//             let intDiff = null
//             if (productWeights.text().match(/int/gi)) {
//                 intDiff = parseFloat(productWeights.first().children(".value").first().next().next().next().next().text())
//             }
//             specs.push({weight: weight, rg: rg, diff: diff, intDiff: intDiff})
//             productWeights = productWeights.next()
//         } while (productWeights.html())
//         ball.specs = specs
// 	}
// 	return ball;
// };
