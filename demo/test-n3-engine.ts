import * as fs from "fs";
import { Store } from "n3";
import * as path from "path";
import { EyeJsReasoner, EyeReasoner, ODRLN3Engine, storeToString, turtleStringToStore } from "../dist/index";

const odrlPolicyText = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/>.
@prefix ex: <http://example.org/>.
@prefix temp: <http://example.com/request/>.
@prefix dct: <http://purl.org/dc/terms/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix foaf: <http://xmlns.com/foaf/0.1/>.
@prefix report: <http://example.com/report/temp/>.

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
@prefix report: <http://example.com/report/temp/>.

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
@prefix report: <http://example.com/report/temp/>.

<urn:uuid:f580eb45-e8bf-4bf0-b85f-f3d37774e2d4> a ex:Sotw ;
    ex:includes temp:currentTime, ex:alice, ex:zeno.

temp:currentTime dct:issued "2024-02-12T11:20:10.999Z"^^xsd:dateTime.
ex:alice a foaf:Person.
ex:zeno a foaf:Person.
`;


const eyeJs = new EyeJsReasoner()
const eye = new EyeReasoner('/usr/local/bin/eye', ["--quiet", "--nope", "--pass-only-new"])
const ruleDir = path.join(path.dirname(__filename), "..", "src", "rules");
const rulePath = path.join(ruleDir, "simpleRules.n3");
const rules = fs.readFileSync(rulePath, "utf-8");

const ODRLEyeLocalEngine = new ODRLN3Engine(eye, rules);
const ODRLEyeJsEngine = new ODRLN3Engine(eyeJs, rules);

async function main() {
    // parse input
    const odrlPolicyStore = await turtleStringToStore(odrlPolicyText);
    const odrlRequestStore = await turtleStringToStore(odrlRequestText);
    const stateOfTheWorldStore = await turtleStringToStore(stateOfTheWorldText);

    const input = [...odrlPolicyStore.getQuads(null, null, null, null), ...odrlRequestStore.getQuads(null, null, null, null), ...stateOfTheWorldStore.getQuads(null, null, null, null)];

    const reasoningResultLocal = await ODRLEyeLocalEngine.evaluate(input);
    const reasoningResultJs = await ODRLEyeJsEngine.evaluate(input);

    console.log("Compliance Report evaluated using the EYE JS reasoner");
    console.log(storeToString(new Store(reasoningResultJs)));
    console.log();
    console.log("Compliance Report evaluated using the EYE reasoner (local)");
    console.log(storeToString(new Store(reasoningResultLocal)));

}
main()