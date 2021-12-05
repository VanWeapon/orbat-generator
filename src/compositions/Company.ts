import { CAPTAIN, MAJOR, Rank } from "../data/ranks/Ranks";
import { Battalion } from "./Battalion";
import { Composition, CompositionParams, Lower, Main } from "./Composition";
import { Platoon } from "./Platoon";

export type CompanyRole =
	| "HQ"
	| "Maintenance"
	| "Combat"
	| "Combat Support"
	| "Medical"
	| "Supply"
	| "Ordinance"
	| "Artillery"
	| "Logistics";

export type CompanyParams = CompositionParams & {
	parentComposition: Battalion;
	childCompositions?: Platoon[];
	role: CompanyRole;
};
export class Company extends Composition {
	parentComposition!: Battalion;
	childCompositions: Platoon[] = [];
	commanderRank = MAJOR;
	commandXORank = CAPTAIN;
	main: Main;
	lower: Lower;
	size = 50;
	companyRole: CompanyRole = "Combat";

	constructor(params: CompanyParams) {
		super(params);
		if (params.name) {
			this.name = params.name;
		}

		switch (params.role) {
			case "HQ":
				this.commanderRank = MAJOR;
				break;
		}
		this.companyRole = params.role;

		this.setCommanderRank();

		if (params.parentComposition) {
			this.parentComposition = params.parentComposition;
			this.alignment = params.parentComposition.alignment;
			this.parentComposition.addCompany.call(this.parentComposition, this);
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
			this.generatePlatoons();
		} else {
			this.childCompositions = params.childCompositions;
		}
	}

	public addPlatoon(inputPlatoon: Platoon) {
		this.childCompositions.push(inputPlatoon);
	}

	private generatePlatoons() {
		switch (this.companyRole) {
			case "Combat":
				this.generateCombatPlatoons();
				break;
			case "HQ":
				this.generateHQPlatoons();
				break;
			case "Combat Support":
				this.generateCombatSupportPlatoons();
				break;
		}
	}

	private generateCombatPlatoons() {
		new Platoon({
			name: "Recon Platoon",
			parentComposition: this,
			main: "reconnaissance"
		});
		new Platoon({
			name: "1st Platoon",
			parentComposition: this,
			main: "infantry"
		});
		new Platoon({
			name: "2nd Platoon",
			parentComposition: this,
			main: "infantry"
		});
		new Platoon({
			name: "3rd Platoon",
			parentComposition: this,
			main: "infantry"
		});
		new Platoon({
			name: this.name + " Headquarters",
			parentComposition: this,
			main: "headquarters"
		});
	}

	private generateCombatSupportPlatoons() {
		new Platoon({
			name: "Mortar Platoon",
			parentComposition: this,
			main: "mortar"
		});
		new Platoon({
			name: "Recon Platoon",
			parentComposition: this,
			main: "reconnaissance"
		});
		new Platoon({
			name: "Anti-Tank Platoon",
			parentComposition: this,
			main: "anti tank"
		});
		new Platoon({
			name: "Sniper Platoon",
			parentComposition: this,
			main: "sniper"
		});
		new Platoon({
			name: "Combat Engineering Platoon",
			parentComposition: this,
			main: "engineer"
		});
		new Platoon({
			name: this.name + " Headquarters",
			parentComposition: this,
			main: "headquarters"
		});
	}

	private generateHQPlatoons() {
		new Platoon({
			name: "Battalion Headquarters",
			parentComposition: this,
			main: "headquarters"
		});
		new Platoon({
			name: "Battalion Signals",
			parentComposition: this,
			main: "signal"
		});
		new Platoon({
			name: "Battalion Medical",
			parentComposition: this,
			main: "medical"
		});
		new Platoon({
			name: "Battalion Engineering",
			parentComposition: this,
			main: "engineer"
		});
		new Platoon({
			name: "Battalion QStore",
			parentComposition: this,
			main: "quartermaster"
		});
	}

	public displayDetails() {
		var details = [];
		details.push("     |- " + this.name);
		details.push("        Commanding Officer: " + this.commander.display());
		// details.push("        Alignment: " + this.alignment);
		if (this.childCompositions) {
			this.childCompositions.forEach((child) => {
				details.push(child.displayDetails());
			});
		}
		return details.join("\n");
	}
}
