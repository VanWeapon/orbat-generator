import { Composition, CompositionParams, Echelon, Main } from "./Composition";
import { BRIGADIER, LT_GENERAL, MAJ_GENERAL, Rank } from "../data/ranks/Ranks";
import { Brigade, BrigadeParams } from "./Brigade";
import { Man } from "../resources/Man";
import Chance from "chance";

type DivisionParams = CompositionParams & { childCompositions?: Brigade[] };

export class Division extends Composition {
	name = "Division";
	commanderRank = MAJ_GENERAL;
	echelon: Echelon = "division";

	childCompositions: Brigade[] = [];
	constructor(params: DivisionParams) {
		super(params);

		if (!params.name) {
			this.name = new Chance().word({ capitalize: true, syllables: 2 }) + " Division";
		} else {
			this.name = params.name;
		}
		this.setCommanderRank();

		this.symbol = this.getTex();
		if (!params.childCompositions) {
			this.generateBrigades();
		}
	}

	private generateBrigades() {
		const defaultBrigades: Brigade[] = [];
		defaultBrigades.push(new Brigade({ parentComposition: this, main: "infantry" }));
		defaultBrigades.push(new Brigade({ parentComposition: this, main: "infantry" }));
		defaultBrigades.push(new Brigade({ parentComposition: this, main: "infantry" }));
		defaultBrigades.push(new Brigade({ parentComposition: this, main: "armoured" }));
		defaultBrigades.push(new Brigade({ parentComposition: this, main: "reconnaissance" }));
		// this.childCompositions = defaultBrigades;
	}

	public createBrigade(inputBrigade: BrigadeParams) {
		var brigade = new Brigade(inputBrigade);
		this.childCompositions.push(brigade);
	}

	public addBrigade(inputBrigade: Brigade) {
		this.childCompositions.push(inputBrigade);
	}

	public displayDetails() {
		const details = [
			this.name,
			"Commanding Officer: " + this.commander.display(),
			"Alignment: " + this.alignment
		];

		if (this.childCompositions) {
			this.childCompositions.forEach((child) => {
				details.push(child.displayDetails());
			});
		}

		return details.join("\n");
	}

	public countChildCorpsBtns(corps: Main) {
		var count = 0;
		this.childCompositions.forEach((bde) => {
			count += bde.countCorpsBattalions(corps);
		});
		return count;
	}
}
