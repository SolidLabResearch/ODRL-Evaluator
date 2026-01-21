
import { Quad } from '@rdfjs/types';
import { DataFactory } from 'n3';
import { DC, RDF, REPORT } from '../Vocabularies';
import { PolicyReport, PremiseReport, RuleReport } from './ComplianceReportTypes';
const { quad,namedNode } = DataFactory;

export function serializeComplianceReport(report: PolicyReport): Quad[] {
    const quads: Quad[] = [];

    quads.push(quad(report.id, RDF.terms.type, REPORT.terms.PolicyReport));
    quads.push(quad(report.id, DC.terms.created, report.created));
    if (report.request){
        quads.push(quad(report.id, REPORT.terms.policyRequest, report.request));
    }
    quads.push(quad(report.id, REPORT.terms.policy, report.policy));

    for (const rr of report.ruleReport) {
        quads.push(quad(report.id, REPORT.terms.ruleReport, rr.id));
        quads.push(...serializeRuleReport(rr));
    }

    return quads;
}


export function serializeRuleReport(ruleReport: RuleReport): Quad[] {
    const quads: Quad[] = [];

    quads.push(quad(ruleReport.id, RDF.terms.type, namedNode(ruleReport.type)));
    quads.push(quad(ruleReport.id, REPORT.terms.rule, ruleReport.rule));
    if (ruleReport.requestedRule){
        quads.push(quad(ruleReport.id, REPORT.terms.ruleRequest, ruleReport.requestedRule));
    }

    if (ruleReport.attemptState) {
        quads.push(quad(ruleReport.id, REPORT.terms.attemptState, namedNode(ruleReport.attemptState)));
    }
    
    if (ruleReport.activationState) {
        quads.push(quad(ruleReport.id, REPORT.terms.activationState, namedNode(ruleReport.activationState)));
    }
    if (ruleReport.performanceState) {
        quads.push(quad(ruleReport.id, REPORT.terms.performanceState, namedNode(ruleReport.performanceState)));
    }
    if (ruleReport.deonticState) {
        quads.push(quad(ruleReport.id, REPORT.terms.deonticState, namedNode(ruleReport.deonticState)));
    }

    for (const pr of ruleReport.premiseReport) {
        quads.push(quad(ruleReport.id, REPORT.terms.premiseReport, pr.id));
        quads.push(...serializePremiseReport(pr));
    }

    for (const condition of ruleReport.conditionReport) {
        quads.push(quad(ruleReport.id, REPORT.terms.conditionReport, condition));
    }

    return quads;
}


export function serializePremiseReport(premiseReport: PremiseReport): Quad[] {
    const quads: Quad[] = [];

    quads.push(quad(premiseReport.id, RDF.terms.type, namedNode(premiseReport.type)));
    quads.push(quad(premiseReport.id, REPORT.terms.satisfactionState, namedNode(premiseReport.satisfactionState)));

    for (const nested of premiseReport.premiseReport) {
        quads.push(quad(premiseReport.id, REPORT.terms.premiseReport, nested.id));
        quads.push(...serializePremiseReport(nested));
    }
    if (premiseReport.constraint) {
        quads.push(quad(premiseReport.id, REPORT.terms.constraint, premiseReport.constraint));
    }

    return quads;
}
