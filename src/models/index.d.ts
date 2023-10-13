export as namespace models;

export class ILocation {
	latitude: number;
	longitude: number;
	priority?: number;
}

export type IUserIndividual = {
	origin: ILocation | null;
	destination: ILocation | null;
	currentLocation: ILocation | null;
	startedAt: Date | null;
	priority: number;
	userId: string;
	geometry: number[][];
};

export type IUserMapper = {
	[K in `${string}`]: IUserIndividual | null;
};

export class FindRoute {
	originLatitude: number;
	originLongitude: number;
	destinationLatitude: number;
	destinationLongitude: number;
}

export type IControllerIndividual = {
	intersectionId: string;
	latitude: number;
	longitude: number;
	interrupted: boolean;
};

export type IControllerMapper = {
	[K in `${string}`]: IControllerIndividual | null;
};
