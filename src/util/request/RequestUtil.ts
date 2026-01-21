import { DataFactory, Quad, Store } from "n3";
import { createRandomUrn } from "../Util";
import { DC, ODRL, RDF, SOTW } from "../Vocabularies";
import { Constraint, constraintToQuads } from "../policy/PolicyUtil";
const { namedNode, quad, literal } = DataFactory;
/**
 * Represents an ODRL-Evaluator-style Request.
 *
 * A Request models an assignment of an Action on a Resource to an Assignee,
 * together with contextual Constraints.
 */
export interface Request {
    /** The party to whom the policy applies (ODRL Party). */
    assignee: string;

    /** The asset being acted upon (ODRL Asset). */
    resource: string;

    /** The operation permitted, prohibited, or obliged (ODRL Action). */
    action: string;

    /** Globally unique URN identifier for this Request. */
    identifier: string;

    /** List of constraints (ODRL Constraint) defining the context. */
    context: Constraint[];

    /** A description of the request. */
    description?: string;
}

/**
 * Constructs a new Request object with normalized constraints and unique identifiers.
 *
 * - Each Constraint is assigned a URN identifier via createRandomUrn().
 * - The operator defaults to odrl:eq if not provided.
 * - The Request itself is assigned a URN identifier.
 *
 * @param input - The request definition including assignee, resource, action, and constraints.
 * @returns A fully normalized Request object ready for ODRL-compliant evaluation.
 */
export function createRequest(input: {
    assignee: string;
    resource: string;
    action: string;
    context: {
        leftOperand: string;
        rightOperand: string;
        operator?: string; // optional, defaults to ODRL.eq
    }[];
}): Request {
    const normalizedContext: Constraint[] = input.context.map(c => ({
        identifier: createRandomUrn(),
        leftOperand: c.leftOperand,
        rightOperand: c.rightOperand,
        operator: c.operator ?? ODRL.eq
    }));

    return {
        assignee: input.assignee,
        resource: input.resource,
        action: input.action,
        identifier: createRandomUrn(),
        context: normalizedContext
    };
}

/**
 * 
 * @param request 
 * @param permissionID TODO: must be removed for the future version of the evaluation request
 * @returns 
 */
export function makeRDFRequest(request: Request, permissionID?: string): Quad[] {
    const quads: Quad[] = [];
    const requestNode = namedNode(request.identifier);

    // Create a Permission node
    const permissionId = permissionID ?? createRandomUrn();
    const permissionNode = namedNode(permissionId);

    // Request triples
    quads.push(quad(requestNode, RDF.terms.type, ODRL.terms.Request));
    quads.push(quad(requestNode, ODRL.terms.uid, requestNode));
    quads.push(quad(requestNode, ODRL.terms.permission, permissionNode));
    if (request.description) {quads.push(quad(requestNode, DC.terms.description, literal(request.description)));}

    // Permission triples
    quads.push(quad(permissionNode, RDF.terms.type, ODRL.terms.Permission));
    quads.push(quad(permissionNode, ODRL.terms.assignee, namedNode(request.assignee)));
    quads.push(quad(permissionNode, ODRL.terms.action, namedNode(request.action))); // NOTE: no check performed whether it is an actual ODRL Action
    quads.push(quad(permissionNode, ODRL.terms.target, namedNode(request.resource)));

    request.context.forEach(c => {
        const constraintNode = namedNode(c.identifier);
        quads.push(quad(permissionNode, SOTW.terms.context, constraintNode));

        quads.push(...constraintToQuads(c))
  });
  return quads
}

/**
 * Get the identifier of an ODRL request.
 * The expectation is that there is only one present.
 * @param quads 
 * @returns 
 */
export function getRequestIdentifier(quads: Quad[]): string {
    const store = new Store(quads);
    const requestNodes = store.getQuads(null, RDF.terms.type, ODRL.terms.Request, null);

    if (requestNodes.length !== 1) {
        throw Error(`Expected one ODRL request identifier. Found ${requestNodes.length}`);
    }
    return requestNodes[0].subject.id;
}