# ODRL Evaluator

## v0.3.0

### New features

- Support for the **Dynamic ODRL Specification** introduced in [**Interoperable and Continuous Usage Control Enforcement in Dataspaces**](https://ceur-ws.org/Vol-3705/paper10.pdf) (for more information, checkout https://w3id.org/force/odrl3proposal)
  - Creation of the `materializePolicy` in `src/evaluator/DynamicConstraint.ts`
- Creation of vocabulary util for common vocabularies (including ODRL)
  - `util/Vocabularies.ts`
- Support for local [eye](https://github.com/eyereasoner/eye) version on windows machines
  - update to `src/reasoner/EyeReasoner.ts`

## v0.2.2

### New features

- Add integration tests based on the [ODRL Test Suite](https://w3id.org/force/test-suite) to ensure correctness. 

## v0.2.1

Introduces a breaking change regarding the identifiers of produced Compliance Report:

Generating compliance reports now uses `https://w3id.org/force/compliance-report#`  as prefix instead of `http://example.com/report/temp/`.

## v0.2.0

### New features

- Support browser support:
  - Adding `src/index.browser.ts` with typescript classes that do not rely on [NodeJS](https://nodejs.org/en) specific libraries or functions (such as `fs` for reading files).
  - In `package.json` there is now a `browser` property which ensures browsers use the correct index file for this package.

## v0.1.1

### New features

- Introduction of tests via [Jest](https://jestjs.io/).
- Introduction of Continious Integration (CI) using [Github Actions](https://github.com/features/actions).

## v0.1.0

### New features

- The ODRL Evaluator now supports all [ODRL Logical Operands](https://www.w3.org/TR/odrl-model/#constraint-logical).

## v0.0.1

First release of the ODRL Evaluator that produces a [Compliance Report](https://w3id.org/force/compliance-report) from an [ODRL Policy](https://www.w3.org/TR/odrl-model/#policy) and the [State of the World](https://w3id.org/force/sotw).

