import { ODRLEngineMultipleSteps, ODRLEvaluator, turtleStringToStore, blanknodeify } from "../../src";
import { Quad, Parser } from "n3";
import "jest-rdf";

describe('The default ODRL evaluator', () => {
    const odrlEvaluator = new ODRLEvaluator(new ODRLEngineMultipleSteps());
    const parser = new Parser()

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
        const report =  await odrlEvaluator.evaluate(
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
        @prefix odrluc: <https://w3id.org/force/odrlproposed#> .
        
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
        const report =  await odrlEvaluator.evaluate(
            odrlPolicyQuads,
            odrlRequestQuads,
            stateOfTheWorldQuads);
        expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(expectedReportQuads))

    })
})