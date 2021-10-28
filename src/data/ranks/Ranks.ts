export type Rank = {
	name: string;
	level: number;
	abbreviation: string;
};

export const GENERAL: Rank = { name: "General", level: 1, abbreviation: "GEN" };
export const LT_GENERAL: Rank = { name: "Lieutenant General", level: 1, abbreviation: "LTGEN" };
export const MAJ_GENERAL: Rank = { name: "Major General", level: 1, abbreviation: "MAJGEN" };
export const BRIGADIER: Rank = { name: "Brigadier", level: 1, abbreviation: "BRIG" };
export const COLONEL: Rank = { name: "Colonel", level: 1, abbreviation: "COL" };
export const LT_COLONEL: Rank = { name: "Lieutenant Colonel", level: 1, abbreviation: "LTCOL" };
export const MAJOR: Rank = { name: "Major", level: 1, abbreviation: "MAJ" };
export const CAPTAIN: Rank = { name: "Captain", level: 1, abbreviation: "CAPT" };
export const LIEUTENANT: Rank = { name: "Lieutenant", level: 1, abbreviation: "LT" };
export const WARRANT_OFFICER: Rank = { name: "Warrant Officer", level: 1, abbreviation: "WO" };
export const SERGEANT: Rank = { name: "Sergeant", level: 1, abbreviation: "SGT" };
export const CORPORAL: Rank = { name: "General", level: 1, abbreviation: "CPL" };
export const LANCE_CORPORAL: Rank = { name: "General", level: 1, abbreviation: "LCPL" };
export const PRIVATE: Rank = { name: "General", level: 1, abbreviation: "PTE" };
export const RECRUIT: Rank = { name: "General", level: 1, abbreviation: "REC" };
export const NONE: Rank = { name: "", level: 1, abbreviation: "" };
