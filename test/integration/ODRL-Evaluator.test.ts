import "jest-rdf";
import { Parser, Quad } from "n3";
import { blanknodeify, CompositeODRLEvaluator, ODRLEngineMultipleSteps, ODRLEvaluator } from "../../src";

const parser = new Parser()
describe('The default ODRL evaluator', () => {
    const odrlEvaluator = new ODRLEvaluator(new ODRLEngineMultipleSteps());

    it('handles skos exact match.', async () => {
        const odrlPolicyText = `
<http://example.org/usagePolicy1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Agreement> .
<http://example.org/usagePolicy1> <http://www.w3.org/ns/odrl/2/permission> <http://example.org/permission1> .
<http://example.org/permission1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<http://example.org/permission1> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/modify> .
<http://example.org/permission1> <http://www.w3.org/ns/odrl/2/target> <http://localhost:3000/alice/other/resource.txt> .
<http://example.org/permission1> <http://www.w3.org/ns/odrl/2/assignee> <https://woslabbi.pod.knows.idlab.ugent.be/profile/card#me> .
<http://example.org/permission1> <http://www.w3.org/ns/odrl/2/assigner> <https://pod.woutslabbinck.com/profile/card#me> .
`;
        const odrlRequestText = `
<urn:uuid:99c27654-3420-4bca-b4c9-3697d990db66> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Request> .
<urn:uuid:99c27654-3420-4bca-b4c9-3697d990db66> <http://www.w3.org/ns/odrl/2/permission> <urn:uuid:aa4f93e0-5194-453b-a5bb-79ffb9fb4b9f> .
<urn:uuid:aa4f93e0-5194-453b-a5bb-79ffb9fb4b9f> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<urn:uuid:aa4f93e0-5194-453b-a5bb-79ffb9fb4b9f> <http://www.w3.org/ns/odrl/2/assignee> <https://woslabbi.pod.knows.idlab.ugent.be/profile/card#me> .
<urn:uuid:aa4f93e0-5194-453b-a5bb-79ffb9fb4b9f> <http://www.w3.org/ns/odrl/2/target> <http://localhost:3000/alice/other/resource.txt> .
<urn:uuid:aa4f93e0-5194-453b-a5bb-79ffb9fb4b9f> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/write> .
`;
        const stateOfTheWorldText = `
<http://example.com/request/currentTime> <http://purl.org/dc/terms/issued> "2025-01-14T10:09:08.370Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
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
    dct:created "2025-01-14T10:09:08.370Z"^^xsd:dateTime;
    report:policy ex:usagePolicy1;
    report:policyRequest <urn:uuid:99c27654-3420-4bca-b4c9-3697d990db66>;
    report:ruleReport <urn:uuid:98c43141-6ded-4b6c-ad7a-d46e94126761>.
<urn:uuid:98c43141-6ded-4b6c-ad7a-d46e94126761> a report:PermissionReport;
    report:attemptState report:Attempted;
    report:rule ex:permission1;
    report:ruleRequest <urn:uuid:aa4f93e0-5194-453b-a5bb-79ffb9fb4b9f>;
    report:premiseReport <urn:uuid:2d5225c0-0151-49f3-a5ab-72b91f8622f6>, <urn:uuid:e5e8650b-d72a-4783-bf88-5adb75272cdd>, <urn:uuid:0821bb62-8ce1-4cde-9834-093274bd79b3>;
    report:activationState report:Active.
<urn:uuid:2d5225c0-0151-49f3-a5ab-72b91f8622f6> a report:TargetReport;
    report:satisfactionState report:Satisfied.
<urn:uuid:e5e8650b-d72a-4783-bf88-5adb75272cdd> a report:PartyReport;
    report:satisfactionState report:Satisfied.
<urn:uuid:0821bb62-8ce1-4cde-9834-093274bd79b3> a report:ActionReport;
    report:satisfactionState report:Satisfied.`

        const odrlPolicyQuads = parser.parse(odrlPolicyText);
        const odrlRequestQuads = parser.parse(odrlRequestText);
        const stateOfTheWorldQuads = parser.parse(stateOfTheWorldText);

        const expectedReportQuads = parser.parse(expectedReport);
        const report = await odrlEvaluator.evaluate(
            odrlPolicyQuads,
            odrlRequestQuads,
            stateOfTheWorldQuads);

        expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(expectedReportQuads))
    });

    it('handles dynamic constraint policies.', async () => {
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

        const expectedReport = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/>.
@prefix dct: <http://purl.org/dc/terms/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix report: <https://w3id.org/force/compliance-report#>.


<urn:uuid:6ca35ea7-1b83-4123-ab9d-2f32296ee584> a report:PolicyReport;
    dct:created "2017-02-12T11:20:10.999Z"^^xsd:dateTime;
    report:policy <urn:uuid:32127a3f-5296-4cc6-b9d6-ef6c647a721d>;
    report:policyRequest <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364>;
    report:ruleReport <urn:uuid:c2eb7c82-9700-45fa-8253-96b4cfaf69ce>.
<urn:uuid:c2eb7c82-9700-45fa-8253-96b4cfaf69ce> a report:PermissionReport;
    report:attemptState report:Attempted;
    report:rule <urn:uuid:d6ab4a38-68fb-418e-8af5-e77649a2187a>;
    report:ruleRequest <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59>;
    report:premiseReport <urn:uuid:43f08161-4649-438b-8f41-cf5bdd25f7ec>, <urn:uuid:4376be4d-7b47-4176-9f89-517c26eacf50>, <urn:uuid:5f9cdbe4-54e2-4ee0-a6f0-afa8989fd12f>, <urn:uuid:ab18a1cf-0a75-44f0-974a-541014fdba38>;
    report:activationState report:Active.
<urn:uuid:4376be4d-7b47-4176-9f89-517c26eacf50> a report:TargetReport;
    report:satisfactionState report:Satisfied.
<urn:uuid:5f9cdbe4-54e2-4ee0-a6f0-afa8989fd12f> a report:PartyReport;
    report:satisfactionState report:Satisfied.
<urn:uuid:ab18a1cf-0a75-44f0-974a-541014fdba38> a report:ActionReport;
    report:satisfactionState report:Satisfied.
<urn:uuid:43f08161-4649-438b-8f41-cf5bdd25f7ec> a report:ConstraintReport;
    report:constraint <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1>;
    report:constraintLeftOperand "2017-02-12T11:20:10.999Z"^^xsd:dateTime;
    report:constraintOperator odrl:lt;
    report:constraintRightOperand "2018-02-12T11:20:10.999Z"^^xsd:dateTime;
    report:satisfactionState report:Satisfied.
`
        const odrlPolicyQuads = parser.parse(policy);
        const odrlRequestQuads = parser.parse(request);
        const stateOfTheWorldQuads = parser.parse(sotw);

        const expectedReportQuads = parser.parse(expectedReport);
        const report = await odrlEvaluator.evaluate(
            odrlPolicyQuads,
            odrlRequestQuads,
            stateOfTheWorldQuads);
        expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(expectedReportQuads))
    })
})

describe('The Composite ODRL Evaluator', () => {
    it('handles policies with compact rules.', async () => {
        const odrlEvaluator = new CompositeODRLEvaluator(new ODRLEngineMultipleSteps());

        const sotw = `
@prefix temp: <http://example.com/request/>.
@prefix dct: <http://purl.org/dc/terms/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.

temp:currentTime dct:issued "2024-02-12T11:20:10.999Z"^^xsd:dateTime.
`

        const request = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

<urn:ucp:policy:2a797ad7-232a-4e1f-853f-81388969e4a1> a odrl:Request;
    odrl:permission <urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef>.
<urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef> a odrl:Permission;
    odrl:action odrl:read;
    odrl:target <http://localhost:3000/alice/other/resource.txt>;
    odrl:assignee <https://both.pod.knows.idlab.ugent.be/profile/card#me>.
`
        const compactPolicy = `
@prefix ex: <http://example.org/>.
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

ex:usagePolicy1 a odrl:Agreement ;
  odrl:permission ex:permission1, ex:permission2 ;
  odrl:prohibition <urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> .


ex:permission1 a odrl:Permission ;
  odrl:action odrl:modify, odrl:read ;
  odrl:target <http://localhost:3000/alice/other/resource.txt> ;
  odrl:assignee <https://both.pod.knows.idlab.ugent.be/profile/card#me> .

ex:permission2 a odrl:Permission ;
  odrl:action odrl:modify ;
  odrl:target <http://localhost:3000/alice/other/resource.txt> ;
  odrl:assignee <https://modify.pod.knows.idlab.ugent.be/profile/card#me> .


<urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> a odrl:Prohibition ;
  odrl:assignee ex:bob ;
  odrl:target <http://localhost:3000/alice/other/resource.txt> ;
  odrl:action odrl:use .

<urn:uuid:95efe0e8-4fb7-496d-8f3c-4d78c97829bc> a odrl:Set;
    odrl:permission <urn:uuid:f5199b0a-d824-45a0-bc08-1caa8d19a001>.
<urn:uuid:f5199b0a-d824-45a0-bc08-1caa8d19a001> a odrl:Permission;
    odrl:action odrl:read;
    odrl:target ex:x;
    odrl:assignee ex:alice;
    odrl:assigner ex:zeno.
`
        const expectedReport = `
@prefix cr: <https://w3id.org/force/compliance-report#> .
@prefix dct: <http://purl.org/dc/terms/created> .
@prefix ex: <http://example.org/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<urn:uuid:3c7f3116-f7e8-497f-ab84-92ec444d6761> a cr:PolicyReport ;
  <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^xsd:dateTime ;
  cr:policy ex:usagePolicy1 ;
  cr:policyRequest <urn:ucp:policy:2a797ad7-232a-4e1f-853f-81388969e4a1> ;
  cr:ruleReport <urn:uuid:998c2562-2656-4267-b1cb-8cde83b73ecc>, <urn:uuid:80d08eaa-afcc-4cbe-9645-39fc8c1957b7>, <urn:uuid:22461372-aff8-4ef2-8c27-d92154b7b8ac> .
<urn:uuid:998c2562-2656-4267-b1cb-8cde83b73ecc> a cr:PermissionReport ;
  cr:attemptState cr:Attempted ;
  cr:rule ex:permission1 ;
  cr:ruleRequest <urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef> ;
  cr:premiseReport <urn:uuid:5c68859b-f70e-4a64-bb12-7b8fb64ddc37>, <urn:uuid:e37247f4-e167-40a4-bd8b-9d91387b04d2>, <urn:uuid:79ae938e-2565-441b-bd15-933b97d7c6ae> ;
  cr:activationState cr:Active .
<urn:uuid:5c68859b-f70e-4a64-bb12-7b8fb64ddc37> a cr:TargetReport ;
  cr:satisfactionState cr:Satisfied .
<urn:uuid:e37247f4-e167-40a4-bd8b-9d91387b04d2> a cr:PartyReport ;
  cr:satisfactionState cr:Satisfied .
<urn:uuid:79ae938e-2565-441b-bd15-933b97d7c6ae> a cr:ActionReport ;
  cr:satisfactionState cr:Satisfied .
<urn:uuid:80d08eaa-afcc-4cbe-9645-39fc8c1957b7> a cr:PermissionReport ;
  cr:attemptState cr:Attempted ;
  cr:rule ex:permission2 ;
  cr:ruleRequest <urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef> ;
  cr:premiseReport <urn:uuid:1b4e9796-265c-4514-941a-532bbb7d09a2>, <urn:uuid:56644213-2bd4-48a7-8645-156008d5da68>, <urn:uuid:949c32da-e6a5-46ce-a110-52eebb699964> ;
  cr:activationState cr:Inactive .
<urn:uuid:1b4e9796-265c-4514-941a-532bbb7d09a2> a cr:TargetReport ;
  cr:satisfactionState cr:Satisfied .
<urn:uuid:56644213-2bd4-48a7-8645-156008d5da68> a cr:PartyReport ;
  cr:satisfactionState cr:Unsatisfied .
<urn:uuid:949c32da-e6a5-46ce-a110-52eebb699964> a cr:ActionReport ;
  cr:satisfactionState cr:Unsatisfied .
<urn:uuid:22461372-aff8-4ef2-8c27-d92154b7b8ac> a cr:ProhibitionReport ;
  cr:attemptState cr:Attempted ;
  cr:rule <urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> ;
  cr:ruleRequest <urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef> ;
  cr:premiseReport <urn:uuid:8171c7a1-c3e8-4398-a0a9-1cd5a9d3c0c3>, <urn:uuid:47faebe8-e708-4acf-87ea-33df9d63f4ea>, <urn:uuid:187c65aa-4e40-4907-9e46-52d0f8c6832a> ;
  cr:activationState cr:Inactive .
<urn:uuid:8171c7a1-c3e8-4398-a0a9-1cd5a9d3c0c3> a cr:TargetReport ;
  cr:satisfactionState cr:Satisfied .
<urn:uuid:47faebe8-e708-4acf-87ea-33df9d63f4ea> a cr:PartyReport ;
  cr:satisfactionState cr:Unsatisfied .
<urn:uuid:187c65aa-4e40-4907-9e46-52d0f8c6832a> a cr:ActionReport ;
  cr:satisfactionState cr:Satisfied .
<urn:uuid:39d19e3f-d303-4cb5-95cd-b266591c859e> a cr:PolicyReport ;
  <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^xsd:dateTime ;
  cr:policy <urn:uuid:95efe0e8-4fb7-496d-8f3c-4d78c97829bc> ;
  cr:policyRequest <urn:ucp:policy:2a797ad7-232a-4e1f-853f-81388969e4a1> ;
  cr:ruleReport <urn:uuid:3fc9a4ca-40b2-434d-9b6b-cf5d77cb1fb7> .
<urn:uuid:3fc9a4ca-40b2-434d-9b6b-cf5d77cb1fb7> a cr:PermissionReport ;
  cr:attemptState cr:Attempted ;
  cr:rule <urn:uuid:f5199b0a-d824-45a0-bc08-1caa8d19a001> ;
  cr:ruleRequest <urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef> ;
  cr:premiseReport <urn:uuid:2a527c2c-3f3a-4add-badf-92fd5ef11fd7>, <urn:uuid:30b38e7c-18ef-4c51-a1a2-0b43c069e99c>, <urn:uuid:55ff7b61-3015-42ae-ab1c-5131ef3a04f2> ;
  cr:activationState cr:Inactive .
<urn:uuid:2a527c2c-3f3a-4add-badf-92fd5ef11fd7> a cr:TargetReport ;
  cr:satisfactionState cr:Unsatisfied .
<urn:uuid:30b38e7c-18ef-4c51-a1a2-0b43c069e99c> a cr:PartyReport ;
  cr:satisfactionState cr:Unsatisfied .
<urn:uuid:55ff7b61-3015-42ae-ab1c-5131ef3a04f2> a cr:ActionReport ;
  cr:satisfactionState cr:Satisfied .`

        const odrlPolicyQuads = parser.parse(compactPolicy);
        const odrlRequestQuads = parser.parse(request);
        const stateOfTheWorldQuads = parser.parse(sotw);

        const expectedReportQuads = parser.parse(expectedReport);
        const report = await odrlEvaluator.evaluate(
            odrlPolicyQuads,
            odrlRequestQuads,
            stateOfTheWorldQuads);
        expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(expectedReportQuads))
    })

})