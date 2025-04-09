import { Parser } from "n3";
import "jest-rdf";
import { materializePolicy } from "../../../src";

describe('The Dynamic Constraints materialize function', () => {
    const dynamicPolicy = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix ex: <http://example.org/> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix odrluc: <https://w3id.org/force/odrlproposed#> .

<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> a odrl:Set ;
  odrl:uid <urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> ;
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
@prefix dct: <http://purl.org/dc/terms/> .

ex:externalSource ex:updatedValue "2018-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
    `
    const instantiatedPolicy = `
<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> .
<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/lt> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2018-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
    `
    const parser = new Parser();
    const odrlDynamicPolicyQuads = parser.parse(dynamicPolicy);
    const stateOfTheWorldQuads = parser.parse(sotw);
    const instantiatedPolicyQuads = parser.parse(instantiatedPolicy);

    it("materializes when a dynamic policy and relevant sotw is provided.", () => {
        const materializedPolicyQuads = materializePolicy(odrlDynamicPolicyQuads, stateOfTheWorldQuads)
        
        expect(materializedPolicyQuads).toBeRdfIsomorphic(instantiatedPolicyQuads);
    });

    it("does nothing when an instantiated policy is presented.", () => {
        const materializedPolicyQuads = materializePolicy(instantiatedPolicyQuads, stateOfTheWorldQuads)
        
        expect(materializedPolicyQuads).toBeRdfIsomorphic(instantiatedPolicyQuads);
    })

    it("throws an error when no external source is provided in the sotw.", () => {
        expect(() => materializePolicy(odrlDynamicPolicyQuads, [])).toThrow(Error)
    })

    it("throws an error when no external source property is provided.", () => {
        const operandReference = `
@prefix ex: <http://example.org/> .
@prefix odrluc: <https://w3id.org/force/odrlproposed#> .    
ex:operandReference1 a odrluc:OperandReference ;
    odrluc:path ex:updatedValue .`

        const operandReferenceQuads = parser.parse(operandReference)
        expect(() => materializePolicy(operandReferenceQuads, [])).toThrow(Error)
    })

    it("throws nope when no path property is provided.", () => {
        const operandReference = `
@prefix ex: <http://example.org/> .
@prefix odrluc: <https://w3id.org/force/odrlproposed#> .    
ex:operandReference1 a odrluc:OperandReference ;
    odrluc:reference ex:externalSource .`

        const operandReferenceQuads = parser.parse(operandReference)
        expect(() => materializePolicy(operandReferenceQuads, [])).toThrow("nope")
    })
})