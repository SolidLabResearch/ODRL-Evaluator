import * as path from "path"
import * as fs from "fs"
import { combineNotation3Files } from "../src/util/Notation3Util";

const ruleDir = path.join(path.dirname(__filename), "..", "src", "rules");

// initialize the rules as a ts file (constant)such that it can be used in the browser
function rules() {
    const multipleRunRules = createMultipleRunRules();
    const simpleRules = createSimpleRules();

    const rules = multipleRunRules + '\n' + simpleRules;
    fs.writeFileSync(path.join(ruleDir, "Rules.ts"), rules);

}

function createMultipleRunRules(): string {
    const fileNamesRulesFirst = ["built-ins.n3", "constraints.n3", "report.n3", "odrl-voc.ttl", "odrl-voc-inferences.ttl"];
    const fileNamesRulesSecond = ["activation-state.n3"];
    
    const firstStepRulePaths = fileNamesRulesFirst.map(fileName => path.join(ruleDir, fileName));
    const secondStepRulePaths = fileNamesRulesSecond.map(fileName => path.join(ruleDir, fileName));
    
    const firstStepRules = combineNotation3Files(firstStepRulePaths);
    const secondStepRules = combineNotation3Files(secondStepRulePaths);
    const rules = `export const RULES: string[] = [\`${firstStepRules}\`, \`${secondStepRules}\`];`;
    return rules
}


function createSimpleRules(): string {
    const ruleName = 'simpleRules.n3';
    const rulePath = path.join(ruleDir, ruleName);
    const simpleRules = fs.readFileSync(rulePath, "utf-8");
    const rules = `export const SIMPLE_RULES: string[] = [\`${simpleRules}\`];`;
    return rules;
}   

rules()


