import fs from "fs";
import { exec } from "child_process";
var header = fs.readFileSync("assets/latex/template_start.tex", "utf8");
var footer = fs.readFileSync("assets/latex/template_end.tex", "utf8");
var corps = "armoured";
var type = "Mil";
var area = "Land";
var faction = "friendly";
var echelon = "battalion";
var main = corps;

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
