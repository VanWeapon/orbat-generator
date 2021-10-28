import { LIEUTENANT, Rank, SERGEANT } from "../data/ranks/Ranks";
import { Company, CompanyRole } from "./Company";
import { Composition, CompositionParams, Modifier } from "./Composition";
import { HQElement } from "./HQElement";
import { Section } from "./Section";

export type PlatoonSpecialisation =
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

export type PlatoonParams = CompositionParams & {
	parentComposition: Company;
	childCompositions?: Section[];
	specialisation: PlatoonSpecialisation;
	modifier?: Modifier;
	HQElement?: HQElement;
};

export class Platoon extends Composition {
	specialisation: PlatoonSpecialisation = "Core";
	modifier: Modifier = "None";
	commanderRank: Rank = LIEUTENANT;
	commandXORank: Rank = SERGEANT;
	size = 30;
	parentComposition!: Company;
	childCompositions: Section[] = [];
	HQElement!: HQElement;

	constructor(params: PlatoonParams) {
		super(params);

		if (params.name) {
			this.name = params.name;
		} else {
			this.name = this.specialisation + " Platoon";
		}
		if (params.specialisation) {
			this.specialisation = params.specialisation;
		} else {
			this.specialisation = "Core";
		}

		if (params.modifier) {
			this.modifier = params.modifier;
		}

		this.setCommanderRank();

		if (params.parentComposition) {
			this.parentComposition = params.parentComposition;
			this.alignment = params.parentComposition.alignment;
			this.parentComposition.addPlatoon.call(this.parentComposition, this);
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
		this.setPlatoonSymbol();
	}

	private setPlatoonSymbol() {
		var alignment = this.alignment;
		var corps = this.corps;
		var specialisation = this.specialisation;
		var path = this.symbol;
		if (specialisation == "Core") {
			return;
		}

		switch (specialisation) {
			case "HQ":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_headquarters_unit");
				break;
			case "Howitzer":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_artillery");
				break;
			case "Mortar":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_mortars");
				break;
			case "Transport":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_css__transport");
				break;
			case "Quartermaster":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_css__quartermaster");
				break;
			case "Medical":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_medical");
				break;
			case "Ordinance":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_css__ordinance");
				break;
			case "Radar":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_radar");
				break;
			case "Reconnaissance":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_reconnaissance");
				break;
			case "SAS":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_special_operations_force__sas");
				break;
			case "SOF":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_special_operations_force");
				break;
			case "Sniper":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_sniper");
				break;
			case "Signals":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_signals_or_communication");
				break;
			case "Surveillance":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_surveillance_b");
				break;
			case "UAV":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_unmanned_arial_vehicles");
				break;
			case "Engineer":
				if (this.parentComposition.companyRole == "Combat") {
					path = path.replace(
						/(unit)(.*?)(?=\.svg)/,
						"unit_military_engineers__combat_engineers_a"
					);
				} else {
					path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_military_engineers");
				}
				break;
			case "EOD":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_explosive_ordinance_disposal_a");
				break;
			case "AT":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_anti-tank");
				break;
			case "Airborne":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_airborne_forces");
				break;
			case "CBRN":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_cbrn");
				break;
			case "CDO":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_commando");
				break;
			case "Heavy MG":
				path = path.replace(/(unit)(.*?)(?=\.svg)/, "unit_infantry__heavy_weapons");
				break;
		}
		this.symbol = path;
	}
}
