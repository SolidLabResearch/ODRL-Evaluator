# Evaluating ODRL Compact Rules through Atomization

## Compact Rules Problem
The ODRL Evaluator was designed for evaluating ODRL policies with atomic rules.
As such, policies with compact rules produced incorrect answers during evaluation (see [issue](https://github.com/SolidLabResearch/ODRL-Evaluator/issues/3)).

The reason is that all premises on a rule level report MUST be be satisfied.
Request policy evaluation for a compact rule with two distinct actions would result in two action reports, where only one of them would be satisfied.

As such requesting a read action to rules with both read and write actions would always result into an inactive state at the rule level report.

## Solution through atomization

The issue was resolved through reducing each compact rule to a set of **atomic** rules prior to evaluation.

For this, the [`Atomizer`](../src/evaluator/Atomizer.ts) class was introduced that works together with the ODRL Evaluator.
The first step ensures that each rule is properly atomized while preserving its link to the original ODRL rule.

Once atomized, each rule is evaluated individually. After evaluation, the atomic results are merged back together. 
For each compact rule, the corresponding rule reports are analyzed and a representative report is selected:
- If any rule report is active, that atomic candidate is chosen.
- Otherwise, the rule report with the highest number of satisfied premises is selected.
Next, each atomic rule is evaluated individually.
Now that each atomic rule is evaluated, we need to merge them again.

The final merged output is returned as a unified policy report.

A specific ODRL Evaluator, the [`CompositeODRLEvaluator`](../src/evaluator/Evaluate.ts) is then created to deal with these kind of policies.

Here is a code snippet:
```ts
const request = ... // list of quads representing the evaluation request
const compactPolicy = ... // list of quads representing the compact policy
const sotw = ... // list of quads representing the state of the world

const odrlEvaluator = new CompositeODRLEvaluator(new ODRLEngineMultipleSteps());

const report = await odrlEvaluator.evaluate(compactPolicy, request, sotw);

```

### Detailed description of the solution
NOTE: this is implemented in the `Atomizer` class

This is how it works in more details:

policy with a compact rule
```turtle
@prefix ex: <http://example.org/>.
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

ex:usagePolicy1 a odrl:Agreement ;
  odrl:permission ex:permission1 ;
  odrl:prohibition <urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> .


ex:permission1 a odrl:Permission ;
  odrl:action odrl:modify, odrl:read ;
  odrl:target <http://localhost:3000/alice/other/resource.txt> ;
  odrl:assignee <https://both.pod.knows.idlab.ugent.be/profile/card#me> .
```

Atomization: transform the policy
```turtle
# Atomized Rule 1 for http://example.org/permission1
<http://example.org/usagePolicy1> <http://www.w3.org/ns/odrl/2/permission> _:n3-23 .
_:n3-23 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
_:n3-23 <http://example.org/ns/derivedFrom> <http://example.org/permission1> .
_:n3-23 <http://www.w3.org/ns/odrl/2/target> <http://localhost:3000/alice/other/resource.txt> .
_:n3-23 <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/modify> .
_:n3-23 <http://www.w3.org/ns/odrl/2/assignee> <https://both.pod.knows.idlab.ugent.be/profile/card#me> .

# Atomized Rule 2 for http://example.org/permission1
<http://example.org/usagePolicy1> <http://www.w3.org/ns/odrl/2/permission> _:n3-24 .
_:n3-24 <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
_:n3-24 <http://example.org/ns/derivedFrom> <http://example.org/permission1> .
_:n3-24 <http://www.w3.org/ns/odrl/2/target> <http://localhost:3000/alice/other/resource.txt> .
_:n3-24 <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
_:n3-24 <http://www.w3.org/ns/odrl/2/assignee> <https://both.pod.knows.idlab.ugent.be/profile/card#me> .
```

Report for the atomized policy
```turtle
@prefix cr: <https://w3id.org/force/compliance-report#> .
@prefix dct: <http://purl.org/dc/terms/created> .
@prefix ex: <http://example.org/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<urn:uuid:c7359d5f-c3b9-494e-afc9-5b8abcb05781> a cr:PolicyReport ;
  <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^xsd:dateTime ;
  cr:policy ex:usagePolicy1 ;
  cr:policyRequest <urn:ucp:policy:2a797ad7-232a-4e1f-853f-81388969e4a1> ;
  cr:ruleReport <urn:uuid:8ab45cc2-6fdf-4ba1-ba51-95688949cfae>, <urn:uuid:da2e5ad3-f5eb-4e4d-ad43-062457baec06> .

<urn:uuid:8ab45cc2-6fdf-4ba1-ba51-95688949cfae> a cr:PermissionReport ;
  cr:attemptState cr:Attempted ;
  cr:rule _:n3-23 ;
  cr:ruleRequest <urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef> ;
  cr:premiseReport <urn:uuid:0b4f74f6-8792-49a3-a9b3-0b0c98eeb153>, <urn:uuid:5db6380d-7e05-4735-8a37-8b2acb88cb69>, <urn:uuid:9b0c2710-615e-4b3a-ae24-e76c26ac1be2> ;
  cr:activationState cr:Inactive .

<urn:uuid:da2e5ad3-f5eb-4e4d-ad43-062457baec06> a cr:PermissionReport ;
  cr:attemptState cr:Attempted ;
  cr:rule _:n3-24 ;
  cr:ruleRequest <urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef> ;
  cr:premiseReport <urn:uuid:0b4f74f6-8792-49a3-a9b3-0b0c98eeb153>, <urn:uuid:5db6380d-7e05-4735-8a37-8b2acb88cb69>, <urn:uuid:abb81f69-15ae-46e4-adcb-aa2bd7093e69> ;
  cr:activationState cr:Active .

<urn:uuid:0b4f74f6-8792-49a3-a9b3-0b0c98eeb153> a cr:TargetReport ;
  cr:satisfactionState cr:Satisfied .

<urn:uuid:5db6380d-7e05-4735-8a37-8b2acb88cb69> a cr:PartyReport ;
  cr:satisfactionState cr:Satisfied .

<urn:uuid:9b0c2710-615e-4b3a-ae24-e76c26ac1be2> a cr:ActionReport ;
  cr:satisfactionState cr:Unsatisfied .

<urn:uuid:abb81f69-15ae-46e4-adcb-aa2bd7093e69> a cr:ActionReport ;
  cr:satisfactionState cr:Satisfied .
```

Final report -> selecting the active one
```turtle
@prefix cr: <https://w3id.org/force/compliance-report#> .
@prefix dct: <http://purl.org/dc/terms/created> .
@prefix ex: <http://example.org/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<urn:uuid:c7359d5f-c3b9-494e-afc9-5b8abcb05781> a cr:PolicyReport ;
  <http://purl.org/dc/terms/created> "2024-02-12T11:20:10.999Z"^^xsd:dateTime ;
  cr:policy ex:usagePolicy1 ;
  cr:policyRequest <urn:ucp:policy:2a797ad7-232a-4e1f-853f-81388969e4a1> ;
  cr:ruleReport <urn:uuid:da2e5ad3-f5eb-4e4d-ad43-062457baec06> .

<urn:uuid:da2e5ad3-f5eb-4e4d-ad43-062457baec06> a cr:PermissionReport ;
  cr:attemptState cr:Attempted ;
  cr:rule _:n3-24 ;
  cr:ruleRequest <urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef> ;
  cr:premiseReport <urn:uuid:0b4f74f6-8792-49a3-a9b3-0b0c98eeb153>, <urn:uuid:5db6380d-7e05-4735-8a37-8b2acb88cb69>, <urn:uuid:abb81f69-15ae-46e4-adcb-aa2bd7093e69> ;
  cr:activationState cr:Active .

<urn:uuid:0b4f74f6-8792-49a3-a9b3-0b0c98eeb153> a cr:TargetReport ;
  cr:satisfactionState cr:Satisfied .

<urn:uuid:5db6380d-7e05-4735-8a37-8b2acb88cb69> a cr:PartyReport ;
  cr:satisfactionState cr:Satisfied .

<urn:uuid:abb81f69-15ae-46e4-adcb-aa2bd7093e69> a cr:ActionReport ;
  cr:satisfactionState cr:Satisfied .
```
