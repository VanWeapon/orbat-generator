import { Composition, CompositionParams, Echelon, Lower, Main } from "./Composition";
import { COLONEL, LT_COLONEL, MAJOR, Rank } from "../data/ranks/Ranks";
import { Brigade } from "./Brigade";
import { Company } from "./Company";
import Chance from "chance";

export type BattalionParams = CompositionParams & {
	parentComposition: Brigade;
	childCompositions?: Company[];
	name: string;
};

export class Battalion extends Composition {
	commanderRank = LT_COLONEL;
	commandXORank = COLONEL;
	name: string = "Battalion";
	echelon: Echelon = "battalion";
	main: Main;
	lower: Lower;
	size = 60;

	parentComposition!: Brigade;
	childCompositions: Company[] = [];
	constructor(params: BattalionParams) {
		super(params);
		this.name = params.name;

		this.setCommanderRank();

		if (params.parentComposition) {
			this.parentComposition = params.parentComposition;
			this.alignment = params.parentComposition.alignment;
			this.parentComposition.addBattalion.call(this.parentComposition, this);
		}

		if (params.main) {
			this.main = params.main;
		} else {
			this.main = this.parentComposition.main;
		}

		if (params.lower) {
			this.lower = params.lower;
		} else {
			this.lower = this.parentComposition.lower;
		}

		if (params.alignment) {
			this.alignment = params.alignment;
		}
		this.symbol = this.getTex();

		if (!params.childCompositions) {
			this.generateCompanies();
		} else {
			this.childCompositions = params.childCompositions;
		}
	}

	public addCompany(inputCompany: Company) {
		this.childCompositions.push(inputCompany);
	}

	private generateCompanies() {
		new Company({
			name: new Chance().animal() + " Company",
			parentComposition: this,
			alignment: this.alignment,
			role: "Combat"
		});
		new Company({
			name: new Chance().animal() + " Company",
			parentComposition: this,
			alignment: this.alignment,
			role: "Combat"
		});
		new Company({
			name: new Chance().animal() + " Company",
			parentComposition: this,
			alignment: this.alignment,
			role: "Combat"
		});
		new Company({
			name: this.name + " Support Company",
			alignment: this.alignment,
			parentComposition: this,
			role: "Combat Support"
		});
		new Company({
			name: this.name + " HQ Company",
			alignment: this.alignment,
			parentComposition: this,
			role: "HQ"
		});
	}

	public displayDetails() {
		var details = [];
		details.push("   |- " + this.name);
		details.push(
			"      Commanding Officer: " +
				this.commander.display() +
				" Executive Officer: " +
				(this.commandXO?.display() || "Vacant")
		);
		// details.push("      Alignment: " + this.alignment);
		if (this.childCompositions) {
			this.childCompositions.forEach((child) => {
				details.push(child.displayDetails());
			});
		}
		return details.join("\n");
	}
}
