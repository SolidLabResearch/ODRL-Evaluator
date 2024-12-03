import {DataFactory, Quad, Quad_Object, Store, Term, Writer} from "n3";
import {ParseOptions} from "rdf-parse/lib/RdfParser";
import {readFileSync} from 'fs';
import * as Path from "path";
import {rdfParser} from "rdf-parse";
import {v4} from "uuid";

const namedNode = DataFactory.namedNode;
const storeStream = require("rdf-store-stream").storeStream;
const streamifyString = require('streamify-string');

export async function turtleStringToStore(text: string, baseIRI?: string): Promise<Store> {
    return await stringToStore(text, {contentType: 'text/turtle', baseIRI});
}

export async function ldjsonToStore(text: string, baseIRI?: string): Promise<Store> {
    return await stringToStore(text, {contentType: 'application/ld+json', baseIRI});
}

/**
 * Converts a store to turtle string
 * @param store
 * @returns {string}
 */
export function storeToString(store: Store): string {
    const writer = new Writer();
    return writer.quadsToString(store.getQuads(null, null, null, null));
}

export async function stringToStore(text: string, options: ParseOptions): Promise<Store> {
    const textStream = streamifyString(text);
    const quadStream = rdfParser.parse(textStream, options);
    return await storeStream(quadStream);
}

/**
 * Convert a file as a store (given a path). Default will use text/turtle as content type
 * @param path
 * @param options
 * @returns {Promise<Store>}
 */
export async function fileAsStore(path: string, options?: { contentType?: string, baseIRI: string }): Promise<Store> {
    // only baseIRI if it is passed
    const baseIRI = options ? options.baseIRI : undefined;
    // text/turtle default, otherwise what is passed
    const contentType = options ? options.contentType ?? 'text/turtle' : 'text/turtle';
    const text = readFileSync(Path.join(path), "utf8");
    return await stringToStore(text, {contentType, baseIRI});
}


// borrowed from Tom Windels https://github.com/woutslabbinck/SolidEventSourcing/blob/main/EventSource/src/util/EventSource.ts
/**
 * Converts a resource (quad array) to an optimised turtle string representation by grouping subjects
 * together, using prefixes wherever possible and replacing blank nodes with their properties.
 * Note: blank nodes referenced to as objects, but not found as subjects in other quads, can cause
 *  issues
 * Note: a more processing performant solution might be possible, by creating a store from the resource
 *  and indexing from there instead of two seperate maps
 *
 * @param resource The resource that gets converted to a string
 * @param _prefixes An object which members are strings, member name being the short prefix and its
 *  value a string representing its URI. Example: `{"rdf": "http://www.w3.org/1999/02/22-rdf-syntax-ns#"}`
 * @returns {string}
 */
export function resourceToOptimisedTurtle(resource: Quad[], _prefixes: any): string {
    // get a grouped overview of this resource's content
    const named = new Map<string, Map<string, Quad_Object[]>>();
    const blank = new Map<string, Map<string, Quad_Object[]>>();
    addElements:
        for (const quad of resource) {
            const data = quad.subject.termType == "BlankNode" ? blank : named;
            if (data.has(quad.subject.id)) {
                const props = data.get(quad.subject.id)!;
                if (props.has(quad.predicate.id)) {
                    // check if value is already in array, if it is, dont add it anymore
                    const objs = props.get(quad.predicate.id)!;
                    for (const obj of objs) {
                        // while it might offer better performance to use a set instead
                        // of an array, the custom type Quad_Object would not work correctly
                        // with Set.has(), and thus would require a seperate container storing
                        // the IDs (which would in turn not be memory efficient)
                        if (obj.equals(quad.object)) {
                            continue addElements;
                        }
                    }
                    objs.push(quad.object);
                } else {
                    props.set(quad.predicate.id, new Array(quad.object));
                }
            } else {
                data.set(quad.subject.id, new Map([[quad.predicate.id, new Array(quad.object)]]));
            }
        }
    // converting all the entries of the blank map first
    // with the ordered view done, a more compact turtle string can be generated
    const writer = new Writer({prefixes: _prefixes});

    named.forEach((properties, subject) => {
        properties.forEach((objects, predicate) => {
            for (const object of objects) {
                if (object.termType != "BlankNode") {
                    writer.addQuad(namedNode(subject), namedNode(predicate), object);
                } else {
                    const blankProperties = blank.get(object.id)!;
                    blankProperties.forEach((blankObjects, blankPredicate) => {
                        for (const blankObject of blankObjects) {
                            writer.addQuad(
                                namedNode(subject), namedNode(predicate),
                                writer.blank(namedNode(blankPredicate), blankObject)
                            );
                        }
                    })
                }
            }
        })
    })
    let str: string = "";
    writer.end((_, result) => str = result);
    return str;
}

/**
 * Recursively get a subgraph given an RDF graph (as N3 Store) and a starting IRI.
 *
 * @param iri - The subject/starting IRI of the subgraph you want to extract
 * @param store - An {@link Store}.
 * @param usedIRIs - A set of IRIs that already have been used in the graph and are not considered for future iterations.
 * @returns A list of Quads representing the subgraph
 */
export function extractGraph(iri: string, store: Store, usedIRIs: Set<string> = new Set<string>()): Quad[] {
    const output: Quad[] = [];
    if (usedIRIs.has(iri)) {
        return output
    }
    usedIRIs.add(iri);
    const subGraph = store.getQuads(namedNode(iri), null, null, null);
    output.push(...subGraph);
    // must go to other iteration if it is an iri and it is not already part of the usedIRIs
    const nextIterationIris = subGraph.filter(triple => triple.object.termType == 'NamedNode')
        .map(triple => triple.object.id)
        .filter(iri => !usedIRIs.has(iri))

    for (const iri of nextIterationIris) {
        output.push(...extractGraph(iri, store, usedIRIs))
    }
    return output
}

/**
 * Replace all the subjects of nodes in a graph with a blank node.
 * References to this subject in the graph are also accordingly updated.
 * @param quads
 */
export function blanknodeify(quads: Quad[]): Quad[] {
    const store = new Store(quads);
    const subjects: Term[] = store.getSubjects(null, null, null);

    for (const subject of subjects) {
        const blankNode = DataFactory.blankNode();

        const triplesWhereSubject = store.getQuads(subject, null, null, null);
        const replacedTriplesSubject = triplesWhereSubject.map(quad => DataFactory.quad(blankNode, quad.predicate, quad.object));

        store.removeQuads(triplesWhereSubject);
        store.addQuads(replacedTriplesSubject);

        const triplesWhereObject = store.getQuads(null, null, subject, null);
        const replacedTriplesObject = triplesWhereObject.map(quad => DataFactory.quad(quad.subject, quad.predicate, blankNode));

        store.removeQuads(triplesWhereObject);
        store.addQuads(replacedTriplesObject);
    }

    return store.getQuads(null, null, null, null);
}

/**
 * Replace all the subjects of nodes in a graph with a UUID.
 * References to this subject in the graph are also accordingly updated.
 * @param quads
 */
export function uuidify(quads: Quad[]): Quad[] {
    // not only difference between blankodify is the strategy in which it creates new identifiers -> could easily be made more modular
    const store = new Store(quads);
    const subjects: Term[] = store.getSubjects(null, null, null);

    for (const subject of subjects) {
        const subjectNode = DataFactory.namedNode(`urn:uuid:${v4()}`)

        const triplesWhereSubject = store.getQuads(subject, null, null, null);
        const replacedTriplesSubject = triplesWhereSubject.map(quad => DataFactory.quad(subjectNode, quad.predicate, quad.object));

        store.removeQuads(triplesWhereSubject);
        store.addQuads(replacedTriplesSubject);

        const triplesWhereObject = store.getQuads(null, null, subject, null);
        const replacedTriplesObject = triplesWhereObject.map(quad => DataFactory.quad(quad.subject, quad.predicate, subjectNode));

        store.removeQuads(triplesWhereObject);
        store.addQuads(replacedTriplesObject);
    }

    return store.getQuads(null, null, null, null);
}
