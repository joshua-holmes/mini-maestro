import Soprano from "./soprano.js";

const sop = new Soprano();
const mel = ['A', 'B', 'C', 'D', 'E', 'F']
const har = [['c', 'e', 'g']]

console.log("HAR", sop.analyzeHarmony(har, 13))
console.log("RESULT", sop.harmonicallyLimit(har, 13, 0))