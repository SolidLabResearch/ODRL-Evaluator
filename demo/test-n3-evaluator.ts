import { ODRLEngineMultipleSteps, ODRLEvaluator, prefixes, turtleStringToStore } from "../dist/index";
import { write } from '@jeswr/pretty-turtle';


const odrlPolicyText = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/>.
@prefix ex: <http://example.org/>.
@prefix temp: <http://example.com/request/>.
@prefix dct: <http://purl.org/dc/terms/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix report: <https://w3id.org/force/compliance-report#>.

<urn:uuid:95efe0e8-4fb7-496d-8f3c-4d78c97829bc> a odrl:Set;
    dct:description "ZENO is data owner of resource X. ALICE may READ resource X.";
    dct:source <https://github.com/woutslabbinck/UCR-test-suite/blob/main/ODRL-Example.md>;
    odrl:permission <urn:uuid:f5199b0a-d824-45a0-bc08-1caa8d19a001>.
<urn:uuid:f5199b0a-d824-45a0-bc08-1caa8d19a001> a odrl:Permission;
    odrl:action odrl:read;
    odrl:target ex:x;
    odrl:assignee ex:alice;
    odrl:assigner ex:zeno.
`;
const odrlRequestText = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/>.
@prefix ex: <http://example.org/>.
@prefix temp: <http://example.com/request/>.
@prefix dct: <http://purl.org/dc/terms/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix report: <https://w3id.org/force/compliance-report#>.

<urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364> a odrl:Request;
    dct:description "Requesting Party ALICE requests to READ resource X.";
    odrl:permission <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59>.
<urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59> a odrl:Permission;
    odrl:assignee ex:alice;
    odrl:action odrl:read;
    odrl:target ex:x.
`;
const stateOfTheWorldText = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/>.
@prefix ex: <http://example.org/>.
@prefix temp: <http://example.com/request/>.
@prefix dct: <http://purl.org/dc/terms/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix report: <https://w3id.org/force/compliance-report#>.

<urn:uuid:f580eb45-e8bf-4bf0-b85f-f3d37774e2d4> a ex:Sotw ;
    ex:includes temp:currentTime, ex:alice, ex:zeno.
    
temp:currentTime dct:issued "2024-02-12T11:20:10.999Z"^^xsd:dateTime.
ex:alice a foaf:Person.
ex:zeno a foaf:Person.
`;

async function main() {
    // parse input
    const odrlPolicyStore = await turtleStringToStore(odrlPolicyText);
    const odrlRequestStore = await turtleStringToStore(odrlRequestText);
    const stateOfTheWorldStore = await turtleStringToStore(stateOfTheWorldText);

    // evaluator (assumes proper policies, requests and sotw)
    const evaluator = new ODRLEvaluator(new ODRLEngineMultipleSteps());

    const reasoningResult = await evaluator.evaluate(
        odrlPolicyStore.getQuads(null, null, null, null),
        odrlRequestStore.getQuads(null, null, null, null),
        stateOfTheWorldStore.getQuads(null, null, null, null))
    // printing report nicely

    console.log(await write(reasoningResult, {prefixes}));

}
main()
