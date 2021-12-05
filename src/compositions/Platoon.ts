import { LIEUTENANT, Rank, SERGEANT } from "../data/ranks/Ranks";
import { Company } from "./Company";
import { Composition, CompositionParams } from "./Composition";
import { Section } from "./Section";
import Chance from "chance";

export type PlatoonParams = CompositionParams & {
	parentComposition: Company;
	childCompositions?: Section[];
};

export class Platoon extends Composition {
	commanderRank: Rank = LIEUTENANT;
	commandXORank: Rank = SERGEANT;
	size = 30;
	parentComposition!: Company;
	childCompositions: Section[] = [];

	constructor(params: PlatoonParams) {
		super(params);
		if (params.main) {
			this.main = params.main;
		} else {
			this.main = this.parentComposition.main;
		}
		if (params.name) {
			this.name = params.name;
		} else {
			this.name = new Chance().capitalize(this.main) + " Platoon";
		}

		if (params.lower) {
			this.lower = params.lower;
		}

		this.setCommanderRank();

		if (params.parentComposition) {
			this.parentComposition = params.parentComposition;
			this.alignment = params.parentComposition.alignment;
			this.parentComposition.addPlatoon.call(this.parentComposition, this);
		}

		if (params.alignment) {
			this.alignment = params.alignment;
		}

		this.symbol = this.getTex();

		if (!params.childCompositions) {
			this.generateSections();
		} else {
			this.childCompositions = params.childCompositions;
		}
	}
	public generateSections() {
		this.childCompositions = [
			new Section({
				parentComposition: this,
				name: "1-1",
				alignment: this.alignment
			}),
			new Section({
				parentComposition: this,
				name: "1-2",
				alignment: this.alignment
			}),
			new Section({
				parentComposition: this,
				name: "1-3",
				alignment: this.alignment
			})
		];
	}

	public addSection(inputSection: Section) {
		this.childCompositions.push(inputSection);
	}
}
