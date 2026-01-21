import { Literal, NamedNode, Quad_Subject, Store } from 'n3';
import { DC, RDF, REPORT } from '../Vocabularies';
import { ActivationState, AttemptState, DeonticState, PerformanceState, PolicyReport, PremiseReport, PremiseReportType, RuleReport, RuleReportType, SatisfactionState } from './ComplianceReportTypes';
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
    const activationState = parseSingleState(
        store,
        identifier,
        REPORT.activationState,
        ActivationState,
    );

    const attemptState = parseSingleState(
        store,
        identifier,
        REPORT.attemptState,
        AttemptState,
    );

    const performanceState = parseSingleState(
        store,
        identifier,
        REPORT.performanceState,
        PerformanceState,
    );

    const deonticState = parseSingleState(
        store,
        identifier,
        REPORT.deonticState,
        DeonticState,
    );


    return {
        id: identifier as NamedNode,
        type: store.getObjects(identifier, RDF.type, null)[0].value as RuleReportType,
        requestedRule: store.getObjects(identifier, REPORT.ruleRequest, null)[0] as NamedNode,
        rule: store.getObjects(identifier, REPORT.rule, null)[0] as NamedNode,
        premiseReport: premiseNodes.map((prem) => parsePremiseReport(prem, store)),
        conditionReport: store.getObjects(identifier, REPORT.conditionReport, null) as NamedNode[],

        activationState,
        attemptState,
        performanceState,
        deonticState
    };
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

    const nestedPremises = store.getObjects(identifier, REPORT.premiseReport, null) as NamedNode[];

    let premiseReport: PremiseReport = {
        id: identifier as NamedNode,
        type: store.getObjects(identifier, RDF.type, null)[0].value as PremiseReportType,
        premiseReport: nestedPremises.map((prem) => parsePremiseReport(prem, store, visited)),
        satisfactionState: parseSingleState(store, identifier, REPORT.satisfactionState, SatisfactionState)
    }

    if (premiseReport.type === PremiseReportType.ConstraintReport) {
        if (store.getObjects(identifier, REPORT.constraint, null).length !== 1) throw new Error("Expected one constraint");
        const constraintID = store.getObjects(identifier, REPORT.constraint, null)[0] as NamedNode;
        premiseReport.constraint = constraintID
    }
    return premiseReport
}

/**
 * Extracts exactly one state value from an N3 store and validates it
 * against a provided enum of allowed values.
 *
 * This helper enforces three guarantees:
 * 1. At most one value exists for the given subject–predicate pair.
 * 2. If a value exists, it must match one of the allowed enum values.
 * 3. Returns `undefined` when no value is present.
 *
 * The human‑readable label used in error messages is automatically derived
 * from the predicate URI by taking the last path or fragment segment.
 *
 * @template T - An enum-like object whose values represent valid states.
 *
 * @param store - The N3 store containing RDF quads.
 * @param subject - The subject node from which the state is extracted.
 * @param predicate - The predicate identifying the state property (as a URI string).
 * @param allowed - The enum of allowed values for this state.
 *
 * @returns The validated state value, or `undefined` if no value is present.
 *
 * @throws Error
 * Thrown when:
 * - More than one value is found for the given predicate.
 * - The found value does not match any allowed enum value.
 */
function parseSingleState<T extends Record<string, string>>(
  store: Store,
  subject: NamedNode | Quad_Subject,
  predicate: string,
  allowed: T
): T[keyof T] | undefined {
  // Derive label from last path or fragment segment
  const label =
    predicate.split('#').pop()?.split('/').pop() ??
    predicate;

  const objects = store.getObjects(subject, predicate, null);

  if (objects.length > 1) {
    throw new Error(`Multiple ${label} values found for ${subject.value}`);
  }

  if (objects.length === 0) {
    return undefined;
  }

  const value = objects[0].value;
  const allowedValues = Object.values(allowed);

  if (!allowedValues.includes(value)) {
    throw new Error(`Invalid ${label} value for ${subject.value}: ${value}`);
  }

  return value as T[keyof T];
}

