import { CAPTAIN, MAJOR, Rank } from "../data/ranks/Ranks";
import { Battalion } from "./Battalion";
import { Composition, CompositionParams } from "./Composition";
import { HQElement } from "./HQElement";
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
	HQElement?: HQElement;
	role: CompanyRole;
};
export class Company extends Composition {
	parentComposition!: Battalion;
	childCompositions: Platoon[] = [];
	HQElement!: HQElement;
	commanderRank = MAJOR;
	commandXORank = CAPTAIN;
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
		if (params.corps) {
			this.corps = params.corps;
		} else {
			this.corps = this.parentComposition.corps;
		}
		if (params.alignment) {
			this.alignment = params.alignment;
		}
		if (!params.HQElement) {
			// this.childCompositions.push(new HQElement());
		} else {
			this.HQElement = params.HQElement;
		}

		this.setDefaultSymbol();
		this.setCompanySymbol();

		if (!params.childCompositions) {
			this.generatePlatoons();
		} else {
			this.childCompositions = params.childCompositions;
		}
	}

	public addPlatoon(inputPlatoon: Platoon) {
		this.childCompositions.push(inputPlatoon);
	}

	private setCompanySymbol() {
		var alignment = this.alignment;
		var corps = this.corps;
		var role = this.companyRole;
		var path = this.symbol;
		if (role == "Combat") {
			return;
		}

		switch (role) {
			case "HQ":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_headquarters_unit");
				break;
			case "Artillery":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_artillery");
				break;
			case "Logistics":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_css__transport");
				break;
			case "Maintenance":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_css__maintenance");
				break;
			case "Medical":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_medical");
				break;
			case "Ordinance":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_css__ordinance");
				break;
			case "Supply":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_css__supply");
				break;
			case "Combat Support":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_combat_support_a");
				break;
		}
		this.symbol = path;
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
			specialisation: "Reconnaissance"
		});
		new Platoon({
			name: "1st Platoon",
			parentComposition: this,
			specialisation: "Core"
		});
		new Platoon({
			name: "2nd Platoon",
			parentComposition: this,
			specialisation: "Core"
		});
		new Platoon({
			name: "3rd Platoon",
			parentComposition: this,
			specialisation: "Core"
		});
		new Platoon({
			name: this.name + " Headquarters",
			parentComposition: this,
			specialisation: "HQ"
		});
	}

	private generateCombatSupportPlatoons() {
		new Platoon({
			name: "Mortar Platoon",
			parentComposition: this,
			specialisation: "Mortar"
		});
		new Platoon({
			name: "Recon Platoon",
			parentComposition: this,
			specialisation: "Reconnaissance"
		});
		new Platoon({
			name: "Anti-Tank Platoon",
			parentComposition: this,
			specialisation: "AT"
		});
		new Platoon({
			name: "Sniper Platoon",
			parentComposition: this,
			specialisation: "Sniper"
		});
		new Platoon({
			name: "Combat Engineering Platoon",
			parentComposition: this,
			specialisation: "Engineer"
		});
		new Platoon({
			name: this.name + " Headquarters",
			parentComposition: this,
			specialisation: "HQ"
		});
	}

	private generateHQPlatoons() {
		new Platoon({
			name: "Battalion Headquarters",
			parentComposition: this,
			specialisation: "HQ"
		});
		new Platoon({
			name: "Battalion Signals",
			parentComposition: this,
			specialisation: "Signals"
		});
		new Platoon({
			name: "Battalion Medical",
			parentComposition: this,
			specialisation: "Medical"
		});
		new Platoon({
			name: "Battalion Engineering",
			parentComposition: this,
			specialisation: "Engineer"
		});
		new Platoon({
			name: "Battalion QStore",
			parentComposition: this,
			specialisation: "Quartermaster"
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
