# ODRL Evaluator Support

## Rules

### Permission

There is support in the ODRL Evaluator for `odrl:Permission` rules.
This is achieved by checking whether all its properties are satisfied (as elaborated in the [ODRL Formal Semantics spec](https://w3c.github.io/odrl/formal-semantics/)).

The properties of the permission that are evaluated against a request and the state of the world are the following:
- [Asset](#asset): the `odrl:target` of the Permission
- [Party](#party): the `odrl:assignee` of the Permission (the recipient)
- [Action](#action): the `odrl:action` of the Permission
- [Constraints](#constraints): the `odrl:constraint`(s) of the permission.
  - Note: when there are multiple constraints and no logical constraint is provided, it is assumed that `odrl:and` is expected.

Currently, the evaluator applies multiple steps (see [reason](../ODRL-Evaluator/rules/faulty/README.md)). 
Therefore, the activation state of an `odrl:Permission` is calculated as the last step in [`activation-state.n3`](../ODRL-Evaluator/rules/activation-state.n3)

Note that there the permission evaluation does not yet take into account Duty Reports. 
That is the (pre-)conditions.

### Prohibition

No support (yet) in the ODRL Evaluator for `odrl:Prohibition` rules.

### Duty

No support (yet) in the ODRL Evaluator for `odrl:Duty` rules.

## Action

Columns of the table elaborated:
- Label: The `rdfs:label` as defined by [ODRL](https://www.w3.org/TR/odrl-vocab)
- Identifier: The ODRL unique identifier for the term
- Normative: Whether it is part of the official standard or not ([hint](https://stackoverflow.com/questions/6420522/what-does-normative-and-non-normative-mean-in-reference-to-xml))
- Deprecated: An element that has been outdated by newer constructs (sometimes superseded by newer version).
- Supported: Whether the ODRL Evaluator supports it.
- Included in: Whether the action is encompassed by an other action. Note that this is a transitive property.
  - For more information, checkout [ODRL IM §2.4](https://www.w3.org/TR/odrl-model/#action) for `odrl:includedIn`
- Exact Match: Whether the action has a similar meaning than the other, i.e., it is an exact match (Symmetric and Transitive)
  - For more information, checkout [Simple Knowledge Organization System (SKOS) primer §3.1](https://www.w3.org/TR/skos-primer/#secmapping) for `skos:ExactMatch`

| Label              | Identifier                                                                | Normative | Deprecated | Supported | Included in      | Exact Match         |
| ------------------ | ------------------------------------------------------------------------- | --------- | ---------- | --------- | ---------------- | ------------------- |
| Attribution        | [`cc:Attribution`](http://creativecommons.org/ns#Attribution)             | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Commercial Use     | [`cc:CommercialUse`](http://creativecommons.org/ns#CommercialUse)         | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Derivative Works   | [`cc:DerivativeWorks`](http://creativecommons.org/ns#DerivativeWorks)     | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Distribution       | [`cc:Distribution`](http://creativecommons.org/ns#Distribution)           | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Notice             | [`cc:Notice`](http://creativecommons.org/ns#Notice)                       | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Reproduction       | [`cc:Reproduction`](http://creativecommons.org/ns#Reproduction)           | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Share Alike        | [`cc:ShareAlike`](http://creativecommons.org/ns#ShareAlike)               | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Sharing            | [`cc:Sharing`](http://creativecommons.org/ns#Sharing)                     | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Source Code        | [`cc:SourceCode`](http://creativecommons.org/ns#SourceCode)               | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Accept Tracking    | [`odrl:acceptTracking`](http://www.w3.org/ns/odrl/2/acceptTracking)       | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Ad-hoc sharing     | [`odrl:adHocShare`](http://www.w3.org/ns/odrl/2/adHocShare)               | [`?`](a "Deprecated, but not explicitly Non-Normative.")         | [✅](a "This original term and URI from the OMA specification should be used: http://www.openmobilealliance.com/oma-dd/adhoc-share .")          | ✅         |                  |                     |
| Aggregate          | [`odrl:aggregate`](http://www.w3.org/ns/odrl/2/aggregate)                 | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Annotate           | [`odrl:annotate`](http://www.w3.org/ns/odrl/2/annotate)                   | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Anonymize          | [`odrl:anonymize`](http://www.w3.org/ns/odrl/2/anonymize)                 | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Append             | [`odrl:append`](http://www.w3.org/ns/odrl/2/append)                       | [`?`](a "Deprecated, but not explicitly Non-Normative.")         | ✅          | ✅         |                  | `odrl:modify`       |
| Append To          | [`odrl:appendTo`](http://www.w3.org/ns/odrl/2/appendTo)                   | [`?`](a "Deprecated, but not explicitly Non-Normative.")         | ✅          | ✅         |                  | `odrl:modify`       |
| Archive            | [`odrl:archive`](http://www.w3.org/ns/odrl/2/archive)                     | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Attach policy      | [`odrl:attachPolicy`](http://www.w3.org/ns/odrl/2/attachPolicy)           | [`?`](a "Deprecated, but not explicitly Non-Normative.")         | ✅          | ✅         |                  | `cc:Notice`         |
| Attach source      | [`odrl:attachSource`](http://www.w3.org/ns/odrl/2/attachSource)           | [`?`](a "Deprecated, but not explicitly Non-Normative.")        | ✅          | ✅         |                  | `cc:SourceCode`     |
| Attribute          | [`odrl:attribute`](http://www.w3.org/ns/odrl/2/attribute)                 | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Commercialize      | [`odrl:commercialize`](http://www.w3.org/ns/odrl/2/commercialize)         |[`?`](a "Deprecated, but not explicitly Non-Normative.")        | ✅          | ✅         |                  | `cc:CommercialUse ` |
| Compensate         | [`odrl:compensate`](http://www.w3.org/ns/odrl/2/compensate)               | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Concurrent Use     | [`odrl:concurrentUse`](http://www.w3.org/ns/odrl/2/concurrentUse)         | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Copy               | [`odrl:copy`](http://www.w3.org/ns/odrl/2/copy)                           | [`?`](a "Deprecated, but not explicitly Non-Normative.")         | ✅          | ✅         |                  | `odrl:reproduce`    |
| Delete             | [`odrl:delete`](http://www.w3.org/ns/odrl/2/delete)                       | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Derive             | [`odrl:derive`](http://www.w3.org/ns/odrl/2/derive)                       | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Digitize           | [`odrl:digitize`](http://www.w3.org/ns/odrl/2/digitize)                   | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Display            | [`odrl:display`](http://www.w3.org/ns/odrl/2/display)                     | ❌         | ❌          | ✅         | `odrl:play`      |                     |
| Distribute         | [`odrl:distribute`](http://www.w3.org/ns/odrl/2/distribute)               | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Ensure Exclusivity | [`odrl:ensureExclusivity`](http://www.w3.org/ns/odrl/2/ensureExclusivity) | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Execute            | [`odrl:execute`](http://www.w3.org/ns/odrl/2/execute)                     | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Export             | [`odrl:export`](http://www.w3.org/ns/odrl/2/export)                       | [`?`](a "Deprecated, but not explicitly Non-Normative.")         | ✅          | ✅         |                  | `odrl:transform`    |
| Extract            | [`odrl:extract`](http://www.w3.org/ns/odrl/2/extract)                     | ❌         | ❌          | ✅         | `odrl:reproduce` |                     |
| Extract character  | [`odrl:extractChar`](http://www.w3.org/ns/odrl/2/extractChar)             | [`?`](a "Deprecated, but not explicitly Non-Normative.")         | [✅]( a "This original term and URI from the ONIX specification should be used: http://www.editeur.org/onix-pl/extract-char .")          | ✅         |                  |                     |
| Extract page       | [`odrl:extractPage`](http://www.w3.org/ns/odrl/2/extractPage)             | [`?`](a "Deprecated, but not explicitly Non-Normative.")         | [✅]( a "This original term and URI from the ONIX specification should be used: http://www.editeur.org/onix-pl/extract-page .")          | ✅         |                  |                     |
| Extract word       | [`odrl:extractWord`](http://www.w3.org/ns/odrl/2/extractWord)             | [`?`](a "Deprecated, but not explicitly Non-Normative.")         | [✅]( a "This original term and URI from the ONIX specification should be used: http://www.editeur.org/onix-pl/extract-word .")          | ✅         |                  |                     |
| Give               | [`odrl:give`](http://www.w3.org/ns/odrl/2/give)                           | ❌         | ❌          | ✅         | `odrl:transfer`  |                     |
| Grant Use          | [`odrl:grantUse`](http://www.w3.org/ns/odrl/2/grantUse)                   | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Include            | [`odrl:include`](http://www.w3.org/ns/odrl/2/include)                     | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Index              | [`odrl:index`](http://www.w3.org/ns/odrl/2/index)                         | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Inform             | [`odrl:inform`](http://www.w3.org/ns/odrl/2/inform)                       | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Install            | [`odrl:install`](http://www.w3.org/ns/odrl/2/install)                     | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Lease              | [`odrl:lease`](http://www.w3.org/ns/odrl/2/lease)                         | [`?`](a "Deprecated, but not explicitly Non-Normative.")         | ✅          | ✅         |                  |                     |
| Lend               | [`odrl:lend`](http://www.w3.org/ns/odrl/2/lend)                           | [`?`](a "Deprecated, but not explicitly Non-Normative.")         | ✅          | ✅         |                  |                     |
| License            | [`odrl:license`](http://www.w3.org/ns/odrl/2/license)                     | [`?`](a "Deprecated, but not explicitly Non-Normative.")         | ✅          | ✅         |                  | `odrl:grantUse`     |
| Modify             | [`odrl:modify`](http://www.w3.org/ns/odrl/2/modify)                       | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Move               | [`odrl:move`](http://www.w3.org/ns/odrl/2/move)                           | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Next Policy        | [`odrl:nextPolicy`](http://www.w3.org/ns/odrl/2/nextPolicy)               | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Obtain Consent     | [`odrl:obtainConsent`](http://www.w3.org/ns/odrl/2/obtainConsent)         | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Pay                | [`odrl:pay`](http://www.w3.org/ns/odrl/2/pay)                             | [`?`](a "Deprecated, but not explicitly Non-Normative.")        | ✅          | ✅         |                  | `odrl:compensate`   |
| Play               | [`odrl:play`](http://www.w3.org/ns/odrl/2/play)                           | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Present            | [`odrl:present`](http://www.w3.org/ns/odrl/2/present)                     | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Preview            | [`odrl:preview`](http://www.w3.org/ns/odrl/2/preview)                     | [`?`](a "Deprecated, but not explicitly Non-Normative.")         | ✅          | ✅         |                  |                     |
| Print              | [`odrl:print`](http://www.w3.org/ns/odrl/2/print)                         | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Read               | [`odrl:read`](http://www.w3.org/ns/odrl/2/read)                           | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Reproduce          | [`odrl:reproduce`](http://www.w3.org/ns/odrl/2/reproduce)                 | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Review Policy      | [`odrl:reviewPolicy`](http://www.w3.org/ns/odrl/2/reviewPolicy)           | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Secondary Use      | [`odrl:secondaryUse`](http://www.w3.org/ns/odrl/2/secondaryUse)           | [`?`](a "Deprecated, but not explicitly Non-Normative.")         | ✅          | ✅         |                  |                     |
| Sell               | [`odrl:sell`](http://www.w3.org/ns/odrl/2/sell)                           | ❌         | ❌          | ✅         | `odrl:transfer`  |                     |
| Share              | [`odrl:share`](http://www.w3.org/ns/odrl/2/share)                         | [`?`](a "Deprecated, but not explicitly Non-Normative.")        | ✅          | ✅         |                  | `cc:Sharing`        |
| Share-alike        | [`odrl:shareAlike`](http://www.w3.org/ns/odrl/2/shareAlike)               | [`?`](a "Deprecated, but not explicitly Non-Normative.")        | ✅          | ✅         |                  | `cc:ShareAlike`     |
| Stream             | [`odrl:stream`](http://www.w3.org/ns/odrl/2/stream)                       | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Synchronize        | [`odrl:synchronize`](http://www.w3.org/ns/odrl/2/synchronize)             | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Text-to-speech     | [`odrl:textToSpeech`](http://www.w3.org/ns/odrl/2/textToSpeech)           | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Transfer Ownership | [`odrl:transfer`](http://www.w3.org/ns/odrl/2/transfer)                   | ✅         | ❌          | ✅         |                  |                     |
| Transform          | [`odrl:transform`](http://www.w3.org/ns/odrl/2/transform)                 | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Translate          | [`odrl:translate`](http://www.w3.org/ns/odrl/2/translate)                 | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Uninstall          | [`odrl:uninstall`](http://www.w3.org/ns/odrl/2/uninstall)                 | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Use                | [`odrl:use`](http://www.w3.org/ns/odrl/2/use)                             | ✅         | ❌          | ✅         |                  |                     |
| Watermark          | [`odrl:watermark`](http://www.w3.org/ns/odrl/2/watermark)                 | ❌         | ❌          | ✅         | `odrl:use`       |                     |
| Write              | [`odrl:write`](http://www.w3.org/ns/odrl/2/write)                         | [`?`](a "Deprecated, but not explicitly Non-Normative.")         | ✅          | ✅         |                  | `odrl:modify`       |
| Write to           | [`odrl:writeTo`](http://www.w3.org/ns/odrl/2/writeTo)                     | [`?`](a "Deprecated, but not explicitly Non-Normative.")         | ✅          | ✅         |                  | `odrl:modify`       |

### Exact match and included in support

Support for `skos:ExactMatch` and `odrl:includedIn` is provided through inferences using [simple Notation3 rules](#inferences-to-be-cached) (which are [cached](../ODRL-Evaluator/rules/odrl-voc-inferences.ttl))
They are then supported during the evaluation by rules that also looks at these properties. 
The rules for these can be found [here](#inferences-for-the-report)


#### Inferences to be cached

Following rules are executed to add te cached inference to odrl voc.
```n3
# exact match rule
{
    ?thing skos:exactMatch ?otherThing .
} =>
{
    ?otherThing skos:exactMatch ?thing .
}.
# exact match rule + inference of includedIN
{
    ?action skos:exactMatch ?otherAction;
        odrl:includedIn ?includedAction .
} =>
{
    ?otherAction skos:exactMatch ?action ;
        odrl:includedIn ?includedAction .
}.
# Transitivity includedIn
{
    ?actionX odrl:includedIn ?actionY.
    ?actionY odrl:includedIn ?actionZ .
} => { 
    ?actionX odrl:includedIn ?actionZ .
}.
```

#### Inferences for the report

Notation3 rule for `odrl:includedIn` (note that this requires the ODRL voc and some inferences due to transitivity)
```n3
{
   ?ruleReport a report:PermissionReport ;
       report:rule ?permission ;
       report:ruleRequest ?requestPermission .

   ?permission odrl:action ?x .

    ?x a odrl:Action;
        odrl:includedIn ?action .

   ?requestPermission odrl:action ?requestedAction .
   ?action log:equalTo ?requestedAction .
   ( ?action ) :getUUID ?urnUuid .
}
=> 
{
   ?ruleReport report:premiseReport ?urnUuid .
   ?urnUuid a report:ActionReport ;
       report:satisfactionState report:Satisfied .
} .
```

Notation3 rule  for `skos:ExactMatch` (note that this requires the ODRL voc and some inferences due to transitivity)
```n3
{
   ?ruleReport a report:PermissionReport ;
       report:rule ?permission ;
       report:ruleRequest ?requestPermission .

   ?permission odrl:action ?x .

    ?x a odrl:Action;
        skos:exactMatch ?action .

   ?requestPermission odrl:action ?requestedAction .
   ?action log:equalTo ?requestedAction .
   ( ?action ) :getUUID ?urnUuid .
}
=> 
{
   ?ruleReport report:premiseReport ?urnUuid .
   ?urnUuid a report:ActionReport ;
       report:satisfactionState report:Satisfied .
} .
```

## Asset

Support for `odrl:Asset` is provided by either exact matching of the request with the policy or by doing an inference over the Asset Collection.
For doing inferences over Asset Collection, these collections must be supplied by the state of the world. 
When this is not the case, no satisfaction of this constraint can be obtained.

To check for membership in an Asset Collection, the `odrl:partOf` property is used as stated in [ODRL IM §2.2.2](https://www.w3.org/TR/odrl-model/#asset-partof).

Example rule of Asset when Asset Collection is present:
Note that the rule is a bit odd. This was also pointed out by [Joshua Corenjo](https://github.com/joshcornejo) in a [github issue](https://github.com/w3c/odrl/issues/64#issue-2572434743).

```n3
{
   ?ruleReport a report:PermissionReport ;
       report:rule ?permission ;
       report:ruleRequest ?requestPermission ;
       report:premiseReport ?targetReport .

   ?targetReport a report:TargetReport .     
   
   # rule containing asset collection
   ?permission odrl:target ?iri .

   # asset collection in policy rule
   ?iri a odrl:AssetCollection.
   ?iri odrl:source ?assetCollection .
   
   # requested asset (resource)
   ?requestPermission odrl:target ?resourceInCollection .

   # from state of the world
   ?resourceInCollection odrl:partOf ?assetCollection .
}
=> 
{
   ?targetReport report:satisfactionState report:Satisfied .
} .
```

## Party

This is analogous to how [Asset](#asset) evaluation works.

Support for `odrl:Party` is provided by either exact matching of the request with the policy or by doing an inference over the Party Collection.
For doing inferences over Party Collection, these collections must be supplied by the state of the world. 
When this is not the case, no satisfaction of this constraint can be obtained.

To check for membership in an Party Collection, the `odrl:partOf` property is used as stated in [ODRL IM §2.2.2](https://www.w3.org/TR/odrl-model/#party-partof).

Example rule of Party when Party Collection is present:

```n3
{
   ?ruleReport a report:PermissionReport ;
       report:rule ?permission ;
       report:ruleRequest ?requestPermission ;
       report:premiseReport ?partyReport .

   ?partyReport a report:PartyReport .

   # rule containing party collection
   ?permission odrl:assignee ?iri .

   # party collection in policy rule
   ?iri a odrl:PartyCollection.
   ?iri odrl:source ?partyCollection .

   # requested party
   ?requestPermission odrl:assignee ?requestedParty .

   # from state of the world
   ?requestedParty odrl:partOf ?partyCollection .
}
=> 
{
   ?partyReport report:satisfactionState report:Satisfied .
} .
```

## Constraints

Rules that implement the constraints can be found in [`constraints.n3`](../ODRL-Evaluator/rules/constraints.n3).

### Refinements

This is handled similar to constraints.

No support yet. Documentation and implementation is still required.

### Logical

Columns of the table elaborated:
- Label: The `rdfs:label` as defined by [ODRL](https://www.w3.org/TR/odrl-vocab)
- Identifier: The ODRL unique identifier for the term
- Normative: Whether it is part of the official standard or not ([hint](https://stackoverflow.com/questions/6420522/what-does-normative-and-non-normative-mean-in-reference-to-xml))
- Deprecated: An element that has been outdated by newer constructs (sometimes superseded by newer version).
- Supported: Whether the ODRL Evaluator supports it.


| Label        | Identifier                                                    | Normative | Deprecated | Supported |
| ------------ | ------------------------------------------------------------- | --------- | ---------- | --------- |
| Only One     | [`odrl:xone`](http://www.w3.org/ns/odrl/2/xone)               | ✅         | ❌          | ✅         |
| And          | [`odrl:and`](http://www.w3.org/ns/odrl/2/and)                 | ✅         | ❌          | ✅         |
| And Sequence | [`odrl:andSequence`](http://www.w3.org/ns/odrl/2/andSequence) | ✅         | ❌          | ✅         |
| Or           | [`odrl:or`](http://www.w3.org/ns/odrl/2/or)                   | ✅         | ❌          | ✅         |

### Operators

Columns of the table elaborated:
- Label: The `rdfs:label` as defined by [ODRL](https://www.w3.org/TR/odrl-vocab)
- Identifier: The ODRL unique identifier for the term
- Normative: Whether it is part of the official standard or not ([hint](https://stackoverflow.com/questions/6420522/what-does-normative-and-non-normative-mean-in-reference-to-xml))
- Deprecated: An element that has been outdated by newer constructs (sometimes superseded by newer version).
- Supported: Whether the ODRL Evaluator supports it.

| Label                    | Identifier                                              | Normative | Deprecated | Supported |
| ------------------------ | ------------------------------------------------------- | --------- | ---------- | --------- |
| Equal to                 | [`odrl:eq`](http://www.w3.org/ns/odrl/2/eq)             | ✅         | ❌          | ✅         |
| Greater than             | [`odrl:gt`](http://www.w3.org/ns/odrl/2/gt)             | ✅         | ❌          | ✅         |
| Greater than or equal to | [`odrl:gteq`](http://www.w3.org/ns/odrl/2/gteq)         | ✅         | ❌          | ✅         |
| Has part                 | [`odrl:hasPart`](http://www.w3.org/ns/odrl/2/hasPart)   | ✅         | ❌          | ❌         |
| Is a                     | [`odrl:isA`](http://www.w3.org/ns/odrl/2/isA)           | ✅         | ❌          | ❌         |
| Is all of                | [`odrl:isAllOf`](http://www.w3.org/ns/odrl/2/isAllOf)   | ✅         | ❌          | ❌         |
| Is any of                | [`odrl:isAnyOf`](http://www.w3.org/ns/odrl/2/isAnyOf)   | ✅         | ❌          | ❌         |
| Is none of               | [`odrl:isNoneOf`](http://www.w3.org/ns/odrl/2/isNoneOf) | ✅         | ❌          | ❌         |
| Is part of               | [`odrl:isPartOf`](http://www.w3.org/ns/odrl/2/isPartOf) | ✅         | ❌          | ❌         |
| Less than                | [`odrl:lt`](http://www.w3.org/ns/odrl/2/lt)             | ✅         | ❌          | ✅         |
| Less than or equal to    | [`odrl:lteq`](http://www.w3.org/ns/odrl/2/lteq)         | ✅         | ❌          | ✅         |
| Not equal to             | [`odrl:neq`](http://www.w3.org/ns/odrl/2/neq)           | ✅         | ❌          | ✅         |

### Left Operands
Columns of the table elaborated:
- Label: The `rdfs:label` as defined by [ODRL](https://www.w3.org/TR/odrl-vocab)
- Identifier: The ODRL unique identifier for the term
- Normative: Whether it is part of the official standard or not ([hint](https://stackoverflow.com/questions/6420522/what-does-normative-and-non-normative-mean-in-reference-to-xml))
- Deprecated: An element that has been outdated by newer constructs (sometimes superseded by newer version).
- Supported: Whether the ODRL Evaluator supports it.

| Label                             | Identifier                                                                              | Normative | Deprecated | Supported |
| --------------------------------- | --------------------------------------------------------------------------------------- | --------- | ---------- | --------- |
| Absolute Asset Position           | [`odrl:absolutePosition`](http://www.w3.org/ns/odrl/2/absolutePosition)                 | ❌         | ❌          | ❌         |
| Absolute Asset Size               | [`odrl:absoluteSize`](http://www.w3.org/ns/odrl/2/absoluteSize)                         | ❌         | ❌          | ❌         |
| Absolute Spatial Asset Position   | [`odrl:absoluteSpatialPosition`](http://www.w3.org/ns/odrl/2/absoluteSpatialPosition)   | ✅         | ❌          | ❌         |
| Absolute Temporal Asset Position  | [`odrl:absoluteTemporalPosition`](http://www.w3.org/ns/odrl/2/absoluteTemporalPosition) | ✅         | ❌          | ❌         |
| Count                             | [`odrl:count`](http://www.w3.org/ns/odrl/2/count)                                       | ❌         | ❌          | ❌         |
| Datetime                          | [`odrl:dateTime`](http://www.w3.org/ns/odrl/2/dateTime)                                 | ❌         | ❌          | ✅         |
| Delay Period                      | [`odrl:delayPeriod`](http://www.w3.org/ns/odrl/2/delayPeriod)                           | ❌         | ❌          | ❌         |
| Delivery Channel                  | [`odrl:deliveryChannel`](http://www.w3.org/ns/odrl/2/deliveryChannel)                   | ❌         | ❌          | ❌         |
| Device                            | [`odrl:device`](http://www.w3.org/ns/odrl/2/device)                                     | ✅         | ✅          | ❌         |
| Elapsed Time                      | [`odrl:elapsedTime`](http://www.w3.org/ns/odrl/2/elapsedTime)                           | ❌         | ❌          | ❌         |
| Event                             | [`odrl:event`](http://www.w3.org/ns/odrl/2/event)                                       | ❌         | ❌          | ❌         |
| File Format                       | [`odrl:fileFormat`](http://www.w3.org/ns/odrl/2/fileFormat)                             | ❌         | ❌          | ❌         |
| Industry Context                  | [`odrl:industry`](http://www.w3.org/ns/odrl/2/industry)                                 | ❌         | ❌          | ❌         |
| Language                          | [`odrl:language`](http://www.w3.org/ns/odrl/2/language)                                 | ❌         | ❌          | ❌         |
| Media Context                     | [`odrl:media`](http://www.w3.org/ns/odrl/2/media)                                       | ❌         | ❌          | ❌         |
| Metered Time                      | [`odrl:meteredTime`](http://www.w3.org/ns/odrl/2/meteredTime)                           | ❌         | ❌          | ❌         |
| Payment Amount                    | [`odrl:payAmount`](http://www.w3.org/ns/odrl/2/payAmount)                               | ❌         | ❌          | ❌         |
| Asset Percentage                  | [`odrl:percentage`](http://www.w3.org/ns/odrl/2/percentage)                             | ❌         | ❌          | ❌         |
| Product Context                   | [`odrl:product`](http://www.w3.org/ns/odrl/2/product)                                   | ❌         | ❌          | ❌         |
| Purpose                           | [`odrl:purpose`](http://www.w3.org/ns/odrl/2/purpose)                                   | ❌         | ❌          | ❌         |
| Recipient                         | [`odrl:recipient`](http://www.w3.org/ns/odrl/2/recipient)                               | ❌         | ❌          | ❌         |
| Relative Asset Position           | [`odrl:relativePosition`](http://www.w3.org/ns/odrl/2/relativePosition)                 | ❌         | ❌          | ❌         |
| Relative Asset Size               | [`odrl:relativeSize`](http://www.w3.org/ns/odrl/2/relativeSize)                         | ❌         | ❌          | ❌         |
| Relative Spatial Asset Position   | [`odrl:relativeSpatialPosition`](http://www.w3.org/ns/odrl/2/relativeSpatialPosition)   | ✅         | ❌          | ❌         |
| Relative Temporal Asset Position  | [`odrl:relativeTemporalPosition`](http://www.w3.org/ns/odrl/2/relativeTemporalPosition) | ✅         | ❌          | ❌         |
| Rendition Resolution              | [`odrl:resolution`](http://www.w3.org/ns/odrl/2/resolution)                             | ❌         | ❌          | ❌         |
| Geospatial Named Area             | [`odrl:spatial`](http://www.w3.org/ns/odrl/2/spatial)                                   | ❌         | ❌          | ❌         |
| Geospatial Coordinates            | [`odrl:spatialCoordinates`](http://www.w3.org/ns/odrl/2/spatialCoordinates)             | ✅         | ❌          | ❌         |
| System                            | [`odrl:system`](http://www.w3.org/ns/odrl/2/system)                                     | ✅         | ✅          | ❌         |
| System Device                     | [`odrl:systemDevice`](http://www.w3.org/ns/odrl/2/systemDevice)                         | ✅         | ❌          | ❌         |
| Recurring Time Interval           | [`odrl:timeInterval`](http://www.w3.org/ns/odrl/2/timeInterval)                         | ❌         | ❌          | ❌         |
| Unit Of Count                     | [`odrl:unitOfCount`](http://www.w3.org/ns/odrl/2/unitOfCount)                           | ❌         | ❌          | ❌         |
| Version                           | [`odrl:version`](http://www.w3.org/ns/odrl/2/version)                                   | ❌         | ❌          | ❌         |
| Virtual IT Communication Location | [`odrl:virtualLocation`](http://www.w3.org/ns/odrl/2/virtualLocation)                   | ❌         | ❌          | ❌         |

In ODRL there is some notion about broader and narrower concepts (using skos notation).
To the best of our knowledge, no additional reasoning support can be added.

- `odrl:spatial` 
	- broader (transitive) than `odrl:spatialCoordinates`
- `odrl:absolutePosition`
	- broader (transitive) than `odrl:absoluteSpatialPosition`
	- broader (transitive) than `odrl:absoluteTemporalPosition`
- `odrl:relativePosition`
	- broader (transitive) than `odrl:relativeSpatialPosition`
	- broader (transitive) than `odrl:relativeTemporalPosition`