import { Rank } from "../data/ranks/Ranks";
import { Man } from "../resources/Man";
import { Chance } from "chance";
import { v4 } from "uuid";
import fs from "fs";
import {
	MilSymbArea,
	MilSymbEchelon,
	MilSymbFaction,
	MilSymbLower,
	MilSymbMain
} from "../latex-gen";

export type Main = MilSymbMain;

export type CompositionAlignment = MilSymbFaction;

export type Lower = MilSymbLower;

export type CommandArea = MilSymbArea;

export type CompositionParams = {
	commander?: Man;
	commandXO?: Man;
	name?: string;
	commandArea?: CommandArea;
	alignment?: CompositionAlignment;
	main?: Main;
	lower?: Lower;
	parentComposition?: Composition | null;
	childCompositions?: Composition[] | null;
	symbol?: string | null;
};

export type Echelon = MilSymbEchelon;

export abstract class Composition {
	public id: string = v4();
	public name!: string;
	public symbol!: string;
	public commandArea!: CommandArea;
	public alignment!: CompositionAlignment;
	public main!: Main;
	public lower!: Lower;
	public commander!: Man;
	public commanderRank!: Rank;
	public commandXO?: Man;
	public commandXORank?: Rank;
	public parentComposition!: Composition | null;
	public childCompositions!: Composition[] | null;
	public echelon!: Echelon;
	constructor(params?: CompositionParams) {
		if (!params) {
			this.setCompositionDefaults();
		}

		params?.commandArea ? (this.commandArea = params.commandArea) : (this.commandArea = "Land");
		params?.commander ? (this.commander = params.commander) : this.generateCommander();
		params?.commandXO ? (this.commandXO = params.commandXO) : this.generateXO();
		params?.alignment ? (this.alignment = params.alignment) : (this.alignment = "unknown");
		params?.main ? (this.main = params.main) : (this.main = "unknown");
		params?.name ? (this.name = params.name) : this.name;
		params?.symbol ? (this.symbol = params.symbol) : (this.symbol = this.getTex());
		params?.parentComposition
			? (this.parentComposition = params.parentComposition)
			: this.parentComposition;
		params?.childCompositions
			? (this.childCompositions = params.childCompositions)
			: this.childCompositions;
	}

	public displayDetails() {
		const details = [
			new Chance().capitalize(this.main) + " " + this.name,
			"Commanding Officer: " + this.commander.display(),
			"Alignment: " + this.alignment
		];
		if (this.childCompositions) {
			this.childCompositions.forEach((child) => {
				details.push(new Chance().capitalize(child.main) + " " + child.name);
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
		this.main = "unknown";
		this.parentComposition = null;
	}

	private generateCommander() {
		this.commander = new Man({
			rank: this.commanderRank,
			equipment: "rifle"
		});
		this.setCommanderRank();
	}

	private generateXO() {
		if (!this.commandXORank) return;
		this.commandXO = new Man({
			rank: this.commandXORank,
			equipment: "rifle"
		});
		this.setCommanderRank();
	}

	public getTex() {
		var main = this.main;
		var type = "Mil";
		var area = this.commandArea;
		let faction = this.alignment;

		var echelon = this.echelon;

		var contentStringStart = `\\${type}${area}[faction=${faction}, echelon=${echelon}, main=${main}`;
		if (this.lower != "None") {
			contentStringStart += ", lower=" + this.lower;
		}
		var contentStringEnd = `, scale=1]`;

		var contentString = contentStringStart + contentStringEnd;

		return contentString;
	}
}
