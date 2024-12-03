# ODRL Evaluator

The ODRL Evaluator is open-source software that realizes the evaluation of an ODRL policy.
It does so by generating a Compliance Report, that states clearly for each policy which rules are active or not and the reason why through the satisfaction state of its constraints.

The definition of an ODRL evaluator as defined by the [ODRL Information Model 2.2](https://www.w3.org/TR/odrl-model/#terminology):
> A system that determines whether the Rules of an ODRL Policy expression have meet their intended action performance.

The [model for a Compliance Report](./Compliance-Report.md) is based of the [ODRL Formal Semantics specification](https://w3c.github.io/odrl/formal-semantics/) created by the [W3C ODRL Community Group](https://www.w3.org/community/odrl/) (CG) (also see [ODRL CG](https://www.w3.org/community/odrl/) for all reports and drafts developed by the CG).

## How does the ODRL Evaluator work?
The evaluation relies on 3 inputs:
- An ODRL Policy
- An ODRL Request
- The state of the world

These are all represented as a list of [Quad](http://rdf.js.org/data-model-spec/#quad-interface)s.

The ODRL Evaluator performs several steps to validate and clean the input before it actually evaluates the policy.\*
1. **Ensure triples**: Validate that the input does not contain quads. The evaluator does nothing with quads and we want to ensure that they are removed as to not provide ambiguity.
2. **Validation**: Validate that the ODRL Policy and ODRL Request conform to a valid SHACL shape that follows the [ODRL Information Model standard](https://www.w3.org/TR/odrl-model/).
3. **Cardinality check**: Verify that there is at least one ODRL policy present.
4. **State of the world check**: Verify that the state of the world contains the minimum required elements (such as the current time).
5. **Policy decomposition**: Guarantee that all the policies (and requests) are [atomic](https://www.w3.org/TR/odrl-model/#composition).

After these steps, the actual evaluation happens which generates the compliance report(s) with an [ODRL engine](#odrl-engine). 
The default ODRL Engine is [`ODRLEngine`](#odrlengine).
Thus, if the user wants a faster evaluation and is sure that all checks are not required, they could directly use the ODRL engine (at their own risk).

*\*Following steps are not implemented yet, but should be: validation, cardinality, SOTW, policy decomposition*
## Running the ODRL Evaluator
Following code shows how to run the ODRL Evaluator.
```ts
import { ODRLEvaluator} from './ODRL-Evaluator'

async function main(){
    const policy = [] // an ODRL policy, represented by a list of quads
    const request = [] // an ODRL request, represented by a list of quads
    const stateOfTheWorld = [] // the state of the world, represented by a list of quads

    const evaluator = new ODRLEvaluator();

    const report = await evaluator.evaluate(policy, request, stateOfTheWorld); // compliance report(s), represented by a list of quads
}

main()
```
Note that the policy, request and state of the world is left empty. 
Due to the check, running this code will result in an error.

For an example that does also parse an ODRL Policy, ODRL Request and the state of the world, checkout the typescript file [`test-n3-evaluator.ts`](../demo/test-n3-evaluator.ts).

## ODRL Engine
The  ODRL Engine is the workhorse of the ODRL Evaluator. It is the component that computes the Policy Compliance Report based on the input, a list of quads.
For that, it assumes that the input is correct. As a result using this component stand-alone will be more efficient. Due to the lack of all those checks, however, it might crash or give wrong results. So use at your own risk!

All ODRL Engines (which can be passed to an Evaluator as argument) follow the `Engine` interface:
```ts
interface Engine {
    evaluate(input: Quad[]): Promise<Quad[]>;
}
```

Three engines are created at this point that all implement the interface `Engine`
- `ODRLN3Engine`: A reasoner that can be used to experiment. 
	- To construct it, you need to provide a [Notation3](https://w3c.github.io/N3/spec/) reasoner that conforms to the `Reasoner` interface and Notation3 rules, serialized as `string`.
- `ODRLEngine`: Extension of the `ODRLN3Engine` that requires no arguments. 
	- It provides as Notation3 reasoner the [EyeJs](https://github.com/eyereasoner/eye-js) Reasoner (which conforms to the `Reasoner` interface) and uses `simpleRules.n3` as the rule set.
- `ODRLEngineMultipleSteps`: Extension of the `ODRLN3Engine` that requires no arguments.
	- It uses Notation3 rules and reasoner (EyeJS)
	- The difference with `ODRLEngine` is that multiple steps of reasoning are used. With one step and all rules combined, it was possible with the temporal constraint (Example 2) policy evaluation to be both `Active` and `Inactive` at the same time ([source](https://github.com/woutslabbinck/UCR-test-suite/blob/b641ec74a85d1555d13d9599f140667e60846b6f/ODRL-Evaluator/rules/faulty/README.md)).
		- Multiple steps: multiple rounds of reasoning
			- the conclusion of the reasoning engine is iteratively added to the input of the next round
			- Each round has different rules. It is only in the last that activation of a Rule Report is calculated as all constraints were already calculated in the prior round(s).

The next sections go more in depth for each engine.

### ODRLN3Engine
This engine offers the most flexibility as a custom reasoner and rule set can be provided.
Early local experiments have proved that this can have a big impact on performance. 
E.g. running a local version of eye is more efficient than the JavaScript one.

An example snippet to create a reasoner using a local version of EYE and run it
```ts
import { ODRLN3Engine, Reasoner, EyeReasoner } from './ODRL-Evaluator'

const input = [] // an ODRL policy, ODRL request and state of the world, represented by a list of quads

const rules: string = "" // your Notation3 rules in .n3 format
const reasoner: Reasoner = new EyeReasoner('/usr/local/bin/eye', ["--quiet", "--nope", "--pass-only-new"]) // A reasoner that is an extension to the abstract `Reasoner` class

const engine = new ODRLN3Engine(reasoner, rules);

const report = await engine.evaluate(input);
```
This configuration requires a local version of eye that can be called with `/usr/local/bin/eye` in a command prompt (Terminal, powershell, ...).

### ODRLEngine
The default ODRL Engine uses under the hood [Notation3](https://w3c.github.io/N3/spec/) rules and the [EYE reasoner](https://github.com/eyereasoner/eye) to evaluate the policies.

It is  an extension of the [`ODRLN3Engine`](#ODRLN3Engine), has no constructor arguments and is configured in the following manner:
- it uses the [eyereasoner](https://github.com/eyereasoner/eye-js), a distribution of EYE reasoner in the JavaScript ecosystem using Webassembly
- it uses the notation rules located at [`ODRL-Evaluator/rules/simpleRules.n3`](../ODRL-Evaluator/rules/simpleRules.n3)

```ts
import { ODRLEngine} from './ODRL-Evaluator'

const input = [] // an ODRL policy, ODRL request and state of the world, represented by a list of quads

const engine = new ODRLEngine()

const report = await engine.evaluate(input);
```

### ODRLEngineMultipleSteps
This version is also an extension of the [`ODRLN3Engine`](#ODRLN3Engine), has also no constructor arguments and does two rounds of reasoning.

In the first round, all the satisfaction states and general body of the report are evaluated with a given set of rules.
The second round's input quads consist of the first round's output combined with the original input. 
The goal of the second round is to calculate the activation state of a rule report.

As it is an extension of the [`ODRLN3Engine`](#ODRLN3Engine) and thus an implementation of the `Engine` interface, calling it is done analogues as the other engines.

Here is a snippet of how it is used:
```ts
import { ODRLEngineMultipleSteps} from './ODRL-Evaluator'

const input = [] // an ODRL policy, ODRL request and state of the world, represented by a list of quads

const engine = new ODRLEngineMultipleSteps()

const report = await engine.evaluate(input);
```
