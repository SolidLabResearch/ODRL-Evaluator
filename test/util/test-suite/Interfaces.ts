import { DataFactory, NamedNode, Quad as QuadN3, Store } from "n3";
import { Quad as QuadRDFJS } from "@rdfjs/types";
import { DC, RDF } from "../../../src/util/Vocabularies";
import { getPolicyIdentifier } from "../../../src/util/policy/PolicyUtil";
import { getRequestIdentifier } from "../../../src/util/request/RequestUtil";
const { namedNode } = DataFactory
/**
 * A representation of a resource.
 */
export interface Representation {
    /**
     * The corresponding identifier. 
     * There can only be one per resource
     */
    identifier: NamedNode;

    /**
     * The data store for this representation.
     * Our assumption currently is that all data is going to be RDF
     */
    data: QuadN3[] | QuadRDFJS[];

    /**
     * A description string of what the representation should represent.
     */
    description: string;

    /**
     * A short name of the representation. Can be used to create filenames.
     */
    slug?: string;
}


export enum RepresentationType {
    Policy = 'http://www.w3.org/ns/odrl/2/Policy',
    EvaluationRequest = 'https://w3id.org/force/sotw#EvaluationRequest',
    StateOfTheWorld = 'https://w3id.org/force/sotw#SotW',
    ComplianceReport = 'https://w3id.org/force/compliance-report#PolicyReport',
    TestCase = 'https://w3id.org/force/TestCase',
}

export class BasicRepresentation implements Representation {
    public readonly identifier: NamedNode;
    public readonly slug?: string;
    private readonly store: Store;

    public constructor(public readonly data: QuadN3[] | QuadRDFJS[], type: RepresentationType, options?: { slug?: string }) {
        this.store = new Store(data)

        switch (type) {
            case RepresentationType.Policy:
                this.identifier = namedNode(getPolicyIdentifier(data as QuadN3[]));
                break;
            case RepresentationType.EvaluationRequest:
                this.identifier = namedNode(getRequestIdentifier(data as QuadN3[]));
                break;
            case RepresentationType.TestCase:
                this.identifier = namedNode(getTestCaseIdentifier(data as QuadN3[]))
                break;
            default:
                const ids = this.store.countQuads(null, RDF.type, type, null)
                if (ids !== 1) {
                    throw new Error(`Expected only one identifier with type "${type}"`);
                }
                this.identifier = this.store.getSubjects(RDF.type, type, null)[0] as NamedNode;
        }

        this.slug = options?.slug
    }

    public get description(): string {
        const quads = this.store.getQuads(this.identifier, null, null, null);
        const descriptions = quads.filter(q =>
            ([DC.description, DC.title] as string[]).includes(q.predicate.value)
        );
        if (descriptions.length > 0) {
            return descriptions[0].object.value;
        } else
            return "No description found"
    }

}

/**
 * Get the identifier of a test case.
 * The expectation is that there is only one present.
 * @param quads
 * @returns
 */
export function getTestCaseIdentifier(quads: QuadN3[]): string {
    const store = new Store(quads);
    const testCaseNodes = store.getQuads(null, RDF.terms.type, namedNode("http://example.org/TestCase"), null);

    if (testCaseNodes.length !== 1) {
        throw Error(`Expected one test case identifier. Found ${testCaseNodes.length}`);
    }
    return testCaseNodes[0].subject.id;
}