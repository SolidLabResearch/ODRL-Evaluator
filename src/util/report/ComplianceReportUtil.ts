import { Literal, NamedNode, Quad_Subject, Store } from 'n3';
import { DC, RDF, REPORT } from '../Vocabularies';
import { ActivationState, PolicyReport, PremiseReport, PremiseReportType, RuleReport, RuleReportType, SatisfactionState } from './ComplianceReportTypes';


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
* Parses Premise Reports, including premises of a Premise Report itself.
* Note that if for some reason there are circular premise reports, this will result into an infinite loop
* @param identifier
* @param store
*/
export function parsePremiseReport(identifier: Quad_Subject, store: Store): PremiseReport {
    const nestedPremises = store.getObjects(identifier, REPORT.PremiseReport, null) as NamedNode[];
    return {
        id: identifier as NamedNode,
        type: store.getObjects(identifier, RDF.type, null)[0].value as PremiseReportType,
        premiseReport: nestedPremises.map((prem) => parsePremiseReport(prem, store)),
        satisfactionState: store.getObjects(identifier, REPORT.satisfactionState, null)[0].value as SatisfactionState
    }
}
