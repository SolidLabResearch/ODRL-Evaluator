import type { Quad } from '@rdfjs/types';
import { Store } from 'n3'
import { Reasoner } from "../reasoner/Reasoner";
import { EyeJsReasoner } from "../reasoner/EyeJsReasoner";
import { RULES, SIMPLE_RULES} from '../rules/Rules'

export interface Engine {
    evaluate(input: Quad[]): Promise<Quad[]>;
}

export class ODRLN3Engine implements Engine {
    protected readonly reasoner: Reasoner;
    protected readonly rules: string[];

    constructor(reasoner: Reasoner, rules: string[]) {
        this.reasoner = reasoner;
        this.rules = rules;
    }

    public async evaluate(input: Quad[]): Promise<Quad[]> {
        const evaluation = await this.reasoner.reason(new Store(input), this.rules);
        return evaluation.getQuads(null, null, null, null);
    }
}
export class ODRLEngine extends ODRLN3Engine {
    constructor(reasoner?: Reasoner) {
        reasoner = reasoner ?? new EyeJsReasoner();
        super(reasoner, SIMPLE_RULES);
    }
}


export class ODRLEngineMultipleSteps extends ODRLN3Engine {
    constructor(config?: {reasoner?: Reasoner, rules?: string[]}) {
        const reasoner = config?.reasoner ?? new EyeJsReasoner();
        const rules = config?.rules ?? RULES;
        super(reasoner, rules );
    }

    public async evaluate(input: Quad[]): Promise<Quad[]> {
        const complianceReportQuads: Quad[] = [];
        const store = new Store(input);

        for (const rule of this.rules){
            const evaluation = await this.reasoner.reason(store, [rule]);
            complianceReportQuads.push(...evaluation.getQuads(null, null, null, null));
            store.addQuads(complianceReportQuads)
        }
        return complianceReportQuads;
    }
}