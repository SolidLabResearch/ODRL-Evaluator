# TODO list

## Creating new test cases

- [ ] checking whether evaluation also work when having xsd:date instead of xsd:dateTime
  - remove comments in `constraint.n3`
- [ ] Test cases for zero or one purpose
  - Ensure no DANGLING context is possible -> see rules related to purpose in `constraint.n3`
    - make a test case for that?
    - 
```n3
?requestPermission sotw:context ?requestContextConstraint .
?requestContextConstraint odrl:leftOperand odrl:purpose . 
```

MUST becom

```n3
?requestPermission a sotw:EvaluationRequest. 
?requestPermission sotw:context ?requestContextConstraint .
?requestContextConstraint odrl:leftOperand odrl:purpose . 
```

## Other

- [ ] Do a github release for version 0.4
- [ ] fix [issue 3](https://github.com/SolidLabResearch/ODRL-Evaluator/issues/3) -> strange behaviour in action reports for compact rules
  - [ ] perhaps also test whether I can solve compact policies as well as that is just derivation
- [ ] fix [issue 8](https://github.com/SolidLabResearch/ODRL-Evaluator/issues/8) -> strange behaviour in
- [ ] implement `odrl:anyOf`
  - checkout other operators
  - Make a release checklist template
- [ ] start drafting roadmap for proper upgrade to new sotw and evaluation request
  - preferably this release?

### To be discussed with Beatriz

- [ ] update policies in https://github.com/besteves4/pacsoi-policies
  - had to explicitly add `odrl:Permission` to the permission of the policies -> perhaps add code to infer this (making it future proof)
  - Recommend using proper identifiers everywhere due the the policy reports
    - Atomizer of Ruben D fails when blank nodes are used for odrl Rules. As a result, so does my `Atomizer` class.

- Does it make sense to request access for multiple purposes?

