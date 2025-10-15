# TODO list

## Creating new test cases

- [x] checking whether evaluation also work when having xsd:date instead of xsd:dateTime
  - [x] remove comments in `constraint.n3`
  - [ ] Make actual test case for (ODRL-test-suite)
- [ ] Test cases for zero or one purpose
  - Ensure no DANGLING context is possible -> see rules related to purpose in `constraint.n3`
    - make a test case for that?
```n3
?requestPermission sotw:context ?requestContextConstraint .
?requestContextConstraint odrl:leftOperand odrl:purpose . 
```

MUST become

```n3
?requestPermission a sotw:EvaluationRequest. 
?requestPermission sotw:context ?requestContextConstraint .
?requestContextConstraint odrl:leftOperand odrl:purpose . 
```

Both created at: `test/ODRL-newTestCases.test.ts`

## Other

- [x] Do a github release for version 0.4
- [ ] fix [issue 3](https://github.com/SolidLabResearch/ODRL-Evaluator/issues/3) -> strange behaviour in action reports for compact rules
  - [ ] perhaps also test whether I can solve compact policies as well as that is just derivation
- [x] fix [issue 8](https://github.com/SolidLabResearch/ODRL-Evaluator/issues/8) -> collection
- [x] implement `odrl:anyOf`
- [x] implement `odrl:isNoneOf`
- [x] implement `odrl:anyOf`
- [x] checkout other operators
  - Needs discussion
    - `odrl:isAllOf`: With how we evaluate right now, `odrlisAllOf` does not make a lot of sense
    - `odrl:isPartOf`: what does containment mean? for Target and Party collections, that is clear (`odrl:partOf`)
    - `odrl:hasPart`: what does containment mean? for Target and Party collections, that is clear (`odrl:partOf`)
    - [x] `odrl:isA`: What does *is an instance* mean for right operands?
      - https://besteves4.github.io/odrl-access-control-profile/oac.html#x5-1-preference-policy
  - Needs implementation and test cases
- [x] Make a release checklist template
- [x] start drafting roadmap for proper upgrade to new sotw and evaluation request
  - preferably this release?

### To be discussed with Beatriz

- [ ] update policies in https://github.com/besteves4/pacsoi-policies
  - had to explicitly add `odrl:Permission` to the permission of the policies -> perhaps add code to infer this (making it future proof)
  - Recommend using proper identifiers everywhere due the the policy reports
    - Atomizer of Ruben D fails when blank nodes are used for odrl Rules. As a result, so does my `Atomizer` class.

### Addressed
- Does it make sense to request access for multiple purposes?
  - A: Right now, it does not. You want to be very specific when you ask for data. You don't want the ambiguity
- For now, `odrl:hasPart` does not make sense:
  - The current sotw and evaluation request assumes a cardinality of one value to materialize for a left operand. Thus far, no examples have been found where a left operand contains multiple properties.
    - this was the assumption for the state of the world anyway, because we want a deterministic way to get **one** value (though programmable) for the Left Operand
- `odrl:isAllOf`: A set-based operator indicating that a given value is all of the right operand of the Constraint.
  - It does not make sense: we have not found a value that could do that
    - NOTE: perhaps it would be possible if the meaning of the constraint is
      - A set-based operator indicating that a given value is **AN INSTANCE OF** all of the right operand of the Constraint.
- `odrl:isPartOf`: There is no generic way to have Collections. Perhaps this operator could be useful in profiles.
  - There is notion of collections with parties and assets, though this is handled already through the party and asset properties of a rule.