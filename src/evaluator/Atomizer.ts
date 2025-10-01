import { Quad, Term } from "@rdfjs/types";
import { DataFactory, NamedNode, Parser, Quad_Object, Quad_Subject, Store } from 'n3';
import { BasicLens, BasicLensM, Cont, extractShapes, subject } from "rdf-lens";
import { SHAPES } from "../shapes/Shapes";
import { ODRL, RDF, REPORT } from "../util/Vocabularies";
const { namedNode, quad } = DataFactory

import { PolicyAtomizer } from "odrl-atomizer";
import { ActivationState, PolicyReport, SatisfactionState } from "../util/report/ComplianceReportTypes";
import { parseComplianceReport } from "../util/report/ComplianceReportUtil";
import { replaceSubject } from "../util/RDFUtil";


/**
 * Represents an ODRL policy containing its identifier and categorized rules.
 */
export type Policy = {
    /** Unique identifier for the policy */
    identifier: Term,
    /** List of permission rules associated with the policy */
    permission: Rule[],
    /** List of prohibition rules associated with the policy */
    prohibition: Rule[],
    /** List of duty rules associated with the policy */
    duty: Rule[]
}

/**
 * Represents a single ODRL rule.
 */
export type Rule = {
    /** Identifier of the policy this rule belongs to */
    policyID: Term,
    /** Unique identifier for the rule */
    ruleID: Term,
    /** Deontic concept (e.g., permission, prohibition, duty) */
    deonticConcept: Term,
    /** RDF quads that define the rule */
    ruleQuads: Quad[]
}

/**
 * Represents an ODRL Rule and its atomized quads
 */
export type AtomizedRule = Rule & {
    atomizedRuleQuads: Quad[];
}


/**
 * Represents an atomized rule that has also been evaluated.
 */
export type AtomizedEvaluatedRule = AtomizedRule & {
    /** RDF quads representing the evaluation report of the policy */
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

    /**
     * Decomposes a compact ODRL Rules from an ODRL policy into a set of atomic rules,
     * where each rule has one action, one target and one assignee.
     *
     * Checkout ODRL Rule Composition §2.7
     * @param {Quad[]} policy - RDF quads representing an ODRL policy with compact rules.
     * @returns {Promise<AtomizedRule[]>} A promise resolving to an array of atomized rules.
     *
     */
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

    /**
     * Consolidates and normalizes compliance reports from atomized and evaluated ODRL rules.
     * 
     * For each rule, it ensures that only one unified policy report is retained per policy,
     * selects the most relevant rule report (active or most satisfied), replaces blank node
     * identifiers with consistent policy-level identifiers, and merges the results.
     *
     * It furthermore ensures that each policy has one Policy Compliance Report
     * 
     * @param {AtomizedEvaluatedRule[]} atomizedEvaluatedRules - Array of evaluated rules with associated policy reports.
     * @returns {Quad[]} A flattened array of RDF quads representing the cleaned-up, unified compliance reports.
     */
    public mergeAtomizedRuleReports(atomizedEvaluatedRules: AtomizedEvaluatedRule[]): Quad[] {
        const report: Quad[] = []
        // map that contains for each policy one Report Identifier. 
        // Used to solve the following issue: One ODRL Policy has multiple Policy Reports at the same time
        const reportMap: Map<string, Term> = new Map();

        for (const rule of atomizedEvaluatedRules) {
            const reportStore = new Store(rule.policyReportQuads)
            const policyReportNodes = reportStore.getSubjects(RDF.type, REPORT.PolicyReport, null);
            const crPolicyIdentifier = policyReportNodes[0] as NamedNode

            const policyReport = parseComplianceReport(crPolicyIdentifier, reportStore)
            const policyIdentifier = policyReport.policy.id

            const actualRuleIdentifier = rule.ruleID as NamedNode;

            if (!reportMap.has(policyIdentifier)) {
                reportMap.set(policyIdentifier, crPolicyIdentifier)
            }

            const normalizedReport = selectBestRuleReport(reportStore, crPolicyIdentifier, actualRuleIdentifier)

            // replace report ID with a unified report ID
            //@ts-ignore
            const outputReport = replaceSubject(normalizedReport, crPolicyIdentifier, reportMap.get(policyIdentifier) as NamedNode)

            report.push(...outputReport)
        }
        return report
    }
}
/**
 * Selects the most relevant rule report from a policy report—either the active one,
 * or the one with the most satisfied premises—and replaces blank node identifiers
 * with original rule identifiers in the RDF store.
 *
 * @param {Store} reportStore - RDF store containing the full report quads.
 * @param {NamedNode} reportIdentifier - RDF subjects representing the policy report.
 * @param {NamedNode} ruleIdentifier - The original rule identifier.
 * @returns {Quad[]} Extracted RDF quads representing the finalized policy report.
 */
function selectBestRuleReport(reportStore: Store, reportIdentifier: NamedNode, ruleIdentifier: NamedNode): Quad[] {
    const policyReport = parseComplianceReport(reportIdentifier, reportStore)

    // if none, take one with most premiseReports satisfied 
    let candidateRuleReport: { id: Term, satisfiedPremises: number, ruleID: Term } = {
        id: policyReport.ruleReport[0].id,
        satisfiedPremises: policyReport.ruleReport[0].premiseReport.filter(report => report.satisfactionState === SatisfactionState.Satisfied).length,
        ruleID: policyReport.ruleReport[0].rule
    }
    let ruleReportQuads = reportStore.getQuads(reportIdentifier, REPORT.terms.ruleReport, null, null);

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
    reportStore.addQuad(reportIdentifier, REPORT.terms.ruleReport, candidateRuleReport.id as Quad_Object)
    // remove the blank node identifier reference from the Rule Report 
    reportStore.removeQuad(candidateRuleReport.id as Quad_Subject, REPORT.terms.rule, candidateRuleReport.ruleID as Quad_Object)
    // add true identifier of the ODRL:Rule back to the Rule Report 
    reportStore.addQuad(candidateRuleReport.id as Quad_Subject, REPORT.terms.rule, ruleIdentifier as Quad_Object)

    // extract CBD of reportStore with policy report ID
    const extractedReport = NamedCBDLens.execute({ id: reportIdentifier, quads: reportStore.getQuads(null, null, null, null) })
    return extractedReport
}