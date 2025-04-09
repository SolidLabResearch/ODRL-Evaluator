// use RDF lens instead of clownface:: https://ceur-ws.org/Vol-3759/paper13.pdf
import { Quad, Term } from "@rdfjs/types";
import { BasicLensM, Cont, pred, ShaclPath, CBDLens } from "rdf-lens";
import { NamedNode, Parser, Store, Writer, DataFactory, Literal, BlankNode} from 'n3';
import { ODRLEngineMultipleSteps, ODRLEvaluator } from "./dist/index";

const { namedNode } = DataFactory

// TODO: change baseIRI for odrluc to https://w3id.org/force/odrlproposed
// TODO: create mini spec at https://w3id.org/force/odrlproposed and create a vocabulary/ontology there
// Next steps:
// - put proposals Beatriz and I from brainstorm in odrlproposed
// - put discussion Pieter and I yesterday regarding ODRL and RDF Context ASsociation in odrlproposed

// odlurc path as defined in "Interoperable and Continuous Usage Control Enforcement in Dataspaces"
export const pathLens = pred(namedNode("http://example.org/odrluc#path"))
  .one()
  .then(ShaclPath);

// Utility function to extract the SHACL property path of the Dynamic ODRL Policy using `odrluc:path`
export function getPath(id: Term, quads: Quad[]): BasicLensM<Cont, Term> {
  return pathLens.execute({ id, quads }).mapAll((x) => x.id);
}

// Utility function to extract the value from an external resource using a SHACL Property path
export function usePath(id: Term, quads: Quad[], lens: BasicLensM<Cont, Term>): Term[] {
  return lens.execute({ id, quads })
}


const policy = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix ex: <http://example.org/> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix odrluc: <http://example.org/odrluc#> .

<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> a odrl:Set ;
  odrl:uid <urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> ;
  dct:description "ALICE may READ resource X when it is before 'ex:updateValue' (see sotw)." ;
  dct:source <https://github.com/SolidLabResearch/ODRL-Test-Suite/> ;
  odrl:permission <urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> .

<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> a odrl:Permission ;
  odrl:assignee ex:alice ;
  odrl:action odrl:read ;
  odrl:target ex:x ;
  odrl:constraint <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .

<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> odrl:leftOperand odrl:dateTime ;
  odrl:operator odrl:lt ;
  odrl:rightOperandReference ex:operandReference1 .

ex:operandReference1 a odrluc:OperandReference ;
    odrluc:reference ex:externalSource ;
    odrluc:path ex:updatedValue .
`


const sotw = `
@prefix ex: <http://example.org/> .
@prefix temp: <http://example.com/request/> .
@prefix dct: <http://purl.org/dc/terms/> .

<urn:uuid:192620fa-06d9-447b-adbd-bd1ece4f9b12> a ex:Sotw ;
  ex:includes temp:currentTime .

temp:currentTime dct:issued "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .

# external value that will be materialized in the policy
ex:externalSource ex:updatedValue "2018-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`

const request = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix ex: <http://example.org/> .
@prefix dct: <http://purl.org/dc/terms/> .

<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> a odrl:Request ;
  odrl:uid <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> ;
  dct:description "Requesting Party ALICE requests to READ resource X." ;
  odrl:permission <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .

<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> a odrl:Permission ;
  odrl:assignee ex:alice ;
  odrl:action odrl:read ;
  odrl:target ex:x .
`

async function main() {
  const parser = new Parser()
  const writer = new Writer()

  const odrlDynamicPolicyQuads = parser.parse(policy)

  const odrlPolicyQuads: Quad[] = []
  const odrlRequestQuads = parser.parse(request)
  const stateOfTheWorldQuads = parser.parse(sotw)

  const instantiatedPolicyQuads = await materializePolicy(odrlDynamicPolicyQuads, stateOfTheWorldQuads)
  
  odrlPolicyQuads.push(...instantiatedPolicyQuads)

  console.log(writer.quadsToString(odrlPolicyQuads));

  // reasoning over new policy
  const evaluator = new ODRLEvaluator(new ODRLEngineMultipleSteps());
  const reasoningResult = await evaluator.evaluate(
    odrlPolicyQuads,
    odrlRequestQuads,
    stateOfTheWorldQuads)

  const output = writer.quadsToString(reasoningResult);
  console.log(output);

}
main()

// algorithm to fetch value using SHACL path from sotw in policy
export async function materializePolicy(dynamicPolicy: Quad[], stateOfTheWorld: Quad[]): Promise<Quad[]> {
  const odrlPolicyStore = new Store(dynamicPolicy)
  const odrlDynamicPolicyStore = new Store(dynamicPolicy)

  // get all constraints containing references
  const operandReferenceNodes = odrlDynamicPolicyStore.getSubjects("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", 'http://example.org/odrluc#OperandReference', null);

  for (const operandReferenceNode of operandReferenceNodes) {
    // ODRL constraint that has that given rightOperandReference
    const constraintNodes = odrlDynamicPolicyStore.getSubjects("http://www.w3.org/ns/odrl/2/rightOperandReference", operandReferenceNode, null)
    
    // external resource
    const externalResource = odrlDynamicPolicyStore.getObjects(operandReferenceNode, namedNode("http://example.org/odrluc#reference"), null)[0]
    if (!externalResource) { 
        throw Error("There is no source present in the Dynamic Policy Constraint.")
    }
    
    // SHACL Property path
    const lens = getPath(operandReferenceNode, dynamicPolicy); 

    // extract SHACL Property Path using clownface
    const getValue = usePath(externalResource, stateOfTheWorld, lens);
    const instantiatedValue = getValue[0]; // according to our algorithm (see paper), there should be only one term
    
    if (!(instantiatedValue instanceof NamedNode || instantiatedValue instanceof Literal || instantiatedValue instanceof BlankNode)) {
        // Now term is a valid Quad_Object
        throw Error("Instantiated value is not a proper value.");
    }
    for (const constraintNode of constraintNodes) {
      // remove rightOperandRefrence triple from constraint
      odrlPolicyStore.removeQuad(constraintNode, namedNode("http://www.w3.org/ns/odrl/2/rightOperandReference"), operandReferenceNode)
      // add materialized rightOperand
      odrlPolicyStore.addQuad(constraintNode, namedNode("http://www.w3.org/ns/odrl/2/rightOperand"), instantiatedValue)
    }

    // remove OperandReference triples from Policy store
    const operandReferenceQuads = CBDLens.execute({id:operandReferenceNode, quads: dynamicPolicy})
    odrlPolicyStore.removeQuads(operandReferenceQuads)
  }
  return odrlPolicyStore.getQuads(null, null, null, null)
}

