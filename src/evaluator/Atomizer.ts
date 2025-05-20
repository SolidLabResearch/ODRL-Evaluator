import { Quad, Term } from "@rdfjs/types";
import { DataFactory, NamedNode, Parser, Quad_Object, Quad_Subject, Store } from 'n3';
import { BasicLens, BasicLensM, Cont, extractShapes, subject } from "rdf-lens";
import { SHAPES } from "../shapes/Shapes";
import { ODRL, RDF, REPORT } from "../util/Vocabularies";
const { namedNode, quad } = DataFactory

import { PolicyAtomizer } from "odrl-atomizer";
import { ActivationState, SatisfactionState } from "../util/report/ComplianceReportTypes";
import { parseComplianceReport } from "../util/report/ComplianceReportUtil";


export type Policy = {
    identifier: Term,
    permission: Rule[],
    prohibition: Rule[],
    duty: Rule[]
}
export type Rule = {
    policyID: Term,
    ruleID: Term,
    deonticConcept: Term,
    ruleQuads: Quad[]
}

export type AtomizedRule = Rule & {
    atomizedRuleQuads: Quad[];
}

export type AtomizedEvaluatedRule = AtomizedRule & {
    policyReportQuads: Quad[];
}

const NamedCBDLens = new BasicLens<Cont, Quad[]>(({ id, quads }) => {
    const done = new Set<string>();
    const todo = [id];
    const out: Quad[] = [];
    let item = todo.pop();
    while (item) {
        const found = quads.filter((x) => x.subject.equals(item));
        out.push(...found);
        for (const option of found) {
            const object = option.object;
            if (object.termType !== "BlankNode" && object.termType !== "NamedNode") {
                continue;
            }

            if (done.has(object.value)) continue;
            done.add(object.value);
            todo.push(object);
        }
        item = todo.pop();
    }
    return out;
});

function TypesLens(types: Term[]): BasicLensM<Quad[], Cont<Quad>> {
    return new BasicLensM(quads => {
        return quads
            // filter on incoming types
            .filter(x => x.predicate.equals(RDF.terms.type) && types.some(ty => x.object.equals(ty)))
            // extend Quad to Cont<Quad>
            .map(id => ({ id, quads }));
    })
}

export class Atomizer {
    private readonly shapes: string;

    constructor() {
        this.shapes = SHAPES;
    }

    public async atomizePolicies(policy: Quad[]): Promise<AtomizedRule[]> {
        const parser = new Parser()

        // Create Lens -> ask Arthur for more info: https://github.com/ajuvercr
        const shapeQuads = parser.parse(this.shapes);
        const shapes = extractShapes(shapeQuads, {
            "Permission": ((permission: Rule): Rule => { permission.deonticConcept = ODRL.terms.permission; return permission }) as (item: unknown) => unknown,
            "Prohibition": ((prohibition: Rule): Rule => { prohibition.deonticConcept = ODRL.terms.prohibition; return prohibition }) as (item: unknown) => unknown,
            "Duty": ((duty: Rule): Rule => { duty.deonticConcept = ODRL.terms.duty; return duty }) as (item: unknown) => unknown,
        }, { NamedCBD: NamedCBDLens });
        const aggrementsLens = TypesLens([ODRL.terms.Agreement, ODRL.terms.Set, ODRL.terms.Policy, ODRL.terms.Offer]).thenAll(subject.then(shapes.lenses["Aggreement"]));
        const aggreements = <Policy[]>aggrementsLens.execute(policy);
        const rules = aggreements.flatMap(agreement => [...agreement.permission, ...agreement.prohibition, ...agreement.duty])

        const atomizedRules: AtomizedRule[] = []
        for (const rule of rules) {
            const policyID = rule.policyID as NamedNode;
            const deonticConcept = rule.deonticConcept as NamedNode;
            const ruleID = rule.ruleID as NamedNode;
            // reconstructed policy, possible wrong type of policy, but with the right identifiers
            const policy: Quad[] = [
                quad(policyID, RDF.terms.type, ODRL.terms.Set),
                quad(policyID, deonticConcept, ruleID),
                ...rule.ruleQuads
            ]

            const atomizer = new PolicyAtomizer();
            const atomized = atomizer.loadQuads(policy).atomize();
            const atomizedPolicies = await atomized.getPolicies()
            // will always be one policy
            const atomizedPolicy = atomizedPolicies[0].quads
            atomizedRules.push({ ...rule, atomizedRuleQuads: atomizedPolicy })
        }
        return atomizedRules
    }
    // TODO: rename
    public cleanUp(atomizedEvaluatedRules: AtomizedEvaluatedRule[]): Quad[] {
        const report: Quad[] = []
        for (const rule of atomizedEvaluatedRules) {
            const reportStore = new Store(rule.policyReportQuads)
            const policyReportNodes = reportStore.getSubjects(RDF.type, REPORT.PolicyReport, null);
            const policyReport = parseComplianceReport(policyReportNodes[0], reportStore)

            // take blank node identifier of active rule
            // if none, ake one with most premiseReports satisfied 
            let candidateRuleReport: { id: Term, satisfiedPremises: number, ruleID: Term } = {
                id: policyReport.ruleReport[0].id,
                satisfiedPremises: policyReport.ruleReport[0].premiseReport.filter(report => report.satisfactionState === SatisfactionState.Satisfied).length,
                ruleID: policyReport.ruleReport[0].rule
            }
            let ruleReportQuads = reportStore.getQuads(policyReportNodes[0], REPORT.terms.ruleReport, null, null);

            for (const ruleReport of policyReport.ruleReport) {
                if (ruleReport.activationState === ActivationState.Active) {
                    candidateRuleReport.id = ruleReport.id
                    candidateRuleReport.ruleID = ruleReport.rule
                    break;
                }

                const premisesSatisfied = ruleReport.premiseReport.filter(report => report.satisfactionState === SatisfactionState.Satisfied).length
                if (premisesSatisfied > candidateRuleReport.satisfiedPremises) {
                    candidateRuleReport.id = ruleReport.id
                    candidateRuleReport.satisfiedPremises = premisesSatisfied
                    candidateRuleReport.ruleID = ruleReport.rule
                }
            }
            // remove all references to Rule Reports with blank node identifiers.
            reportStore.removeQuads(ruleReportQuads);
            // add candidate report to the Policy Report (either the active rule report or the one with most premise reports satisfied) .
            reportStore.addQuad(policyReportNodes[0], REPORT.terms.ruleReport, candidateRuleReport.id as Quad_Object)
            // remove the blank node identifier reference from the Rule Report 
            reportStore.removeQuad(candidateRuleReport.id as Quad_Subject, REPORT.terms.rule, candidateRuleReport.ruleID as Quad_Object)
            // add true identifier of the ODRL:Rule back to the Rule Report 
            reportStore.addQuad(candidateRuleReport.id as Quad_Subject, REPORT.terms.rule, rule.ruleID as Quad_Object)

            // extract CBD of reportStore with policy report ID
            const outputReport = NamedCBDLens.execute({ id: policyReportNodes[0], quads: reportStore.getQuads(null, null, null, null) })
            report.push(...outputReport)
        }
        return report
    }
}