import { Parser, Writer } from 'n3';
import { materializePolicy, ODRLEngineMultipleSteps, ODRLEvaluator, prefixes } from "../dist/index";
import { write } from '@jeswr/pretty-turtle';


// Variant on test case 036: Read request from Alice to resource X returns into yes (temporal lt) (Alice Request Read X).
// https://github.com/SolidLabResearch/ODRL-Test-Suite/blob/main/data/test_cases/testcase-036-alice-read-x.ttl
const policy = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix ex: <http://example.org/> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix odrluc: <https://w3id.org/force/odrl3proposal#> .

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

// state of the world -> with external value indicating the time
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

  const odrlRequestQuads = parser.parse(request)
  const stateOfTheWorldQuads = parser.parse(sotw)

  const instantiatedPolicyQuads = materializePolicy(odrlDynamicPolicyQuads, stateOfTheWorldQuads)
  
  console.log("Instantiated Policy:")
  console.log(writer.quadsToString(instantiatedPolicyQuads));


  // reasoning over dynamic policy
  const evaluator = new ODRLEvaluator(new ODRLEngineMultipleSteps());
  const reasoningResult = await evaluator.evaluate(
    odrlDynamicPolicyQuads,
    odrlRequestQuads,
    stateOfTheWorldQuads)

  const output = writer.quadsToString(reasoningResult);
  console.log("Compliance Report")
  console.log(output);
  
      // created report with N3
    console.log(await write(reasoningResult, { prefixes }));


}
main()

