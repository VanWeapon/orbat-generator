import { Rank } from "../data/ranks/Ranks";
import { Man } from "../resources/Man";
import { Chance } from "chance";
import { v4 } from "uuid";
import fs from "fs";
export type Corps =
	| "infantry"
	| "artillery"
	| "armour"
	| "cavalry"
	| "reconnaissance"
	| "sof"
	| "hq"
	| "engineer"
	| "training"
	| "support"
	| "aviation"
	| "rotary"
	| "fixed_wing"
	| "unknown";

export type CompositionAlignment = "bluefor" | "opfor" | "civilian" | "neutral" | "unknown";

export type Modifier =
	| "Amphibious"
	| "CBRN"
	| "Motorised"
	| "Mountain"
	| "Naval"
	| "Radar"
	| "Radio"
	| "Rail"
	| "SIGINT"
	| "Towed"
	| "Tracked"
	| "Video Imagery"
	| "Wheeled and Tracked"
	| "Wheeled"
	| "None";

export type CompositionParams = {
	commander?: Man;
	commandXO?: Man;
	name?: string;
	alignment?: CompositionAlignment;
	corps?: Corps;
	parentComposition?: Composition | null;
	childCompositions?: Composition[] | null;
	symbol?: string | null;
};

export abstract class Composition {
	public id: string = v4();
	public name!: string;
	public symbol!: string;
	public alignment!: CompositionAlignment;
	public corps!: Corps;
	public commander!: Man;
	public commanderRank!: Rank;
	public commandXO?: Man;
	public commandXORank?: Rank;
	public parentComposition!: Composition | null;
	public childCompositions!: Composition[] | null;
	size?: number;
	constructor(params?: CompositionParams) {
		if (!params) {
			this.setCompositionDefaults();
		}

		params?.commander ? (this.commander = params.commander) : this.generateCommander();
		params?.commandXO ? (this.commandXO = params.commandXO) : this.generateXO();
		params?.alignment ? (this.alignment = params.alignment) : (this.alignment = "unknown");
		params?.corps ? (this.corps = params.corps) : (this.corps = "unknown");
		params?.name ? (this.name = params.name) : this.name;
		params?.symbol ? (this.symbol = params.symbol) : this.setDefaultSymbol();
		params?.parentComposition
			? (this.parentComposition = params.parentComposition)
			: this.parentComposition;
		params?.childCompositions
			? (this.childCompositions = params.childCompositions)
			: this.childCompositions;
	}

	public displayDetails() {
		const details = [
			new Chance().capitalize(this.corps) + " " + this.name,
			"Commanding Officer: " + this.commander.display(),
			"Alignment: " + this.alignment
		];
		if (this.childCompositions) {
			this.childCompositions.forEach((child) => {
				details.push(new Chance().capitalize(child.corps) + " " + child.name);
				details.push("Commanding Officer: " + child.commander.display());
				details.push("Alignment: " + child.alignment);
			});
		}

		return details.join("\n");
	}

	protected setCommanderRank() {
		this.commander.rank = this.commanderRank;
		if (this.commandXO && this.commandXORank) this.commandXO.rank = this.commandXORank;
	}

	protected setSymbol() {}

	private setCompositionDefaults() {
		this.generateCommander();
		this.alignment = "unknown";
		this.corps = "unknown";
		this.parentComposition = null;
	}

	private generateCommander() {
		this.commander = new Man({
			name: new Chance().name({ gender: "male" }),
			rank: this.commanderRank
		});
		this.setCommanderRank();
	}

	private generateXO() {
		if (!this.commandXORank) return;
		this.commandXO = new Man({
			name: new Chance().name({ gender: "male" }),
			rank: this.commandXORank
		});
		this.setCommanderRank();
	}

	public writeCSV() {
		var csv = [];

		var sizeSymbol =
			"/assets/nato_icons/size/" + this.alignment + "_0" + this.size?.toString() + ".svg";

		csv.push(
			[
				this.name,
				this.alignment,
				this.corps,
				this.commander.rank.abbreviation + " " + this.commander.name,
				this.symbol || "unknown",
				this.id,
				this.parentComposition?.id || "",
				sizeSymbol || ""
			].join(",")
		);
		this.childCompositions?.forEach((comp) => {
			comp.writeCSV();
		});
		fs.appendFileSync("src/output.csv", csv.join(",") + ",\n");
	}

	public setDefaultSymbol() {
		var alignment;
		if (this.alignment == "unknown") alignment = "black";
		else alignment = this.alignment;

		var path = "/assets/nato_icons/" + alignment + "/";
		switch (this.corps) {
			case "infantry":
				path += "unit_infantry";
				break;
			case "reconnaissance":
				path += "unit_reconnaissance";
				break;
			case "armour":
				path += "unit_armour";
				break;
			case "support":
				path += "unit_css__supply";
				break;
			case "hq":
				path += "unit_headquarters_unit";
				break;
			case "engineer":
				path += "unit_military_engineers";
				break;
			case "artillery":
				path += "unit_artillery";
				break;
			case "cavalry":
				path += "unit_cavalry";
				break;
			case "aviation":
				path += "unit_aviation_a";
				break;
			case "rotary":
				path += "unit_aviation__rotary_wing_a";
				break;
			case "fixed_wing":
				path += "unit_aviation__fixed_wing_a";
				break;
			default:
				path += "unit_unspecified_or_composite_all-arms_a";
				break;
		}
		path += ".svg";

		this.symbol = path;
	}
}
