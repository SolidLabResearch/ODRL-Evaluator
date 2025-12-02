import { Literal, NamedNode, Quad_Subject, Store } from 'n3';
import { DC, RDF, REPORT } from '../Vocabularies';
import { ActivationState, PolicyReport, PremiseReport, PremiseReportType, RuleReport, RuleReportType, SatisfactionState } from './ComplianceReportTypes';
import { Quad } from '@rdfjs/types';

/**
 * Parses a single compliance report from a given set of RDF quads.
 * Ensures that exactly one PolicyReport exists in the provided quads.
 *
 * @param quads - The RDF quads representing the compliance report data.
 * @returns The parsed PolicyReport object.
 * @throws Error if there is not exactly one PolicyReport in the quads.
 */
export function parseSingleComplianceReport(quads: Quad[]): PolicyReport {
    const store = new Store(quads);
    const identifiers = store.getQuads(null, RDF.type, REPORT.PolicyReport, null)
    if (identifiers.length !== 1) { throw Error("Expected only one Compliance Report") }
    return parseComplianceReport(identifiers[0].subject, store);
}

/**
 * Parses a compliance report identified by a subject node from the RDF store.
 *
 * @param identifier - The RDF subject identifying the PolicyReport.
 * @param store - The RDF store containing the quads to parse.
 * @returns The parsed PolicyReport object.
 * @throws Error if no PolicyReport exists for the given identifier.
 */
export function parseComplianceReport(identifier: Quad_Subject, store: Store): PolicyReport {
    const exists = store.getQuads(identifier, RDF.type, REPORT.PolicyReport, null).length === 1;
    if (!exists) { throw Error(`No Policy Report found with: ${identifier}.`); }
    const ruleReportNodes = store.getObjects(identifier, REPORT.ruleReport, null) as NamedNode[];

    return {
        id: identifier as NamedNode,
        created: store.getObjects(identifier, DC.created, null)[0] as Literal,
        policy: store.getObjects(identifier, REPORT.policy, null)[0] as NamedNode,
        request: store.getObjects(identifier, REPORT.policyRequest, null)[0] as NamedNode,
        ruleReport: ruleReportNodes.map(ruleReportNode => parseRuleReport(ruleReportNode, store))
    }
}

/**
* Parses Rule Reports from a Compliance Report, including its premises
* @param identifier
* @param store
*/
export function parseRuleReport(identifier: Quad_Subject, store: Store): RuleReport {
    const premiseNodes = store.getObjects(identifier, REPORT.premiseReport, null) as NamedNode[];
    return {
        id: identifier as NamedNode,
        type: store.getObjects(identifier, RDF.type, null)[0].value as RuleReportType,
        activationState: store.getObjects(identifier, REPORT.activationState, null)[0].value as ActivationState,
        requestedRule: store.getObjects(identifier, REPORT.ruleRequest, null)[0] as NamedNode,
        rule: store.getObjects(identifier, REPORT.rule, null)[0] as NamedNode,
        premiseReport: premiseNodes.map((prem) => parsePremiseReport(prem, store))
    }
}

/**
 * Parses Premise Reports, including nested premises of a Premise Report itself.
 * Detects and prevents infinite recursion caused by circular premise references.
 *
 * @param identifier - The RDF subject identifying the PremiseReport.
 * @param store - The RDF store containing the quads to parse.
 * @param visited - A set of identifiers already visited in the current recursion chain.
 *                  Used internally to detect cycles. Defaults to an empty set.
 * @returns The parsed PremiseReport object.
 * @throws Error if a circular premise report is detected.
 */
export function parsePremiseReport(
  identifier: Quad_Subject,
  store: Store,
  visited: Set<string> = new Set()
): PremiseReport {
    const idStr = (identifier as NamedNode).value;
    if (visited.has(idStr)) {
        throw new Error(`Circular premise report detected at ${idStr}`);
    }
    visited.add(idStr);

    const nestedPremises = store.getObjects(identifier, REPORT.PremiseReport, null) as NamedNode[];
    return {
        id: identifier as NamedNode,
        type: store.getObjects(identifier, RDF.type, null)[0].value as PremiseReportType,
        premiseReport: nestedPremises.map((prem) => parsePremiseReport(prem, store)),
        satisfactionState: store.getObjects(identifier, REPORT.satisfactionState, null)[0].value as SatisfactionState
    }
}
