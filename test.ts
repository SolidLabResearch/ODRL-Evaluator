import { NamedNode, Parser, Store, Writer, DataFactory, Quad } from 'n3';
import { ODRLEngineMultipleSteps, ODRLEvaluator } from "./dist/index";

const { namedNode, quad } = DataFactory
// Test algorithm for "Dynamic ODRL Specification"
// see paper "Interoperable and Continuous Usage Control Enforcement in Dataspaces" https://raw.githubusercontent.com/woutslabbinck/papers/main/2024/Interoperable_and_Continuous_Usage_Control_Enforcement_in_Dataspaces.pdf

// need to use https://www.npmjs.com/package/clownface-shacl-path
// how to use TS module: https://github.com/woutslabbinck/ODRL-shape/blob/main/index.ts#L17


// Variant on test case 036: Read request from Alice to resource X returns into yes (temporal lt) (Alice Request Read X).
// https://github.com/SolidLabResearch/ODRL-Test-Suite/blob/main/data/test_cases/testcase-036-alice-read-x.ttl
const policy = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix ex: <http://example.org/> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix odrluc: <http://example.org/odrluc#> .

<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> a odrl:Set ;
  odrl:uid <urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> ;
  dct:description "ALICE may READ resource X when it is before 2024-02-12T11:20:10.999Z." ;
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

  // TODO: algorithm to fetch value using SHACL path from sotw in policy

  //@ts-ignore
  const { findNodes } = await import('clownface-shacl-path')
  //@ts-ignore
  const clownface = (await import('clownface')).default
  //@ts-ignore
  const { dataset } = await import('@rdfjs/dataset');

  const odrlPolicyStore = new Store(odrlDynamicPolicyQuads)
  const odrlDynamicPolicyStore = new Store(odrlDynamicPolicyQuads)
  const operandReferenceNodes = odrlDynamicPolicyStore.getSubjects("https://www.w3.org/TR/rdf-schema#type", 'http://example.org/odrluc#OperandReference', null);

  const operandReferenceNode = operandReferenceNodes[0]
  const constraintNodes = odrlDynamicPolicyStore.getSubjects("http://www.w3.org/ns/odrl/2/rightOperandReference", operandReferenceNode, null)
  console.log(constraintNodes);

  const operandReferencePath = odrlDynamicPolicyStore.getObjects(operandReferenceNode, 'http://example.org/odrluc#path', null)
  console.log(operandReferencePath[0]); // TODO: should be extracted properly

  const nodes = findNodes(clownface({ dataset: new Store(stateOfTheWorldQuads) }), operandReferencePath[0])
  const instantiatedValue = nodes.terms[0]; // according to our algorithm, there should be only one term
  console.log(instantiatedValue);


  for (const constraintNode of constraintNodes) {
    // remove reference thingy
    odrlPolicyStore.removeQuad(constraintNode, namedNode("http://www.w3.org/ns/odrl/2/rightOperandReference"), operandReferenceNode)
    const rightOperandTriple = quad(constraintNode, namedNode("http://www.w3.org/ns/odrl/2/rightOperand"), instantiatedValue)
    odrlPolicyStore.addQuads([rightOperandTriple])

    console.log(writer.quadsToString([rightOperandTriple]))
  }

  odrlPolicyQuads.push(...odrlPolicyStore.getQuads(null, null, null, null))

  // const instantiatedPolicyQuads = materializePolicy(odrlDynamicPolicyQuads, stateOfTheWorldQuads)
  // console.log(writer.quadsToString(instantiatedPolicyQuads));
  
  // odrlPolicyQuads.push(...instantiatedPolicyQuads)

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

async function materializePolicy(dynamicPolicy: Quad[], stateOfTheWorld: Quad[]): Promise<Quad[]> {
  //@ts-ignore
  const { findNodes } = await import('clownface-shacl-path')
  //@ts-ignore
  const clownface = (await import('clownface')).default

  const odrlPolicyStore = new Store(dynamicPolicy)

  const odrlDynamicPolicyStore = new Store(dynamicPolicy)
  const stateOfTheWorldStore = new Store(stateOfTheWorld)

  const operandReferenceNodes = odrlDynamicPolicyStore.getSubjects("https://www.w3.org/TR/rdf-schema#type", 'http://example.org/odrluc#OperandReference', null);

  for (const operandReferenceNode of operandReferenceNodes) {
    // ODRL constraint that has that given rightOperandReference
    const constraintNodes = odrlDynamicPolicyStore.getSubjects("http://www.w3.org/ns/odrl/2/rightOperandReference", operandReferenceNode, null)

    // SHACL Property path
    // TODO: needs to be extracted properly (currently only the most simple form is extracted)
    const operandReferencePath = odrlDynamicPolicyStore.getObjects(operandReferenceNode, 'http://example.org/odrluc#path', null)

    // extract SHACL Property Path using clownface
    const nodes = findNodes(clownface({ dataset: stateOfTheWorldStore }), operandReferencePath[0])
    const instantiatedValue = nodes.terms[0]; // according to our algorithm (see paper), there should be only one term

    for (const constraintNode of constraintNodes) {
      // remove rightOperandRefrence triple from constraint
      odrlPolicyStore.removeQuad(constraintNode, namedNode("http://www.w3.org/ns/odrl/2/rightOperandReference"), operandReferenceNode)
      // add materialized rightOperand
      odrlPolicyStore.addQuad(constraintNode, namedNode("http://www.w3.org/ns/odrl/2/rightOperand"), instantiatedValue)
    }
  }


  // TODO: need a clean up, there is dangling operandReference stuff in the ODRL Policy 
  return odrlPolicyStore.getQuads(null, null, null, null)
}