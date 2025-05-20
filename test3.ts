import { Parser, Writer } from "n3";
import { ODRLEvaluator, ODRLEngineMultipleSteps, Atomizer, AtomizedEvaluatedRule } from "./dist";

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
`

async function main(){
    const parser = new Parser()
    const writer = new Writer();
    // ODRL Evaluator inputs
    const sotwQuads = parser.parse(sotw)
    const requestQuads = parser.parse(request)
    const evaluator = new ODRLEvaluator(new ODRLEngineMultipleSteps());
    const compactPolicyQuads = parser.parse(compactPolicy)

    const atomizer = new Atomizer();
    const policies = await atomizer.atomizePolicies(compactPolicyQuads);

    const atomizedEvaluatedRules: AtomizedEvaluatedRule[] = []
    for (const policy of policies) {
        const report = await evaluator.evaluate(policy.atomizedRuleQuads, requestQuads, sotwQuads)
        atomizedEvaluatedRules.push({
            ...policy,
            policyReportQuads: report
        })
    }

    const report = atomizer.cleanUp(atomizedEvaluatedRules);
    console.log(writer.quadsToString(report));
}
main()