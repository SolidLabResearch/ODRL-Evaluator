import type { Quad } from '@rdfjs/types';
import { Store } from 'n3'
import { Reasoner } from "../reasoner/Reasoner";
import { EyeJsReasoner } from "../reasoner/EyeJsReasoner";
import * as path from "path"
import * as fs from "fs"
import { combineNotation3, combineNotation3Files } from '../util/Notation3Util';

export interface Engine {
    evaluate(input: Quad[]): Promise<Quad[]>;
}

export class ODRLN3Engine implements Engine {
    protected readonly reasoner: Reasoner;
    protected readonly rules: string;

    constructor(reasoner: Reasoner, rules: string) {
        this.reasoner = reasoner;
        this.rules = rules;
    }

    public async evaluate(input: Quad[]): Promise<Quad[]> {
        const evaluation = await this.reasoner.reason(new Store(input), [this.rules]);
        return evaluation.getQuads(null, null, null, null);
    }
}
export class ODRLEngine extends ODRLN3Engine {
    constructor(reasoner?: Reasoner) {
        reasoner = reasoner ?? new EyeJsReasoner();
        const ruleDir = path.join(path.dirname(__filename), "..", "rules");
        const rulePath = path.join(ruleDir, "simpleRules.n3");
        const rules = fs.readFileSync(rulePath, "utf-8");
        super(reasoner, rules);
    }
}

export class ODRLEngineMultipleSteps extends ODRLN3Engine {
    private readonly firstStepRules: string;
    private readonly secondStepRules: string;
    
    constructor(reasoner?: Reasoner) {
        reasoner = reasoner ?? new EyeJsReasoner();
        const ruleDir = path.join(path.dirname(__filename), "..", "rules");

        // note: if there are more steps than two, this MUST be made into a function.
        // This also applies to the class variables and evaluate function.
        const fileNamesRulesFirst = ["built-ins.n3", "constraints.n3", "report.n3", "odrl-voc.ttl", "odrl-voc-inferences.ttl"]; 
        const fileNamesRulesSecond = ["activation-state.n3"];

        const firstStepRulePaths = fileNamesRulesFirst.map(fileName => path.join(ruleDir, fileName));
        const secondStepRulePaths = fileNamesRulesSecond.map(fileName => path.join(ruleDir, fileName));
        
        const firstStepRules = combineNotation3Files(firstStepRulePaths);
        const secondStepRules = combineNotation3Files(secondStepRulePaths);
        
        super(reasoner, combineNotation3([firstStepRules, secondStepRules]) );
        this.firstStepRules = firstStepRules;
        this.secondStepRules = secondStepRules;
    }

    public async evaluate(input: Quad[]): Promise<Quad[]> {
        const complianceReportQuads: Quad[] = [];
        const store = new Store(input);

        const firstEvaluation = await this.reasoner.reason(store,[this.firstStepRules]);
        
        // The first evaluation creates a partial report. Now reason again over the same input + partial evaluation report
        complianceReportQuads.push(...firstEvaluation.getQuads(null, null, null, null));
        store.addQuads(complianceReportQuads)

        // might be a problem that store is re-used?
        const secondEvaluation = await this.reasoner.reason(store,[this.secondStepRules]);

        complianceReportQuads.push(...secondEvaluation.getQuads(null, null, null, null));
        return complianceReportQuads;
    }
}