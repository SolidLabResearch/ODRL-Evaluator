import "jest-rdf";
import { Parser, Quad } from "n3";
import { ODRLEvaluator } from "../../src/evaluator/Evaluate";
import { ODRLEngineMultipleSteps } from "../../src/evaluator/Engine";
import { ODRL, REPORT } from "../../src/util/Vocabularies"
import { blanknodeify } from "../../src/util/RDFUtil"
import { createPolicy, policyToQuads, Policy } from "../../src/util/policy/PolicyUtil";
import { makeRDFRequest, Request } from "../../src/util/request/RequestUtil";
import { createRandomUrn } from "../../src/util/Util";
import { write } from "@jeswr/pretty-turtle/dist";
import { ActivationState, parseComplianceReport, parseSingleComplianceReport, prefixes } from "../../src";
import { countSatisfiedPremises } from "../util/ReportTest";

// request 1
const request1 = `
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .`

// temporal.ttl
const sotwTemporal = `
<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const parser = new Parser()
describe('The default ODRL evaluator', () => {
    const odrlEvaluator = new ODRLEvaluator(new ODRLEngineMultipleSteps());

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
        const odrlRequestText = request1

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

    describe('handling set operators in constraints', () => {
        // TODO: add as new policy
        const odrlPolicyPurposeSingle = `
@prefix dct: <http://purl.org/dc/terms/> .
@prefix ex: <http://example.org/> .
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix dpv: <https://w3id.org/dpv#>.

<urn:uuid:18a5175e-33e4-4f66-895d-97bcbd4e427b> a odrl:Set ;
    odrl:uid <urn:uuid:18a5175e-33e4-4f66-895d-97bcbd4e427b> ;
    dct:description "ALICE may READ resource X for the purpose of dpv:AccountManagement." ;
    dct:source <https://github.com/besteves4/pacsoi-policies/blob/main/PoC2/policy-22.ttl> ;
    odrl:permission <urn:uuid:1c63f3af-7c09-4748-9002-1868f6816b16> .

<urn:uuid:1c63f3af-7c09-4748-9002-1868f6816b16> a odrl:Permission ;
    odrl:assignee ex:alice ;
    odrl:action odrl:read ;
    odrl:target ex:x ;
    odrl:constraint <urn:uuid:ccce2874-20f2-4281-a56c-ec2614282bda> .

<urn:uuid:ccce2874-20f2-4281-a56c-ec2614282bda> odrl:leftOperand odrl:purpose ;
    odrl:operator odrl:eq ;
    odrl:rightOperand dpv:AccountManagement .
`;
        // TODO: add as new policy
        const odrlPolicyPurposeMultiple = `
@prefix dct: <http://purl.org/dc/terms/> .
@prefix ex: <http://example.org/> .
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix dpv: <https://w3id.org/dpv#>.

<urn:uuid:b791d8a7-8e49-4428-be77-d4bb5aeffc20> a odrl:Set ;
    odrl:uid <urn:uuid:b791d8a7-8e49-4428-be77-d4bb5aeffc20> ;
    dct:description "ALICE may READ resource X for the purpose of dpv:AccountManagement or dpv:DataQualityManagement." ;
    dct:source <https://github.com/besteves4/pacsoi-policies/blob/main/PoC2/policy-25.ttl> ;
    odrl:permission <urn:uuid:79b34c79-b550-4ccf-9331-ef83c27f390f> .

<urn:uuid:79b34c79-b550-4ccf-9331-ef83c27f390f> a odrl:Permission ;
    odrl:assignee ex:alice ;
    odrl:action odrl:read ;
    odrl:target ex:x ;
    odrl:constraint <urn:uuid:7bffb023-24a9-4228-b767-e55b8341ef98> .
    
<urn:uuid:7bffb023-24a9-4228-b767-e55b8341ef98> odrl:leftOperand odrl:purpose ;
    odrl:operator odrl:isAnyOf ;
    odrl:rightOperand dpv:AccountManagement, dpv:DataQualityManagement .
`;
        // TODO: add as new policy
        const odrlPolicyPurposeIsA = `
@prefix dct: <http://purl.org/dc/terms/> .
@prefix ex: <http://example.org/> .
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix dpv: <https://w3id.org/dpv#> .

<urn:uuid:6a1153c1-aca7-496a-aba1-0b2561d4555e> a odrl:Set ;
    odrl:uid <urn:uuid:6a1153c1-aca7-496a-aba1-0b2561d4555e> ;
    dct:description "ALICE may READ resource X for an instance of purpose of dpv:AccountManagement." ;
    dct:source <https://besteves4.github.io/odrl-access-control-profile/oac.html#x5-1-preference-policy> ;
    odrl:permission <urn:uuid:f0ce2b23-d35c-483c-909a-17c986db5e68> .

<urn:uuid:f0ce2b23-d35c-483c-909a-17c986db5e68> a odrl:Permission ;
    odrl:assignee ex:alice ;
    odrl:action odrl:read ;
    odrl:target ex:x ;
    odrl:constraint <urn:uuid:2899cef7-fb9e-49b1-b4fb-cc28a8fae75f> .

<urn:uuid:2899cef7-fb9e-49b1-b4fb-cc28a8fae75f> odrl:leftOperand odrl:purpose ;
    odrl:operator odrl:isA ;
    odrl:rightOperand dpv:AccountManagement .
        `
        // TODO: add as new policy
        const odrlPolicyPurposeIsNone = `
@prefix dct: <http://purl.org/dc/terms/> .
@prefix ex: <http://example.org/> .
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix dpv: <https://w3id.org/dpv#> .

<urn:uuid:5ee1a7dd-ccba-49a4-92e8-6cc375509efd> a odrl:Set ;
    odrl:uid <urn:uuid:5ee1a7dd-ccba-49a4-92e8-6cc375509efd> ;
    dct:description "ALICE may READ resource X for the purpose of dpv:AccountManagement or dpv:DataQualityManagement." ;
    dct:source <https://github.com/besteves4/pacsoi-policies/blob/main/PoC2/policy-25.ttl> ;
    odrl:permission <urn:uuid:8b64ba6c-015b-41cf-9f06-2f942edcf1db> .

<urn:uuid:8b64ba6c-015b-41cf-9f06-2f942edcf1db> a odrl:Permission ;
    odrl:assignee ex:alice ;
    odrl:action odrl:read ;
    odrl:target ex:x ;
    odrl:constraint <urn:uuid:52d3b046-52b6-419f-95b4-93bb557cdf97> .

<urn:uuid:52d3b046-52b6-419f-95b4-93bb557cdf97> odrl:leftOperand odrl:purpose ;
    odrl:operator odrl:isNoneOf ;
    odrl:rightOperand dpv:AccountManagement, dpv:DataQualityManagement .
`;
        // TODO: add as new request; but make it Evaluation Request
        const odrlRequestPurposeManagement = `
@prefix dct: <http://purl.org/dc/terms/> .
@prefix ex: <http://example.org/> .
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix dpv: <https://w3id.org/dpv#> .

<urn:uuid:ce9fc20e-7c79-474e-8afe-7605accccee8> a odrl:Request ;
    odrl:uid <urn:uuid:ce9fc20e-7c79-474e-8afe-7605accccee8> ;
    dct:description "Requesting Party ALICE requests to READ resource X for the purpose of dpv:AccountManagement." ;
    odrl:permission <urn:uuid:e51a43e4-616f-4f32-906b-2359955228e5> .

<urn:uuid:e51a43e4-616f-4f32-906b-2359955228e5> a odrl:Permission ;
    odrl:assignee ex:alice ;
    odrl:action odrl:read ;
    odrl:target ex:x ;
    <https://w3id.org/force/sotw#context> <urn:uuid:963698fe-3b44-4b88-8527-501b6c5765a6> .

<urn:uuid:963698fe-3b44-4b88-8527-501b6c5765a6> a odrl:Constraint ;
    odrl:leftOperand odrl:purpose ;
    odrl:operator odrl:eq ;
    odrl:rightOperand dpv:AccountManagement .
        `

        // TODO: add as new request; but make it Evaluation Request
        const odrlRequestPurposeManagementInstance = `
@prefix dct: <http://purl.org/dc/terms/>.
@prefix ex: <http://example.org/> .
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix dcterms: <http://purl.org/dc/terms/>.
@prefix sotw: <https://w3id.org/force/sotw#> .
@prefix dpv: <https://w3id.org/dpv#>.

<urn:uuid:480915ba-6784-4596-be02-34b35899d000> a odrl:Request ;
    odrl:uid <urn:uuid:480915ba-6784-4596-be02-34b35899d000> ;
    dct:description "Requesting Party ALICE requests to READ resource X for the purpose of dpv:AccountManagement." ;
    odrl:permission <urn:uuid:2a2bcfe6-b421-4279-9e0f-223567a93548> .
    
<urn:uuid:2a2bcfe6-b421-4279-9e0f-223567a93548> a odrl:Permission ;
    odrl:assignee ex:alice ;
    odrl:action odrl:read ;
    odrl:target ex:x ;
    sotw:context <urn:uuid:7e19a42e-ea76-43fe-9bef-7abb694d9f04> .
    
<urn:uuid:7e19a42e-ea76-43fe-9bef-7abb694d9f04> a odrl:Constraint ;
    odrl:leftOperand odrl:purpose ;
    odrl:operator odrl:eq ;
    odrl:rightOperand ex:purpose .

ex:purpose a dpv:AccountManagement .
        `
        it('Happy flow regarding purpose with equality.', async () => {

            const odrlPolicyText = odrlPolicyPurposeSingle
            const odrlRequestText = odrlRequestPurposeManagement
            const stateOfTheWorldText = sotwTemporal
            const expectedReport = `
@prefix cr: <https://w3id.org/force/compliance-report#> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<urn:uuid:ceee3728-ee68-4971-bf20-64892e8eee69> a cr:ConstraintReport ;
    cr:constraint <urn:uuid:ccce2874-20f2-4281-a56c-ec2614282bda> ;
    cr:satisfactionState cr:Satisfied ;
    cr:constraintLeftOperand <https://w3id.org/dpv#AccountManagement> ;
    cr:constraintOperator odrl:eq ;
    cr:constraintRightOperand <https://w3id.org/dpv#AccountManagement> .

<urn:uuid:a8f77e09-117f-4044-a8d4-768ecc5aeb43> a cr:PolicyReport ;
    dct:created "2024-02-12T11:20:10.999Z"^^xsd:dateTime ;
    cr:policy <urn:uuid:18a5175e-33e4-4f66-895d-97bcbd4e427b> ;
    cr:policyRequest <urn:uuid:ce9fc20e-7c79-474e-8afe-7605accccee8> ;
    cr:ruleReport <urn:uuid:d34fc225-f547-4239-821e-d639f73d4cc9> .

<urn:uuid:d34fc225-f547-4239-821e-d639f73d4cc9> a cr:PermissionReport ;
    cr:attemptState cr:Attempted ;
    cr:rule <urn:uuid:1c63f3af-7c09-4748-9002-1868f6816b16> ;
    cr:ruleRequest <urn:uuid:e51a43e4-616f-4f32-906b-2359955228e5> ;
    cr:premiseReport <urn:uuid:ceee3728-ee68-4971-bf20-64892e8eee69>, <urn:uuid:d1e9b76b-a785-49fa-90d1-68bc457d346d>, <urn:uuid:0abaec0b-c686-4b89-b37f-99fb9beef569>, <urn:uuid:f6d64365-7252-48f9-abde-188cf1746401> ;
    cr:activationState cr:Active .

<urn:uuid:d1e9b76b-a785-49fa-90d1-68bc457d346d> a cr:TargetReport ;
    cr:satisfactionState cr:Satisfied .

<urn:uuid:0abaec0b-c686-4b89-b37f-99fb9beef569> a cr:PartyReport ;
    cr:satisfactionState cr:Satisfied .

<urn:uuid:f6d64365-7252-48f9-abde-188cf1746401> a cr:ActionReport ;
    cr:satisfactionState cr:Satisfied .
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

        it('Bad flow regarding purpose with equality.', async () => {
            const odrlPolicyText = odrlPolicyPurposeSingle;
            const odrlRequestText = request1
            const stateOfTheWorldText = sotwTemporal
            const expectedReport = `
@prefix cr: <https://w3id.org/force/compliance-report#> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<urn:uuid:ceee3728-ee68-4971-bf20-64892e8eee69> a cr:ConstraintReport ;
    cr:constraint <urn:uuid:ccce2874-20f2-4281-a56c-ec2614282bda> ;
    cr:satisfactionState cr:Unsatisfied ;
    cr:constraintLeftOperand "" .

<urn:uuid:a8f77e09-117f-4044-a8d4-768ecc5aeb43> a cr:PolicyReport ;
    dct:created "2024-02-12T11:20:10.999Z"^^xsd:dateTime ;
    cr:policy <urn:uuid:18a5175e-33e4-4f66-895d-97bcbd4e427b> ;
    cr:policyRequest <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> ;
    cr:ruleReport <urn:uuid:d34fc225-f547-4239-821e-d639f73d4cc9> .

<urn:uuid:d34fc225-f547-4239-821e-d639f73d4cc9> a cr:PermissionReport ;
    cr:attemptState cr:Attempted ;
    cr:rule <urn:uuid:1c63f3af-7c09-4748-9002-1868f6816b16> ;
    cr:ruleRequest <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> ;
    cr:premiseReport <urn:uuid:ceee3728-ee68-4971-bf20-64892e8eee69>, <urn:uuid:d1e9b76b-a785-49fa-90d1-68bc457d346d>, <urn:uuid:0abaec0b-c686-4b89-b37f-99fb9beef569>, <urn:uuid:f6d64365-7252-48f9-abde-188cf1746401> ;
    cr:activationState cr:Inactive .

<urn:uuid:d1e9b76b-a785-49fa-90d1-68bc457d346d> a cr:TargetReport ;
    cr:satisfactionState cr:Satisfied .

<urn:uuid:0abaec0b-c686-4b89-b37f-99fb9beef569> a cr:PartyReport ;
    cr:satisfactionState cr:Satisfied .

<urn:uuid:f6d64365-7252-48f9-abde-188cf1746401> a cr:ActionReport ;
    cr:satisfactionState cr:Satisfied .
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

        it('Happy flow regarding purpose with is any of.', async () => {
            const odrlPolicyText = odrlPolicyPurposeMultiple
            const odrlRequestText = odrlRequestPurposeManagement
            const stateOfTheWorldText = sotwTemporal
            const expectedReport = `
@prefix cr: <https://w3id.org/force/compliance-report#> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix dpv: <https://w3id.org/dpv#>.

<urn:uuid:ceee3728-ee68-4971-bf20-64892e8eee69> a cr:ConstraintReport ;
    cr:constraint <urn:uuid:7bffb023-24a9-4228-b767-e55b8341ef98> ;
    cr:satisfactionState cr:Satisfied ;
    cr:constraintLeftOperand <https://w3id.org/dpv#AccountManagement> ;
    cr:constraintOperator odrl:isAnyOf ;
    cr:constraintRightOperand <https://w3id.org/dpv#AccountManagement>, dpv:DataQualityManagement .

<urn:uuid:a8f77e09-117f-4044-a8d4-768ecc5aeb43> a cr:PolicyReport ;
    dct:created "2024-02-12T11:20:10.999Z"^^xsd:dateTime ;
    cr:policy <urn:uuid:b791d8a7-8e49-4428-be77-d4bb5aeffc20> ;
    cr:policyRequest <urn:uuid:ce9fc20e-7c79-474e-8afe-7605accccee8> ;
    cr:ruleReport <urn:uuid:d34fc225-f547-4239-821e-d639f73d4cc9> .

<urn:uuid:d34fc225-f547-4239-821e-d639f73d4cc9> a cr:PermissionReport ;
    cr:attemptState cr:Attempted ;
    cr:rule <urn:uuid:79b34c79-b550-4ccf-9331-ef83c27f390f> ;
    cr:ruleRequest <urn:uuid:e51a43e4-616f-4f32-906b-2359955228e5> ;
    cr:premiseReport <urn:uuid:ceee3728-ee68-4971-bf20-64892e8eee69>, <urn:uuid:d1e9b76b-a785-49fa-90d1-68bc457d346d>, <urn:uuid:0abaec0b-c686-4b89-b37f-99fb9beef569>, <urn:uuid:f6d64365-7252-48f9-abde-188cf1746401> ;
    cr:activationState cr:Active .

<urn:uuid:d1e9b76b-a785-49fa-90d1-68bc457d346d> a cr:TargetReport ;
    cr:satisfactionState cr:Satisfied .

<urn:uuid:0abaec0b-c686-4b89-b37f-99fb9beef569> a cr:PartyReport ;
    cr:satisfactionState cr:Satisfied .

<urn:uuid:f6d64365-7252-48f9-abde-188cf1746401> a cr:ActionReport ;
    cr:satisfactionState cr:Satisfied .
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

        it('Bad flow regarding purpose with is any of.', async () => {
            const odrlPolicyText = odrlPolicyPurposeMultiple
            const odrlRequestText = request1
            const stateOfTheWorldText = sotwTemporal
            const expectedReport = `
@prefix cr: <https://w3id.org/force/compliance-report#> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
    
<urn:uuid:43ce532f-dd75-4fb8-a74f-b676a00deaae> a cr:ConstraintReport ;
    cr:constraint <urn:uuid:7bffb023-24a9-4228-b767-e55b8341ef98> ;
    cr:constraintLeftOperand "" ;
    cr:satisfactionState cr:Unsatisfied .

<urn:uuid:e1fbde5d-30ce-4081-a783-9bfc1bcb133e> a cr:PolicyReport ;
    dct:created "2024-02-12T11:20:10.999Z"^^xsd:dateTime ;
    cr:policy <urn:uuid:b791d8a7-8e49-4428-be77-d4bb5aeffc20> ;
    cr:policyRequest <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> ;
    cr:ruleReport <urn:uuid:7e6d4123-2a2a-49cc-813b-bc5c56dc20ab> .

<urn:uuid:7e6d4123-2a2a-49cc-813b-bc5c56dc20ab> a cr:PermissionReport ;
    cr:attemptState cr:Attempted ;
    cr:rule <urn:uuid:79b34c79-b550-4ccf-9331-ef83c27f390f> ;
    cr:ruleRequest <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> ;
    cr:premiseReport <urn:uuid:43ce532f-dd75-4fb8-a74f-b676a00deaae>, <urn:uuid:bdb103b2-690d-4b80-9719-e4dc02f7c691>, <urn:uuid:5d5bdf58-235d-46d5-a62a-c0dbfa0573d2>, <urn:uuid:a13f705a-d06e-4f7d-83b3-26feb8efcc0d> ;
    cr:activationState cr:Inactive .

<urn:uuid:bdb103b2-690d-4b80-9719-e4dc02f7c691> a cr:TargetReport ;
    cr:satisfactionState cr:Satisfied .

<urn:uuid:5d5bdf58-235d-46d5-a62a-c0dbfa0573d2> a cr:PartyReport ;
    cr:satisfactionState cr:Satisfied .

<urn:uuid:a13f705a-d06e-4f7d-83b3-26feb8efcc0d> a cr:ActionReport ;
    cr:satisfactionState cr:Satisfied .
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

        it('Happy flow regarding purpose with is a.', async () => {
            const odrlPolicyText = odrlPolicyPurposeIsA
            const odrlRequestText = odrlRequestPurposeManagementInstance
            const stateOfTheWorldText = sotwTemporal
            const expectedReport = `
@prefix cr: <https://w3id.org/force/compliance-report#> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix ex: <http://example.org/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix dpv: <https://w3id.org/dpv#>.
@prefix odrl: <http://www.w3.org/ns/odrl/2/>.

<urn:uuid:8c4d1e57-b565-4e8c-a92a-68ab48da5b8c> a cr:ConstraintReport ;
    cr:constraint <urn:uuid:2899cef7-fb9e-49b1-b4fb-cc28a8fae75f> ;
    cr:satisfactionState cr:Satisfied ;
    cr:constraintLeftOperand ex:purpose ;
    cr:constraintOperator odrl:isA ;
    cr:constraintRightOperand dpv:AccountManagement .

<urn:uuid:a0b13218-bd11-446c-b5b0-14f6911780d5> a cr:PolicyReport ;
    dct:created "2024-02-12T11:20:10.999Z"^^xsd:dateTime ;
    cr:policy <urn:uuid:6a1153c1-aca7-496a-aba1-0b2561d4555e> ;
    cr:policyRequest <urn:uuid:480915ba-6784-4596-be02-34b35899d000> ;
    cr:ruleReport <urn:uuid:e7bd5c69-d347-4930-a45c-18b5668a2041> .

<urn:uuid:e7bd5c69-d347-4930-a45c-18b5668a2041> a cr:PermissionReport ;
    cr:attemptState cr:Attempted ;
    cr:rule <urn:uuid:f0ce2b23-d35c-483c-909a-17c986db5e68> ;
    cr:ruleRequest <urn:uuid:2a2bcfe6-b421-4279-9e0f-223567a93548> ;
    cr:premiseReport <urn:uuid:8c4d1e57-b565-4e8c-a92a-68ab48da5b8c>, <urn:uuid:0ae442d9-7212-4d53-880c-8a10d6f0c580>, <urn:uuid:30a189a5-51a8-45a1-b538-13da61408165>, <urn:uuid:d4033d99-4fb5-4ddd-9bbd-2ca3a19843bd> ;
    cr:activationState cr:Active .

<urn:uuid:0ae442d9-7212-4d53-880c-8a10d6f0c580> a cr:TargetReport ;
    cr:satisfactionState cr:Satisfied .

<urn:uuid:30a189a5-51a8-45a1-b538-13da61408165> a cr:PartyReport ;
    cr:satisfactionState cr:Satisfied .

<urn:uuid:d4033d99-4fb5-4ddd-9bbd-2ca3a19843bd> a cr:ActionReport ;
    cr:satisfactionState cr:Satisfied .
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

        it('Bad flow regarding purpose with is a.', async () => {
            const odrlPolicyText = odrlPolicyPurposeIsA
            const odrlRequestText = odrlRequestPurposeManagement
            const stateOfTheWorldText = sotwTemporal
            const expectedReport = `
@prefix cr: <https://w3id.org/force/compliance-report#> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix ex: <http://example.org/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix dpv: <https://w3id.org/dpv#>.
@prefix odrl: <http://www.w3.org/ns/odrl/2/>.

<urn:uuid:8c4d1e57-b565-4e8c-a92a-68ab48da5b8c> a cr:ConstraintReport ;
    cr:constraint <urn:uuid:2899cef7-fb9e-49b1-b4fb-cc28a8fae75f> ;
    cr:satisfactionState cr:Unsatisfied ;
    cr:constraintLeftOperand dpv:AccountManagement .

<urn:uuid:a0b13218-bd11-446c-b5b0-14f6911780d5> a cr:PolicyReport ;
    dct:created "2024-02-12T11:20:10.999Z"^^xsd:dateTime ;
    cr:policy <urn:uuid:6a1153c1-aca7-496a-aba1-0b2561d4555e> ;
    cr:policyRequest <urn:uuid:ce9fc20e-7c79-474e-8afe-7605accccee8> ;
    cr:ruleReport <urn:uuid:e7bd5c69-d347-4930-a45c-18b5668a2041> .

<urn:uuid:e7bd5c69-d347-4930-a45c-18b5668a2041> a cr:PermissionReport ;
    cr:attemptState cr:Attempted ;
    cr:rule <urn:uuid:f0ce2b23-d35c-483c-909a-17c986db5e68> ;
    cr:ruleRequest <urn:uuid:e51a43e4-616f-4f32-906b-2359955228e5> ;
    cr:premiseReport <urn:uuid:8c4d1e57-b565-4e8c-a92a-68ab48da5b8c>, <urn:uuid:0ae442d9-7212-4d53-880c-8a10d6f0c580>, <urn:uuid:30a189a5-51a8-45a1-b538-13da61408165>, <urn:uuid:d4033d99-4fb5-4ddd-9bbd-2ca3a19843bd> ;
    cr:activationState cr:Inactive .

<urn:uuid:0ae442d9-7212-4d53-880c-8a10d6f0c580> a cr:TargetReport ;
    cr:satisfactionState cr:Satisfied .

<urn:uuid:30a189a5-51a8-45a1-b538-13da61408165> a cr:PartyReport ;
    cr:satisfactionState cr:Satisfied .

<urn:uuid:d4033d99-4fb5-4ddd-9bbd-2ca3a19843bd> a cr:ActionReport ;
    cr:satisfactionState cr:Satisfied .
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

        it('Happy flow regarding purpose with is None Of (no purpose present).', async () => {
            const odrlPolicyText = odrlPolicyPurposeIsNone
            const odrlRequestText = request1
            const stateOfTheWorldText = sotwTemporal
            const expectedReport = `
@prefix cr: <https://w3id.org/force/compliance-report#> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix dpv: <https://w3id.org/dpv#> .

<urn:uuid:b97e2a7f-5740-4342-89d9-86c5893c49f1> a cr:ConstraintReport ;
    cr:constraint <urn:uuid:52d3b046-52b6-419f-95b4-93bb557cdf97> ;
    cr:satisfactionState cr:Satisfied ;
    cr:constraintLeftOperand "" ;
    cr:constraintOperator odrl:isNoneOf ;
    cr:constraintRightOperand dpv:AccountManagement, dpv:DataQualityManagement .

<urn:uuid:fb3649b2-aed3-4ea0-9bc8-567d20e3dd94> a cr:PolicyReport ;
    dct:created "2024-02-12T11:20:10.999Z"^^xsd:dateTime ;
    cr:policy <urn:uuid:5ee1a7dd-ccba-49a4-92e8-6cc375509efd> ;
    cr:policyRequest <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> ;
    cr:ruleReport <urn:uuid:1b49273e-52f4-44a1-ae7a-84936abe7b58> .

<urn:uuid:1b49273e-52f4-44a1-ae7a-84936abe7b58> a cr:PermissionReport ;
    cr:attemptState cr:Attempted ;
    cr:rule <urn:uuid:8b64ba6c-015b-41cf-9f06-2f942edcf1db> ;
    cr:ruleRequest <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> ;
    cr:premiseReport <urn:uuid:b97e2a7f-5740-4342-89d9-86c5893c49f1>, <urn:uuid:7306f8f9-1a68-4f90-9d29-c6cde17e74c1>, <urn:uuid:3d496620-54fb-4fbf-8463-be55d86b27ba>, <urn:uuid:66bb29a0-1e4f-4a2e-8bce-879385d09b97> ;
    cr:activationState cr:Active .

<urn:uuid:7306f8f9-1a68-4f90-9d29-c6cde17e74c1> a cr:TargetReport ;
    cr:satisfactionState cr:Satisfied .

<urn:uuid:3d496620-54fb-4fbf-8463-be55d86b27ba> a cr:PartyReport ;
    cr:satisfactionState cr:Satisfied .

<urn:uuid:66bb29a0-1e4f-4a2e-8bce-879385d09b97> a cr:ActionReport ;
    cr:satisfactionState cr:Satisfied .
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
        it('Bad flow regarding purpose with is None Of.', async () => {
            const odrlPolicyText = odrlPolicyPurposeIsNone
            const odrlRequestText = odrlRequestPurposeManagement
            const stateOfTheWorldText = sotwTemporal
            const expectedReport = `
@prefix cr: <https://w3id.org/force/compliance-report#> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix dpv: <https://w3id.org/dpv#> .

<urn:uuid:b97e2a7f-5740-4342-89d9-86c5893c49f1> a cr:ConstraintReport ;
    cr:constraint <urn:uuid:52d3b046-52b6-419f-95b4-93bb557cdf97> ;
    cr:satisfactionState cr:Unsatisfied ;
    cr:constraintLeftOperand dpv:AccountManagement .

<urn:uuid:fb3649b2-aed3-4ea0-9bc8-567d20e3dd94> a cr:PolicyReport ;
    dct:created "2024-02-12T11:20:10.999Z"^^xsd:dateTime ;
    cr:policy <urn:uuid:5ee1a7dd-ccba-49a4-92e8-6cc375509efd> ;
    cr:policyRequest <urn:uuid:ce9fc20e-7c79-474e-8afe-7605accccee8> ;
    cr:ruleReport <urn:uuid:1b49273e-52f4-44a1-ae7a-84936abe7b58> .

<urn:uuid:1b49273e-52f4-44a1-ae7a-84936abe7b58> a cr:PermissionReport ;
    cr:attemptState cr:Attempted ;
    cr:rule <urn:uuid:8b64ba6c-015b-41cf-9f06-2f942edcf1db> ;
    cr:ruleRequest <urn:uuid:e51a43e4-616f-4f32-906b-2359955228e5> ;
    cr:premiseReport <urn:uuid:b97e2a7f-5740-4342-89d9-86c5893c49f1>, <urn:uuid:7306f8f9-1a68-4f90-9d29-c6cde17e74c1>, <urn:uuid:3d496620-54fb-4fbf-8463-be55d86b27ba>, <urn:uuid:66bb29a0-1e4f-4a2e-8bce-879385d09b97> ;
    cr:activationState cr:Inactive .

<urn:uuid:7306f8f9-1a68-4f90-9d29-c6cde17e74c1> a cr:TargetReport ;
    cr:satisfactionState cr:Satisfied .

<urn:uuid:3d496620-54fb-4fbf-8463-be55d86b27ba> a cr:PartyReport ;
    cr:satisfactionState cr:Satisfied .

<urn:uuid:66bb29a0-1e4f-4a2e-8bce-879385d09b97> a cr:ActionReport ;
    cr:satisfactionState cr:Satisfied .
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
    })
    describe('handling requests with extra context.', () => {
        const requestID = "urn:uuid:ce9fc20e-7c79-474e-8afe-7605accccee8";
        const requestPermissionID = "urn:uuid:ce9fc20" // TODO: remove when iterated upon compliance report

        const assignee = "http://example.org/alice";
        const resource = "http://example.org/x";
        const action = ODRL.read;

        const policyID = "urn:uuid:5ee1a7dd-ccba-49a4-92e8-6cc375509efd";
        const policyType = ODRL.Agreement;
        const permissionID = "urn:uuid:e51a43e4-616f-4f32-906b-2359955228e5";
        const ruleType = ODRL.Permission

        const constraintID = "urn:uuid:963698fe-3b44-4b88-8527-501b6c5765a6";
        let policy: Policy;
        let request: Request;

        const sotwQuads = parser.parse(sotwTemporal);

        beforeEach(() => {
            policy = {
                identifier: policyID,
                type: policyType,
                rules: [{
                    assignee: assignee,
                    target: resource,
                    action: action,
                    type: ruleType,
                    identifier: permissionID,
                    constraints: []
                }]
            }
            request = {
                assignee: assignee,
                resource: resource,
                action: action,
                identifier: requestID,
                context: []
            }
        })

        it('Happy flow evaluation of an ODRL policy with a deliveryChannel constraint.', async () => {
            const leftOperand = ODRL.deliveryChannel;
            const operator = ODRL.eq;
            const rightOperand = "https://podpro.dev/id";
            policy.rules[0].constraints.push({
                leftOperand: leftOperand,
                rightOperand: rightOperand,
                operator: operator,
                identifier: constraintID
            })
            const policyQuads = policyToQuads(policy)

            request.context.push({
                leftOperand: leftOperand,
                rightOperand: rightOperand,
                operator: operator,
                identifier: createRandomUrn()
            })
            const requestQuads = makeRDFRequest(request, requestPermissionID)

            const report = await odrlEvaluator.evaluate(policyQuads, requestQuads, sotwQuads);
            const policyReport = parseSingleComplianceReport(report);
            expect(policyReport.ruleReport.length).toBe(1)
            expect(policyReport.ruleReport[0].activationState).toBe(REPORT.Active)
            expect(policyReport.ruleReport[0].premiseReport.length).toBe(4);
            expect(countSatisfiedPremises(policyReport.ruleReport[0].premiseReport)).toBe(4);
        });

        it('Bad evaluation of an ODRL policy with a deliveryChannel constraint.', async () => {
            const leftOperand = ODRL.deliveryChannel;
            const operator = ODRL.eq;
            const rightOperand = "https://podpro.dev/id";
            policy.rules[0].constraints.push({
                leftOperand: leftOperand,
                rightOperand: rightOperand,
                operator: operator,
                identifier: constraintID
            })
            const policyQuads = policyToQuads(policy)

            request.context.push({
                leftOperand: leftOperand,
                rightOperand: "https://someOtherClient.id",
                operator: operator,
                identifier: createRandomUrn()
            })
            const requestQuads = makeRDFRequest(request, requestPermissionID)

            const report = await odrlEvaluator.evaluate(policyQuads, requestQuads, sotwQuads);
            const policyReport = parseSingleComplianceReport(report);
            expect(policyReport.ruleReport.length).toBe(1)
            expect(policyReport.ruleReport[0].activationState).toBe(REPORT.Inactive)
            expect(policyReport.ruleReport[0].premiseReport.length).toBe(4);
            expect(countSatisfiedPremises(policyReport.ruleReport[0].premiseReport)).toBe(3);
        });

        it('Happy flow evaluation of an ODRL policy with a purpose constraint.', async () => {
            const leftOperand = ODRL.purpose;
            const operator = ODRL.eq;
            const rightOperand = "https://w3id.org/dpv#AccountManagement";

            policy.rules[0].constraints.push({
                leftOperand: leftOperand,
                rightOperand: rightOperand,
                operator: operator,
                identifier: constraintID
            })
            const policyQuads = policyToQuads(policy)

            request.context.push({
                leftOperand: leftOperand,
                rightOperand: rightOperand,
                operator: operator,
                identifier: createRandomUrn()
            })
            const requestQuads = makeRDFRequest(request, requestPermissionID)

            const report = await odrlEvaluator.evaluate(policyQuads, requestQuads, sotwQuads);
            const policyReport = parseSingleComplianceReport(report);
            expect(policyReport.ruleReport.length).toBe(1)
            expect(policyReport.ruleReport[0].activationState).toBe(REPORT.Active)
            expect(policyReport.ruleReport[0].premiseReport.length).toBe(4);
            expect(countSatisfiedPremises(policyReport.ruleReport[0].premiseReport)).toBe(4);
        })

        it('Bad evaluation of an ODRL policy with a purpose constraint.', async () => {
            const leftOperand = ODRL.purpose;
            const operator = ODRL.eq;
            const rightOperand = "https://w3id.org/dpv#AccountManagement";

            policy.rules[0].constraints.push({
                leftOperand: leftOperand,
                rightOperand: rightOperand,
                operator: operator,
                identifier: constraintID
            })
            const policyQuads = policyToQuads(policy)

            request.context.push({
                leftOperand: ODRL.deliveryChannel,
                rightOperand: rightOperand,
                operator: operator,
                identifier: createRandomUrn()
            })
            const requestQuads = makeRDFRequest(request, requestPermissionID)

            const report = await odrlEvaluator.evaluate(policyQuads, requestQuads, sotwQuads);
            const policyReport = parseSingleComplianceReport(report);
            expect(policyReport.ruleReport.length).toBe(1)
            expect(policyReport.ruleReport[0].activationState).toBe(REPORT.Inactive)
            expect(policyReport.ruleReport[0].premiseReport.length).toBe(4);
            expect(countSatisfiedPremises(policyReport.ruleReport[0].premiseReport)).toBe(3);
        })
    })
});