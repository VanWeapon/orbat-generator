import { Rank } from "../data/ranks/Ranks";
import Chance from "chance";
import { v4 } from "uuid";
import fs from "fs";

export type ManParams = {
	name?: string;
	rank: Rank;
	equipment: Equipment;
	mobility?: Mobility;
};

export type Equipment =
	| "air defence gun"
	| "air defence missilelauncher"
	| "antennae"
	| "anti tank gun"
	| "anti tank missile launcher"
	| "antipersonnel land mine"
	| "armoured fighting vehicle command and control"
	| "armoured fighting vehicle"
	| "armoured medical personnel carrier"
	| "armoured personnel carrier"
	| "armoured protected recovery vehicle"
	| "automatic rifle"
	| "bomb"
	| "booby trap"
	| "bridge mounted on utility vehicle"
	| "bridge"
	| "bus"
	| "chemical biological radiological nuclear equipment"
	| "computer system"
	| "direct fire gun"
	| "drill"
	| "fixed bridge"
	| "flame thrower"
	| "grenade launcher"
	| "heavy grenade launcher"
	| "heavy machine gun"
	| "heavy tank"
	| "howitzer"
	| "improvised explosive device"
	| "land mine"
	| "laser"
	| "light grenade launcher"
	| "light machine gun"
	| "light tank"
	| "machine gun"
	| "medical evacuation"
	| "medical vehicle"
	| "medium grenade launcher"
	| "medium machine gun"
	| "medium tank"
	| "mine clearing equipment"
	| "mine clearing vehicle"
	| "mine laying equipment"
	| "mine laying vehicle"
	| "missile launcher"
	| "mortar"
	| "multiple rocket launcher"
	| "non lethal grenade launcher"
	| "non lethal weapon"
	| "radar"
	| "recoilless gun"
	| "rifle"
	| "semi automatic rifle"
	| "sensor"
	| "single rocket launcher"
	| "single shot rifle"
	| "surface to surface missile launcher"
	| "tank"
	| "taser"
	| "train locomotive"
	| "utility vehicle"
	| "water cannon"
	| "water vehicle";

export type Mobility =
	| "amphibious"
	| "barge"
	| "over snow"
	| "pack animal"
	| "railroad"
	| "sled"
	| "towed"
	| "tracked"
	| "wheeled and tracked"
	| "wheeled cross country"
	| "wheeled limited mobility"
	| "wheeled semi trailer"
	| "none";

export class Man {
	public rank!: Rank;
	public name?: string;
	public equipment!: Equipment;
	public mobility: Mobility = "none";
	public id = v4();
	constructor(params: ManParams) {
		if (params.name) {
			this.name = params.name;
		} else {
			this.name = new Chance().name({ gender: "male" });
		}

		if (params.mobility) this.mobility = params.mobility;
		this.rank = params.rank;
		this.equipment = params.equipment;
	}

	public display() {
		return this.rank.abbreviation + " " + this.name;
	}
}
