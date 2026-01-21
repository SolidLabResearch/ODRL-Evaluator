import { Quad, DataFactory, Writer, Store } from 'n3';
import { RDF, ODRL, XSD, DC } from '../Vocabularies';
import { createRandomUrn } from '../Util';
const { namedNode, quad, literal } = DataFactory;
/**
 * A generic ODRL Policy.
 *
 * A Policy groups one or more Rules (Permissions, Prohibitions, Duties).
 */
export interface Policy {
    /** Globally unique identifier for the Policy. */
    identifier: string;

    /** The type of Policy (Policy, Offer, Agreement, Request). */
    type: string

    /** The set of rules contained in this Policy. */
    rules: Rule[];

    /** A description of the request. */
    description?: string;
}

/**
 * A generic ODRL Rule.
 *
 * A Rule defines the assignee, target resource, action, and optional constraints.
 * It can be specialized into Permission, Prohibition, or Duty.
 */
export interface Rule {
    /** Globally unique identifier for the Rule. */
    identifier: string;

    /** The party to whom the Rule applies (ODRL Party). */
    assignee: string;

    /** The asset under policy control (ODRL Asset). */
    target: string;

    /** The action being permitted, prohibited, or obliged (ODRL Action). */
    action: string;

    /** The type of Rule (Permission, Prohibition, Duty). */
    type: string

    /** Optional constraints refining applicability of the Rule. Empty list means no constraints. */
    constraints: Constraint[];
}

/**
 * An ODRL Constraint.
 *
 * Defines logical conditions that must hold for a Rule to apply.
 */
export interface Constraint {
    /** Globally unique identifier for the Constraint. */
    identifier: string;

    /** The attribute being tested (ODRL leftOperand). */
    leftOperand: string;

    /** The comparison operator (ODRL Operator). */
    operator: string;

    /** The value against which the leftOperand is compared. */
    rightOperand: string;
}

/**
 * Constructs a new Policy object with unique identifiers.
 *
 * - The Policy itself is assigned a URN identifier via createRandomUrn().
 * - The Policy be default is an odrl:Agreement.
 * - Each Rule is assigned a URN identifier via createRandomUrn().
 * - Each Constraint is assigned a URN identifier via createRandomUrn().
 *
 * @param input - The policy definition including type and rules.
 * @returns A Policy object.
 */
export function createPolicy(input: {
    type?: string;
    rules: {
        assignee: string;
        target: string;
        action: string;
        type: string
        constraints?: {
            leftOperand: string;
            rightOperand: string;
            operator: string;
        }[];
    }[];
}): Policy {
    const normalizedRules: Rule[] = input.rules.map(r => {
        const normalizedConstraints: Constraint[] = r.constraints?.map(c => ({
            identifier: createRandomUrn(),
            leftOperand: c.leftOperand,
            rightOperand: c.rightOperand,
            operator: c.operator
        })) ?? [];

        return {
            identifier: createRandomUrn(),
            assignee: r.assignee,
            target: r.target,
            action: r.action,
            type: r.type,
            constraints: normalizedConstraints
        };
    });

    return {
        identifier: createRandomUrn(),
        type: input.type ?? ODRL.Agreement,
        rules: normalizedRules
    };
}


/**
 * Serialize a Policy into RDF quads.
 */
export function policyToQuads(policy: Policy): Quad[] {
    const quads: Quad[] = [];
    const policyNode = namedNode(policy.identifier);

    // Policy triples
    quads.push(quad(policyNode, RDF.terms.type, namedNode(policy.type)));
    quads.push(quad(policyNode, ODRL.terms.uid, policyNode));
    if (policy.description) { quads.push(quad(policyNode, DC.terms.description, literal(policy.description))); }

    // Rules
    policy.rules.forEach(rule => {
        const ruleNode = namedNode(rule.identifier);

        // Link policy to rule depending on type
        let linkPredicate;
        let ruleClass;
        switch (rule.type) {
            case ODRL.Permission:
                linkPredicate = ODRL.terms.permission;
                ruleClass = ODRL.terms.Permission;
                break;
            case ODRL.Prohibition:
                linkPredicate = ODRL.terms.prohibition;
                ruleClass = ODRL.terms.Prohibition;
                break;
            case ODRL.Duty:
                linkPredicate = ODRL.terms.duty;
                ruleClass = ODRL.terms.Duty;
                break;
            default:
                throw new Error(`Unknown rule type: ${rule.type}`);
        }

        quads.push(quad(policyNode, linkPredicate, ruleNode));
        quads.push(quad(ruleNode, RDF.terms.type, ruleClass));

        // Rule properties
        quads.push(quad(ruleNode, ODRL.terms.assignee, namedNode(rule.assignee)));
        quads.push(quad(ruleNode, ODRL.terms.action, namedNode(rule.action)));
        quads.push(quad(ruleNode, ODRL.terms.target, namedNode(rule.target)));

        // Constraints
        rule.constraints?.forEach(c => {
            const constraintNode = namedNode(c.identifier);
            quads.push(quad(ruleNode, ODRL.terms.constraint, constraintNode));

            quads.push(...constraintToQuads(c))
        });
    });

    return quads;
}

export function constraintToQuads(constraint: Constraint) {
    const quads: Quad[] = []
    const constraintNode = namedNode(constraint.identifier);
    quads.push(quad(constraintNode, RDF.terms.type, ODRL.terms.Constraint));
    quads.push(quad(constraintNode, ODRL.terms.leftOperand, namedNode(constraint.leftOperand)));
    quads.push(quad(constraintNode, ODRL.terms.operator, namedNode(constraint.operator)));
    switch (constraint.leftOperand) {
        case ODRL.dateTime:
            quads.push(quad(constraintNode, ODRL.terms.rightOperand,
                literal(constraint.rightOperand, XSD.terms.dateTime)));
            break;
        case ODRL.purpose:
            quads.push(quad(constraintNode, ODRL.terms.rightOperand, namedNode(constraint.rightOperand)));
            break;
        case ODRL.deliveryChannel:
            quads.push(quad(constraintNode, ODRL.terms.rightOperand, namedNode(constraint.rightOperand)));
            break;
        default:
            throw Error("This kind of ODRL constraint has not been thought about properly, feel free to add. We accept Pull Requests.");
    }

    return quads
}

/**
 * Get the identifier of an ODRL policy.
 * The expectation is that there is only one present.
 * 
 * Classes of policies that are taken into account: Policy, Offer, Set and Agreement.
 * As disccused in issue 5 (https://github.com/woutslabbinck/UCR-test-suite/issues/5)
 * Context:
 * The policy must either be a Set or an Agreement (see Formal Semantics §2).
 * But, it should still be possible to evaluate an Offer.
 * Note: if you use policy, you use the default which is Set (ODRL Information model  §2.1)
 * 
 * @param quads 
 * @returns 
 */
export function getPolicyIdentifier(quads: Quad[]): string {
    const store = new Store(quads);
    const policyNodes: Quad[] = [];
    policyNodes.push(
        ...store.getQuads(null, RDF.terms.type, ODRL.terms.Set, null),
        ...store.getQuads(null, RDF.terms.type, ODRL.terms.Agreement, null),
        ...store.getQuads(null, RDF.terms.type, ODRL.terms.Policy, null),
        ...store.getQuads(null, RDF.terms.type, ODRL.terms.Offer, null)
    );
    const policyIdentifiers: Set<string> = new Set(policyNodes.map(quad => quad.subject.id));

    if (policyIdentifiers.size !== 1) {
        throw Error(`Expected one ODRL policy. Found ${policyIdentifiers.size}`);
    }

    return Array.from(policyIdentifiers)[0];
}