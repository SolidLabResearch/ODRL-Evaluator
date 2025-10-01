
import { Literal, NamedNode } from 'n3';

export type PolicyReport = {
    id: NamedNode;
    created: Literal;
    request: NamedNode;
    policy: NamedNode;
    ruleReport: RuleReport[];
}
export type RuleReport = {
    id: NamedNode;
    type: RuleReportType;
    activationState: ActivationState
    rule: NamedNode;
    requestedRule: NamedNode;
    premiseReport: PremiseReport[]
}

export type PremiseReport = {
    id: NamedNode;
    type: PremiseReportType;
    premiseReport: PremiseReport[];
    satisfactionState: SatisfactionState
}

// is it possible to just use REPORT.namespace + "term"?
// https://github.com/microsoft/TypeScript/issues/40793
export enum RuleReportType {
    PermissionReport = 'https://w3id.org/force/compliance-report#PermissionReport',
    ProhibitionReport = 'https://w3id.org/force/compliance-report#ProhibitionReport',
    ObligationReport = 'https://w3id.org/force/compliance-report#ObligationReport',
}
export enum SatisfactionState {
    Satisfied = 'https://w3id.org/force/compliance-report#Satisfied',
    Unsatisfied = 'https://w3id.org/force/compliance-report#Unsatisfied',
}

export enum PremiseReportType {
    ConstraintReport = 'https://w3id.org/force/compliance-report#ConstraintReport',
    PartyReport = 'https://w3id.org/force/compliance-report#PartyReport',
    TargetReport = 'https://w3id.org/force/compliance-report#TargetReport',
    ActionReport = 'https://w3id.org/force/compliance-report#ActionReport',
}

export enum ActivationState {
    Active = 'https://w3id.org/force/compliance-report#Active',
    Inactive = 'https://w3id.org/force/compliance-report#Inactive',
}