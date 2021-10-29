import { Rank } from "../data/ranks/Ranks";
import Chance from "chance";
import { v4 } from "uuid";
import fs from "fs";

export type ManParams = {
	name?: string;
	rank: Rank;
	role: ManRole;
};

export type ManRole =
	| "Officer"
	| "Section Commander"
	| "Section 2IC"
	| "Rifleman"
	| "AT Rifleman"
	| "AT Assistant"
	| "Gunner"
	| "Medic"
	| "Clerk"
	| "Driver"
	| "Pilot"
	| "Grenadier"
	| "Marksman"
	| "Sniper"
	| "None";

export class Man {
	public rank!: Rank;
	public name?: string;
	public role: ManRole;
	public id = v4();
	constructor(params: ManParams) {
		if (params.name) {
			this.name = params.name;
		} else {
			this.name = new Chance().name({ gender: "male" });
		}

		this.role = params.role;
		this.rank = params.rank;
	}

	public display() {
		return this.rank.abbreviation + " " + this.name;
	}

	public writeCSV(alignment: string, corps: string, symbol: string, parentId: string) {
		var csv = [];

		var sizeSymbol = "";

		csv.push(
			[
				this.role,
				alignment,
				corps,
				this.rank.abbreviation + " " + this.name,
				symbol || "unknown",
				this.id,
				parentId || "",
				sizeSymbol || ""
			].join(",")
		);
		fs.appendFileSync("src/output.csv", csv.join(",") + ",\n");
	}
}
