import "jest-rdf";
import { Parser, Quad, Writer } from "n3";
import { createPolicy, policyToQuads, Policy } from "../../../../src/util/policy/PolicyUtil";
import { blanknodeify } from "../../../../src/util/RDFUtil";
import { ODRL } from "../../../../src/util/Vocabularies";

const parser = new Parser()

// === Test parameters as full IRIs ===
const policyID = "urn:uuid:ce9fc20e-7c79-474e-8afe-7605accccee8";
const policyType = ODRL.Agreement;

const permissionID = "urn:uuid:e51a43e4-616f-4f32-906b-2359955228e5";
const ruleType = ODRL.Permission
const assignee = "http://example.org/alice";
const resource = "http://example.org/x";
const action = "http://www.w3.org/ns/odrl/2/read";

const constraintID = "urn:uuid:963698fe-3b44-4b88-8527-501b6c5765a6";
const leftOperand = "http://www.w3.org/ns/odrl/2/purpose";
const operator = "http://www.w3.org/ns/odrl/2/eq";
const rightOperand = "https://w3id.org/dpv#AccountManagement";

// === RDF string under test ===
const policyString = `
@prefix dct: <http://purl.org/dc/terms/> .
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix sotw: <https://w3id.org/force/sotw#> .

<${policyID}> a <${policyType}> ;
    odrl:uid <${policyID}> ;
    odrl:permission <${permissionID}> .

<${permissionID}> a <${ruleType}> ;
    odrl:assignee <${assignee}> ;
    odrl:action <${action}> ;
    odrl:target <${resource}> ;
    odrl:constraint <${constraintID}> .

<${constraintID}> a odrl:Constraint ;
    odrl:leftOperand <${leftOperand}> ;
    odrl:operator <${operator}> ;
    odrl:rightOperand <${rightOperand}> .
`;

describe('The Policy Util', () => {
    let policyRDF: Quad[]
    let policy: Policy

    beforeEach(() => {
        policyRDF = parser.parse(policyString);
        policy = {
            identifier: policyID,
            type: policyType,
            rules: [{
                assignee: assignee,
                target: resource,
                action: action,
                type: ruleType,
                identifier: permissionID,
                constraints: [
                    {
                        leftOperand: leftOperand,
                        rightOperand: rightOperand,
                        operator: operator,
                        identifier: constraintID
                    }
                ]
            }]
        }
    })
    it('generates policies as expected.', () => {
        const generatedpolicy = policyToQuads(policy)
        policy.rules[0].action = "test"
        const differentpolicy = policyToQuads(policy)

        expect(blanknodeify(generatedpolicy)).toBeRdfIsomorphic(blanknodeify(policyRDF))
        expect(blanknodeify(differentpolicy)).not.toBeRdfIsomorphic(blanknodeify(policyRDF))
    })

    it('generate identifiers itself.', () => {
        const partialPolicy = {
            rules: [{
                assignee: assignee,
                target: resource,
                action: action,
                type: ruleType,
                constraints: [
                    {
                        leftOperand: leftOperand,
                        rightOperand: rightOperand,
                        operator: operator,
                    }
                ]
            }]
        }
        const generatedpolicy = policyToQuads(createPolicy(partialPolicy))

        expect(blanknodeify(generatedpolicy)).toBeRdfIsomorphic(blanknodeify(policyRDF))
    })

    it('correctly generates permission rule with temporal constraint.', () => {
        const policyString = `
        @prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<urn:uuid:eddac112-4049-4907-9c4c-f12458cd3cc7>
  a odrl:Agreement ;
  odrl:uid <urn:uuid:eddac112-4049-4907-9c4c-f12458cd3cc7> ;
  odrl:permission <urn:uuid:10bd2f63-e288-4f2b-bfb5-1a96b87c55f9> .

<urn:uuid:10bd2f63-e288-4f2b-bfb5-1a96b87c55f9>
  a odrl:Permission ;
  odrl:assignee <urn:alice> ;
  odrl:action odrl:read ;
  odrl:target <urn:resource> ;
  odrl:constraint <urn:uuid:dd070ebd-1c62-4281-a2f9-b1a9830b6a53> .

<urn:uuid:dd070ebd-1c62-4281-a2f9-b1a9830b6a53>
  a odrl:Constraint ;
  odrl:leftOperand odrl:dateTime ;
  odrl:operator odrl:gteq ;
  odrl:rightOperand "2020-12-05T02:26:20.000Z"^^xsd:dateTime .`
        const policyRDF = parser.parse(policyString)
        const generatedpolicy = policyToQuads(createPolicy({
            rules: [{
                assignee: 'urn:alice',
                target: 'urn:resource',
                action: ODRL.read,
                type: ODRL.Permission,
                constraints: [{
                    leftOperand: ODRL.dateTime,
                    rightOperand: "2020-12-05T02:26:20.000Z",
                    operator: ODRL.gteq
                }]
            }]
        }))
        expect(blanknodeify(generatedpolicy)).toBeRdfIsomorphic(blanknodeify(policyRDF))
    })

    it('fails for creating policies for which the constraint type is not implemented yet.', () => {
        const policy = createPolicy({
            rules: [{
                assignee: 'urn:alice',
                target: 'urn:resource',
                action: ODRL.read,
                type: ODRL.Permission,
                constraints: [{
                    leftOperand: ODRL.count,
                    rightOperand: "5",
                    operator: ODRL.gteq
                }]
            }]
        })
        expect(() => policyToQuads(policy)).toThrow(Error)
    })
})

