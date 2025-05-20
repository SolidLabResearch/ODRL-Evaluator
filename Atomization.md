# TODO List Atomization

- [ ] create demo in `./demo/` directory
- [ ] create Atomizer class
- [ ] add properly in ODRL Evaluate
  - [ ] should I make it configurable?
- [ ] add documentation, how does it work
  - [ ] I am okay with this being in https://w3id.org/force/policy-instantiation
- [ ] create some tests
- [ ] merge with main
- [ ] remove `test.ts`, `test2.ts` and `test3.ts`
- [ ] remove Atomization.md
- [ ] publish v0.3.0

## Progress 20/05/2025

Reduced the required code already to the following:

```ts
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
```

Current issues:

- Doing multiple evaluating runs (performance issue)
- not natively in Evaluate Class
- One ODRL Policy has multiple Policy Reports at the same time. That does not make sense (major issue if you ask me) -> see example

example output:

```ttl
@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix dcterms: <http://purl.org/dc/terms/> .

<urn:uuid:324681f2-02c4-4cfd-ba45-3821590bf185> a <https://w3id.org/force/compliance-report#PolicyReport> ;
	dcterms:created "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> ;
	<https://w3id.org/force/compliance-report#policy> <http://example.org/usagePolicy1> ;
	<https://w3id.org/force/compliance-report#policyRequest> <urn:ucp:policy:2a797ad7-232a-4e1f-853f-81388969e4a1> ;
	<https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:870a4943-af99-4877-a76c-c8f34cffaa61> .

<urn:uuid:870a4943-af99-4877-a76c-c8f34cffaa61> a <https://w3id.org/force/compliance-report#PermissionReport> ;
	<https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> ;
	<https://w3id.org/force/compliance-report#rule> <http://example.org/permission1> ;
	<https://w3id.org/force/compliance-report#ruleRequest> <urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef> ;
	<https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:b8bec390-6b84-4d19-85a1-6902eb0163d2>, <urn:uuid:9549cce4-41f2-4ec6-bd36-7370e6e13f4d>, <urn:uuid:d1c05a27-be07-440e-88cd-40908f4e41eb> ;
	<https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Active> .

<urn:uuid:d1c05a27-be07-440e-88cd-40908f4e41eb> a <https://w3id.org/force/compliance-report#ActionReport> ;
	<https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .

<urn:uuid:9549cce4-41f2-4ec6-bd36-7370e6e13f4d> a <https://w3id.org/force/compliance-report#PartyReport> ;
	<https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .

<urn:uuid:b8bec390-6b84-4d19-85a1-6902eb0163d2> a <https://w3id.org/force/compliance-report#TargetReport> ;
	<https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .

<urn:uuid:1fb01424-ece3-4d5f-b83f-1cdc06f51ea1> a <https://w3id.org/force/compliance-report#PolicyReport> ;
	dcterms:created "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> ;
	<https://w3id.org/force/compliance-report#policy> <http://example.org/usagePolicy1> ;
	<https://w3id.org/force/compliance-report#policyRequest> <urn:ucp:policy:2a797ad7-232a-4e1f-853f-81388969e4a1> ;
	<https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:2c5e77b3-9620-4c0c-abaa-a9741344405f> .

<urn:uuid:2c5e77b3-9620-4c0c-abaa-a9741344405f> a <https://w3id.org/force/compliance-report#PermissionReport> ;
	<https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> ;
	<https://w3id.org/force/compliance-report#rule> <http://example.org/permission2> ;
	<https://w3id.org/force/compliance-report#ruleRequest> <urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef> ;
	<https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:1337d606-470f-41d4-9562-00ae78b4c699>, <urn:uuid:ec239bbd-45c7-4541-af7c-afb434249370>, <urn:uuid:a94c648d-729d-4d62-a9bb-116c76df3d5d> ;
	<https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .

<urn:uuid:a94c648d-729d-4d62-a9bb-116c76df3d5d> a <https://w3id.org/force/compliance-report#ActionReport> ;
	<https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .

<urn:uuid:ec239bbd-45c7-4541-af7c-afb434249370> a <https://w3id.org/force/compliance-report#PartyReport> ;
	<https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .

<urn:uuid:1337d606-470f-41d4-9562-00ae78b4c699> a <https://w3id.org/force/compliance-report#TargetReport> ;
	<https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .

<urn:uuid:456f3065-4eae-49d0-bf61-3b2678ff07bd> a <https://w3id.org/force/compliance-report#PolicyReport> ;
	dcterms:created "2024-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> ;
	<https://w3id.org/force/compliance-report#policy> <http://example.org/usagePolicy1> ;
	<https://w3id.org/force/compliance-report#policyRequest> <urn:ucp:policy:2a797ad7-232a-4e1f-853f-81388969e4a1> ;
	<https://w3id.org/force/compliance-report#ruleReport> <urn:uuid:d0dd88e8-0866-45f4-9581-545cc1d2b4fb> .

<urn:uuid:d0dd88e8-0866-45f4-9581-545cc1d2b4fb> a <https://w3id.org/force/compliance-report#ProhibitionReport> ;
	<https://w3id.org/force/compliance-report#attemptState> <https://w3id.org/force/compliance-report#Attempted> ;
	<https://w3id.org/force/compliance-report#rule> <urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> ;
	<https://w3id.org/force/compliance-report#ruleRequest> <urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef> ;
	<https://w3id.org/force/compliance-report#premiseReport> <urn:uuid:f0a14c31-f613-47c1-b1d8-070fa0121e6b>, <urn:uuid:d1c85267-b866-459d-ba8b-736962209d2c>, <urn:uuid:01562f58-0504-4757-902b-3225e37d653a> ;
	<https://w3id.org/force/compliance-report#activationState> <https://w3id.org/force/compliance-report#Inactive> .

<urn:uuid:01562f58-0504-4757-902b-3225e37d653a> a <https://w3id.org/force/compliance-report#ActionReport> ;
	<https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .

<urn:uuid:d1c85267-b866-459d-ba8b-736962209d2c> a <https://w3id.org/force/compliance-report#PartyReport> ;
	<https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Unsatisfied> .

<urn:uuid:f0a14c31-f613-47c1-b1d8-070fa0121e6b> a <https://w3id.org/force/compliance-report#TargetReport> ;
	<https://w3id.org/force/compliance-report#satisfactionState> <https://w3id.org/force/compliance-report#Satisfied> .

```