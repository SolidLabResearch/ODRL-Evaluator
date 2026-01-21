
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
    attemptState?: AttemptState ;
    activationState?: ActivationState
    performanceState?: PerformanceState
    deonticState?: DeonticState
    rule: NamedNode;
    requestedRule: NamedNode;
    premiseReport: PremiseReport[];
    conditionReport: NamedNode[];
}

export type PremiseReport = {
    id: NamedNode;
    type: PremiseReportType;
    premiseReport: PremiseReport[];
    satisfactionState: SatisfactionState;
    constraint?: NamedNode
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

export enum AttemptState {
    Attempted = 'https://w3id.org/force/compliance-report#Attempted',
    NotAttempted = 'https://w3id.org/force/compliance-report#NotAttempted',  
}

export enum PerformanceState {
    Performed = 'https://w3id.org/force/compliance-report#Performed',
    Unperformed = 'https://w3id.org/force/compliance-report#Unperformed',  
    Unknown = 'https://w3id.org/force/compliance-report#Unknown',  
}

export enum DeonticState {
    NonSet = 'https://w3id.org/force/compliance-report#NonSet',
    Violated = 'https://w3id.org/force/compliance-report#Violated',  
    Fulfilled = 'https://w3id.org/force/compliance-report#Fulfilled',   
}