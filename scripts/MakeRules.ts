import * as path from "path"
import * as fs from "fs"
import { combineNotation3Files } from "../src/util/Notation3Util";

// initialize the rules as ts class such that it can be used in the browser
const ruleDir = path.join(path.dirname(__filename), "..", "src", "rules");
const fileNamesRulesFirst = ["built-ins.n3", "constraints.n3", "report.n3", "odrl-voc.ttl", "odrl-voc-inferences.ttl"];
const fileNamesRulesSecond = ["activation-state.n3"];

const firstStepRulePaths = fileNamesRulesFirst.map(fileName => path.join(ruleDir, fileName));
const secondStepRulePaths = fileNamesRulesSecond.map(fileName => path.join(ruleDir, fileName));

const firstStepRules = combineNotation3Files(firstStepRulePaths);
const secondStepRules = combineNotation3Files(secondStepRulePaths);
const rules = `export const RULES: string[] = [\`${firstStepRules}\`, \`${secondStepRules}\`];`
fs.writeFileSync(path.join(ruleDir, "Rules.ts"), rules)