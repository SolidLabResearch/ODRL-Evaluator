import { ODRLEngineMultipleSteps, ODRLEvaluator, turtleStringToStore, blanknodeify } from "../../src";
import { Quad } from "n3";
import "jest-rdf";

describe('The default ODRL evaluator', () => {
    const odrlEvaluator = new ODRLEvaluator(new ODRLEngineMultipleSteps());
    it ('Handle skos exact match', async () => {
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
        const expectedReport =`
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

    const odrlPolicyStore = await turtleStringToStore(odrlPolicyText);
    const odrlRequestStore = await turtleStringToStore(odrlRequestText);
    const stateOfTheWorldStore = await turtleStringToStore(stateOfTheWorldText);
    const expectedReportStore = await turtleStringToStore(expectedReport);
    const report = await odrlEvaluator.evaluate(
        odrlPolicyStore.getQuads(null, null, null, null), 
        odrlRequestStore.getQuads(null, null, null, null), 
        stateOfTheWorldStore.getQuads(null, null, null, null));
        
        expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(blanknodeify(expectedReportStore.getQuads(null, null, null, null)))
    });
})