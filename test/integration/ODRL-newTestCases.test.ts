import "jest-rdf";
import { Parser, Quad, Writer } from "n3";
import { blanknodeify, CompositeODRLEvaluator, ODRLEngineMultipleSteps, ODRLEvaluator, uuidify } from "../../src";

const parser = new Parser()
describe('The default ODRL evaluator', () => {
    const odrlEvaluator = new CompositeODRLEvaluator(new ODRLEngineMultipleSteps());

    it('A test Case comparing xsd:date in the right operand,', async () => {
        // TODO: add this policy to ODRL-test-suite
        const odrlPolicyText = `
<urn:uuid:7e7a4e8a-e389-41ac-94fc-78e266cec31b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:7e7a4e8a-e389-41ac-94fc-78e266cec31b> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:7e7a4e8a-e389-41ac-94fc-78e266cec31b> .
<urn:uuid:7e7a4e8a-e389-41ac-94fc-78e266cec31b> <http://purl.org/dc/terms/description> "ALICE may READ resource X at 2024-02-12." .
<urn:uuid:7e7a4e8a-e389-41ac-94fc-78e266cec31b> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:7e7a4e8a-e389-41ac-94fc-78e266cec31b> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:a6a16de7-7975-45f9-a15d-5e1f474de7b7> .
<urn:uuid:a6a16de7-7975-45f9-a15d-5e1f474de7b7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:a6a16de7-7975-45f9-a15d-5e1f474de7b7> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:a6a16de7-7975-45f9-a15d-5e1f474de7b7> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:a6a16de7-7975-45f9-a15d-5e1f474de7b7> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:a6a16de7-7975-45f9-a15d-5e1f474de7b7> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:5d83f959-9103-4413-ac98-a5167d1118c8> .
<urn:uuid:5d83f959-9103-4413-ac98-a5167d1118c8> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:5d83f959-9103-4413-ac98-a5167d1118c8> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/eq> .
<urn:uuid:5d83f959-9103-4413-ac98-a5167d1118c8> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12"^^<http://www.w3.org/2001/XMLSchema#date> .
`;
        const odrlRequestText = `
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
        // TODO: add this state of the world to ODRL-test-suite
        const stateOfTheWorldText = `
<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T00:00:00Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
        const expectedReport = `
        @prefix odrl: <http://www.w3.org/ns/odrl/2/>.
@prefix ex: <http://example.org/>.
@prefix temp: <http://example.com/request/>.
@prefix dct: <http://purl.org/dc/terms/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix report: <https://w3id.org/force/compliance-report#>.

<urn:uuid:b3d04120-04b4-4176-b0d7-c813fa654ab8> a report:PolicyReport;
    dct:created "2024-02-12T00:00:00Z"^^xsd:dateTime;
    report:policy <urn:uuid:7e7a4e8a-e389-41ac-94fc-78e266cec31b>;
    report:policyRequest <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364>;
    report:ruleReport <urn:uuid:98c43141-6ded-4b6c-ad7a-d46e94126761>.
<urn:uuid:98c43141-6ded-4b6c-ad7a-d46e94126761> a report:PermissionReport;
    report:attemptState report:Attempted;
    report:rule <urn:uuid:a6a16de7-7975-45f9-a15d-5e1f474de7b7>;
    report:ruleRequest <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59>;
    report:premiseReport <urn:uuid:2d5225c0-0151-49f3-a5ab-72b91f8622f6>, <urn:uuid:e5e8650b-d72a-4783-bf88-5adb75272cdd>, <urn:uuid:0821bb62-8ce1-4cde-9834-093274bd79b3>, <urn:uuid:1678415c-8576-4627-a787-5f273e5ac01a>;
    report:activationState report:Active.
<urn:uuid:2d5225c0-0151-49f3-a5ab-72b91f8622f6> a report:TargetReport;
    report:satisfactionState report:Satisfied.
<urn:uuid:e5e8650b-d72a-4783-bf88-5adb75272cdd> a report:PartyReport;
    report:satisfactionState report:Satisfied.
<urn:uuid:0821bb62-8ce1-4cde-9834-093274bd79b3> a report:ActionReport;
    report:satisfactionState report:Satisfied.
    <urn:uuid:1678415c-8576-4627-a787-5f273e5ac01a> a report:ConstraintReport.
<urn:uuid:1678415c-8576-4627-a787-5f273e5ac01a> report:constraint <urn:uuid:5d83f959-9103-4413-ac98-a5167d1118c8>.
<urn:uuid:1678415c-8576-4627-a787-5f273e5ac01a> report:constraintLeftOperand "2024-02-12T00:00:00Z"^^xsd:dateTime.
<urn:uuid:1678415c-8576-4627-a787-5f273e5ac01a> report:constraintOperator odrl:eq.
<urn:uuid:1678415c-8576-4627-a787-5f273e5ac01a> report:constraintRightOperand "2024-02-12"^^xsd:date.
<urn:uuid:1678415c-8576-4627-a787-5f273e5ac01a> report:satisfactionState report:Satisfied.
    `

        const odrlPolicyQuads = parser.parse(odrlPolicyText);
        const odrlRequestQuads = parser.parse(odrlRequestText);
        const stateOfTheWorldQuads = parser.parse(stateOfTheWorldText);
        
        const expectedReportQuads = parser.parse(expectedReport);
        const report = await odrlEvaluator.evaluate(
            odrlPolicyQuads,
            odrlRequestQuads,
            stateOfTheWorldQuads);
            
        expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(expectedReportQuads))
    })


});