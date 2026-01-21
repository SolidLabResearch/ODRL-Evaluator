import { Parser, Quad } from "n3";
import { blanknodeify } from "../../../../src";
import { Request, makeRDFRequest } from "../../../../src/util/request/RequestUtil";
import "jest-rdf";

const parser = new Parser()

// === Test parameters as full IRIs ===
const requestID = "urn:uuid:ce9fc20e-7c79-474e-8afe-7605accccee8";
const permissionID = "urn:uuid:e51a43e4-616f-4f32-906b-2359955228e5";
const constraintID = "urn:uuid:963698fe-3b44-4b88-8527-501b6c5765a6";

const assignee = "http://example.org/alice";
const resource = "http://example.org/x";
const action = "http://www.w3.org/ns/odrl/2/read";
const leftOperand = "http://www.w3.org/ns/odrl/2/purpose";
const operator = "http://www.w3.org/ns/odrl/2/eq";
const rightOperand = "https://w3id.org/dpv#AccountManagement";

// === RDF string under test ===
const requestString = `
@prefix dct: <http://purl.org/dc/terms/> .
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix sotw: <https://w3id.org/force/sotw#> .

<${requestID}> a odrl:Request ;
    odrl:uid <${requestID}> ;
    odrl:permission <${permissionID}> .

<${permissionID}> a odrl:Permission ;
    odrl:assignee <${assignee}> ;
    odrl:action <${action}> ;
    odrl:target <${resource}> ;
    sotw:context <${constraintID}> .

<${constraintID}> a odrl:Constraint ;
    odrl:leftOperand <${leftOperand}> ;
    odrl:operator <${operator}> ;
    odrl:rightOperand <${rightOperand}> .
`;

describe('The Request Util', () => {
    let requestRDF: Quad[]
    let request: Request

    beforeEach(() => {
        requestRDF = parser.parse(requestString);
        request = {
            assignee: assignee,
            resource: resource,
            action: action,
            identifier: requestID,
            context: [
                {
                    leftOperand: leftOperand,
                    rightOperand: rightOperand,
                    operator: operator,
                    identifier: constraintID
                }
            ]
        }
    })
    it('generates requests as expected.', () => {
        const generatedRequest = makeRDFRequest(request)
        request.action = "test"
        const differentRequest = makeRDFRequest(request)

        expect(blanknodeify(generatedRequest)).toBeRdfIsomorphic(blanknodeify(requestRDF))
        expect(blanknodeify(differentRequest)).not.toBeRdfIsomorphic(blanknodeify(requestRDF))
    })

    it('generates requests using the permission identifier.', () => {
        const generatedRequest = makeRDFRequest(request, permissionID)
        expect(generatedRequest).toBeRdfIsomorphic(requestRDF)
    })
})