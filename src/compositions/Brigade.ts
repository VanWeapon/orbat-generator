import Chance from "chance";
import { BRIGADIER, COLONEL, LT_COLONEL, MAJ_GENERAL } from "../data/ranks/Ranks";
import { Battalion } from "./Battalion";
import { Composition, CompositionParams, Corps } from "./Composition";
import { Division } from "./Division";

export type BrigadeParams = CompositionParams & {
	parentComposition?: Division;
	childCompositions?: Battalion[];
};

export class Brigade extends Composition {
	name = "Brigade";
	commanderRank = BRIGADIER;
	commandXORank = LT_COLONEL;
	size = 70;

	parentComposition!: Division;
	childCompositions: Battalion[] = [];
	constructor(params: BrigadeParams) {
		super(params);

		if (!params.alignment) {
			this.alignment = this.parentComposition.alignment;
		} else {
			this.alignment = params.alignment;
		}

		if (!params.name) {
			this.name = new Chance().word({ capitalize: true, syllables: 2 }) + " Brigade";
		} else {
			this.name = params.name;
		}

		if (params.corps) {
			this.corps = params.corps;
		}

		this.setCommanderRank();
		this.setDefaultSymbol();

		// console.log(this);

		if (params.parentComposition) {
			this.parentComposition = params.parentComposition;
			this.parentComposition.addBrigade.call(this.parentComposition, this);
		}
		if (!params.childCompositions) {
			this.generateBattalions();
		} else {
			this.childCompositions = params.childCompositions;
		}
	}

	private generateBattalions() {
		// console.log(
		// 	"Counting btns of corps: " + this.corps,
		// 	this.parentComposition.countChildCorpsBtns(this.corps)
		// );
		let ordinal = this.getOrdinal();
		new Battalion({
			name: `${ordinal} ${Chance().capitalize(this.corps)} Battalion`,
			parentComposition: this,
			alignment: this.alignment
		});
		ordinal = this.getOrdinal();
		new Battalion({
			name: `${ordinal} ${Chance().capitalize(this.corps)} Battalion`,
			parentComposition: this,
			alignment: this.alignment
		});
		ordinal = this.getOrdinal();
		new Battalion({
			name: `${ordinal} ${Chance().capitalize(this.corps)} Battalion`,
			parentComposition: this,
			alignment: this.alignment
		});
	}
	private getOrdinal() {
		var corpsNum = this.parentComposition.countChildCorpsBtns(this.corps) + 1;
		let ordinal = "";
		switch (corpsNum) {
			case 1:
				ordinal = "1st";
				break;
			case 2:
				ordinal = "2nd";
				break;
			case 3:
				ordinal = "3rd";
				break;
			default:
				ordinal = corpsNum + "th";
				break;
		}
		return ordinal;
	}

	public addBattalion(inputBattalion: Battalion) {
		this.childCompositions.push(inputBattalion);
	}

	public displayDetails() {
		var details = [];
		details.push(" |- " + Chance().capitalize(this.corps) + " " + this.name);
		details.push("    Commanding Officer: " + this.commander.display());
		// details.push("    Alignment: " + this.alignment);

		if (this.childCompositions) {
			this.childCompositions.forEach((child) => {
				details.push(child.displayDetails());
			});
		}
		return details.join("\n");
	}

	public countCorpsBattalions(corps: Corps) {
		if (this.childCompositions) {
			var corpsBtns = this.childCompositions.filter((btn) => btn.corps == corps);
			return corpsBtns.length;
		} else {
			return 0;
		}
	}
}
