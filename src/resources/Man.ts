import { Rank } from "../data/ranks/Ranks";
import { BaseResource } from "./BaseResource";

export type ManParams = {
	name: string;
	rank: Rank;
};
export class Man {
	public rank!: Rank;
	public name!: string;

	constructor(params: ManParams) {
		this.name = params.name;
		this.rank = params.rank;
	}

	public display() {
		return this.rank.abbreviation + " " + this.name;
	}
}
