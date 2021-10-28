import { Brigade } from "./compositions/Brigade";
import { Division } from "./compositions/Division";
import fs from "fs";
const div1 = new Division({ alignment: "bluefor", name: "1st Division" });
// console.log(div1.displayDetails());

fs.writeFileSync("src/output.csv", "name,alignment,corps,commander,symbol,id,parentId,size\n");
div1.writeCSV();
