import fs from "fs";
import { exec } from "child_process";
var header = fs.readFileSync("assets/latex/template_start.tex", "utf8");
var footer = fs.readFileSync("assets/latex/template_end.tex", "utf8");
var corps = "armoured";
export type MilSymbType = "Mil";
export type MilSymbArea =
	| "Air"
	| "Land"
	| "SeaSurfact"
	| "SeaSubsurface"
	| "Missile"
	| "Equipment"
	| "Installation"
	| "Mine"
	| "Space"
	| "Debris"
	| "Activity";
export type MilSymbFaction = "friendly" | "hostile" | "neutral" | "unknown";
export type MilSymbEchelon =
	| "team"
	| "squad"
	| "section"
	| "company"
	| "battalion"
	| "regiment"
	| "brigade"
	| "division"
	| "corps";

export type MilSymbMain =
	| "administrative"
	| "air defence"
	| "air traffic services"
	| "ammunition"
	| "amphibious"
	| "analysis"
	| "anti tank"
	| "armoured"
	| "aviation fixed wing"
	| "aviation rotary wing"
	| "chemical biological radiological nuclear defence"
	| "combat service support"
	| "combat support"
	| "combined arms"
	| "corps support"
	| "electronic ordinance disposal"
	| "electronic warfare"
	| "engineer"
	| "field artillery observer"
	| "field artillery"
	| "headquarters"
	| "individual"
	| "infantry"
	| "maintenance"
	| "medical treatment facility"
	| "medical"
	| "military police"
	| "mine"
	| "missile"
	| "mortar"
	| "motorized"
	| "naval"
	| "ordnance"
	| "quartermaster"
	| "radar"
	| "radio"
	| "reconnaissance"
	| "security"
	| "self propelled field artillery"
	| "signal"
	| "sniper"
	| "special forces"
	| "special operations forces"
	| "supply"
	| "tactical mortar"
	| "unmanned systems"
	| "unknown";

export type MilSymbLower =
	| "airborne"
	| "arctic"
	| "bicycle equipped"
	| "demolition"
	| "heavy"
	| "launcher"
	| "light"
	| "long range"
	| "medium range"
	| "mountain"
	| "railroad"
	| "riverine"
	| "short range"
	| "support"
	| "tactical"
	| "vertical of short takeoff and landing"
	| "towed"
	| "wheeled"
	| "None";

export function latexGen(params: {
	type: MilSymbType;
	area: MilSymbArea;
	faction: MilSymbFaction;
	echelon: MilSymbEchelon;
	main: MilSymbMain;
	lower?: MilSymbLower;
}) {
	var type,
		area,
		faction,
		echelon,
		main = { params };
	var contentString = `\\${type}${area}[faction=${faction}, echelon=${echelon}, main=${main}, scale=1]`;
	var fileName = `unit_${faction}_${main}_${echelon}.tex`;
	var filePath = `assets/latex/${fileName}`;
	fs.writeFile(filePath, header + contentString + footer, () => {
		console.log("wrote filename: " + fileName);
		exec("pdflatex -file-line-error " + filePath + " -output-directory assets/latex", (err) => {
			if (err) {
				console.error(err);
				return;
			}
			console.log(
				"Converting " +
					filePath.replace(".tex", ".pdf") +
					" to " +
					" assets/nato_icons/images/" +
					fileName.replace(".tex", ".png")
			);
			exec(
				"magick convert -density 300 " +
					filePath.replace(".tex", ".pdf") +
					" assets/nato_icons/images/" +
					fileName.replace(".tex", ".png")
			);
		});
	});
}
