export type CoreType = "symmetrical" | "asymmetrical" | "unknown";

export type CoverType =
	| "solid urethane"
	| "pearl urethane"
	| "solid reactive"
	| "hybrid reactive"
	| "pearl reactive"
	| "pearl polyester"
    | "pearl microcell"
    | "hybrid microcell"
    | "solid microcell"
    | "polyurethane"
	| "unknown";

export interface BallSpecs {
	weight: number;
	rg: number;
	diff: number;
	intDiff: number | null;
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
