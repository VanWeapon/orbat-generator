import { CORPORAL, LANCE_CORPORAL, PRIVATE, Rank } from "../data/ranks/Ranks";
import { Man } from "../resources/Man";
import { Company } from "./Company";
import { Composition, CompositionParams } from "./Composition";
import { Platoon } from "./Platoon";
import fs from "fs";

export type SectionParams = CompositionParams & {
	parentComposition: Platoon;
	childCompositions?: Section[];
};
export class Section extends Composition {
	size = 20;
	commanderRank: Rank = CORPORAL;
	commandXORank: Rank = LANCE_CORPORAL;
	parentComposition!: Platoon;
	men: Man[] = [];

	constructor(params: SectionParams) {
		super(params);

		if (params.name) {
			this.name = params.name;
		}

		if (params.parentComposition) {
			this.parentComposition = params.parentComposition;
			this.alignment = params.parentComposition.alignment;
			this.main = params.parentComposition.main;
			this.parentComposition.addSection.call(this.parentComposition, this);
		}

		this.setCommanderRank();

		if (params.main) {
			this.main = params.main;
		} else {
			this.main = this.parentComposition.main;
		}

		if (params.lower) {
			this.lower = params.lower;
		}

		this.generateMen();
	}

	private generateMen() {
		switch (this.main) {
			case "infantry":
				this.commander.equipment = "rifle";
				this.commandXO
					? (this.commandXO.equipment = "rifle")
					: (this.commandXO = new Man({
							rank: LANCE_CORPORAL,
							equipment: "rifle"
					  }));
				this.men.push(new Man({ rank: PRIVATE, equipment: "automatic rifle" }));
				this.men.push(new Man({ rank: PRIVATE, equipment: "automatic rifle" }));
				this.men.push(new Man({ rank: PRIVATE, equipment: "grenade launcher" }));
				this.men.push(new Man({ rank: PRIVATE, equipment: "anti tank gun" }));
				this.men.push(new Man({ rank: PRIVATE, equipment: "rifle" }));
				this.men.push(new Man({ rank: PRIVATE, equipment: "rifle" }));
				break;

			case "mortar":
				this.commander.equipment = "rifle";
				this.men.push(new Man({ rank: PRIVATE, equipment: "mortar" }));
				this.men.push(new Man({ rank: PRIVATE, equipment: "mortar" }));
				break;
			case "armoured":
				this.commander.equipment = "tank";
				this.commandXO
					? (this.commandXO.equipment = "tank")
					: (this.commandXO = new Man({ rank: LANCE_CORPORAL, equipment: "tank" }));
				break;
		}

		this.men.push(this.commander);
		if (this.commandXO) this.men.push(this.commandXO);
	}
}
