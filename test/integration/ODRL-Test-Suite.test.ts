import { ODRLEngineMultipleSteps, ODRLEvaluator, blanknodeify } from "../../src";
import { Parser, Quad } from "n3";
import "jest-rdf";

describe('The ODRL evaluator succeeds following test case ', () => {
    const parser = new Parser();
    const odrlEvaluator = new ODRLEvaluator(new ODRLEngineMultipleSteps());

        it('urn:uuid:e2123eb7-0707-4f24-bcc0-9d61dd9088a9: Any request results into yes (Alice Request).', async () => {
        
    const odrlPolicy = `<urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> .
<urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> <http://purl.org/dc/terms/description> "Everybody can do everything." .
<urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:72e248bf-5f4f-472f-af76-8beca297415c> .
<urn:uuid:72e248bf-5f4f-472f-af76-8beca297415c> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:75a52a92-5872-480e-9380-f7d9f2a53e94> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:75a52a92-5872-480e-9380-f7d9f2a53e94> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:75a52a92-5872-480e-9380-f7d9f2a53e94> <https://w3id.org/force/compliance-report#policy> <urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> .
<urn:uuid:75a52a92-5872-480e-9380-f7d9f2a53e94> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:75a52a92-5872-480e-9380-f7d9f2a53e94> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:070aa778-01c8-487b-b833-ccdfd4be836b> .
<urn:uuid:070aa778-01c8-487b-b833-ccdfd4be836b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:070aa778-01c8-487b-b833-ccdfd4be836b> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:070aa778-01c8-487b-b833-ccdfd4be836b> <https://w3id.org/force/compliance-report#rule> <urn:uuid:72e248bf-5f4f-472f-af76-8beca297415c> .
<urn:uuid:070aa778-01c8-487b-b833-ccdfd4be836b> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:070aa778-01c8-487b-b833-ccdfd4be836b> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:bffd9ee8-63a6-4b50-ab68-26709ce95bdc: Any request results into yes (Bob Request).', async () => {
        
    const odrlPolicy = `<urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> .
<urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> <http://purl.org/dc/terms/description> "Everybody can do everything." .
<urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:72e248bf-5f4f-472f-af76-8beca297415c> .
<urn:uuid:72e248bf-5f4f-472f-af76-8beca297415c> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
`;
const odrlRequest = `<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://purl.org/dc/terms/description> "Requesting Party BOB requests to READ resource X." .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:06be7c95-1771-43e8-83d9-18899440c42d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:06be7c95-1771-43e8-83d9-18899440c42d> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:06be7c95-1771-43e8-83d9-18899440c42d> <https://w3id.org/force/compliance-report#policy> <urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> .
<urn:uuid:06be7c95-1771-43e8-83d9-18899440c42d> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> .
<urn:uuid:06be7c95-1771-43e8-83d9-18899440c42d> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:41b4b672-6f17-42e1-8fa5-cdac4f231cf0> .
<urn:uuid:41b4b672-6f17-42e1-8fa5-cdac4f231cf0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:41b4b672-6f17-42e1-8fa5-cdac4f231cf0> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:41b4b672-6f17-42e1-8fa5-cdac4f231cf0> <https://w3id.org/force/compliance-report#rule> <urn:uuid:72e248bf-5f4f-472f-af76-8beca297415c> .
<urn:uuid:41b4b672-6f17-42e1-8fa5-cdac4f231cf0> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> .
<urn:uuid:41b4b672-6f17-42e1-8fa5-cdac4f231cf0> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:debea3a5-056b-464c-bcca-95ab4678a27b: Any request results into yes (Bob Request Write).', async () => {
        
    const odrlPolicy = `<urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> .
<urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> <http://purl.org/dc/terms/description> "Everybody can do everything." .
<urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:72e248bf-5f4f-472f-af76-8beca297415c> .
<urn:uuid:72e248bf-5f4f-472f-af76-8beca297415c> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
`;
const odrlRequest = `<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://purl.org/dc/terms/description> "Requesting Party BOB requests to WRITE resource Y." .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/write> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/target> <http://example.org/y> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:00f32161-8dcf-470c-b419-681e7344697b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:00f32161-8dcf-470c-b419-681e7344697b> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:00f32161-8dcf-470c-b419-681e7344697b> <https://w3id.org/force/compliance-report#policy> <urn:uuid:4cbd8f38-348b-4b09-8e1a-04b47c97ad78> .
<urn:uuid:00f32161-8dcf-470c-b419-681e7344697b> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> .
<urn:uuid:00f32161-8dcf-470c-b419-681e7344697b> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:e1116cdc-bbc4-4f9a-8287-b6a6e878bf70> .
<urn:uuid:e1116cdc-bbc4-4f9a-8287-b6a6e878bf70> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:e1116cdc-bbc4-4f9a-8287-b6a6e878bf70> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:e1116cdc-bbc4-4f9a-8287-b6a6e878bf70> <https://w3id.org/force/compliance-report#rule> <urn:uuid:72e248bf-5f4f-472f-af76-8beca297415c> .
<urn:uuid:e1116cdc-bbc4-4f9a-8287-b6a6e878bf70> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> .
<urn:uuid:e1116cdc-bbc4-4f9a-8287-b6a6e878bf70> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:00a20e06-50db-4ae4-a53e-18ffeccde8c8: Any request results into no (Alice Request).', async () => {
        
    const odrlPolicy = `<urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> .
<urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> <http://purl.org/dc/terms/description> "Nobody can do anything." .
<urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> <http://www.w3.org/ns/odrl/2/prohibition> <urn:uuid:f3bdc260-5194-4a8a-a99e-91f9b3b710ee> .
<urn:uuid:f3bdc260-5194-4a8a-a99e-91f9b3b710ee> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Prohibition> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:5ed77faf-9549-4564-a26a-41ddd95c46c1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:5ed77faf-9549-4564-a26a-41ddd95c46c1> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:5ed77faf-9549-4564-a26a-41ddd95c46c1> <https://w3id.org/force/compliance-report#policy> <urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> .
<urn:uuid:5ed77faf-9549-4564-a26a-41ddd95c46c1> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:5ed77faf-9549-4564-a26a-41ddd95c46c1> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:39b4bec9-14d5-4350-88dc-839150aa9fb1> .
<urn:uuid:39b4bec9-14d5-4350-88dc-839150aa9fb1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ProhibitionReport> .
<urn:uuid:39b4bec9-14d5-4350-88dc-839150aa9fb1> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:39b4bec9-14d5-4350-88dc-839150aa9fb1> <https://w3id.org/force/compliance-report#rule> <urn:uuid:f3bdc260-5194-4a8a-a99e-91f9b3b710ee> .
<urn:uuid:39b4bec9-14d5-4350-88dc-839150aa9fb1> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:39b4bec9-14d5-4350-88dc-839150aa9fb1> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:a1c58c22-c170-483f-b05a-5b6ae4e632f5: Any request results into no (Bob Request).', async () => {
        
    const odrlPolicy = `<urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> .
<urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> <http://purl.org/dc/terms/description> "Nobody can do anything." .
<urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> <http://www.w3.org/ns/odrl/2/prohibition> <urn:uuid:f3bdc260-5194-4a8a-a99e-91f9b3b710ee> .
<urn:uuid:f3bdc260-5194-4a8a-a99e-91f9b3b710ee> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Prohibition> .
`;
const odrlRequest = `<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://purl.org/dc/terms/description> "Requesting Party BOB requests to READ resource X." .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:6a0d84bd-0144-4367-9d2f-e790dba3ef9c> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:6a0d84bd-0144-4367-9d2f-e790dba3ef9c> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:6a0d84bd-0144-4367-9d2f-e790dba3ef9c> <https://w3id.org/force/compliance-report#policy> <urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> .
<urn:uuid:6a0d84bd-0144-4367-9d2f-e790dba3ef9c> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> .
<urn:uuid:6a0d84bd-0144-4367-9d2f-e790dba3ef9c> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:6bfa4b0a-5b04-466e-9807-165c159d4d91> .
<urn:uuid:6bfa4b0a-5b04-466e-9807-165c159d4d91> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ProhibitionReport> .
<urn:uuid:6bfa4b0a-5b04-466e-9807-165c159d4d91> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:6bfa4b0a-5b04-466e-9807-165c159d4d91> <https://w3id.org/force/compliance-report#rule> <urn:uuid:f3bdc260-5194-4a8a-a99e-91f9b3b710ee> .
<urn:uuid:6bfa4b0a-5b04-466e-9807-165c159d4d91> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> .
<urn:uuid:6bfa4b0a-5b04-466e-9807-165c159d4d91> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:f588a33b-9346-4ea5-9d3a-22fd215e50a6: Any request results into no (Bob Request Write).', async () => {
        
    const odrlPolicy = `<urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> .
<urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> <http://purl.org/dc/terms/description> "Nobody can do anything." .
<urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> <http://www.w3.org/ns/odrl/2/prohibition> <urn:uuid:f3bdc260-5194-4a8a-a99e-91f9b3b710ee> .
<urn:uuid:f3bdc260-5194-4a8a-a99e-91f9b3b710ee> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Prohibition> .
`;
const odrlRequest = `<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://purl.org/dc/terms/description> "Requesting Party BOB requests to WRITE resource Y." .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/write> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/target> <http://example.org/y> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:a8d22539-246e-4818-b9e3-b0bb07f41bd0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:a8d22539-246e-4818-b9e3-b0bb07f41bd0> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:a8d22539-246e-4818-b9e3-b0bb07f41bd0> <https://w3id.org/force/compliance-report#policy> <urn:uuid:fe737228-8ead-4771-af2c-d6c9de1bdc05> .
<urn:uuid:a8d22539-246e-4818-b9e3-b0bb07f41bd0> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> .
<urn:uuid:a8d22539-246e-4818-b9e3-b0bb07f41bd0> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:9552f918-2d2b-4b51-85ea-c4003f689ca0> .
<urn:uuid:9552f918-2d2b-4b51-85ea-c4003f689ca0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ProhibitionReport> .
<urn:uuid:9552f918-2d2b-4b51-85ea-c4003f689ca0> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:9552f918-2d2b-4b51-85ea-c4003f689ca0> <https://w3id.org/force/compliance-report#rule> <urn:uuid:f3bdc260-5194-4a8a-a99e-91f9b3b710ee> .
<urn:uuid:9552f918-2d2b-4b51-85ea-c4003f689ca0> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> .
<urn:uuid:9552f918-2d2b-4b51-85ea-c4003f689ca0> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:b68298ee-f9d5-4f1c-a856-7a011cc2af69: Any request to use results into yes (Alice Request).', async () => {
        
    const odrlPolicy = `<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> .
<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://purl.org/dc/terms/description> "Everybody can do use." .
<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:a40b1d34-02ae-4af6-b31f-2296443a726b> .
<urn:uuid:a40b1d34-02ae-4af6-b31f-2296443a726b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:a40b1d34-02ae-4af6-b31f-2296443a726b> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/use> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:895ccdd2-b693-4ac1-809e-2656fd5f0a1b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:895ccdd2-b693-4ac1-809e-2656fd5f0a1b> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:895ccdd2-b693-4ac1-809e-2656fd5f0a1b> <https://w3id.org/force/compliance-report#policy> <urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> .
<urn:uuid:895ccdd2-b693-4ac1-809e-2656fd5f0a1b> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:895ccdd2-b693-4ac1-809e-2656fd5f0a1b> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:c83c8ec8-a7d6-41d8-b970-6dc2b0aeecc0> .
<urn:uuid:c83c8ec8-a7d6-41d8-b970-6dc2b0aeecc0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:c83c8ec8-a7d6-41d8-b970-6dc2b0aeecc0> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:c83c8ec8-a7d6-41d8-b970-6dc2b0aeecc0> <https://w3id.org/force/compliance-report#rule> <urn:uuid:a40b1d34-02ae-4af6-b31f-2296443a726b> .
<urn:uuid:c83c8ec8-a7d6-41d8-b970-6dc2b0aeecc0> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:c83c8ec8-a7d6-41d8-b970-6dc2b0aeecc0> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:fa79756a-4f2c-4945-a7d9-e8aeb6b55df7> .
<urn:uuid:c83c8ec8-a7d6-41d8-b970-6dc2b0aeecc0> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:fa79756a-4f2c-4945-a7d9-e8aeb6b55df7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:fa79756a-4f2c-4945-a7d9-e8aeb6b55df7> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:dfe139c2-02c9-40b1-a8ae-e61cc82a768a: Any request to use results into yes (Bob Request).', async () => {
        
    const odrlPolicy = `<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> .
<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://purl.org/dc/terms/description> "Everybody can do use." .
<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:a40b1d34-02ae-4af6-b31f-2296443a726b> .
<urn:uuid:a40b1d34-02ae-4af6-b31f-2296443a726b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:a40b1d34-02ae-4af6-b31f-2296443a726b> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/use> .
`;
const odrlRequest = `<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://purl.org/dc/terms/description> "Requesting Party BOB requests to READ resource X." .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:db6c0265-0997-44a6-87fb-f241e334f1c4> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:db6c0265-0997-44a6-87fb-f241e334f1c4> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:db6c0265-0997-44a6-87fb-f241e334f1c4> <https://w3id.org/force/compliance-report#policy> <urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> .
<urn:uuid:db6c0265-0997-44a6-87fb-f241e334f1c4> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> .
<urn:uuid:db6c0265-0997-44a6-87fb-f241e334f1c4> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:6870285f-579e-4400-bb97-768ed786f58e> .
<urn:uuid:6870285f-579e-4400-bb97-768ed786f58e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:6870285f-579e-4400-bb97-768ed786f58e> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:6870285f-579e-4400-bb97-768ed786f58e> <https://w3id.org/force/compliance-report#rule> <urn:uuid:a40b1d34-02ae-4af6-b31f-2296443a726b> .
<urn:uuid:6870285f-579e-4400-bb97-768ed786f58e> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> .
<urn:uuid:6870285f-579e-4400-bb97-768ed786f58e> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:ca08a6ea-2a50-41c6-ac7e-7793c43b01f1> .
<urn:uuid:6870285f-579e-4400-bb97-768ed786f58e> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:ca08a6ea-2a50-41c6-ac7e-7793c43b01f1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:ca08a6ea-2a50-41c6-ac7e-7793c43b01f1> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:f2e067fb-c1df-4266-9b23-6c60ccdbfcb0: Any request to use results into yes (Bob Request Write).', async () => {
        
    const odrlPolicy = `<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> .
<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://purl.org/dc/terms/description> "Everybody can do use." .
<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:a40b1d34-02ae-4af6-b31f-2296443a726b> .
<urn:uuid:a40b1d34-02ae-4af6-b31f-2296443a726b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:a40b1d34-02ae-4af6-b31f-2296443a726b> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/use> .
`;
const odrlRequest = `<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://purl.org/dc/terms/description> "Requesting Party BOB requests to WRITE resource Y." .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/write> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/target> <http://example.org/y> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:e582b7bc-5acf-43a9-aec4-a48e3a1f3c6a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:e582b7bc-5acf-43a9-aec4-a48e3a1f3c6a> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:e582b7bc-5acf-43a9-aec4-a48e3a1f3c6a> <https://w3id.org/force/compliance-report#policy> <urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> .
<urn:uuid:e582b7bc-5acf-43a9-aec4-a48e3a1f3c6a> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> .
<urn:uuid:e582b7bc-5acf-43a9-aec4-a48e3a1f3c6a> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:c46d16b6-7c43-419a-88f5-17908467095e> .
<urn:uuid:c46d16b6-7c43-419a-88f5-17908467095e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:c46d16b6-7c43-419a-88f5-17908467095e> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:c46d16b6-7c43-419a-88f5-17908467095e> <https://w3id.org/force/compliance-report#rule> <urn:uuid:a40b1d34-02ae-4af6-b31f-2296443a726b> .
<urn:uuid:c46d16b6-7c43-419a-88f5-17908467095e> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> .
<urn:uuid:c46d16b6-7c43-419a-88f5-17908467095e> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:395706e8-bf06-431a-a9ad-acb70314382b> .
<urn:uuid:c46d16b6-7c43-419a-88f5-17908467095e> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:395706e8-bf06-431a-a9ad-acb70314382b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:395706e8-bf06-431a-a9ad-acb70314382b> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:5e23604d-f6a0-464f-a6b3-eb04fe97b908: Any request to use results into yes (Alice Request Sell).', async () => {
        
    const odrlPolicy = `<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> .
<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://purl.org/dc/terms/description> "Everybody can do use." .
<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:a40b1d34-02ae-4af6-b31f-2296443a726b> .
<urn:uuid:a40b1d34-02ae-4af6-b31f-2296443a726b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:a40b1d34-02ae-4af6-b31f-2296443a726b> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/use> .
`;
const odrlRequest = `<urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> .
<urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to SELL resource X." .
<urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> .
<urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/sell> .
<urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:7b715f6e-23f1-402e-8dd6-89df8cff0cf7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:7b715f6e-23f1-402e-8dd6-89df8cff0cf7> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:7b715f6e-23f1-402e-8dd6-89df8cff0cf7> <https://w3id.org/force/compliance-report#policy> <urn:uuid:a2ada399-48a3-4860-b44d-fa35516fdac2> .
<urn:uuid:7b715f6e-23f1-402e-8dd6-89df8cff0cf7> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> .
<urn:uuid:7b715f6e-23f1-402e-8dd6-89df8cff0cf7> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:373dfcf5-c27b-4ab7-9a66-a3ba931f1493> .
<urn:uuid:373dfcf5-c27b-4ab7-9a66-a3ba931f1493> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:373dfcf5-c27b-4ab7-9a66-a3ba931f1493> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:373dfcf5-c27b-4ab7-9a66-a3ba931f1493> <https://w3id.org/force/compliance-report#rule> <urn:uuid:a40b1d34-02ae-4af6-b31f-2296443a726b> .
<urn:uuid:373dfcf5-c27b-4ab7-9a66-a3ba931f1493> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> .
<urn:uuid:373dfcf5-c27b-4ab7-9a66-a3ba931f1493> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:7a230308-3b1d-45e8-898c-cf401a9380e9> .
<urn:uuid:373dfcf5-c27b-4ab7-9a66-a3ba931f1493> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:7a230308-3b1d-45e8-898c-cf401a9380e9> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:7a230308-3b1d-45e8-898c-cf401a9380e9> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:f152953e-c7c6-4a47-a7e5-2522210d5627: Any request to use results into no (Alice Request).', async () => {
        
    const odrlPolicy = `<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> .
<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://purl.org/dc/terms/description> "Nobody can do use." .
<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://www.w3.org/ns/odrl/2/prohibition> <urn:uuid:bdc2727b-d28d-4d8b-a9df-bff9546242fe> .
<urn:uuid:bdc2727b-d28d-4d8b-a9df-bff9546242fe> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Prohibition> .
<urn:uuid:bdc2727b-d28d-4d8b-a9df-bff9546242fe> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/use> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:6094d6c2-99bb-4c07-a257-19e61b0256e8> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:6094d6c2-99bb-4c07-a257-19e61b0256e8> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:6094d6c2-99bb-4c07-a257-19e61b0256e8> <https://w3id.org/force/compliance-report#policy> <urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> .
<urn:uuid:6094d6c2-99bb-4c07-a257-19e61b0256e8> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:6094d6c2-99bb-4c07-a257-19e61b0256e8> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:cb6ef7c7-8447-4e9c-bdb4-c4f5dd93a16b> .
<urn:uuid:cb6ef7c7-8447-4e9c-bdb4-c4f5dd93a16b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ProhibitionReport> .
<urn:uuid:cb6ef7c7-8447-4e9c-bdb4-c4f5dd93a16b> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:cb6ef7c7-8447-4e9c-bdb4-c4f5dd93a16b> <https://w3id.org/force/compliance-report#rule> <urn:uuid:bdc2727b-d28d-4d8b-a9df-bff9546242fe> .
<urn:uuid:cb6ef7c7-8447-4e9c-bdb4-c4f5dd93a16b> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:cb6ef7c7-8447-4e9c-bdb4-c4f5dd93a16b> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:432df964-11f9-4329-88f6-f9fae42fa433> .
<urn:uuid:cb6ef7c7-8447-4e9c-bdb4-c4f5dd93a16b> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:432df964-11f9-4329-88f6-f9fae42fa433> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:432df964-11f9-4329-88f6-f9fae42fa433> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:d9c381f3-76db-4e1e-801b-380c8e47722d: Any request to use results into no (Bob Request).', async () => {
        
    const odrlPolicy = `<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> .
<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://purl.org/dc/terms/description> "Nobody can do use." .
<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://www.w3.org/ns/odrl/2/prohibition> <urn:uuid:bdc2727b-d28d-4d8b-a9df-bff9546242fe> .
<urn:uuid:bdc2727b-d28d-4d8b-a9df-bff9546242fe> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Prohibition> .
<urn:uuid:bdc2727b-d28d-4d8b-a9df-bff9546242fe> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/use> .
`;
const odrlRequest = `<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://purl.org/dc/terms/description> "Requesting Party BOB requests to READ resource X." .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:1c18a891-f525-43ed-b9a1-45552b87dede> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:1c18a891-f525-43ed-b9a1-45552b87dede> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:1c18a891-f525-43ed-b9a1-45552b87dede> <https://w3id.org/force/compliance-report#policy> <urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> .
<urn:uuid:1c18a891-f525-43ed-b9a1-45552b87dede> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> .
<urn:uuid:1c18a891-f525-43ed-b9a1-45552b87dede> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:cc5eab66-cac7-4ecd-abd4-7f0dba5eda20> .
<urn:uuid:cc5eab66-cac7-4ecd-abd4-7f0dba5eda20> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ProhibitionReport> .
<urn:uuid:cc5eab66-cac7-4ecd-abd4-7f0dba5eda20> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:cc5eab66-cac7-4ecd-abd4-7f0dba5eda20> <https://w3id.org/force/compliance-report#rule> <urn:uuid:bdc2727b-d28d-4d8b-a9df-bff9546242fe> .
<urn:uuid:cc5eab66-cac7-4ecd-abd4-7f0dba5eda20> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> .
<urn:uuid:cc5eab66-cac7-4ecd-abd4-7f0dba5eda20> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:b9ce17f7-b286-4d02-92b3-ea7c77455f21> .
<urn:uuid:cc5eab66-cac7-4ecd-abd4-7f0dba5eda20> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:b9ce17f7-b286-4d02-92b3-ea7c77455f21> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:b9ce17f7-b286-4d02-92b3-ea7c77455f21> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:eed06a7c-055e-4789-bdbc-40365b2a26d4: Any request to use results into no (Bob Request Write).', async () => {
        
    const odrlPolicy = `<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> .
<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://purl.org/dc/terms/description> "Nobody can do use." .
<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://www.w3.org/ns/odrl/2/prohibition> <urn:uuid:bdc2727b-d28d-4d8b-a9df-bff9546242fe> .
<urn:uuid:bdc2727b-d28d-4d8b-a9df-bff9546242fe> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Prohibition> .
<urn:uuid:bdc2727b-d28d-4d8b-a9df-bff9546242fe> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/use> .
`;
const odrlRequest = `<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://purl.org/dc/terms/description> "Requesting Party BOB requests to WRITE resource Y." .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/write> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/target> <http://example.org/y> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:b00eed8a-d5fa-476a-9558-c839e9ebf262> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:b00eed8a-d5fa-476a-9558-c839e9ebf262> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:b00eed8a-d5fa-476a-9558-c839e9ebf262> <https://w3id.org/force/compliance-report#policy> <urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> .
<urn:uuid:b00eed8a-d5fa-476a-9558-c839e9ebf262> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> .
<urn:uuid:b00eed8a-d5fa-476a-9558-c839e9ebf262> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:d0216f8e-2281-48db-a846-ff5d6a485664> .
<urn:uuid:d0216f8e-2281-48db-a846-ff5d6a485664> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ProhibitionReport> .
<urn:uuid:d0216f8e-2281-48db-a846-ff5d6a485664> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:d0216f8e-2281-48db-a846-ff5d6a485664> <https://w3id.org/force/compliance-report#rule> <urn:uuid:bdc2727b-d28d-4d8b-a9df-bff9546242fe> .
<urn:uuid:d0216f8e-2281-48db-a846-ff5d6a485664> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> .
<urn:uuid:d0216f8e-2281-48db-a846-ff5d6a485664> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:37c4b16c-6f15-4594-bc57-13a5c65877f7> .
<urn:uuid:d0216f8e-2281-48db-a846-ff5d6a485664> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:37c4b16c-6f15-4594-bc57-13a5c65877f7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:37c4b16c-6f15-4594-bc57-13a5c65877f7> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:687781a9-409d-4ae6-89e5-3a64bdb5bda7: Any request to use results into no (Alice Request Sell).', async () => {
        
    const odrlPolicy = `<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> .
<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://purl.org/dc/terms/description> "Nobody can do use." .
<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> <http://www.w3.org/ns/odrl/2/prohibition> <urn:uuid:bdc2727b-d28d-4d8b-a9df-bff9546242fe> .
<urn:uuid:bdc2727b-d28d-4d8b-a9df-bff9546242fe> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Prohibition> .
<urn:uuid:bdc2727b-d28d-4d8b-a9df-bff9546242fe> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/use> .
`;
const odrlRequest = `<urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> .
<urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to SELL resource X." .
<urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> .
<urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/sell> .
<urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:d2ddd6a9-1c15-49fa-8b9d-62201f84a111> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:d2ddd6a9-1c15-49fa-8b9d-62201f84a111> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:d2ddd6a9-1c15-49fa-8b9d-62201f84a111> <https://w3id.org/force/compliance-report#policy> <urn:uuid:b0d32e25-f642-4afa-9098-0e23750f7ad6> .
<urn:uuid:d2ddd6a9-1c15-49fa-8b9d-62201f84a111> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> .
<urn:uuid:d2ddd6a9-1c15-49fa-8b9d-62201f84a111> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:66e93960-141b-405b-9610-9937e358708a> .
<urn:uuid:66e93960-141b-405b-9610-9937e358708a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ProhibitionReport> .
<urn:uuid:66e93960-141b-405b-9610-9937e358708a> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:66e93960-141b-405b-9610-9937e358708a> <https://w3id.org/force/compliance-report#rule> <urn:uuid:bdc2727b-d28d-4d8b-a9df-bff9546242fe> .
<urn:uuid:66e93960-141b-405b-9610-9937e358708a> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> .
<urn:uuid:66e93960-141b-405b-9610-9937e358708a> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:47b2ba00-920b-4b03-a5c1-412c2c42d0dd> .
<urn:uuid:66e93960-141b-405b-9610-9937e358708a> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:47b2ba00-920b-4b03-a5c1-412c2c42d0dd> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:47b2ba00-920b-4b03-a5c1-412c2c42d0dd> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:a03acb38-73b3-4b09-a1f9-d9dd21bae0ef: Any request from Alice to use returns into yes (Alice Request).', async () => {
        
    const odrlPolicy = `<urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> .
<urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> <http://purl.org/dc/terms/description> "Only Alice can use everything." .
<urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:cb04c08b-e956-4f74-b89a-f87b6f658a90> .
<urn:uuid:cb04c08b-e956-4f74-b89a-f87b6f658a90> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:cb04c08b-e956-4f74-b89a-f87b6f658a90> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:cb04c08b-e956-4f74-b89a-f87b6f658a90> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/use> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:9b5bb511-9729-48f0-8dd1-09f4cb395101> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:9b5bb511-9729-48f0-8dd1-09f4cb395101> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:9b5bb511-9729-48f0-8dd1-09f4cb395101> <https://w3id.org/force/compliance-report#policy> <urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> .
<urn:uuid:9b5bb511-9729-48f0-8dd1-09f4cb395101> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:9b5bb511-9729-48f0-8dd1-09f4cb395101> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:95df7483-d3af-41df-8c02-80a1fff848ee> .
<urn:uuid:95df7483-d3af-41df-8c02-80a1fff848ee> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:95df7483-d3af-41df-8c02-80a1fff848ee> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:95df7483-d3af-41df-8c02-80a1fff848ee> <https://w3id.org/force/compliance-report#rule> <urn:uuid:cb04c08b-e956-4f74-b89a-f87b6f658a90> .
<urn:uuid:95df7483-d3af-41df-8c02-80a1fff848ee> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:95df7483-d3af-41df-8c02-80a1fff848ee> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:ef9132bd-a400-4f27-acff-f00b19e37c47> .
<urn:uuid:95df7483-d3af-41df-8c02-80a1fff848ee> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:3ca13acb-ebe6-4020-97f6-9daf0b4295c5> .
<urn:uuid:95df7483-d3af-41df-8c02-80a1fff848ee> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:ef9132bd-a400-4f27-acff-f00b19e37c47> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:ef9132bd-a400-4f27-acff-f00b19e37c47> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:3ca13acb-ebe6-4020-97f6-9daf0b4295c5> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:3ca13acb-ebe6-4020-97f6-9daf0b4295c5> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:296a3e9d-af68-4d1c-8acd-f2958c3d7a8a: Any request from Alice to use returns into yes (Bob Request).', async () => {
        
    const odrlPolicy = `<urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> .
<urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> <http://purl.org/dc/terms/description> "Only Alice can use everything." .
<urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:cb04c08b-e956-4f74-b89a-f87b6f658a90> .
<urn:uuid:cb04c08b-e956-4f74-b89a-f87b6f658a90> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:cb04c08b-e956-4f74-b89a-f87b6f658a90> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:cb04c08b-e956-4f74-b89a-f87b6f658a90> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/use> .
`;
const odrlRequest = `<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://purl.org/dc/terms/description> "Requesting Party BOB requests to READ resource X." .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:273bae0e-5716-4fd5-82b9-7569cb93b755> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:273bae0e-5716-4fd5-82b9-7569cb93b755> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:273bae0e-5716-4fd5-82b9-7569cb93b755> <https://w3id.org/force/compliance-report#policy> <urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> .
<urn:uuid:273bae0e-5716-4fd5-82b9-7569cb93b755> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> .
<urn:uuid:273bae0e-5716-4fd5-82b9-7569cb93b755> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:a9bc031d-c846-442e-bb72-25951c7939c0> .
<urn:uuid:a9bc031d-c846-442e-bb72-25951c7939c0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:a9bc031d-c846-442e-bb72-25951c7939c0> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:a9bc031d-c846-442e-bb72-25951c7939c0> <https://w3id.org/force/compliance-report#rule> <urn:uuid:cb04c08b-e956-4f74-b89a-f87b6f658a90> .
<urn:uuid:a9bc031d-c846-442e-bb72-25951c7939c0> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> .
<urn:uuid:a9bc031d-c846-442e-bb72-25951c7939c0> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:2e67d261-bac2-4bb6-adae-24aa006f255e> .
<urn:uuid:a9bc031d-c846-442e-bb72-25951c7939c0> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:d812ee1d-30e0-49a7-87d4-919e557656c4> .
<urn:uuid:a9bc031d-c846-442e-bb72-25951c7939c0> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:2e67d261-bac2-4bb6-adae-24aa006f255e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:2e67d261-bac2-4bb6-adae-24aa006f255e> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:d812ee1d-30e0-49a7-87d4-919e557656c4> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:d812ee1d-30e0-49a7-87d4-919e557656c4> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:ab740e02-2f2c-4f50-bccd-9884e96b679e: Any request from Alice to use returns into yes (Alice Request Sell).', async () => {
        
    const odrlPolicy = `<urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> .
<urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> <http://purl.org/dc/terms/description> "Only Alice can use everything." .
<urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:cb04c08b-e956-4f74-b89a-f87b6f658a90> .
<urn:uuid:cb04c08b-e956-4f74-b89a-f87b6f658a90> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:cb04c08b-e956-4f74-b89a-f87b6f658a90> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:cb04c08b-e956-4f74-b89a-f87b6f658a90> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/use> .
`;
const odrlRequest = `<urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> .
<urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to SELL resource X." .
<urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> .
<urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/sell> .
<urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:ace9b76b-6e8e-464f-b229-c91722aa3c6c> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:ace9b76b-6e8e-464f-b229-c91722aa3c6c> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:ace9b76b-6e8e-464f-b229-c91722aa3c6c> <https://w3id.org/force/compliance-report#policy> <urn:uuid:715d33b9-5222-4a73-a2ad-9899066b4fd7> .
<urn:uuid:ace9b76b-6e8e-464f-b229-c91722aa3c6c> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> .
<urn:uuid:ace9b76b-6e8e-464f-b229-c91722aa3c6c> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:606f7860-e453-476d-a927-014135d28984> .
<urn:uuid:606f7860-e453-476d-a927-014135d28984> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:606f7860-e453-476d-a927-014135d28984> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:606f7860-e453-476d-a927-014135d28984> <https://w3id.org/force/compliance-report#rule> <urn:uuid:cb04c08b-e956-4f74-b89a-f87b6f658a90> .
<urn:uuid:606f7860-e453-476d-a927-014135d28984> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> .
<urn:uuid:606f7860-e453-476d-a927-014135d28984> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:6af2437a-dab9-4811-979d-a8e4cc796fc9> .
<urn:uuid:606f7860-e453-476d-a927-014135d28984> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:a3930a85-a3a3-40de-924b-971557cecc78> .
<urn:uuid:606f7860-e453-476d-a927-014135d28984> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:6af2437a-dab9-4811-979d-a8e4cc796fc9> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:6af2437a-dab9-4811-979d-a8e4cc796fc9> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:a3930a85-a3a3-40de-924b-971557cecc78> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:a3930a85-a3a3-40de-924b-971557cecc78> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:95dd195c-0e5e-440f-8517-f4298a64a019: Any request from Bob to use returns into no (Alice Request).', async () => {
        
    const odrlPolicy = `<urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> .
<urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> <http://purl.org/dc/terms/description> "Bob explicitely use nothing." .
<urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> <http://www.w3.org/ns/odrl/2/prohibition> <urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> .
<urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Prohibition> .
<urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/use> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:ea01244e-c705-4c63-b8ec-f7e224a10b8e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:ea01244e-c705-4c63-b8ec-f7e224a10b8e> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:ea01244e-c705-4c63-b8ec-f7e224a10b8e> <https://w3id.org/force/compliance-report#policy> <urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> .
<urn:uuid:ea01244e-c705-4c63-b8ec-f7e224a10b8e> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:ea01244e-c705-4c63-b8ec-f7e224a10b8e> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:d5094f49-84a3-4af0-b465-d2dd50590e6a> .
<urn:uuid:d5094f49-84a3-4af0-b465-d2dd50590e6a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ProhibitionReport> .
<urn:uuid:d5094f49-84a3-4af0-b465-d2dd50590e6a> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:d5094f49-84a3-4af0-b465-d2dd50590e6a> <https://w3id.org/force/compliance-report#rule> <urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> .
<urn:uuid:d5094f49-84a3-4af0-b465-d2dd50590e6a> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:d5094f49-84a3-4af0-b465-d2dd50590e6a> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:8b2a7408-820a-4692-8ff9-40df26d6bc5a> .
<urn:uuid:d5094f49-84a3-4af0-b465-d2dd50590e6a> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:212f7b33-d3d6-46a2-b8ab-87c52b71d3d6> .
<urn:uuid:d5094f49-84a3-4af0-b465-d2dd50590e6a> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:8b2a7408-820a-4692-8ff9-40df26d6bc5a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:8b2a7408-820a-4692-8ff9-40df26d6bc5a> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:212f7b33-d3d6-46a2-b8ab-87c52b71d3d6> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:212f7b33-d3d6-46a2-b8ab-87c52b71d3d6> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:790f07c5-2dc2-4782-abcc-410340abad94: Any request from Bob to use returns into no (Bob Request).', async () => {
        
    const odrlPolicy = `<urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> .
<urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> <http://purl.org/dc/terms/description> "Bob explicitely use nothing." .
<urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> <http://www.w3.org/ns/odrl/2/prohibition> <urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> .
<urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Prohibition> .
<urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/use> .
`;
const odrlRequest = `<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://purl.org/dc/terms/description> "Requesting Party BOB requests to READ resource X." .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:011bbf22-2039-4f65-bf9b-2e581fcbc0a8> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:011bbf22-2039-4f65-bf9b-2e581fcbc0a8> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:011bbf22-2039-4f65-bf9b-2e581fcbc0a8> <https://w3id.org/force/compliance-report#policy> <urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> .
<urn:uuid:011bbf22-2039-4f65-bf9b-2e581fcbc0a8> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> .
<urn:uuid:011bbf22-2039-4f65-bf9b-2e581fcbc0a8> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:42b203d0-90c8-479f-b127-f04e56cdbd75> .
<urn:uuid:42b203d0-90c8-479f-b127-f04e56cdbd75> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ProhibitionReport> .
<urn:uuid:42b203d0-90c8-479f-b127-f04e56cdbd75> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:42b203d0-90c8-479f-b127-f04e56cdbd75> <https://w3id.org/force/compliance-report#rule> <urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> .
<urn:uuid:42b203d0-90c8-479f-b127-f04e56cdbd75> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> .
<urn:uuid:42b203d0-90c8-479f-b127-f04e56cdbd75> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:55d0c400-f07e-466e-868d-7216a5770123> .
<urn:uuid:42b203d0-90c8-479f-b127-f04e56cdbd75> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:24e09513-53a0-4e73-b942-4b35d170cbfd> .
<urn:uuid:42b203d0-90c8-479f-b127-f04e56cdbd75> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:55d0c400-f07e-466e-868d-7216a5770123> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:55d0c400-f07e-466e-868d-7216a5770123> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:24e09513-53a0-4e73-b942-4b35d170cbfd> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:24e09513-53a0-4e73-b942-4b35d170cbfd> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:c309ff91-5c6e-427a-bee4-4923f5f38844: Any request from Bob to use returns into no (Bob Request Sell).', async () => {
        
    const odrlPolicy = `<urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> .
<urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> <http://purl.org/dc/terms/description> "Bob explicitely use nothing." .
<urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> <http://www.w3.org/ns/odrl/2/prohibition> <urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> .
<urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Prohibition> .
<urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/use> .
`;
const odrlRequest = `<urn:uuid:b7306adc-3f51-4ed4-b9fb-1864c2f1bdc9> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:b7306adc-3f51-4ed4-b9fb-1864c2f1bdc9> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:b7306adc-3f51-4ed4-b9fb-1864c2f1bdc9> .
<urn:uuid:b7306adc-3f51-4ed4-b9fb-1864c2f1bdc9> <http://purl.org/dc/terms/description> "Requesting Party BOB requests to SELL resource X." .
<urn:uuid:b7306adc-3f51-4ed4-b9fb-1864c2f1bdc9> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:057e7c34-57e7-473c-972c-d80a2a7b32b1> .
<urn:uuid:057e7c34-57e7-473c-972c-d80a2a7b32b1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:057e7c34-57e7-473c-972c-d80a2a7b32b1> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:057e7c34-57e7-473c-972c-d80a2a7b32b1> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/sell> .
<urn:uuid:057e7c34-57e7-473c-972c-d80a2a7b32b1> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:1e4beeee-a180-4e16-8a00-0cd70150292e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:1e4beeee-a180-4e16-8a00-0cd70150292e> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:1e4beeee-a180-4e16-8a00-0cd70150292e> <https://w3id.org/force/compliance-report#policy> <urn:uuid:e4b538e6-2613-4de4-8930-48fee524aa40> .
<urn:uuid:1e4beeee-a180-4e16-8a00-0cd70150292e> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:b7306adc-3f51-4ed4-b9fb-1864c2f1bdc9> .
<urn:uuid:1e4beeee-a180-4e16-8a00-0cd70150292e> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:874a30f9-ba8e-4d3d-bf9e-df1c1c151837> .
<urn:uuid:874a30f9-ba8e-4d3d-bf9e-df1c1c151837> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ProhibitionReport> .
<urn:uuid:874a30f9-ba8e-4d3d-bf9e-df1c1c151837> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:874a30f9-ba8e-4d3d-bf9e-df1c1c151837> <https://w3id.org/force/compliance-report#rule> <urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> .
<urn:uuid:874a30f9-ba8e-4d3d-bf9e-df1c1c151837> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:057e7c34-57e7-473c-972c-d80a2a7b32b1> .
<urn:uuid:874a30f9-ba8e-4d3d-bf9e-df1c1c151837> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:7157a374-e1d8-4de5-a434-96f1e2600bc6> .
<urn:uuid:874a30f9-ba8e-4d3d-bf9e-df1c1c151837> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:c244fb96-d80f-4b90-bbfc-7b9caec6062c> .
<urn:uuid:874a30f9-ba8e-4d3d-bf9e-df1c1c151837> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:7157a374-e1d8-4de5-a434-96f1e2600bc6> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:7157a374-e1d8-4de5-a434-96f1e2600bc6> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:c244fb96-d80f-4b90-bbfc-7b9caec6062c> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:c244fb96-d80f-4b90-bbfc-7b9caec6062c> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:84cdbf46-afc2-42f2-9ed5-b9e87063292c: Read request from Alice returns into yes (Alice Request).', async () => {
        
    const odrlPolicy = `<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://purl.org/dc/terms/description> "Alice can only read everything." .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> .
<urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:98c7e0b4-c589-4916-a4c3-5162423d4942> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:98c7e0b4-c589-4916-a4c3-5162423d4942> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:98c7e0b4-c589-4916-a4c3-5162423d4942> <https://w3id.org/force/compliance-report#policy> <urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> .
<urn:uuid:98c7e0b4-c589-4916-a4c3-5162423d4942> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:98c7e0b4-c589-4916-a4c3-5162423d4942> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:80906b36-deb4-4b02-bff6-d27b09bff240> .
<urn:uuid:80906b36-deb4-4b02-bff6-d27b09bff240> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:80906b36-deb4-4b02-bff6-d27b09bff240> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:80906b36-deb4-4b02-bff6-d27b09bff240> <https://w3id.org/force/compliance-report#rule> <urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> .
<urn:uuid:80906b36-deb4-4b02-bff6-d27b09bff240> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:80906b36-deb4-4b02-bff6-d27b09bff240> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:6e7b3c94-ed81-4d79-ae51-912df497c2f8> .
<urn:uuid:80906b36-deb4-4b02-bff6-d27b09bff240> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:f626e3cd-53d4-4408-938c-3a4ce69dc394> .
<urn:uuid:80906b36-deb4-4b02-bff6-d27b09bff240> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:6e7b3c94-ed81-4d79-ae51-912df497c2f8> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:6e7b3c94-ed81-4d79-ae51-912df497c2f8> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:f626e3cd-53d4-4408-938c-3a4ce69dc394> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:f626e3cd-53d4-4408-938c-3a4ce69dc394> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:9cbe9ea0-61aa-4e92-a711-65d677b54f55: Read request from Alice returns into yes (Alice Request Sell).', async () => {
        
    const odrlPolicy = `<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://purl.org/dc/terms/description> "Alice can only read everything." .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> .
<urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
`;
const odrlRequest = `<urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> .
<urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to SELL resource X." .
<urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> .
<urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/sell> .
<urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:ecdcf3cf-8043-4dfd-8303-c3d8cfc0ed65> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:ecdcf3cf-8043-4dfd-8303-c3d8cfc0ed65> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:ecdcf3cf-8043-4dfd-8303-c3d8cfc0ed65> <https://w3id.org/force/compliance-report#policy> <urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> .
<urn:uuid:ecdcf3cf-8043-4dfd-8303-c3d8cfc0ed65> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:4089cf37-8cb0-49e9-a5a4-022cc1b2b749> .
<urn:uuid:ecdcf3cf-8043-4dfd-8303-c3d8cfc0ed65> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:79bf6556-b6fd-42f0-a4f2-f841065a2caf> .
<urn:uuid:79bf6556-b6fd-42f0-a4f2-f841065a2caf> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:79bf6556-b6fd-42f0-a4f2-f841065a2caf> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:79bf6556-b6fd-42f0-a4f2-f841065a2caf> <https://w3id.org/force/compliance-report#rule> <urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> .
<urn:uuid:79bf6556-b6fd-42f0-a4f2-f841065a2caf> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:918e0608-59cd-4f69-8614-679f23f0bb7e> .
<urn:uuid:79bf6556-b6fd-42f0-a4f2-f841065a2caf> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:6e36b032-9a9e-4f54-b2ab-b6bf15417c02> .
<urn:uuid:79bf6556-b6fd-42f0-a4f2-f841065a2caf> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:aee016fd-8277-4d1c-b0bd-899862a9d4e6> .
<urn:uuid:79bf6556-b6fd-42f0-a4f2-f841065a2caf> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:6e36b032-9a9e-4f54-b2ab-b6bf15417c02> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:6e36b032-9a9e-4f54-b2ab-b6bf15417c02> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:aee016fd-8277-4d1c-b0bd-899862a9d4e6> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:aee016fd-8277-4d1c-b0bd-899862a9d4e6> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:0b40edb2-8d1c-4c0e-91a0-1c19486686bd: Read request from Alice returns into yes (Alice Request Read Y).', async () => {
        
    const odrlPolicy = `<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://purl.org/dc/terms/description> "Alice can only read everything." .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> .
<urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
`;
const odrlRequest = `<urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> .
<urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> <http://purl.org/dc/terms/description> "Requesting Party Alice requests to READ resource Y." .
<urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> .
<urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> <http://www.w3.org/ns/odrl/2/target> <http://example.org/y> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:7ce1df83-59cb-4b0b-b80f-c029f603e43d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:7ce1df83-59cb-4b0b-b80f-c029f603e43d> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:7ce1df83-59cb-4b0b-b80f-c029f603e43d> <https://w3id.org/force/compliance-report#policy> <urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> .
<urn:uuid:7ce1df83-59cb-4b0b-b80f-c029f603e43d> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> .
<urn:uuid:7ce1df83-59cb-4b0b-b80f-c029f603e43d> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:94f48e3e-d77e-4ef8-9fab-f8bcd37e3488> .
<urn:uuid:94f48e3e-d77e-4ef8-9fab-f8bcd37e3488> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:94f48e3e-d77e-4ef8-9fab-f8bcd37e3488> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:94f48e3e-d77e-4ef8-9fab-f8bcd37e3488> <https://w3id.org/force/compliance-report#rule> <urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> .
<urn:uuid:94f48e3e-d77e-4ef8-9fab-f8bcd37e3488> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> .
<urn:uuid:94f48e3e-d77e-4ef8-9fab-f8bcd37e3488> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:fcf260a5-1923-4b15-a16f-3bafb915647b> .
<urn:uuid:94f48e3e-d77e-4ef8-9fab-f8bcd37e3488> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:f1f63cf1-9615-414c-a61d-42563c6dbc54> .
<urn:uuid:94f48e3e-d77e-4ef8-9fab-f8bcd37e3488> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:fcf260a5-1923-4b15-a16f-3bafb915647b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:fcf260a5-1923-4b15-a16f-3bafb915647b> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:f1f63cf1-9615-414c-a61d-42563c6dbc54> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:f1f63cf1-9615-414c-a61d-42563c6dbc54> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:623d29bc-f4e2-4f2a-80ec-2cbb2e8c6a2a: Read request from Alice returns into yes (Alice Request Write X).', async () => {
        
    const odrlPolicy = `<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://purl.org/dc/terms/description> "Alice can only read everything." .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> .
<urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
`;
const odrlRequest = `<urn:uuid:5b323bdb-7b4d-4431-8548-de2d021b673d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:5b323bdb-7b4d-4431-8548-de2d021b673d> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:5b323bdb-7b4d-4431-8548-de2d021b673d> .
<urn:uuid:5b323bdb-7b4d-4431-8548-de2d021b673d> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to WRITE resource X." .
<urn:uuid:5b323bdb-7b4d-4431-8548-de2d021b673d> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:6045248b-571c-4f90-a5bc-c980bbe776e8> .
<urn:uuid:6045248b-571c-4f90-a5bc-c980bbe776e8> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:6045248b-571c-4f90-a5bc-c980bbe776e8> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:6045248b-571c-4f90-a5bc-c980bbe776e8> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/write> .
<urn:uuid:6045248b-571c-4f90-a5bc-c980bbe776e8> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:c0a9957f-0c38-40d9-8a9c-fad5ca29cb31> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:c0a9957f-0c38-40d9-8a9c-fad5ca29cb31> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:c0a9957f-0c38-40d9-8a9c-fad5ca29cb31> <https://w3id.org/force/compliance-report#policy> <urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> .
<urn:uuid:c0a9957f-0c38-40d9-8a9c-fad5ca29cb31> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:5b323bdb-7b4d-4431-8548-de2d021b673d> .
<urn:uuid:c0a9957f-0c38-40d9-8a9c-fad5ca29cb31> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:50f11768-3dd7-4cbb-a129-3c4310fff848> .
<urn:uuid:50f11768-3dd7-4cbb-a129-3c4310fff848> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:50f11768-3dd7-4cbb-a129-3c4310fff848> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:50f11768-3dd7-4cbb-a129-3c4310fff848> <https://w3id.org/force/compliance-report#rule> <urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> .
<urn:uuid:50f11768-3dd7-4cbb-a129-3c4310fff848> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:6045248b-571c-4f90-a5bc-c980bbe776e8> .
<urn:uuid:50f11768-3dd7-4cbb-a129-3c4310fff848> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:7382ada1-d7ef-4c3e-8f3d-f7bbb66d36b7> .
<urn:uuid:50f11768-3dd7-4cbb-a129-3c4310fff848> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:7e994fa3-df3e-49ba-96f6-746e398df3a5> .
<urn:uuid:50f11768-3dd7-4cbb-a129-3c4310fff848> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:7382ada1-d7ef-4c3e-8f3d-f7bbb66d36b7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:7382ada1-d7ef-4c3e-8f3d-f7bbb66d36b7> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:7e994fa3-df3e-49ba-96f6-746e398df3a5> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:7e994fa3-df3e-49ba-96f6-746e398df3a5> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:c6cc07c2-7c97-44d2-a85d-578710efefca: Read request from Alice returns into yes (Bob Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://purl.org/dc/terms/description> "Alice can only read everything." .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> .
<urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
`;
const odrlRequest = `<urn:uuid:df1566c9-a18b-444f-a1fa-98b976d411eb> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:df1566c9-a18b-444f-a1fa-98b976d411eb> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:df1566c9-a18b-444f-a1fa-98b976d411eb> .
<urn:uuid:df1566c9-a18b-444f-a1fa-98b976d411eb> <http://purl.org/dc/terms/description> "Requesting Party BOB requests to READ resource X." .
<urn:uuid:df1566c9-a18b-444f-a1fa-98b976d411eb> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:abaf6782-4094-4010-a8b4-8cd70f008039> .
<urn:uuid:abaf6782-4094-4010-a8b4-8cd70f008039> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:abaf6782-4094-4010-a8b4-8cd70f008039> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:abaf6782-4094-4010-a8b4-8cd70f008039> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:abaf6782-4094-4010-a8b4-8cd70f008039> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:9ebc4d47-e23e-49c9-83c5-1fcf3f85bcfa> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:9ebc4d47-e23e-49c9-83c5-1fcf3f85bcfa> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:9ebc4d47-e23e-49c9-83c5-1fcf3f85bcfa> <https://w3id.org/force/compliance-report#policy> <urn:uuid:d30381e3-2c24-4197-a5b4-1e9767575141> .
<urn:uuid:9ebc4d47-e23e-49c9-83c5-1fcf3f85bcfa> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:df1566c9-a18b-444f-a1fa-98b976d411eb> .
<urn:uuid:9ebc4d47-e23e-49c9-83c5-1fcf3f85bcfa> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:20e253d9-d3fc-45b5-b98f-5eb0873380f7> .
<urn:uuid:20e253d9-d3fc-45b5-b98f-5eb0873380f7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:20e253d9-d3fc-45b5-b98f-5eb0873380f7> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:20e253d9-d3fc-45b5-b98f-5eb0873380f7> <https://w3id.org/force/compliance-report#rule> <urn:uuid:8d6927a2-6c5b-4df7-9aa8-4cba7387db61> .
<urn:uuid:20e253d9-d3fc-45b5-b98f-5eb0873380f7> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:abaf6782-4094-4010-a8b4-8cd70f008039> .
<urn:uuid:20e253d9-d3fc-45b5-b98f-5eb0873380f7> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:c96ab5ef-1126-4a10-a63c-8bd5a1f59734> .
<urn:uuid:20e253d9-d3fc-45b5-b98f-5eb0873380f7> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:36391041-92c9-4bee-830d-0766d7102d75> .
<urn:uuid:20e253d9-d3fc-45b5-b98f-5eb0873380f7> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:c96ab5ef-1126-4a10-a63c-8bd5a1f59734> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:c96ab5ef-1126-4a10-a63c-8bd5a1f59734> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:36391041-92c9-4bee-830d-0766d7102d75> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:36391041-92c9-4bee-830d-0766d7102d75> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:3ce32312-1c36-4839-b12d-e3d6884d89f0: Read request from Alice to resource X returns into yes (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> .
<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://purl.org/dc/terms/description> "Alice can only read x." .
<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> .
<urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:13727869-5f02-4a2b-bc34-d081833b8642> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:13727869-5f02-4a2b-bc34-d081833b8642> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:13727869-5f02-4a2b-bc34-d081833b8642> <https://w3id.org/force/compliance-report#policy> <urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> .
<urn:uuid:13727869-5f02-4a2b-bc34-d081833b8642> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:13727869-5f02-4a2b-bc34-d081833b8642> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:d9f2106d-93fd-4084-a67e-8cf4bb530c81> .
<urn:uuid:d9f2106d-93fd-4084-a67e-8cf4bb530c81> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:d9f2106d-93fd-4084-a67e-8cf4bb530c81> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:d9f2106d-93fd-4084-a67e-8cf4bb530c81> <https://w3id.org/force/compliance-report#rule> <urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> .
<urn:uuid:d9f2106d-93fd-4084-a67e-8cf4bb530c81> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:d9f2106d-93fd-4084-a67e-8cf4bb530c81> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:8be1de65-b824-40e5-8688-a967e6125867> .
<urn:uuid:d9f2106d-93fd-4084-a67e-8cf4bb530c81> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:9b664503-2217-41dc-9339-318c3fd8c5d4> .
<urn:uuid:d9f2106d-93fd-4084-a67e-8cf4bb530c81> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:dda08273-b3ee-4431-9b84-db236222a9ac> .
<urn:uuid:d9f2106d-93fd-4084-a67e-8cf4bb530c81> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:8be1de65-b824-40e5-8688-a967e6125867> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:8be1de65-b824-40e5-8688-a967e6125867> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:9b664503-2217-41dc-9339-318c3fd8c5d4> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:9b664503-2217-41dc-9339-318c3fd8c5d4> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:dda08273-b3ee-4431-9b84-db236222a9ac> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:dda08273-b3ee-4431-9b84-db236222a9ac> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:113d9a92-fee3-42b2-b347-e8bbc8316b6f: Read request from Alice to resource X returns into yes (Alice Request Write X).', async () => {
        
    const odrlPolicy = `<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> .
<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://purl.org/dc/terms/description> "Alice can only read x." .
<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> .
<urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const odrlRequest = `<urn:uuid:5b323bdb-7b4d-4431-8548-de2d021b673d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:5b323bdb-7b4d-4431-8548-de2d021b673d> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:5b323bdb-7b4d-4431-8548-de2d021b673d> .
<urn:uuid:5b323bdb-7b4d-4431-8548-de2d021b673d> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to WRITE resource X." .
<urn:uuid:5b323bdb-7b4d-4431-8548-de2d021b673d> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:6045248b-571c-4f90-a5bc-c980bbe776e8> .
<urn:uuid:6045248b-571c-4f90-a5bc-c980bbe776e8> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:6045248b-571c-4f90-a5bc-c980bbe776e8> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:6045248b-571c-4f90-a5bc-c980bbe776e8> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/write> .
<urn:uuid:6045248b-571c-4f90-a5bc-c980bbe776e8> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:34fd6de1-5f4d-4743-ab5e-856766eb9396> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:34fd6de1-5f4d-4743-ab5e-856766eb9396> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:34fd6de1-5f4d-4743-ab5e-856766eb9396> <https://w3id.org/force/compliance-report#policy> <urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> .
<urn:uuid:34fd6de1-5f4d-4743-ab5e-856766eb9396> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:5b323bdb-7b4d-4431-8548-de2d021b673d> .
<urn:uuid:34fd6de1-5f4d-4743-ab5e-856766eb9396> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:6bd3a324-0095-4455-b6e7-7d51924e2643> .
<urn:uuid:6bd3a324-0095-4455-b6e7-7d51924e2643> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:6bd3a324-0095-4455-b6e7-7d51924e2643> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:6bd3a324-0095-4455-b6e7-7d51924e2643> <https://w3id.org/force/compliance-report#rule> <urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> .
<urn:uuid:6bd3a324-0095-4455-b6e7-7d51924e2643> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:6045248b-571c-4f90-a5bc-c980bbe776e8> .
<urn:uuid:6bd3a324-0095-4455-b6e7-7d51924e2643> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:77ec6e77-59aa-4b2a-8e6e-4f6409a9a593> .
<urn:uuid:6bd3a324-0095-4455-b6e7-7d51924e2643> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:93a0af5d-bd95-4412-9ba7-adb9694ac722> .
<urn:uuid:6bd3a324-0095-4455-b6e7-7d51924e2643> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:bb6250ee-d291-43d4-8131-2341bc128d21> .
<urn:uuid:6bd3a324-0095-4455-b6e7-7d51924e2643> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:77ec6e77-59aa-4b2a-8e6e-4f6409a9a593> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:77ec6e77-59aa-4b2a-8e6e-4f6409a9a593> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:93a0af5d-bd95-4412-9ba7-adb9694ac722> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:93a0af5d-bd95-4412-9ba7-adb9694ac722> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:bb6250ee-d291-43d4-8131-2341bc128d21> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:bb6250ee-d291-43d4-8131-2341bc128d21> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:97e3adc5-16f1-45d2-87b9-e8e50b5a61d8: Read request from Alice to resource X returns into yes (Alice Request Read Y).', async () => {
        
    const odrlPolicy = `<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> .
<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://purl.org/dc/terms/description> "Alice can only read x." .
<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> .
<urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const odrlRequest = `<urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> .
<urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> <http://purl.org/dc/terms/description> "Requesting Party Alice requests to READ resource Y." .
<urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> .
<urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> <http://www.w3.org/ns/odrl/2/target> <http://example.org/y> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:2e5b4bf4-ff6e-4fc3-9aa1-b9452139171b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:2e5b4bf4-ff6e-4fc3-9aa1-b9452139171b> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:2e5b4bf4-ff6e-4fc3-9aa1-b9452139171b> <https://w3id.org/force/compliance-report#policy> <urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> .
<urn:uuid:2e5b4bf4-ff6e-4fc3-9aa1-b9452139171b> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> .
<urn:uuid:2e5b4bf4-ff6e-4fc3-9aa1-b9452139171b> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:d31e8708-d175-4358-aa71-97f28c549f58> .
<urn:uuid:d31e8708-d175-4358-aa71-97f28c549f58> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:d31e8708-d175-4358-aa71-97f28c549f58> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:d31e8708-d175-4358-aa71-97f28c549f58> <https://w3id.org/force/compliance-report#rule> <urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> .
<urn:uuid:d31e8708-d175-4358-aa71-97f28c549f58> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> .
<urn:uuid:d31e8708-d175-4358-aa71-97f28c549f58> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:14c953af-960d-4210-88c5-080e97246854> .
<urn:uuid:d31e8708-d175-4358-aa71-97f28c549f58> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:2469a759-8f5a-40b2-89f4-f41826a8ae3e> .
<urn:uuid:d31e8708-d175-4358-aa71-97f28c549f58> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:e3bf126f-404b-45a0-ba15-226de603aa87> .
<urn:uuid:d31e8708-d175-4358-aa71-97f28c549f58> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:14c953af-960d-4210-88c5-080e97246854> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:14c953af-960d-4210-88c5-080e97246854> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:2469a759-8f5a-40b2-89f4-f41826a8ae3e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:2469a759-8f5a-40b2-89f4-f41826a8ae3e> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:e3bf126f-404b-45a0-ba15-226de603aa87> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:e3bf126f-404b-45a0-ba15-226de603aa87> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:2e5cac06-0f27-4265-884c-9a60d5a64a61: Read request from Alice to resource X returns into yes (Bob Request Write Y).', async () => {
        
    const odrlPolicy = `<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> .
<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://purl.org/dc/terms/description> "Alice can only read x." .
<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> .
<urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const odrlRequest = `<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://purl.org/dc/terms/description> "Requesting Party BOB requests to WRITE resource Y." .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/write> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/target> <http://example.org/y> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:c3dcf705-8b6e-4fc8-b336-19a67097e130> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:c3dcf705-8b6e-4fc8-b336-19a67097e130> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:c3dcf705-8b6e-4fc8-b336-19a67097e130> <https://w3id.org/force/compliance-report#policy> <urn:uuid:f42a700b-3314-4cf0-8b8d-1581f203cfa1> .
<urn:uuid:c3dcf705-8b6e-4fc8-b336-19a67097e130> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> .
<urn:uuid:c3dcf705-8b6e-4fc8-b336-19a67097e130> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:4296e1b2-9737-413c-8780-ab0434569fb9> .
<urn:uuid:4296e1b2-9737-413c-8780-ab0434569fb9> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:4296e1b2-9737-413c-8780-ab0434569fb9> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:4296e1b2-9737-413c-8780-ab0434569fb9> <https://w3id.org/force/compliance-report#rule> <urn:uuid:69d57d36-74e5-443c-bae5-30159b0cbd3e> .
<urn:uuid:4296e1b2-9737-413c-8780-ab0434569fb9> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> .
<urn:uuid:4296e1b2-9737-413c-8780-ab0434569fb9> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:0187fbd6-f8a9-4e31-be96-26278bf35165> .
<urn:uuid:4296e1b2-9737-413c-8780-ab0434569fb9> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:7130c1c2-bd09-4e2c-94d1-bf5ff149a711> .
<urn:uuid:4296e1b2-9737-413c-8780-ab0434569fb9> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:3e6aefbe-6379-4dce-b24e-c6910481858b> .
<urn:uuid:4296e1b2-9737-413c-8780-ab0434569fb9> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:0187fbd6-f8a9-4e31-be96-26278bf35165> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:0187fbd6-f8a9-4e31-be96-26278bf35165> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:7130c1c2-bd09-4e2c-94d1-bf5ff149a711> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:7130c1c2-bd09-4e2c-94d1-bf5ff149a711> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:3e6aefbe-6379-4dce-b24e-c6910481858b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:3e6aefbe-6379-4dce-b24e-c6910481858b> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:dde40097-f237-40cf-bb1e-03f632f6fd62: Read request from Alice to resource X returns into yes (temporal eq) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> .
<urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> <http://purl.org/dc/terms/description> "ALICE may READ resource X at 2024-02-12T11:20:10.999Z." .
<urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> .
<urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/eq> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:b5c925fe-7b3b-4370-b5ce-e3fe81a0b472> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:b5c925fe-7b3b-4370-b5ce-e3fe81a0b472> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:b5c925fe-7b3b-4370-b5ce-e3fe81a0b472> <https://w3id.org/force/compliance-report#policy> <urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> .
<urn:uuid:b5c925fe-7b3b-4370-b5ce-e3fe81a0b472> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:b5c925fe-7b3b-4370-b5ce-e3fe81a0b472> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:0eac903b-0177-459a-b380-5ea5f2d30a2a> .
<urn:uuid:0eac903b-0177-459a-b380-5ea5f2d30a2a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:0eac903b-0177-459a-b380-5ea5f2d30a2a> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:0eac903b-0177-459a-b380-5ea5f2d30a2a> <https://w3id.org/force/compliance-report#rule> <urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> .
<urn:uuid:0eac903b-0177-459a-b380-5ea5f2d30a2a> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:0eac903b-0177-459a-b380-5ea5f2d30a2a> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:902e4ac0-514a-45b8-aa88-bff23668ab82> .
<urn:uuid:0eac903b-0177-459a-b380-5ea5f2d30a2a> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:ba0bf101-32fd-4381-aae9-600b70d79b7c> .
<urn:uuid:0eac903b-0177-459a-b380-5ea5f2d30a2a> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:12fa7ab7-9d92-4f7e-8fbd-485030da2099> .
<urn:uuid:0eac903b-0177-459a-b380-5ea5f2d30a2a> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:4129b67c-3a29-4cfc-9ec5-b37affed48e8> .
<urn:uuid:0eac903b-0177-459a-b380-5ea5f2d30a2a> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:902e4ac0-514a-45b8-aa88-bff23668ab82> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:902e4ac0-514a-45b8-aa88-bff23668ab82> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:902e4ac0-514a-45b8-aa88-bff23668ab82> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:902e4ac0-514a-45b8-aa88-bff23668ab82> <https://w3id.org/force/compliance-report#constraintOperator> <http://www.w3.org/ns/odrl/2/eq> .
<urn:uuid:902e4ac0-514a-45b8-aa88-bff23668ab82> <https://w3id.org/force/compliance-report#constraintRightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:902e4ac0-514a-45b8-aa88-bff23668ab82> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:ba0bf101-32fd-4381-aae9-600b70d79b7c> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:ba0bf101-32fd-4381-aae9-600b70d79b7c> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:12fa7ab7-9d92-4f7e-8fbd-485030da2099> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:12fa7ab7-9d92-4f7e-8fbd-485030da2099> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:4129b67c-3a29-4cfc-9ec5-b37affed48e8> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:4129b67c-3a29-4cfc-9ec5-b37affed48e8> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:f86ae64f-a207-4f5e-824d-c71253419232: Read request from Alice to resource X returns into yes (temporal eq - past) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> .
<urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> <http://purl.org/dc/terms/description> "ALICE may READ resource X at 2024-02-12T11:20:10.999Z." .
<urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> .
<urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/eq> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:01dfd00b-6851-41d2-800f-c9e17f30e1a5> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:01dfd00b-6851-41d2-800f-c9e17f30e1a5> <http://purl.org/dc/terms/created> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:01dfd00b-6851-41d2-800f-c9e17f30e1a5> <https://w3id.org/force/compliance-report#policy> <urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> .
<urn:uuid:01dfd00b-6851-41d2-800f-c9e17f30e1a5> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:01dfd00b-6851-41d2-800f-c9e17f30e1a5> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:ddfb407a-42ed-4a74-ba1d-fb2a2e4a3526> .
<urn:uuid:ddfb407a-42ed-4a74-ba1d-fb2a2e4a3526> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:ddfb407a-42ed-4a74-ba1d-fb2a2e4a3526> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:ddfb407a-42ed-4a74-ba1d-fb2a2e4a3526> <https://w3id.org/force/compliance-report#rule> <urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> .
<urn:uuid:ddfb407a-42ed-4a74-ba1d-fb2a2e4a3526> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:ddfb407a-42ed-4a74-ba1d-fb2a2e4a3526> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:9d1d8c56-e2ac-467f-a368-3913b7aad001> .
<urn:uuid:ddfb407a-42ed-4a74-ba1d-fb2a2e4a3526> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:b62c94c2-0481-4387-81c6-0bcd4be6eaef> .
<urn:uuid:ddfb407a-42ed-4a74-ba1d-fb2a2e4a3526> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:e7106ef9-051c-4582-9fec-62c44dc3c1fd> .
<urn:uuid:ddfb407a-42ed-4a74-ba1d-fb2a2e4a3526> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:fce85c0c-47d3-4c41-9e06-5d01a01c910a> .
<urn:uuid:ddfb407a-42ed-4a74-ba1d-fb2a2e4a3526> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:9d1d8c56-e2ac-467f-a368-3913b7aad001> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:9d1d8c56-e2ac-467f-a368-3913b7aad001> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:9d1d8c56-e2ac-467f-a368-3913b7aad001> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:9d1d8c56-e2ac-467f-a368-3913b7aad001> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:b62c94c2-0481-4387-81c6-0bcd4be6eaef> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:b62c94c2-0481-4387-81c6-0bcd4be6eaef> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:e7106ef9-051c-4582-9fec-62c44dc3c1fd> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:e7106ef9-051c-4582-9fec-62c44dc3c1fd> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:fce85c0c-47d3-4c41-9e06-5d01a01c910a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:fce85c0c-47d3-4c41-9e06-5d01a01c910a> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:ea199623-277b-4976-9cf5-1bbccb334da3: Read request from Alice to resource X returns into yes (temporal eq - future) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> .
<urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> <http://purl.org/dc/terms/description> "ALICE may READ resource X at 2024-02-12T11:20:10.999Z." .
<urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> .
<urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/eq> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:0d97f018-503b-4439-822b-f1199f37bff1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:0d97f018-503b-4439-822b-f1199f37bff1> <http://purl.org/dc/terms/created> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:0d97f018-503b-4439-822b-f1199f37bff1> <https://w3id.org/force/compliance-report#policy> <urn:uuid:aa146278-f812-4957-9e25-318a83998cc4> .
<urn:uuid:0d97f018-503b-4439-822b-f1199f37bff1> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:0d97f018-503b-4439-822b-f1199f37bff1> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:3eed20de-163a-49d1-adaf-34040bcd22bd> .
<urn:uuid:3eed20de-163a-49d1-adaf-34040bcd22bd> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:3eed20de-163a-49d1-adaf-34040bcd22bd> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:3eed20de-163a-49d1-adaf-34040bcd22bd> <https://w3id.org/force/compliance-report#rule> <urn:uuid:6ed7ed9d-b9be-4756-9b44-1d2372ae943c> .
<urn:uuid:3eed20de-163a-49d1-adaf-34040bcd22bd> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:3eed20de-163a-49d1-adaf-34040bcd22bd> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:187ab85d-5c5f-4b97-9b5a-e150b25d9600> .
<urn:uuid:3eed20de-163a-49d1-adaf-34040bcd22bd> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:31957e00-6e8c-4f71-b0eb-e818078c1e44> .
<urn:uuid:3eed20de-163a-49d1-adaf-34040bcd22bd> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:579400a5-3fdb-4743-bdb9-cae5ef596986> .
<urn:uuid:3eed20de-163a-49d1-adaf-34040bcd22bd> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:75b73704-515f-4a04-94b5-89edf4f6976f> .
<urn:uuid:3eed20de-163a-49d1-adaf-34040bcd22bd> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:187ab85d-5c5f-4b97-9b5a-e150b25d9600> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:187ab85d-5c5f-4b97-9b5a-e150b25d9600> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:187ab85d-5c5f-4b97-9b5a-e150b25d9600> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:187ab85d-5c5f-4b97-9b5a-e150b25d9600> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:31957e00-6e8c-4f71-b0eb-e818078c1e44> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:31957e00-6e8c-4f71-b0eb-e818078c1e44> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:579400a5-3fdb-4743-bdb9-cae5ef596986> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:579400a5-3fdb-4743-bdb9-cae5ef596986> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:75b73704-515f-4a04-94b5-89edf4f6976f> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:75b73704-515f-4a04-94b5-89edf4f6976f> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:b55e6773-1149-4149-86c2-d5133885f99e: Read request from Alice to resource X returns into yes (temporal neq) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> .
<urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> <http://purl.org/dc/terms/description> "ALICE may NOT READ resource X at 2024-02-12T11:20:10.999Z." .
<urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> .
<urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/neq> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:5b348753-16e9-478c-8d8b-8553ba03f85d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:5b348753-16e9-478c-8d8b-8553ba03f85d> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:5b348753-16e9-478c-8d8b-8553ba03f85d> <https://w3id.org/force/compliance-report#policy> <urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> .
<urn:uuid:5b348753-16e9-478c-8d8b-8553ba03f85d> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:5b348753-16e9-478c-8d8b-8553ba03f85d> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:2feb242d-75e3-46cd-a6aa-b4d948f34e81> .
<urn:uuid:2feb242d-75e3-46cd-a6aa-b4d948f34e81> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:2feb242d-75e3-46cd-a6aa-b4d948f34e81> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:2feb242d-75e3-46cd-a6aa-b4d948f34e81> <https://w3id.org/force/compliance-report#rule> <urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> .
<urn:uuid:2feb242d-75e3-46cd-a6aa-b4d948f34e81> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:2feb242d-75e3-46cd-a6aa-b4d948f34e81> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:d8a98025-b1b6-4d7b-962b-32a89cfb4bb6> .
<urn:uuid:2feb242d-75e3-46cd-a6aa-b4d948f34e81> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:c3c5d146-7e4d-4824-9316-f9b4b9ba3a07> .
<urn:uuid:2feb242d-75e3-46cd-a6aa-b4d948f34e81> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:5583bc6e-6ebc-4582-a012-ff2e5efebbc2> .
<urn:uuid:2feb242d-75e3-46cd-a6aa-b4d948f34e81> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:9d081d3f-a9ee-47d9-8423-40eb4a0c53f0> .
<urn:uuid:2feb242d-75e3-46cd-a6aa-b4d948f34e81> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:d8a98025-b1b6-4d7b-962b-32a89cfb4bb6> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:d8a98025-b1b6-4d7b-962b-32a89cfb4bb6> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:d8a98025-b1b6-4d7b-962b-32a89cfb4bb6> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:d8a98025-b1b6-4d7b-962b-32a89cfb4bb6> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:c3c5d146-7e4d-4824-9316-f9b4b9ba3a07> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:c3c5d146-7e4d-4824-9316-f9b4b9ba3a07> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:5583bc6e-6ebc-4582-a012-ff2e5efebbc2> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:5583bc6e-6ebc-4582-a012-ff2e5efebbc2> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:9d081d3f-a9ee-47d9-8423-40eb4a0c53f0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:9d081d3f-a9ee-47d9-8423-40eb4a0c53f0> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:c58bab8c-a0a7-400b-9f28-1f753482a041: Read request from Alice to resource X returns into yes (temporal neq - past) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> .
<urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> <http://purl.org/dc/terms/description> "ALICE may NOT READ resource X at 2024-02-12T11:20:10.999Z." .
<urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> .
<urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/neq> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:09ebc94d-c90c-4e67-8d65-d5fb13a475f5> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:09ebc94d-c90c-4e67-8d65-d5fb13a475f5> <http://purl.org/dc/terms/created> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:09ebc94d-c90c-4e67-8d65-d5fb13a475f5> <https://w3id.org/force/compliance-report#policy> <urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> .
<urn:uuid:09ebc94d-c90c-4e67-8d65-d5fb13a475f5> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:09ebc94d-c90c-4e67-8d65-d5fb13a475f5> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:af9b2810-d655-432c-bf95-8795d2298dfb> .
<urn:uuid:af9b2810-d655-432c-bf95-8795d2298dfb> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:af9b2810-d655-432c-bf95-8795d2298dfb> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:af9b2810-d655-432c-bf95-8795d2298dfb> <https://w3id.org/force/compliance-report#rule> <urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> .
<urn:uuid:af9b2810-d655-432c-bf95-8795d2298dfb> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:af9b2810-d655-432c-bf95-8795d2298dfb> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:4b567d7e-4ead-4136-8b73-6ce0ad5c214a> .
<urn:uuid:af9b2810-d655-432c-bf95-8795d2298dfb> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:287faba4-a25a-4e60-968e-c3aed695c13a> .
<urn:uuid:af9b2810-d655-432c-bf95-8795d2298dfb> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:c55dc77f-b230-4aed-99b2-49b4d9d9e0cc> .
<urn:uuid:af9b2810-d655-432c-bf95-8795d2298dfb> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:3c8f3532-fd82-45b0-b0b5-dba3d39859be> .
<urn:uuid:af9b2810-d655-432c-bf95-8795d2298dfb> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:4b567d7e-4ead-4136-8b73-6ce0ad5c214a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:4b567d7e-4ead-4136-8b73-6ce0ad5c214a> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:4b567d7e-4ead-4136-8b73-6ce0ad5c214a> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:4b567d7e-4ead-4136-8b73-6ce0ad5c214a> <https://w3id.org/force/compliance-report#constraintOperator> <http://www.w3.org/ns/odrl/2/neq> .
<urn:uuid:4b567d7e-4ead-4136-8b73-6ce0ad5c214a> <https://w3id.org/force/compliance-report#constraintRightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:4b567d7e-4ead-4136-8b73-6ce0ad5c214a> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:287faba4-a25a-4e60-968e-c3aed695c13a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:287faba4-a25a-4e60-968e-c3aed695c13a> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:c55dc77f-b230-4aed-99b2-49b4d9d9e0cc> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:c55dc77f-b230-4aed-99b2-49b4d9d9e0cc> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:3c8f3532-fd82-45b0-b0b5-dba3d39859be> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:3c8f3532-fd82-45b0-b0b5-dba3d39859be> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:420152ac-946b-4187-9b0d-f1facebc983e: Read request from Alice to resource X returns into yes (temporal neq - future) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> .
<urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> <http://purl.org/dc/terms/description> "ALICE may NOT READ resource X at 2024-02-12T11:20:10.999Z." .
<urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> .
<urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/neq> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:29d41ebb-bd94-4460-b01b-19b2c7accb98> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:29d41ebb-bd94-4460-b01b-19b2c7accb98> <http://purl.org/dc/terms/created> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:29d41ebb-bd94-4460-b01b-19b2c7accb98> <https://w3id.org/force/compliance-report#policy> <urn:uuid:16aa64e3-1495-486d-a5ad-81211961e915> .
<urn:uuid:29d41ebb-bd94-4460-b01b-19b2c7accb98> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:29d41ebb-bd94-4460-b01b-19b2c7accb98> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:efb5ace2-c639-43b8-9afd-e5cd996214a4> .
<urn:uuid:efb5ace2-c639-43b8-9afd-e5cd996214a4> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:efb5ace2-c639-43b8-9afd-e5cd996214a4> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:efb5ace2-c639-43b8-9afd-e5cd996214a4> <https://w3id.org/force/compliance-report#rule> <urn:uuid:512ad75a-22da-4142-ba42-0a39a217ba29> .
<urn:uuid:efb5ace2-c639-43b8-9afd-e5cd996214a4> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:efb5ace2-c639-43b8-9afd-e5cd996214a4> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:8797b76e-512e-4c2f-a00d-73a11ae043f4> .
<urn:uuid:efb5ace2-c639-43b8-9afd-e5cd996214a4> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:7c205902-f7e2-40d4-a0bf-ff4de3bbfc4b> .
<urn:uuid:efb5ace2-c639-43b8-9afd-e5cd996214a4> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:f8c118c4-b55d-4b05-9982-eb887f27666b> .
<urn:uuid:efb5ace2-c639-43b8-9afd-e5cd996214a4> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:a1dfafa3-4cfb-4634-90fe-b2e3cf7a26c4> .
<urn:uuid:efb5ace2-c639-43b8-9afd-e5cd996214a4> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:8797b76e-512e-4c2f-a00d-73a11ae043f4> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:8797b76e-512e-4c2f-a00d-73a11ae043f4> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:8797b76e-512e-4c2f-a00d-73a11ae043f4> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:8797b76e-512e-4c2f-a00d-73a11ae043f4> <https://w3id.org/force/compliance-report#constraintOperator> <http://www.w3.org/ns/odrl/2/neq> .
<urn:uuid:8797b76e-512e-4c2f-a00d-73a11ae043f4> <https://w3id.org/force/compliance-report#constraintRightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:8797b76e-512e-4c2f-a00d-73a11ae043f4> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:7c205902-f7e2-40d4-a0bf-ff4de3bbfc4b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:7c205902-f7e2-40d4-a0bf-ff4de3bbfc4b> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:f8c118c4-b55d-4b05-9982-eb887f27666b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:f8c118c4-b55d-4b05-9982-eb887f27666b> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:a1dfafa3-4cfb-4634-90fe-b2e3cf7a26c4> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:a1dfafa3-4cfb-4634-90fe-b2e3cf7a26c4> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:e0cbcbbd-00de-4fb1-b4c0-fc86a1b7ec9d: Read request from Alice to resource X returns into yes (temporal lt) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> .
<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://purl.org/dc/terms/description> "ALICE may READ resource X when it is before 2024-02-12T11:20:10.999Z." .
<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/lt> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:7d73a813-1018-4bf7-8c81-0528e0779977> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:7d73a813-1018-4bf7-8c81-0528e0779977> <http://purl.org/dc/terms/created> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:7d73a813-1018-4bf7-8c81-0528e0779977> <https://w3id.org/force/compliance-report#policy> <urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> .
<urn:uuid:7d73a813-1018-4bf7-8c81-0528e0779977> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:7d73a813-1018-4bf7-8c81-0528e0779977> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:d4920772-6bcb-450d-a127-e06041cd64e8> .
<urn:uuid:d4920772-6bcb-450d-a127-e06041cd64e8> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:d4920772-6bcb-450d-a127-e06041cd64e8> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:d4920772-6bcb-450d-a127-e06041cd64e8> <https://w3id.org/force/compliance-report#rule> <urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> .
<urn:uuid:d4920772-6bcb-450d-a127-e06041cd64e8> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:d4920772-6bcb-450d-a127-e06041cd64e8> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:b2513781-6c24-4085-97de-1395c22ffdee> .
<urn:uuid:d4920772-6bcb-450d-a127-e06041cd64e8> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:10cf978d-d594-4de7-935b-05d22304de09> .
<urn:uuid:d4920772-6bcb-450d-a127-e06041cd64e8> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:3d99eb15-1c39-4f23-a817-06cdb6e79e67> .
<urn:uuid:d4920772-6bcb-450d-a127-e06041cd64e8> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:b3c920f0-793c-4184-96e9-70eac25ebb1e> .
<urn:uuid:d4920772-6bcb-450d-a127-e06041cd64e8> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:b2513781-6c24-4085-97de-1395c22ffdee> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:b2513781-6c24-4085-97de-1395c22ffdee> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:b2513781-6c24-4085-97de-1395c22ffdee> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:b2513781-6c24-4085-97de-1395c22ffdee> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:10cf978d-d594-4de7-935b-05d22304de09> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:10cf978d-d594-4de7-935b-05d22304de09> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:3d99eb15-1c39-4f23-a817-06cdb6e79e67> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:3d99eb15-1c39-4f23-a817-06cdb6e79e67> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:b3c920f0-793c-4184-96e9-70eac25ebb1e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:b3c920f0-793c-4184-96e9-70eac25ebb1e> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:22ee88e3-a923-4ee0-b690-65710cf9480f: Read request from Alice to resource X returns into yes (temporal lt - past) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> .
<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://purl.org/dc/terms/description> "ALICE may READ resource X when it is before 2024-02-12T11:20:10.999Z." .
<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/lt> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:94fedebb-9b3b-4aae-b94a-d3649c7898cc> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:94fedebb-9b3b-4aae-b94a-d3649c7898cc> <http://purl.org/dc/terms/created> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:94fedebb-9b3b-4aae-b94a-d3649c7898cc> <https://w3id.org/force/compliance-report#policy> <urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> .
<urn:uuid:94fedebb-9b3b-4aae-b94a-d3649c7898cc> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:94fedebb-9b3b-4aae-b94a-d3649c7898cc> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:bb0a27e0-3963-4f78-a215-9ef1d585a472> .
<urn:uuid:bb0a27e0-3963-4f78-a215-9ef1d585a472> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:bb0a27e0-3963-4f78-a215-9ef1d585a472> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:bb0a27e0-3963-4f78-a215-9ef1d585a472> <https://w3id.org/force/compliance-report#rule> <urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> .
<urn:uuid:bb0a27e0-3963-4f78-a215-9ef1d585a472> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:bb0a27e0-3963-4f78-a215-9ef1d585a472> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:9b1b7cef-01ad-4d3f-b8dd-e7f762a4da33> .
<urn:uuid:bb0a27e0-3963-4f78-a215-9ef1d585a472> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:661035b0-2d40-43fa-8667-f18ef04d42b4> .
<urn:uuid:bb0a27e0-3963-4f78-a215-9ef1d585a472> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:dcb46902-8284-4912-b2b0-546a82a2c853> .
<urn:uuid:bb0a27e0-3963-4f78-a215-9ef1d585a472> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:05a48436-1d60-46ed-bbc2-d74227c38ab7> .
<urn:uuid:bb0a27e0-3963-4f78-a215-9ef1d585a472> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:9b1b7cef-01ad-4d3f-b8dd-e7f762a4da33> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:9b1b7cef-01ad-4d3f-b8dd-e7f762a4da33> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:9b1b7cef-01ad-4d3f-b8dd-e7f762a4da33> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:9b1b7cef-01ad-4d3f-b8dd-e7f762a4da33> <https://w3id.org/force/compliance-report#constraintOperator> <http://www.w3.org/ns/odrl/2/lt> .
<urn:uuid:9b1b7cef-01ad-4d3f-b8dd-e7f762a4da33> <https://w3id.org/force/compliance-report#constraintRightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:9b1b7cef-01ad-4d3f-b8dd-e7f762a4da33> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:661035b0-2d40-43fa-8667-f18ef04d42b4> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:661035b0-2d40-43fa-8667-f18ef04d42b4> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:dcb46902-8284-4912-b2b0-546a82a2c853> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:dcb46902-8284-4912-b2b0-546a82a2c853> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:05a48436-1d60-46ed-bbc2-d74227c38ab7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:05a48436-1d60-46ed-bbc2-d74227c38ab7> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:d8c0aec1-a8d1-41dc-8847-775669a264e3: Read request from Alice to resource X returns into yes (temporal lt - future) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> .
<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://purl.org/dc/terms/description> "ALICE may READ resource X when it is before 2024-02-12T11:20:10.999Z." .
<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/lt> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:14b3a2ee-66ef-4f98-b1c2-9df6017cab81> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:14b3a2ee-66ef-4f98-b1c2-9df6017cab81> <http://purl.org/dc/terms/created> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:14b3a2ee-66ef-4f98-b1c2-9df6017cab81> <https://w3id.org/force/compliance-report#policy> <urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d> .
<urn:uuid:14b3a2ee-66ef-4f98-b1c2-9df6017cab81> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:14b3a2ee-66ef-4f98-b1c2-9df6017cab81> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:969b1fc2-efa4-4288-bf13-f3d2339e840f> .
<urn:uuid:969b1fc2-efa4-4288-bf13-f3d2339e840f> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:969b1fc2-efa4-4288-bf13-f3d2339e840f> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:969b1fc2-efa4-4288-bf13-f3d2339e840f> <https://w3id.org/force/compliance-report#rule> <urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a> .
<urn:uuid:969b1fc2-efa4-4288-bf13-f3d2339e840f> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:969b1fc2-efa4-4288-bf13-f3d2339e840f> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:d3dfa010-4f39-4aa5-8ed6-78bac90e28be> .
<urn:uuid:969b1fc2-efa4-4288-bf13-f3d2339e840f> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:ac19584b-d128-48f2-983b-7de3c89507e6> .
<urn:uuid:969b1fc2-efa4-4288-bf13-f3d2339e840f> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:1a8cc9fd-34d9-4c15-9c45-5921a8eb8746> .
<urn:uuid:969b1fc2-efa4-4288-bf13-f3d2339e840f> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:704c5961-40aa-469f-bdd3-d82b11e72ddd> .
<urn:uuid:969b1fc2-efa4-4288-bf13-f3d2339e840f> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:d3dfa010-4f39-4aa5-8ed6-78bac90e28be> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:d3dfa010-4f39-4aa5-8ed6-78bac90e28be> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:d3dfa010-4f39-4aa5-8ed6-78bac90e28be> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:d3dfa010-4f39-4aa5-8ed6-78bac90e28be> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:ac19584b-d128-48f2-983b-7de3c89507e6> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:ac19584b-d128-48f2-983b-7de3c89507e6> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:1a8cc9fd-34d9-4c15-9c45-5921a8eb8746> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:1a8cc9fd-34d9-4c15-9c45-5921a8eb8746> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:704c5961-40aa-469f-bdd3-d82b11e72ddd> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:704c5961-40aa-469f-bdd3-d82b11e72ddd> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:251ab936-e085-44f1-aca6-ecbd704d1128: Read request from Alice to resource X returns into yes (temporal lteq) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> .
<urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> <http://purl.org/dc/terms/description> "ALICE may READ resource X when it is before or equal to 2024-02-12T11:20:10.999Z." .
<urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> .
<urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/lteq> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:00c6070b-ef3e-487f-9fbe-6b817f67f2bc> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:00c6070b-ef3e-487f-9fbe-6b817f67f2bc> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:00c6070b-ef3e-487f-9fbe-6b817f67f2bc> <https://w3id.org/force/compliance-report#policy> <urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> .
<urn:uuid:00c6070b-ef3e-487f-9fbe-6b817f67f2bc> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:00c6070b-ef3e-487f-9fbe-6b817f67f2bc> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:e5c74d9f-20b5-48ab-baed-bcd74981ccd6> .
<urn:uuid:e5c74d9f-20b5-48ab-baed-bcd74981ccd6> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:e5c74d9f-20b5-48ab-baed-bcd74981ccd6> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:e5c74d9f-20b5-48ab-baed-bcd74981ccd6> <https://w3id.org/force/compliance-report#rule> <urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> .
<urn:uuid:e5c74d9f-20b5-48ab-baed-bcd74981ccd6> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:e5c74d9f-20b5-48ab-baed-bcd74981ccd6> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:cb840f5b-9b71-4b03-b562-1cab4f9f60d5> .
<urn:uuid:e5c74d9f-20b5-48ab-baed-bcd74981ccd6> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:44d02a09-17df-4c9e-b9fa-b7e6af9cd799> .
<urn:uuid:e5c74d9f-20b5-48ab-baed-bcd74981ccd6> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:36054e1a-ec1c-4b88-9888-6608492598dc> .
<urn:uuid:e5c74d9f-20b5-48ab-baed-bcd74981ccd6> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:80678596-c5b9-4b30-9cbd-9e76c42e4426> .
<urn:uuid:e5c74d9f-20b5-48ab-baed-bcd74981ccd6> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:cb840f5b-9b71-4b03-b562-1cab4f9f60d5> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:cb840f5b-9b71-4b03-b562-1cab4f9f60d5> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:cb840f5b-9b71-4b03-b562-1cab4f9f60d5> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:cb840f5b-9b71-4b03-b562-1cab4f9f60d5> <https://w3id.org/force/compliance-report#constraintOperator> <http://www.w3.org/ns/odrl/2/lteq> .
<urn:uuid:cb840f5b-9b71-4b03-b562-1cab4f9f60d5> <https://w3id.org/force/compliance-report#constraintRightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:cb840f5b-9b71-4b03-b562-1cab4f9f60d5> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:44d02a09-17df-4c9e-b9fa-b7e6af9cd799> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:44d02a09-17df-4c9e-b9fa-b7e6af9cd799> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:36054e1a-ec1c-4b88-9888-6608492598dc> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:36054e1a-ec1c-4b88-9888-6608492598dc> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:80678596-c5b9-4b30-9cbd-9e76c42e4426> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:80678596-c5b9-4b30-9cbd-9e76c42e4426> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:778fb3a6-aefe-4fd5-91e8-6455b6409707: Read request from Alice to resource X returns into yes (temporal lteq - past) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> .
<urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> <http://purl.org/dc/terms/description> "ALICE may READ resource X when it is before or equal to 2024-02-12T11:20:10.999Z." .
<urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> .
<urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/lteq> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:05d0eaa3-762a-4d41-bacc-0deba5c4d036> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:05d0eaa3-762a-4d41-bacc-0deba5c4d036> <http://purl.org/dc/terms/created> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:05d0eaa3-762a-4d41-bacc-0deba5c4d036> <https://w3id.org/force/compliance-report#policy> <urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> .
<urn:uuid:05d0eaa3-762a-4d41-bacc-0deba5c4d036> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:05d0eaa3-762a-4d41-bacc-0deba5c4d036> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:99b97183-cb78-4e6e-84d8-5f3d42722ae4> .
<urn:uuid:99b97183-cb78-4e6e-84d8-5f3d42722ae4> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:99b97183-cb78-4e6e-84d8-5f3d42722ae4> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:99b97183-cb78-4e6e-84d8-5f3d42722ae4> <https://w3id.org/force/compliance-report#rule> <urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> .
<urn:uuid:99b97183-cb78-4e6e-84d8-5f3d42722ae4> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:99b97183-cb78-4e6e-84d8-5f3d42722ae4> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:276a6377-ba41-43bd-aaa9-7c75063022cd> .
<urn:uuid:99b97183-cb78-4e6e-84d8-5f3d42722ae4> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:2d5b7e02-2dc2-4bfe-89f7-2236573845ee> .
<urn:uuid:99b97183-cb78-4e6e-84d8-5f3d42722ae4> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:a785178f-07c5-4077-8e0e-0e6ea493d882> .
<urn:uuid:99b97183-cb78-4e6e-84d8-5f3d42722ae4> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:90ed99d0-c834-4e59-bb1a-981fad89a2df> .
<urn:uuid:99b97183-cb78-4e6e-84d8-5f3d42722ae4> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:276a6377-ba41-43bd-aaa9-7c75063022cd> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:276a6377-ba41-43bd-aaa9-7c75063022cd> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:276a6377-ba41-43bd-aaa9-7c75063022cd> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:276a6377-ba41-43bd-aaa9-7c75063022cd> <https://w3id.org/force/compliance-report#constraintOperator> <http://www.w3.org/ns/odrl/2/lteq> .
<urn:uuid:276a6377-ba41-43bd-aaa9-7c75063022cd> <https://w3id.org/force/compliance-report#constraintRightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:276a6377-ba41-43bd-aaa9-7c75063022cd> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:2d5b7e02-2dc2-4bfe-89f7-2236573845ee> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:2d5b7e02-2dc2-4bfe-89f7-2236573845ee> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:a785178f-07c5-4077-8e0e-0e6ea493d882> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:a785178f-07c5-4077-8e0e-0e6ea493d882> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:90ed99d0-c834-4e59-bb1a-981fad89a2df> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:90ed99d0-c834-4e59-bb1a-981fad89a2df> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:44b34091-7f68-43b2-8a1b-529da71e2237: Read request from Alice to resource X returns into yes (temporal lteq - future) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> .
<urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> <http://purl.org/dc/terms/description> "ALICE may READ resource X when it is before or equal to 2024-02-12T11:20:10.999Z." .
<urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> .
<urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/lteq> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:05f331a0-6cad-4e5d-8204-1410702f42c1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:05f331a0-6cad-4e5d-8204-1410702f42c1> <http://purl.org/dc/terms/created> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:05f331a0-6cad-4e5d-8204-1410702f42c1> <https://w3id.org/force/compliance-report#policy> <urn:uuid:55214ab0-2e30-46c4-be13-c63997fa4272> .
<urn:uuid:05f331a0-6cad-4e5d-8204-1410702f42c1> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:05f331a0-6cad-4e5d-8204-1410702f42c1> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:4ea67309-cb23-48c4-b240-5951145ee2bc> .
<urn:uuid:4ea67309-cb23-48c4-b240-5951145ee2bc> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:4ea67309-cb23-48c4-b240-5951145ee2bc> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:4ea67309-cb23-48c4-b240-5951145ee2bc> <https://w3id.org/force/compliance-report#rule> <urn:uuid:b3222ad2-60b5-4aef-b928-fdef873717cd> .
<urn:uuid:4ea67309-cb23-48c4-b240-5951145ee2bc> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:4ea67309-cb23-48c4-b240-5951145ee2bc> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:ab5bc7b9-d0f8-4911-9c8c-8adf9ad26624> .
<urn:uuid:4ea67309-cb23-48c4-b240-5951145ee2bc> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:28d0dfd7-a184-4e79-b58b-072bed3fd9d2> .
<urn:uuid:4ea67309-cb23-48c4-b240-5951145ee2bc> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:9d68ae2a-facb-49f0-b2ec-81c64a682160> .
<urn:uuid:4ea67309-cb23-48c4-b240-5951145ee2bc> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:8b656da5-2a71-4152-b90d-31d169e7f72d> .
<urn:uuid:4ea67309-cb23-48c4-b240-5951145ee2bc> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:ab5bc7b9-d0f8-4911-9c8c-8adf9ad26624> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:ab5bc7b9-d0f8-4911-9c8c-8adf9ad26624> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:ab5bc7b9-d0f8-4911-9c8c-8adf9ad26624> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:ab5bc7b9-d0f8-4911-9c8c-8adf9ad26624> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:28d0dfd7-a184-4e79-b58b-072bed3fd9d2> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:28d0dfd7-a184-4e79-b58b-072bed3fd9d2> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:9d68ae2a-facb-49f0-b2ec-81c64a682160> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:9d68ae2a-facb-49f0-b2ec-81c64a682160> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:8b656da5-2a71-4152-b90d-31d169e7f72d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:8b656da5-2a71-4152-b90d-31d169e7f72d> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:55606dca-592f-49da-95c3-8795e99cafca: Read request from Alice to resource X returns into yes (temporal gt) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> .
<urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> <http://purl.org/dc/terms/description> "ALICE may READ resource X when it is later than 2024-02-12T11:20:10.999Z." .
<urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> .
<urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/gt> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:0d1ac1d0-61f3-4fa2-8ba7-26a1d98898df> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:0d1ac1d0-61f3-4fa2-8ba7-26a1d98898df> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:0d1ac1d0-61f3-4fa2-8ba7-26a1d98898df> <https://w3id.org/force/compliance-report#policy> <urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> .
<urn:uuid:0d1ac1d0-61f3-4fa2-8ba7-26a1d98898df> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:0d1ac1d0-61f3-4fa2-8ba7-26a1d98898df> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:92c0ba3b-70d8-4fa2-a232-420c64d27d74> .
<urn:uuid:92c0ba3b-70d8-4fa2-a232-420c64d27d74> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:92c0ba3b-70d8-4fa2-a232-420c64d27d74> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:92c0ba3b-70d8-4fa2-a232-420c64d27d74> <https://w3id.org/force/compliance-report#rule> <urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> .
<urn:uuid:92c0ba3b-70d8-4fa2-a232-420c64d27d74> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:92c0ba3b-70d8-4fa2-a232-420c64d27d74> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:3f3bf465-49e3-4bba-addd-fcebeefe39fb> .
<urn:uuid:92c0ba3b-70d8-4fa2-a232-420c64d27d74> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:4a124d9a-92ec-45af-87c2-3d0175e24b9b> .
<urn:uuid:92c0ba3b-70d8-4fa2-a232-420c64d27d74> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:fb827552-7110-42a4-875c-f09faf0eed58> .
<urn:uuid:92c0ba3b-70d8-4fa2-a232-420c64d27d74> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:d53b2824-1cc7-48e6-a625-502ea2d0c6e5> .
<urn:uuid:92c0ba3b-70d8-4fa2-a232-420c64d27d74> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:3f3bf465-49e3-4bba-addd-fcebeefe39fb> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:3f3bf465-49e3-4bba-addd-fcebeefe39fb> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:3f3bf465-49e3-4bba-addd-fcebeefe39fb> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:3f3bf465-49e3-4bba-addd-fcebeefe39fb> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:4a124d9a-92ec-45af-87c2-3d0175e24b9b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:4a124d9a-92ec-45af-87c2-3d0175e24b9b> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:fb827552-7110-42a4-875c-f09faf0eed58> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:fb827552-7110-42a4-875c-f09faf0eed58> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:d53b2824-1cc7-48e6-a625-502ea2d0c6e5> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:d53b2824-1cc7-48e6-a625-502ea2d0c6e5> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:8a50fa6b-468a-4959-94d3-33458ec30cc9: Read request from Alice to resource X returns into yes (temporal gt - past) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> .
<urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> <http://purl.org/dc/terms/description> "ALICE may READ resource X when it is later than 2024-02-12T11:20:10.999Z." .
<urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> .
<urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/gt> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:c59462a5-37b7-4072-9405-e49ff33c06f4> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:c59462a5-37b7-4072-9405-e49ff33c06f4> <http://purl.org/dc/terms/created> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:c59462a5-37b7-4072-9405-e49ff33c06f4> <https://w3id.org/force/compliance-report#policy> <urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> .
<urn:uuid:c59462a5-37b7-4072-9405-e49ff33c06f4> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:c59462a5-37b7-4072-9405-e49ff33c06f4> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:489394a1-4330-4dce-9902-aa58e9198555> .
<urn:uuid:489394a1-4330-4dce-9902-aa58e9198555> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:489394a1-4330-4dce-9902-aa58e9198555> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:489394a1-4330-4dce-9902-aa58e9198555> <https://w3id.org/force/compliance-report#rule> <urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> .
<urn:uuid:489394a1-4330-4dce-9902-aa58e9198555> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:489394a1-4330-4dce-9902-aa58e9198555> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:8366655d-3de4-481c-8392-6baa4940d50d> .
<urn:uuid:489394a1-4330-4dce-9902-aa58e9198555> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:8301ee01-a511-422d-8d8a-f1e9ba921db4> .
<urn:uuid:489394a1-4330-4dce-9902-aa58e9198555> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:a068e7f2-5df4-4681-8081-56e62e1e4a9d> .
<urn:uuid:489394a1-4330-4dce-9902-aa58e9198555> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:8ed30993-ee36-4c32-a67e-2823ec59929a> .
<urn:uuid:489394a1-4330-4dce-9902-aa58e9198555> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:8366655d-3de4-481c-8392-6baa4940d50d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:8366655d-3de4-481c-8392-6baa4940d50d> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:8366655d-3de4-481c-8392-6baa4940d50d> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:8366655d-3de4-481c-8392-6baa4940d50d> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:8301ee01-a511-422d-8d8a-f1e9ba921db4> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:8301ee01-a511-422d-8d8a-f1e9ba921db4> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:a068e7f2-5df4-4681-8081-56e62e1e4a9d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:a068e7f2-5df4-4681-8081-56e62e1e4a9d> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:8ed30993-ee36-4c32-a67e-2823ec59929a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:8ed30993-ee36-4c32-a67e-2823ec59929a> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:431d8e84-236b-4045-a3f2-cc36bf5a21c2: Read request from Alice to resource X returns into yes (temporal gt - future) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> .
<urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> <http://purl.org/dc/terms/description> "ALICE may READ resource X when it is later than 2024-02-12T11:20:10.999Z." .
<urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> .
<urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/gt> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:510ca28e-3973-4031-a10f-29a379d96b02> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:510ca28e-3973-4031-a10f-29a379d96b02> <http://purl.org/dc/terms/created> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:510ca28e-3973-4031-a10f-29a379d96b02> <https://w3id.org/force/compliance-report#policy> <urn:uuid:9fcff55b-33bd-4c8f-bcd7-9e206e4dbbbe> .
<urn:uuid:510ca28e-3973-4031-a10f-29a379d96b02> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:510ca28e-3973-4031-a10f-29a379d96b02> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:912b8d3a-b13c-42a2-a08e-12b1d6373758> .
<urn:uuid:912b8d3a-b13c-42a2-a08e-12b1d6373758> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:912b8d3a-b13c-42a2-a08e-12b1d6373758> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:912b8d3a-b13c-42a2-a08e-12b1d6373758> <https://w3id.org/force/compliance-report#rule> <urn:uuid:641a79e0-0633-46c5-afe8-616e36701404> .
<urn:uuid:912b8d3a-b13c-42a2-a08e-12b1d6373758> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:912b8d3a-b13c-42a2-a08e-12b1d6373758> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:415e90c7-c10d-4688-a37b-bd6ddd964572> .
<urn:uuid:912b8d3a-b13c-42a2-a08e-12b1d6373758> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:d4f30bb4-844b-494f-a93e-d9e0641c560b> .
<urn:uuid:912b8d3a-b13c-42a2-a08e-12b1d6373758> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:91657f54-abac-4de7-a747-576d081d081b> .
<urn:uuid:912b8d3a-b13c-42a2-a08e-12b1d6373758> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:dcb3b3fe-e7f9-495a-b3b9-eb2a2779bf43> .
<urn:uuid:912b8d3a-b13c-42a2-a08e-12b1d6373758> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:415e90c7-c10d-4688-a37b-bd6ddd964572> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:415e90c7-c10d-4688-a37b-bd6ddd964572> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:415e90c7-c10d-4688-a37b-bd6ddd964572> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:415e90c7-c10d-4688-a37b-bd6ddd964572> <https://w3id.org/force/compliance-report#constraintOperator> <http://www.w3.org/ns/odrl/2/gt> .
<urn:uuid:415e90c7-c10d-4688-a37b-bd6ddd964572> <https://w3id.org/force/compliance-report#constraintRightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:415e90c7-c10d-4688-a37b-bd6ddd964572> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:d4f30bb4-844b-494f-a93e-d9e0641c560b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:d4f30bb4-844b-494f-a93e-d9e0641c560b> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:91657f54-abac-4de7-a747-576d081d081b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:91657f54-abac-4de7-a747-576d081d081b> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:dcb3b3fe-e7f9-495a-b3b9-eb2a2779bf43> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:dcb3b3fe-e7f9-495a-b3b9-eb2a2779bf43> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:0cf68c7f-97ba-4bc5-8f57-53e99dc7e989: Read request from Alice to resource X returns into yes (temporal gteq) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> .
<urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> <http://purl.org/dc/terms/description> "ALICE may READ resource X when it is later than or equal to 2024-02-12T11:20:10.999Z." .
<urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> .
<urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/gteq> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:72f0d66a-3887-4ddc-986a-02914589ac9d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:72f0d66a-3887-4ddc-986a-02914589ac9d> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:72f0d66a-3887-4ddc-986a-02914589ac9d> <https://w3id.org/force/compliance-report#policy> <urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> .
<urn:uuid:72f0d66a-3887-4ddc-986a-02914589ac9d> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:72f0d66a-3887-4ddc-986a-02914589ac9d> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:41ede2c2-859b-4e7a-bbbb-b180f85197e7> .
<urn:uuid:41ede2c2-859b-4e7a-bbbb-b180f85197e7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:41ede2c2-859b-4e7a-bbbb-b180f85197e7> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:41ede2c2-859b-4e7a-bbbb-b180f85197e7> <https://w3id.org/force/compliance-report#rule> <urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> .
<urn:uuid:41ede2c2-859b-4e7a-bbbb-b180f85197e7> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:41ede2c2-859b-4e7a-bbbb-b180f85197e7> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:511bbfa3-e310-47e5-a797-ee64b433bd3c> .
<urn:uuid:41ede2c2-859b-4e7a-bbbb-b180f85197e7> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:059711e2-e58a-43de-b54d-04115e66d57a> .
<urn:uuid:41ede2c2-859b-4e7a-bbbb-b180f85197e7> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:24bbb845-1021-4698-8ba2-126040cac3f0> .
<urn:uuid:41ede2c2-859b-4e7a-bbbb-b180f85197e7> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:16554e2c-48fb-4c34-bd81-cf9a2e0d48e0> .
<urn:uuid:41ede2c2-859b-4e7a-bbbb-b180f85197e7> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:511bbfa3-e310-47e5-a797-ee64b433bd3c> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:511bbfa3-e310-47e5-a797-ee64b433bd3c> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:511bbfa3-e310-47e5-a797-ee64b433bd3c> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:511bbfa3-e310-47e5-a797-ee64b433bd3c> <https://w3id.org/force/compliance-report#constraintOperator> <http://www.w3.org/ns/odrl/2/gteq> .
<urn:uuid:511bbfa3-e310-47e5-a797-ee64b433bd3c> <https://w3id.org/force/compliance-report#constraintRightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:511bbfa3-e310-47e5-a797-ee64b433bd3c> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:059711e2-e58a-43de-b54d-04115e66d57a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:059711e2-e58a-43de-b54d-04115e66d57a> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:24bbb845-1021-4698-8ba2-126040cac3f0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:24bbb845-1021-4698-8ba2-126040cac3f0> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:16554e2c-48fb-4c34-bd81-cf9a2e0d48e0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:16554e2c-48fb-4c34-bd81-cf9a2e0d48e0> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:2535a606-e982-49d4-b6a0-b35b81ec518d: Read request from Alice to resource X returns into yes (temporal gteq - past) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> .
<urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> <http://purl.org/dc/terms/description> "ALICE may READ resource X when it is later than or equal to 2024-02-12T11:20:10.999Z." .
<urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> .
<urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/gteq> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:f1bf5215-3fd9-48e7-826d-ab170b9df1d6> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:f1bf5215-3fd9-48e7-826d-ab170b9df1d6> <http://purl.org/dc/terms/created> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:f1bf5215-3fd9-48e7-826d-ab170b9df1d6> <https://w3id.org/force/compliance-report#policy> <urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> .
<urn:uuid:f1bf5215-3fd9-48e7-826d-ab170b9df1d6> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:f1bf5215-3fd9-48e7-826d-ab170b9df1d6> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:a90f8d6d-9e53-4e5c-b9a8-105dd7b10f0d> .
<urn:uuid:a90f8d6d-9e53-4e5c-b9a8-105dd7b10f0d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:a90f8d6d-9e53-4e5c-b9a8-105dd7b10f0d> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:a90f8d6d-9e53-4e5c-b9a8-105dd7b10f0d> <https://w3id.org/force/compliance-report#rule> <urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> .
<urn:uuid:a90f8d6d-9e53-4e5c-b9a8-105dd7b10f0d> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:a90f8d6d-9e53-4e5c-b9a8-105dd7b10f0d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:38788fb5-64ba-47c6-a1fc-d17336c411d1> .
<urn:uuid:a90f8d6d-9e53-4e5c-b9a8-105dd7b10f0d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:95243527-9c85-4df7-9e3c-80da4a1a277c> .
<urn:uuid:a90f8d6d-9e53-4e5c-b9a8-105dd7b10f0d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:e3dcaf92-530d-418d-b3b3-e758f64a746d> .
<urn:uuid:a90f8d6d-9e53-4e5c-b9a8-105dd7b10f0d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:464196b7-6e25-453c-a452-dcac89fe9f37> .
<urn:uuid:a90f8d6d-9e53-4e5c-b9a8-105dd7b10f0d> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:38788fb5-64ba-47c6-a1fc-d17336c411d1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:38788fb5-64ba-47c6-a1fc-d17336c411d1> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:38788fb5-64ba-47c6-a1fc-d17336c411d1> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:38788fb5-64ba-47c6-a1fc-d17336c411d1> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:95243527-9c85-4df7-9e3c-80da4a1a277c> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:95243527-9c85-4df7-9e3c-80da4a1a277c> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:e3dcaf92-530d-418d-b3b3-e758f64a746d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:e3dcaf92-530d-418d-b3b3-e758f64a746d> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:464196b7-6e25-453c-a452-dcac89fe9f37> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:464196b7-6e25-453c-a452-dcac89fe9f37> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:43a06637-af8a-4db3-a29d-1ac8916d3291: Read request from Alice to resource X returns into yes (temporal gteq - future) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> .
<urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> <http://purl.org/dc/terms/description> "ALICE may READ resource X when it is later than or equal to 2024-02-12T11:20:10.999Z." .
<urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> .
<urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/gteq> .
<urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:a216b953-0c02-4fe0-9282-120b99d44312> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:a216b953-0c02-4fe0-9282-120b99d44312> <http://purl.org/dc/terms/created> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:a216b953-0c02-4fe0-9282-120b99d44312> <https://w3id.org/force/compliance-report#policy> <urn:uuid:dfd89db7-7a03-4457-80ae-2f4b92c8e1ad> .
<urn:uuid:a216b953-0c02-4fe0-9282-120b99d44312> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:a216b953-0c02-4fe0-9282-120b99d44312> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:c87192bd-09aa-455b-8b86-a5e633a83868> .
<urn:uuid:c87192bd-09aa-455b-8b86-a5e633a83868> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:c87192bd-09aa-455b-8b86-a5e633a83868> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:c87192bd-09aa-455b-8b86-a5e633a83868> <https://w3id.org/force/compliance-report#rule> <urn:uuid:8e8bdcbd-3b76-485a-a279-fb3df060aa06> .
<urn:uuid:c87192bd-09aa-455b-8b86-a5e633a83868> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:c87192bd-09aa-455b-8b86-a5e633a83868> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:24cf4d9f-c5dd-4587-a661-90f4878fc7bc> .
<urn:uuid:c87192bd-09aa-455b-8b86-a5e633a83868> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:118be187-5a8a-4fa4-b82d-99038f2a34b3> .
<urn:uuid:c87192bd-09aa-455b-8b86-a5e633a83868> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:ada63569-4853-4800-954f-f9fad33e8b74> .
<urn:uuid:c87192bd-09aa-455b-8b86-a5e633a83868> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:9c5659da-9686-4738-bb4e-e2ee38fd2d87> .
<urn:uuid:c87192bd-09aa-455b-8b86-a5e633a83868> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:24cf4d9f-c5dd-4587-a661-90f4878fc7bc> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:24cf4d9f-c5dd-4587-a661-90f4878fc7bc> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1> .
<urn:uuid:24cf4d9f-c5dd-4587-a661-90f4878fc7bc> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:24cf4d9f-c5dd-4587-a661-90f4878fc7bc> <https://w3id.org/force/compliance-report#constraintOperator> <http://www.w3.org/ns/odrl/2/gteq> .
<urn:uuid:24cf4d9f-c5dd-4587-a661-90f4878fc7bc> <https://w3id.org/force/compliance-report#constraintRightOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:24cf4d9f-c5dd-4587-a661-90f4878fc7bc> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:118be187-5a8a-4fa4-b82d-99038f2a34b3> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:118be187-5a8a-4fa4-b82d-99038f2a34b3> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:ada63569-4853-4800-954f-f9fad33e8b74> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:ada63569-4853-4800-954f-f9fad33e8b74> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:9c5659da-9686-4738-bb4e-e2ee38fd2d87> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:9c5659da-9686-4738-bb4e-e2ee38fd2d87> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:1f435d44-1ba1-477c-b07e-79ee56abee34: Read request from Alice to resource X returns into yes (temporal + And (year 2024)) (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> .
<urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> <http://purl.org/dc/terms/description> "ALICE may READ resource X between 2024-01-01T00:00:00Z and 2024-12-31T23:59:59Z." .
<urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> .
<urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:c9359a6f-06bf-4a99-afb0-62996ca78100> .
<urn:uuid:c9359a6f-06bf-4a99-afb0-62996ca78100> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/LogicalConstraint> .
<urn:uuid:c9359a6f-06bf-4a99-afb0-62996ca78100> <http://www.w3.org/ns/odrl/2/and> <urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> .
<urn:uuid:c9359a6f-06bf-4a99-afb0-62996ca78100> <http://www.w3.org/ns/odrl/2/and> <urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> .
<urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Constraint> .
<urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/gt> .
<urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-01-01T00:00:00Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Constraint> .
<urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/lt> .
<urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-12-31T23:59:59Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:6ebb156b-0006-4da8-9d10-085c142b7a0e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:6ebb156b-0006-4da8-9d10-085c142b7a0e> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:6ebb156b-0006-4da8-9d10-085c142b7a0e> <https://w3id.org/force/compliance-report#policy> <urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> .
<urn:uuid:6ebb156b-0006-4da8-9d10-085c142b7a0e> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:6ebb156b-0006-4da8-9d10-085c142b7a0e> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:746b609b-e451-4f8d-b1e3-1593b86bd22d> .
<urn:uuid:746b609b-e451-4f8d-b1e3-1593b86bd22d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:746b609b-e451-4f8d-b1e3-1593b86bd22d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:b73e8e0d-5e28-453f-a82c-9fe8e5129fa6> .
<urn:uuid:746b609b-e451-4f8d-b1e3-1593b86bd22d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:22a4f05f-071c-4344-a4c1-4c1930f6f013> .
<urn:uuid:746b609b-e451-4f8d-b1e3-1593b86bd22d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:b376228c-7b4e-4d3a-9c9a-406b978437c5> .
<urn:uuid:746b609b-e451-4f8d-b1e3-1593b86bd22d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:b1e845d1-23b0-4e14-8817-1bfdfa41d036> .
<urn:uuid:746b609b-e451-4f8d-b1e3-1593b86bd22d> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:746b609b-e451-4f8d-b1e3-1593b86bd22d> <https://w3id.org/force/compliance-report#rule> <urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> .
<urn:uuid:746b609b-e451-4f8d-b1e3-1593b86bd22d> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:746b609b-e451-4f8d-b1e3-1593b86bd22d> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:b73e8e0d-5e28-453f-a82c-9fe8e5129fa6> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:b73e8e0d-5e28-453f-a82c-9fe8e5129fa6> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:c9359a6f-06bf-4a99-afb0-62996ca78100> .
<urn:uuid:b73e8e0d-5e28-453f-a82c-9fe8e5129fa6> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:b73e8e0d-5e28-453f-a82c-9fe8e5129fa6> <https://w3id.org/force/compliance-report#constraintLogicalOperand> <http://www.w3.org/ns/odrl/2/and> .
<urn:uuid:b73e8e0d-5e28-453f-a82c-9fe8e5129fa6> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:7ff462da-ab7c-4eb4-a0e7-c157b2647a54> .
<urn:uuid:b73e8e0d-5e28-453f-a82c-9fe8e5129fa6> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:a3f76709-5449-4bb8-a90a-8631b70459b6> .
<urn:uuid:7ff462da-ab7c-4eb4-a0e7-c157b2647a54> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:7ff462da-ab7c-4eb4-a0e7-c157b2647a54> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> .
<urn:uuid:7ff462da-ab7c-4eb4-a0e7-c157b2647a54> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:7ff462da-ab7c-4eb4-a0e7-c157b2647a54> <https://w3id.org/force/compliance-report#constraintOperator> <http://www.w3.org/ns/odrl/2/gt> .
<urn:uuid:7ff462da-ab7c-4eb4-a0e7-c157b2647a54> <https://w3id.org/force/compliance-report#constraintRightOperand> "2024-01-01T00:00:00Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:7ff462da-ab7c-4eb4-a0e7-c157b2647a54> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:a3f76709-5449-4bb8-a90a-8631b70459b6> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:a3f76709-5449-4bb8-a90a-8631b70459b6> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> .
<urn:uuid:a3f76709-5449-4bb8-a90a-8631b70459b6> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:a3f76709-5449-4bb8-a90a-8631b70459b6> <https://w3id.org/force/compliance-report#constraintOperator> <http://www.w3.org/ns/odrl/2/lt> .
<urn:uuid:a3f76709-5449-4bb8-a90a-8631b70459b6> <https://w3id.org/force/compliance-report#constraintRightOperand> "2024-12-31T23:59:59Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:a3f76709-5449-4bb8-a90a-8631b70459b6> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:22a4f05f-071c-4344-a4c1-4c1930f6f013> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:22a4f05f-071c-4344-a4c1-4c1930f6f013> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:b376228c-7b4e-4d3a-9c9a-406b978437c5> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:b376228c-7b4e-4d3a-9c9a-406b978437c5> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:b1e845d1-23b0-4e14-8817-1bfdfa41d036> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:b1e845d1-23b0-4e14-8817-1bfdfa41d036> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:f7e559c1-e9e2-403a-a335-aa0ec71d2531: Read request from Alice to resource X returns into yes (temporal + And (year 2024)) (Alice Request Read X - past).', async () => {
        
    const odrlPolicy = `<urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> .
<urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> <http://purl.org/dc/terms/description> "ALICE may READ resource X between 2024-01-01T00:00:00Z and 2024-12-31T23:59:59Z." .
<urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> .
<urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:c9359a6f-06bf-4a99-afb0-62996ca78100> .
<urn:uuid:c9359a6f-06bf-4a99-afb0-62996ca78100> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/LogicalConstraint> .
<urn:uuid:c9359a6f-06bf-4a99-afb0-62996ca78100> <http://www.w3.org/ns/odrl/2/and> <urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> .
<urn:uuid:c9359a6f-06bf-4a99-afb0-62996ca78100> <http://www.w3.org/ns/odrl/2/and> <urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> .
<urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Constraint> .
<urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/gt> .
<urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-01-01T00:00:00Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Constraint> .
<urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/lt> .
<urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-12-31T23:59:59Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:4827fb9f-88a2-484e-9f49-5c7fab58f04e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:4827fb9f-88a2-484e-9f49-5c7fab58f04e> <http://purl.org/dc/terms/created> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:4827fb9f-88a2-484e-9f49-5c7fab58f04e> <https://w3id.org/force/compliance-report#policy> <urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> .
<urn:uuid:4827fb9f-88a2-484e-9f49-5c7fab58f04e> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:4827fb9f-88a2-484e-9f49-5c7fab58f04e> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:b9841622-2ed9-4c2b-8308-b3c5ee29122d> .
<urn:uuid:b9841622-2ed9-4c2b-8308-b3c5ee29122d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:b9841622-2ed9-4c2b-8308-b3c5ee29122d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:2056bb62-9581-4b6c-a9ee-c1e73c431483> .
<urn:uuid:b9841622-2ed9-4c2b-8308-b3c5ee29122d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:c42e305e-8031-4aa3-b847-6f6500383143> .
<urn:uuid:b9841622-2ed9-4c2b-8308-b3c5ee29122d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:2ab33439-8536-4b10-8757-35992bd2a950> .
<urn:uuid:b9841622-2ed9-4c2b-8308-b3c5ee29122d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:d18eb3da-7816-46b8-957f-a03e949e18f5> .
<urn:uuid:b9841622-2ed9-4c2b-8308-b3c5ee29122d> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:b9841622-2ed9-4c2b-8308-b3c5ee29122d> <https://w3id.org/force/compliance-report#rule> <urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> .
<urn:uuid:b9841622-2ed9-4c2b-8308-b3c5ee29122d> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:b9841622-2ed9-4c2b-8308-b3c5ee29122d> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:2056bb62-9581-4b6c-a9ee-c1e73c431483> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:2056bb62-9581-4b6c-a9ee-c1e73c431483> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:c9359a6f-06bf-4a99-afb0-62996ca78100> .
<urn:uuid:2056bb62-9581-4b6c-a9ee-c1e73c431483> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:2056bb62-9581-4b6c-a9ee-c1e73c431483> <https://w3id.org/force/compliance-report#constraintLogicalOperand> <http://www.w3.org/ns/odrl/2/and> .
<urn:uuid:2056bb62-9581-4b6c-a9ee-c1e73c431483> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:aa1c46f1-3db6-4ff4-b6be-ef2322f850ec> .
<urn:uuid:2056bb62-9581-4b6c-a9ee-c1e73c431483> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:e56af108-1944-4dc3-95aa-9ced57137180> .
<urn:uuid:aa1c46f1-3db6-4ff4-b6be-ef2322f850ec> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:aa1c46f1-3db6-4ff4-b6be-ef2322f850ec> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> .
<urn:uuid:aa1c46f1-3db6-4ff4-b6be-ef2322f850ec> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:aa1c46f1-3db6-4ff4-b6be-ef2322f850ec> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:e56af108-1944-4dc3-95aa-9ced57137180> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:e56af108-1944-4dc3-95aa-9ced57137180> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> .
<urn:uuid:e56af108-1944-4dc3-95aa-9ced57137180> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:e56af108-1944-4dc3-95aa-9ced57137180> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:e56af108-1944-4dc3-95aa-9ced57137180> <https://w3id.org/force/compliance-report#constraintOperator> <http://www.w3.org/ns/odrl/2/lt> .
<urn:uuid:e56af108-1944-4dc3-95aa-9ced57137180> <https://w3id.org/force/compliance-report#constraintRightOperand> "2024-12-31T23:59:59Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:c42e305e-8031-4aa3-b847-6f6500383143> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:c42e305e-8031-4aa3-b847-6f6500383143> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:2ab33439-8536-4b10-8757-35992bd2a950> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:2ab33439-8536-4b10-8757-35992bd2a950> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:d18eb3da-7816-46b8-957f-a03e949e18f5> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:d18eb3da-7816-46b8-957f-a03e949e18f5> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:7a7afb6f-f4f8-4bb7-90e0-4b913e58cc94: Read request from Alice to resource X returns into yes (temporal + And (year 2024)) (Alice Request Read X - future).', async () => {
        
    const odrlPolicy = `<urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> .
<urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> <http://purl.org/dc/terms/description> "ALICE may READ resource X between 2024-01-01T00:00:00Z and 2024-12-31T23:59:59Z." .
<urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> .
<urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> <http://www.w3.org/ns/odrl/2/constraint> <urn:uuid:c9359a6f-06bf-4a99-afb0-62996ca78100> .
<urn:uuid:c9359a6f-06bf-4a99-afb0-62996ca78100> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/LogicalConstraint> .
<urn:uuid:c9359a6f-06bf-4a99-afb0-62996ca78100> <http://www.w3.org/ns/odrl/2/and> <urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> .
<urn:uuid:c9359a6f-06bf-4a99-afb0-62996ca78100> <http://www.w3.org/ns/odrl/2/and> <urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> .
<urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Constraint> .
<urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/gt> .
<urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-01-01T00:00:00Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Constraint> .
<urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> <http://www.w3.org/ns/odrl/2/leftOperand> <http://www.w3.org/ns/odrl/2/dateTime> .
<urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> <http://www.w3.org/ns/odrl/2/operator> <http://www.w3.org/ns/odrl/2/lt> .
<urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> <http://www.w3.org/ns/odrl/2/rightOperand> "2024-12-31T23:59:59Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`;
const expectedReport = `<urn:uuid:9c908aff-1a7d-4965-adf1-49bf0fefa670> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:9c908aff-1a7d-4965-adf1-49bf0fefa670> <http://purl.org/dc/terms/created> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:9c908aff-1a7d-4965-adf1-49bf0fefa670> <https://w3id.org/force/compliance-report#policy> <urn:uuid:3d48cff7-9266-4c6c-9069-418e8d8775da> .
<urn:uuid:9c908aff-1a7d-4965-adf1-49bf0fefa670> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:9c908aff-1a7d-4965-adf1-49bf0fefa670> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:9ef138c2-15fb-4121-b9e9-7e3cd441f4d0> .
<urn:uuid:9ef138c2-15fb-4121-b9e9-7e3cd441f4d0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:9ef138c2-15fb-4121-b9e9-7e3cd441f4d0> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:984f86ec-8d63-4140-9fbe-4e31093ec974> .
<urn:uuid:9ef138c2-15fb-4121-b9e9-7e3cd441f4d0> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:690dff72-f9a1-46ed-b3ed-b80444450c7a> .
<urn:uuid:9ef138c2-15fb-4121-b9e9-7e3cd441f4d0> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:eb884313-dd0c-4def-8dff-7461a703baa9> .
<urn:uuid:9ef138c2-15fb-4121-b9e9-7e3cd441f4d0> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:c6411837-810a-4249-abd4-f779ee9b7a4d> .
<urn:uuid:9ef138c2-15fb-4121-b9e9-7e3cd441f4d0> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:9ef138c2-15fb-4121-b9e9-7e3cd441f4d0> <https://w3id.org/force/compliance-report#rule> <urn:uuid:0a12c9d5-8f0d-40bd-88f2-baa456117a22> .
<urn:uuid:9ef138c2-15fb-4121-b9e9-7e3cd441f4d0> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:9ef138c2-15fb-4121-b9e9-7e3cd441f4d0> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:984f86ec-8d63-4140-9fbe-4e31093ec974> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:984f86ec-8d63-4140-9fbe-4e31093ec974> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:c9359a6f-06bf-4a99-afb0-62996ca78100> .
<urn:uuid:984f86ec-8d63-4140-9fbe-4e31093ec974> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:984f86ec-8d63-4140-9fbe-4e31093ec974> <https://w3id.org/force/compliance-report#constraintLogicalOperand> <http://www.w3.org/ns/odrl/2/and> .
<urn:uuid:984f86ec-8d63-4140-9fbe-4e31093ec974> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:57adafda-7dc2-4902-8209-abf35334d07e> .
<urn:uuid:984f86ec-8d63-4140-9fbe-4e31093ec974> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:6b4c31b8-a143-4610-91f1-fa051a644b7c> .
<urn:uuid:57adafda-7dc2-4902-8209-abf35334d07e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:57adafda-7dc2-4902-8209-abf35334d07e> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:c1a4d116-2777-4598-847d-8fbebf8eb535> .
<urn:uuid:57adafda-7dc2-4902-8209-abf35334d07e> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:57adafda-7dc2-4902-8209-abf35334d07e> <https://w3id.org/force/compliance-report#constraintOperator> <http://www.w3.org/ns/odrl/2/gt> .
<urn:uuid:57adafda-7dc2-4902-8209-abf35334d07e> <https://w3id.org/force/compliance-report#constraintRightOperand> "2024-01-01T00:00:00Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:57adafda-7dc2-4902-8209-abf35334d07e> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:6b4c31b8-a143-4610-91f1-fa051a644b7c> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ConstraintReport> .
<urn:uuid:6b4c31b8-a143-4610-91f1-fa051a644b7c> <https://w3id.org/force/compliance-report#constraint> <urn:uuid:49e4be66-54ef-45e0-8fac-5d5eb58c23fd> .
<urn:uuid:6b4c31b8-a143-4610-91f1-fa051a644b7c> <https://w3id.org/force/compliance-report#constraintLeftOperand> "2025-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:6b4c31b8-a143-4610-91f1-fa051a644b7c> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:690dff72-f9a1-46ed-b3ed-b80444450c7a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:690dff72-f9a1-46ed-b3ed-b80444450c7a> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:eb884313-dd0c-4def-8dff-7461a703baa9> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:eb884313-dd0c-4def-8dff-7461a703baa9> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:c6411837-810a-4249-abd4-f779ee9b7a4d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:c6411837-810a-4249-abd4-f779ee9b7a4d> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:11a9dfb5-a3a9-43a5-9c18-e92df3057e76: Read request from people in party collection to resource X returns into yes (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:7c0f8805-384b-4306-9736-382dfe89c0cd> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:7c0f8805-384b-4306-9736-382dfe89c0cd> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:7c0f8805-384b-4306-9736-382dfe89c0cd> .
<urn:uuid:7c0f8805-384b-4306-9736-382dfe89c0cd> <http://purl.org/dc/terms/description> "A party collection may READ resource X." .
<urn:uuid:7c0f8805-384b-4306-9736-382dfe89c0cd> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:7c0f8805-384b-4306-9736-382dfe89c0cd> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:b2b7acd4-496c-4f47-ae2d-50e2a5e3be08> .
<urn:uuid:b2b7acd4-496c-4f47-ae2d-50e2a5e3be08> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:b2b7acd4-496c-4f47-ae2d-50e2a5e3be08> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/partyCollection> .
<urn:uuid:b2b7acd4-496c-4f47-ae2d-50e2a5e3be08> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:b2b7acd4-496c-4f47-ae2d-50e2a5e3be08> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<http://example.org/partyCollection> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/PartyCollection> .
<http://example.org/partyCollection> <http://www.w3.org/ns/odrl/2/source> <http://example.org/partyIdentifier> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<http://example.org/alice> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
<http://example.org/alice> <http://www.w3.org/ns/odrl/2/partOf> <http://example.org/partyIdentifier> .
`;
const expectedReport = `<urn:uuid:d2f7c622-8915-44f9-aa28-0ac73f067334> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:d2f7c622-8915-44f9-aa28-0ac73f067334> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:d2f7c622-8915-44f9-aa28-0ac73f067334> <https://w3id.org/force/compliance-report#policy> <urn:uuid:7c0f8805-384b-4306-9736-382dfe89c0cd> .
<urn:uuid:d2f7c622-8915-44f9-aa28-0ac73f067334> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:d2f7c622-8915-44f9-aa28-0ac73f067334> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:8f8f6417-11df-4405-813b-211198f8d79d> .
<urn:uuid:8f8f6417-11df-4405-813b-211198f8d79d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:8f8f6417-11df-4405-813b-211198f8d79d> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:8f8f6417-11df-4405-813b-211198f8d79d> <https://w3id.org/force/compliance-report#rule> <urn:uuid:b2b7acd4-496c-4f47-ae2d-50e2a5e3be08> .
<urn:uuid:8f8f6417-11df-4405-813b-211198f8d79d> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:8f8f6417-11df-4405-813b-211198f8d79d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:be999f22-dce9-4963-9d28-1ea8c899a2a7> .
<urn:uuid:8f8f6417-11df-4405-813b-211198f8d79d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:5d20380f-bce6-4fc0-992f-d400874ebae7> .
<urn:uuid:8f8f6417-11df-4405-813b-211198f8d79d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:270429db-1947-4ef8-86f1-c562e8ecc769> .
<urn:uuid:8f8f6417-11df-4405-813b-211198f8d79d> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:be999f22-dce9-4963-9d28-1ea8c899a2a7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:be999f22-dce9-4963-9d28-1ea8c899a2a7> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:5d20380f-bce6-4fc0-992f-d400874ebae7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:5d20380f-bce6-4fc0-992f-d400874ebae7> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:270429db-1947-4ef8-86f1-c562e8ecc769> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:270429db-1947-4ef8-86f1-c562e8ecc769> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:57856edb-2ff9-4ff8-a2b2-f56ceb8d5825: Read request from people in party collection to resource X returns into yes (Bob Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:7c0f8805-384b-4306-9736-382dfe89c0cd> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:7c0f8805-384b-4306-9736-382dfe89c0cd> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:7c0f8805-384b-4306-9736-382dfe89c0cd> .
<urn:uuid:7c0f8805-384b-4306-9736-382dfe89c0cd> <http://purl.org/dc/terms/description> "A party collection may READ resource X." .
<urn:uuid:7c0f8805-384b-4306-9736-382dfe89c0cd> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:7c0f8805-384b-4306-9736-382dfe89c0cd> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:b2b7acd4-496c-4f47-ae2d-50e2a5e3be08> .
<urn:uuid:b2b7acd4-496c-4f47-ae2d-50e2a5e3be08> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:b2b7acd4-496c-4f47-ae2d-50e2a5e3be08> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/partyCollection> .
<urn:uuid:b2b7acd4-496c-4f47-ae2d-50e2a5e3be08> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:b2b7acd4-496c-4f47-ae2d-50e2a5e3be08> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
<http://example.org/partyCollection> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/PartyCollection> .
<http://example.org/partyCollection> <http://www.w3.org/ns/odrl/2/source> <http://example.org/partyIdentifier> .
`;
const odrlRequest = `<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://purl.org/dc/terms/description> "Requesting Party BOB requests to READ resource X." .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<http://example.org/alice> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
<http://example.org/alice> <http://www.w3.org/ns/odrl/2/partOf> <http://example.org/partyIdentifier> .
`;
const expectedReport = `<urn:uuid:a1e8cb10-1a4e-45fd-a5d6-56b6b8eb09db> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:a1e8cb10-1a4e-45fd-a5d6-56b6b8eb09db> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:a1e8cb10-1a4e-45fd-a5d6-56b6b8eb09db> <https://w3id.org/force/compliance-report#policy> <urn:uuid:7c0f8805-384b-4306-9736-382dfe89c0cd> .
<urn:uuid:a1e8cb10-1a4e-45fd-a5d6-56b6b8eb09db> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> .
<urn:uuid:a1e8cb10-1a4e-45fd-a5d6-56b6b8eb09db> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:0ca78ab9-4f0a-4c88-84d9-d114e8179583> .
<urn:uuid:0ca78ab9-4f0a-4c88-84d9-d114e8179583> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:0ca78ab9-4f0a-4c88-84d9-d114e8179583> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:0ca78ab9-4f0a-4c88-84d9-d114e8179583> <https://w3id.org/force/compliance-report#rule> <urn:uuid:b2b7acd4-496c-4f47-ae2d-50e2a5e3be08> .
<urn:uuid:0ca78ab9-4f0a-4c88-84d9-d114e8179583> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> .
<urn:uuid:0ca78ab9-4f0a-4c88-84d9-d114e8179583> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:c053ae7c-1548-4d2b-afeb-46b191955ee1> .
<urn:uuid:0ca78ab9-4f0a-4c88-84d9-d114e8179583> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:92c1b89f-f281-4583-859d-8267f01f7fbd> .
<urn:uuid:0ca78ab9-4f0a-4c88-84d9-d114e8179583> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:b6b3f56a-c440-4aba-b953-7a04fba39081> .
<urn:uuid:0ca78ab9-4f0a-4c88-84d9-d114e8179583> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:c053ae7c-1548-4d2b-afeb-46b191955ee1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:c053ae7c-1548-4d2b-afeb-46b191955ee1> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:92c1b89f-f281-4583-859d-8267f01f7fbd> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:92c1b89f-f281-4583-859d-8267f01f7fbd> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:b6b3f56a-c440-4aba-b953-7a04fba39081> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:b6b3f56a-c440-4aba-b953-7a04fba39081> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:459e47f0-fcb8-4880-9225-5f6a3b4c155f: Read request from Alice to resource in asset collection returns into yes (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:e30bcd34-0d5c-43d1-b229-bf68afcae5ae> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:e30bcd34-0d5c-43d1-b229-bf68afcae5ae> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:e30bcd34-0d5c-43d1-b229-bf68afcae5ae> .
<urn:uuid:e30bcd34-0d5c-43d1-b229-bf68afcae5ae> <http://purl.org/dc/terms/description> "ALICE may READ any resource from the Asset Collection." .
<urn:uuid:e30bcd34-0d5c-43d1-b229-bf68afcae5ae> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:e30bcd34-0d5c-43d1-b229-bf68afcae5ae> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:f4cb5007-e834-4a9c-a62a-091891350c04> .
<urn:uuid:f4cb5007-e834-4a9c-a62a-091891350c04> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:f4cb5007-e834-4a9c-a62a-091891350c04> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:f4cb5007-e834-4a9c-a62a-091891350c04> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:f4cb5007-e834-4a9c-a62a-091891350c04> <http://www.w3.org/ns/odrl/2/target> <http://example.org/assetCollection> .
<http://example.org/assetCollection> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/AssetCollection> .
<http://example.org/assetCollection> <http://www.w3.org/ns/odrl/2/source> <http://example.org/assetIdentifier> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<http://example.org/x> <http://www.w3.org/ns/odrl/2/partOf> <http://example.org/assetIdentifier> .
`;
const expectedReport = `<urn:uuid:32cc5602-588e-46df-9e9f-9b8da97891ef> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:32cc5602-588e-46df-9e9f-9b8da97891ef> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:32cc5602-588e-46df-9e9f-9b8da97891ef> <https://w3id.org/force/compliance-report#policy> <urn:uuid:e30bcd34-0d5c-43d1-b229-bf68afcae5ae> .
<urn:uuid:32cc5602-588e-46df-9e9f-9b8da97891ef> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:32cc5602-588e-46df-9e9f-9b8da97891ef> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:b77ce2ba-4a16-4db9-a357-e08708723a60> .
<urn:uuid:b77ce2ba-4a16-4db9-a357-e08708723a60> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:b77ce2ba-4a16-4db9-a357-e08708723a60> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:b77ce2ba-4a16-4db9-a357-e08708723a60> <https://w3id.org/force/compliance-report#rule> <urn:uuid:f4cb5007-e834-4a9c-a62a-091891350c04> .
<urn:uuid:b77ce2ba-4a16-4db9-a357-e08708723a60> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:b77ce2ba-4a16-4db9-a357-e08708723a60> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:76c20eea-f7b2-4a04-897c-e1b3a6301dfc> .
<urn:uuid:b77ce2ba-4a16-4db9-a357-e08708723a60> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:c71019a5-117f-4a53-b0dc-ba09b1dfb052> .
<urn:uuid:b77ce2ba-4a16-4db9-a357-e08708723a60> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:f73b8683-2bb8-4d72-ad3b-bb4f97f51dcb> .
<urn:uuid:b77ce2ba-4a16-4db9-a357-e08708723a60> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:76c20eea-f7b2-4a04-897c-e1b3a6301dfc> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:76c20eea-f7b2-4a04-897c-e1b3a6301dfc> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:c71019a5-117f-4a53-b0dc-ba09b1dfb052> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:c71019a5-117f-4a53-b0dc-ba09b1dfb052> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:f73b8683-2bb8-4d72-ad3b-bb4f97f51dcb> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:f73b8683-2bb8-4d72-ad3b-bb4f97f51dcb> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:1e735c45-0c7a-41fc-a267-784894e6fddd: Read request from Alice to resource in asset collection returns into yes (Alice Request Read Y).', async () => {
        
    const odrlPolicy = `<urn:uuid:e30bcd34-0d5c-43d1-b229-bf68afcae5ae> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:e30bcd34-0d5c-43d1-b229-bf68afcae5ae> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:e30bcd34-0d5c-43d1-b229-bf68afcae5ae> .
<urn:uuid:e30bcd34-0d5c-43d1-b229-bf68afcae5ae> <http://purl.org/dc/terms/description> "ALICE may READ any resource from the Asset Collection." .
<urn:uuid:e30bcd34-0d5c-43d1-b229-bf68afcae5ae> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:e30bcd34-0d5c-43d1-b229-bf68afcae5ae> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:f4cb5007-e834-4a9c-a62a-091891350c04> .
<urn:uuid:f4cb5007-e834-4a9c-a62a-091891350c04> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:f4cb5007-e834-4a9c-a62a-091891350c04> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:f4cb5007-e834-4a9c-a62a-091891350c04> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:f4cb5007-e834-4a9c-a62a-091891350c04> <http://www.w3.org/ns/odrl/2/target> <http://example.org/assetCollection> .
<http://example.org/assetCollection> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/AssetCollection> .
<http://example.org/assetCollection> <http://www.w3.org/ns/odrl/2/source> <http://example.org/assetIdentifier> .
`;
const odrlRequest = `<urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> .
<urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> <http://purl.org/dc/terms/description> "Requesting Party Alice requests to READ resource Y." .
<urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> .
<urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> <http://www.w3.org/ns/odrl/2/target> <http://example.org/y> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<http://example.org/x> <http://www.w3.org/ns/odrl/2/partOf> <http://example.org/assetIdentifier> .
`;
const expectedReport = `<urn:uuid:3a2f5c93-ee01-4856-833c-12be09978c0c> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:3a2f5c93-ee01-4856-833c-12be09978c0c> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:3a2f5c93-ee01-4856-833c-12be09978c0c> <https://w3id.org/force/compliance-report#policy> <urn:uuid:e30bcd34-0d5c-43d1-b229-bf68afcae5ae> .
<urn:uuid:3a2f5c93-ee01-4856-833c-12be09978c0c> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> .
<urn:uuid:3a2f5c93-ee01-4856-833c-12be09978c0c> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:5692542e-a60d-447f-9f8a-3b4f6cadde29> .
<urn:uuid:5692542e-a60d-447f-9f8a-3b4f6cadde29> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:5692542e-a60d-447f-9f8a-3b4f6cadde29> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:5692542e-a60d-447f-9f8a-3b4f6cadde29> <https://w3id.org/force/compliance-report#rule> <urn:uuid:f4cb5007-e834-4a9c-a62a-091891350c04> .
<urn:uuid:5692542e-a60d-447f-9f8a-3b4f6cadde29> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> .
<urn:uuid:5692542e-a60d-447f-9f8a-3b4f6cadde29> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:c6267db4-c2da-4ed7-9382-0f307ce86635> .
<urn:uuid:5692542e-a60d-447f-9f8a-3b4f6cadde29> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:de0f3292-8665-4764-a2a7-c8d37aee9c2a> .
<urn:uuid:5692542e-a60d-447f-9f8a-3b4f6cadde29> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:c5446f77-fc33-4c89-8caa-94db0ee9b75e> .
<urn:uuid:5692542e-a60d-447f-9f8a-3b4f6cadde29> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:c6267db4-c2da-4ed7-9382-0f307ce86635> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:c6267db4-c2da-4ed7-9382-0f307ce86635> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:de0f3292-8665-4764-a2a7-c8d37aee9c2a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:de0f3292-8665-4764-a2a7-c8d37aee9c2a> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:c5446f77-fc33-4c89-8caa-94db0ee9b75e> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:c5446f77-fc33-4c89-8caa-94db0ee9b75e> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:ada99890-79ab-4893-9969-69678fe3756c: Read request from people in party collection to resource in asset collection returns into yes (Alice Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> .
<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://purl.org/dc/terms/description> "A party collection may READ any resource from the Asset Collection." .
<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> .
<urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/partyCollection> .
<urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> <http://www.w3.org/ns/odrl/2/target> <http://example.org/assetCollection> .
<http://example.org/assetCollection> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/AssetCollection> .
<http://example.org/assetCollection> <http://www.w3.org/ns/odrl/2/source> <http://example.org/assetIdentifier> .
<http://example.org/partyCollection> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/PartyCollection> .
<http://example.org/partyCollection> <http://www.w3.org/ns/odrl/2/source> <http://example.org/partyIdentifier> .
`;
const odrlRequest = `<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://purl.org/dc/terms/description> "Requesting Party ALICE requests to READ resource X." .
<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<http://example.org/x> <http://www.w3.org/ns/odrl/2/partOf> <http://example.org/assetIdentifier> .
<http://example.org/alice> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
<http://example.org/alice> <http://www.w3.org/ns/odrl/2/partOf> <http://example.org/partyIdentifier> .
`;
const expectedReport = `<urn:uuid:43dd3176-0d8e-4498-afeb-1aaf3a481371> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:43dd3176-0d8e-4498-afeb-1aaf3a481371> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:43dd3176-0d8e-4498-afeb-1aaf3a481371> <https://w3id.org/force/compliance-report#policy> <urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> .
<urn:uuid:43dd3176-0d8e-4498-afeb-1aaf3a481371> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> .
<urn:uuid:43dd3176-0d8e-4498-afeb-1aaf3a481371> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:503ee670-1cd8-42c5-8e39-913589934546> .
<urn:uuid:503ee670-1cd8-42c5-8e39-913589934546> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:503ee670-1cd8-42c5-8e39-913589934546> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:503ee670-1cd8-42c5-8e39-913589934546> <https://w3id.org/force/compliance-report#rule> <urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> .
<urn:uuid:503ee670-1cd8-42c5-8e39-913589934546> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> .
<urn:uuid:503ee670-1cd8-42c5-8e39-913589934546> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:4be0248a-e3ea-498b-8cad-fc2288e6620a> .
<urn:uuid:503ee670-1cd8-42c5-8e39-913589934546> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:aca3b71f-e01e-4362-ba2c-88cbde548ef1> .
<urn:uuid:503ee670-1cd8-42c5-8e39-913589934546> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:824ea31c-5855-46aa-957f-fc970333987a> .
<urn:uuid:503ee670-1cd8-42c5-8e39-913589934546> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .
<urn:uuid:4be0248a-e3ea-498b-8cad-fc2288e6620a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:4be0248a-e3ea-498b-8cad-fc2288e6620a> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:aca3b71f-e01e-4362-ba2c-88cbde548ef1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:aca3b71f-e01e-4362-ba2c-88cbde548ef1> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:824ea31c-5855-46aa-957f-fc970333987a> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:824ea31c-5855-46aa-957f-fc970333987a> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:8c94c52e-76e4-4b36-96e5-b2782fcbf767: Read request from people in party collection to resource in asset collection returns into yes (Alice Request Read Y).', async () => {
        
    const odrlPolicy = `<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> .
<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://purl.org/dc/terms/description> "A party collection may READ any resource from the Asset Collection." .
<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> .
<urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/partyCollection> .
<urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> <http://www.w3.org/ns/odrl/2/target> <http://example.org/assetCollection> .
<http://example.org/assetCollection> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/AssetCollection> .
<http://example.org/assetCollection> <http://www.w3.org/ns/odrl/2/source> <http://example.org/assetIdentifier> .
<http://example.org/partyCollection> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/PartyCollection> .
<http://example.org/partyCollection> <http://www.w3.org/ns/odrl/2/source> <http://example.org/partyIdentifier> .
`;
const odrlRequest = `<urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> .
<urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> <http://purl.org/dc/terms/description> "Requesting Party Alice requests to READ resource Y." .
<urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> .
<urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/alice> .
<urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> <http://www.w3.org/ns/odrl/2/target> <http://example.org/y> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<http://example.org/x> <http://www.w3.org/ns/odrl/2/partOf> <http://example.org/assetIdentifier> .
<http://example.org/alice> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
<http://example.org/alice> <http://www.w3.org/ns/odrl/2/partOf> <http://example.org/partyIdentifier> .
`;
const expectedReport = `<urn:uuid:9561f7d4-d183-4508-8f82-9c6fcc737f38> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:9561f7d4-d183-4508-8f82-9c6fcc737f38> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:9561f7d4-d183-4508-8f82-9c6fcc737f38> <https://w3id.org/force/compliance-report#policy> <urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> .
<urn:uuid:9561f7d4-d183-4508-8f82-9c6fcc737f38> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:b384ec45-0f24-4be6-86ba-91a749c698ed> .
<urn:uuid:9561f7d4-d183-4508-8f82-9c6fcc737f38> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:6bf89816-6ea4-48b9-be7e-4ef896b188ea> .
<urn:uuid:6bf89816-6ea4-48b9-be7e-4ef896b188ea> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:6bf89816-6ea4-48b9-be7e-4ef896b188ea> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:6bf89816-6ea4-48b9-be7e-4ef896b188ea> <https://w3id.org/force/compliance-report#rule> <urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> .
<urn:uuid:6bf89816-6ea4-48b9-be7e-4ef896b188ea> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:35d4666e-8fbd-4677-8671-2875eee26a1b> .
<urn:uuid:6bf89816-6ea4-48b9-be7e-4ef896b188ea> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:0677d800-0bd8-4839-9175-33d8039105f1> .
<urn:uuid:6bf89816-6ea4-48b9-be7e-4ef896b188ea> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:12e79b26-0ca6-4ada-9dd0-1faf0a952921> .
<urn:uuid:6bf89816-6ea4-48b9-be7e-4ef896b188ea> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:44f71303-b6c2-4330-b790-5628b6778ee1> .
<urn:uuid:6bf89816-6ea4-48b9-be7e-4ef896b188ea> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:0677d800-0bd8-4839-9175-33d8039105f1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:0677d800-0bd8-4839-9175-33d8039105f1> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:12e79b26-0ca6-4ada-9dd0-1faf0a952921> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:12e79b26-0ca6-4ada-9dd0-1faf0a952921> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:44f71303-b6c2-4330-b790-5628b6778ee1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:44f71303-b6c2-4330-b790-5628b6778ee1> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:9f6b34db-8bee-4de4-a313-afdae6f8cc3b: Read request from people in party collection to resource in asset collection returns into yes (Bob Request Read X).', async () => {
        
    const odrlPolicy = `<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> .
<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://purl.org/dc/terms/description> "A party collection may READ any resource from the Asset Collection." .
<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> .
<urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/partyCollection> .
<urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> <http://www.w3.org/ns/odrl/2/target> <http://example.org/assetCollection> .
<http://example.org/assetCollection> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/AssetCollection> .
<http://example.org/assetCollection> <http://www.w3.org/ns/odrl/2/source> <http://example.org/assetIdentifier> .
<http://example.org/partyCollection> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/PartyCollection> .
<http://example.org/partyCollection> <http://www.w3.org/ns/odrl/2/source> <http://example.org/partyIdentifier> .
`;
const odrlRequest = `<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://purl.org/dc/terms/description> "Requesting Party BOB requests to READ resource X." .
<urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> <http://www.w3.org/ns/odrl/2/target> <http://example.org/x> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<http://example.org/x> <http://www.w3.org/ns/odrl/2/partOf> <http://example.org/assetIdentifier> .
<http://example.org/alice> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
<http://example.org/alice> <http://www.w3.org/ns/odrl/2/partOf> <http://example.org/partyIdentifier> .
`;
const expectedReport = `<urn:uuid:b3275c42-0f6d-4a0d-a33c-da27d5359ae0> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:b3275c42-0f6d-4a0d-a33c-da27d5359ae0> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:b3275c42-0f6d-4a0d-a33c-da27d5359ae0> <https://w3id.org/force/compliance-report#policy> <urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> .
<urn:uuid:b3275c42-0f6d-4a0d-a33c-da27d5359ae0> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:5be7b7d5-bc05-4168-8b31-81ebc32cfaa0> .
<urn:uuid:b3275c42-0f6d-4a0d-a33c-da27d5359ae0> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:bd5db87a-71da-4948-846c-d089d3bc66f7> .
<urn:uuid:bd5db87a-71da-4948-846c-d089d3bc66f7> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:bd5db87a-71da-4948-846c-d089d3bc66f7> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:bd5db87a-71da-4948-846c-d089d3bc66f7> <https://w3id.org/force/compliance-report#rule> <urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> .
<urn:uuid:bd5db87a-71da-4948-846c-d089d3bc66f7> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:0c997117-eefc-474e-9049-c4e3b8defbc7> .
<urn:uuid:bd5db87a-71da-4948-846c-d089d3bc66f7> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:4e74ee91-31be-400a-9366-502a445b2408> .
<urn:uuid:bd5db87a-71da-4948-846c-d089d3bc66f7> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:fcf80e43-dd91-41de-9ced-70f8b87074de> .
<urn:uuid:bd5db87a-71da-4948-846c-d089d3bc66f7> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:522f781e-5c7a-487e-a266-83cb6f0484ad> .
<urn:uuid:bd5db87a-71da-4948-846c-d089d3bc66f7> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:4e74ee91-31be-400a-9366-502a445b2408> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:4e74ee91-31be-400a-9366-502a445b2408> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
<urn:uuid:fcf80e43-dd91-41de-9ced-70f8b87074de> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:fcf80e43-dd91-41de-9ced-70f8b87074de> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:522f781e-5c7a-487e-a266-83cb6f0484ad> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:522f781e-5c7a-487e-a266-83cb6f0484ad> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

    it('urn:uuid:94703acc-1dfd-4689-87d2-607c81974a4c: Read request from people in party collection to resource in asset collection returns into yes (Bob Request Write Y).', async () => {
        
    const odrlPolicy = `<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> .
<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://purl.org/dc/terms/description> "A party collection may READ any resource from the Asset Collection." .
<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://purl.org/dc/terms/source> <https://github.com/SolidLabResearch/ODRL-Test-Suite/> .
<urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> .
<urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/partyCollection> .
<urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> <http://www.w3.org/ns/odrl/2/target> <http://example.org/assetCollection> .
<http://example.org/assetCollection> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/AssetCollection> .
<http://example.org/assetCollection> <http://www.w3.org/ns/odrl/2/source> <http://example.org/assetIdentifier> .
<http://example.org/partyCollection> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/PartyCollection> .
<http://example.org/partyCollection> <http://www.w3.org/ns/odrl/2/source> <http://example.org/partyIdentifier> .
`;
const odrlRequest = `<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/ns/odrl/2/uid> <urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://purl.org/dc/terms/description> "Requesting Party BOB requests to WRITE resource Y." .
<urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/assignee> <http://example.org/bob> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/write> .
<urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> <http://www.w3.org/ns/odrl/2/target> <http://example.org/y> .
`;
const sotw = `<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<http://example.org/x> <http://www.w3.org/ns/odrl/2/partOf> <http://example.org/assetIdentifier> .
<http://example.org/alice> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://xmlns.com/foaf/0.1/Person> .
<http://example.org/alice> <http://www.w3.org/ns/odrl/2/partOf> <http://example.org/partyIdentifier> .
`;
const expectedReport = `<urn:uuid:d954cc20-64d4-4db3-b5a7-a84527676788> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PolicyReport> .
<urn:uuid:d954cc20-64d4-4db3-b5a7-a84527676788> <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
<urn:uuid:d954cc20-64d4-4db3-b5a7-a84527676788> <https://w3id.org/force/compliance-report#policy> <urn:uuid:2dd7d09e-aff1-49bf-bdc5-d50f2a3b5013> .
<urn:uuid:d954cc20-64d4-4db3-b5a7-a84527676788> <https://w3id.org/force/compliance-report#policyRequest> <urn:uuid:73904e56-0fa9-43b8-8fd7-a45bb9d98c46> .
<urn:uuid:d954cc20-64d4-4db3-b5a7-a84527676788> <https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:0c826a59-f4ed-4f69-ad79-50752092c11d> .
<urn:uuid:0c826a59-f4ed-4f69-ad79-50752092c11d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PermissionReport> .
<urn:uuid:0c826a59-f4ed-4f69-ad79-50752092c11d> <https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> .
<urn:uuid:0c826a59-f4ed-4f69-ad79-50752092c11d> <https://w3id.org/force/compliance-report#rule> <urn:uuid:f5d8113b-dd1b-44bd-b95d-76198f346609> .
<urn:uuid:0c826a59-f4ed-4f69-ad79-50752092c11d> <https://w3id.org/force/compliance-report#ruleRequest> <urn:uuid:68ae9b26-69d2-48cf-83e6-ef77c4a9cda9> .
<urn:uuid:0c826a59-f4ed-4f69-ad79-50752092c11d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:30f391cc-d0f6-4a31-bee2-ea5bb51f5832> .
<urn:uuid:0c826a59-f4ed-4f69-ad79-50752092c11d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:51677934-ea48-455b-8727-79f680a6434d> .
<urn:uuid:0c826a59-f4ed-4f69-ad79-50752092c11d> <https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:b2fa623b-4ad5-4596-a6f4-bc5f84ad42be> .
<urn:uuid:0c826a59-f4ed-4f69-ad79-50752092c11d> <https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .
<urn:uuid:30f391cc-d0f6-4a31-bee2-ea5bb51f5832> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#TargetReport> .
<urn:uuid:30f391cc-d0f6-4a31-bee2-ea5bb51f5832> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:51677934-ea48-455b-8727-79f680a6434d> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#PartyReport> .
<urn:uuid:51677934-ea48-455b-8727-79f680a6434d> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
<urn:uuid:b2fa623b-4ad5-4596-a6f4-bc5f84ad42be> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <https://w3id.org/force/compliance-report#ActionReport> .
<urn:uuid:b2fa623b-4ad5-4596-a6f4-bc5f84ad42be> <https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .
`;
const report = await odrlEvaluator.evaluate(parser.parse(odrlPolicy), parser.parse(odrlRequest), parser.parse(sotw));

expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(parser.parse(expectedReport)));
});

          
})
    
