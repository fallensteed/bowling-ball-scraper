export type CoreType = "symmetrical" | "asymmetrical" | "other";

export type CoverType =
	| "solid urethane"
	| "pearl urethane"
	| "solid reactive"
	| "hybrid reactive"
	| "pearl reactive"
	| "pearl polyester"
	| "other";

export interface BallSpecs {
    weight: number;
    rg: number;
    diff: number;
    psa: number | null;
}

export interface BallModel {
	name: string;
	companyName: string;
	url?: string;
	companyBallId?: string;
	imageUrl?: string;
	description?: string;
	color?: string;
	releaseDate?: Date;
	factoryFinish?: string;
	coreType?: CoreType;
	coreName?: string;
	coverType?: CoverType;
	coverName?: string;
	specs?: BallSpecs[];
}
