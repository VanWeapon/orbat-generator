import { CORPORAL, LANCE_CORPORAL, PRIVATE, Rank } from "../data/ranks/Ranks";
import { Man } from "../resources/Man";
import { Company } from "./Company";
import { Composition, CompositionParams, Modifier } from "./Composition";
import { Platoon, PlatoonSpecialisation } from "./Platoon";
import fs from "fs";
export type SectionSpecialisation =
	| "Core"
	| "Reconnaissance"
	| "Mortar"
	| "Heavy MG"
	| "AT"
	| "Sniper"
	| "HQ"
	| "Signals"
	| "SOF"
	| "Airborne"
	| "Howitzer"
	| "Engineer"
	| "Transport"
	| "Ordinance"
	| "EOD"
	| "CBRN"
	| "CDO"
	| "SAS"
	| "UAV"
	| "Radar"
	| "Medical"
	| "Quartermaster"
	| "Surveillance";

export type SectionParams = CompositionParams & {
	parentComposition: Platoon;
	childCompositions?: Section[];
	specialisation: SectionSpecialisation;
	modifier?: Modifier;
};
export class Section extends Composition {
	size = 20;
	specialisation: SectionSpecialisation = "Core";
	modifier: Modifier = "None";
	commanderRank: Rank = CORPORAL;
	commandXORank: Rank = LANCE_CORPORAL;
	parentComposition!: Platoon;
	men: Man[] = [];

	constructor(params: SectionParams) {
		super(params);

		if (params.name) {
			this.name = params.name;
		}
		if (params.modifier) {
			this.modifier = params.modifier;
		}

		if (params.specialisation) {
			this.specialisation = params.specialisation;
		} else {
			this.specialisation = "Core";
		}

		if (params.parentComposition) {
			this.parentComposition = params.parentComposition;
			this.alignment = params.parentComposition.alignment;
			this.corps = params.parentComposition.corps;
			this.parentComposition.addSection.call(this.parentComposition, this);
		}

		this.setCommanderRank();

		if (params.corps) {
			this.corps = params.corps;
		} else {
			this.corps = this.parentComposition.corps;
		}
		this.setDefaultSymbol();
		this.setSectionSymbol();
		this.generateMen();
	}
	private setSectionSymbol() {
		this.symbol = this.parentComposition.symbol;
	}

	private generateMen() {
		switch (this.corps) {
			case "Infantry":
				switch (this.specialisation) {
					case "Core":
						switch (this.modifier) {
							case "None":
								this.commander.role = "Section Commander";
								this.commandXO
									? (this.commandXO.role = "Section 2IC")
									: this.commandXO;
								this.men.push(new Man({ rank: PRIVATE, role: "Gunner" }));
								this.men.push(new Man({ rank: PRIVATE, role: "Gunner" }));
								this.men.push(new Man({ rank: PRIVATE, role: "Grenadier" }));
								this.men.push(new Man({ rank: PRIVATE, role: "Grenadier" }));
								this.men.push(new Man({ rank: PRIVATE, role: "Rifleman" }));
								this.men.push(new Man({ rank: PRIVATE, role: "Rifleman" }));
								break;
							default:
								this.commander.role = "Section Commander";
								this.commandXO
									? (this.commandXO.role = "Section 2IC")
									: this.commandXO;
								this.men.push(new Man({ rank: PRIVATE, role: "Gunner" }));
								this.men.push(new Man({ rank: PRIVATE, role: "Gunner" }));
								this.men.push(new Man({ rank: PRIVATE, role: "Grenadier" }));
								this.men.push(new Man({ rank: PRIVATE, role: "Grenadier" }));
								this.men.push(new Man({ rank: PRIVATE, role: "Rifleman" }));
								this.men.push(new Man({ rank: PRIVATE, role: "Rifleman" }));
								break;
						}
						break;
					default:
						this.commander.role = "Section Commander";
						this.commandXO ? (this.commandXO.role = "Section 2IC") : this.commandXO;
						this.men.push(new Man({ rank: PRIVATE, role: "Gunner" }));
						this.men.push(new Man({ rank: PRIVATE, role: "Gunner" }));
						this.men.push(new Man({ rank: PRIVATE, role: "Grenadier" }));
						this.men.push(new Man({ rank: PRIVATE, role: "Grenadier" }));
						this.men.push(new Man({ rank: PRIVATE, role: "Rifleman" }));
						this.men.push(new Man({ rank: PRIVATE, role: "Rifleman" }));
						break;
				}
				break;
			default:
				this.commander.role = "Section Commander";
				this.commandXO ? (this.commandXO.role = "Section 2IC") : this.commandXO;
				this.men.push(new Man({ rank: PRIVATE, role: "Gunner" }));
				this.men.push(new Man({ rank: PRIVATE, role: "Gunner" }));
				this.men.push(new Man({ rank: PRIVATE, role: "Grenadier" }));
				this.men.push(new Man({ rank: PRIVATE, role: "Grenadier" }));
				this.men.push(new Man({ rank: PRIVATE, role: "Rifleman" }));
				this.men.push(new Man({ rank: PRIVATE, role: "Rifleman" }));
				break;
		}

		this.men.push(this.commander);
		if (this.commandXO) this.men.push(this.commandXO);
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
		this.men.forEach((man) => {
			man.writeCSV(this.alignment, this.corps, this.symbol, this.id);
		});
		fs.appendFileSync("src/output.csv", csv.join(",") + ",\n");
	}
}
