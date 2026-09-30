import { reports, testcases, policies, sotws, requests } from "../util/test-suite/Source"
import { EyelingReasoner, ODRLEngineMultipleSteps, ODRLEvaluator, blanknodeify } from "../../src";
import { Quad } from "n3";
import "jest-rdf";

const excludedTestcases = [
    // due to duties being required, which we do not support currently
    "testcase_059_nonset",
    "testcase_060_fulfilled",
    "testcase_061_violated",
    "testcase_065_alice",
    "testcase_066_bob_sell",
    "testcase_067_alice_past",
    "testcase_068_bob_write_y_past",
    // they take too long, but I can easily add them
    "testcase_062_big_policy",
    "testcase_063_big_policy_OoO",
    "testcase_064_big_policy_past",
    // requires proper atomizer
    "testcase_080_composite_read_happy",
    "testcase_081_composite_sell_bad",
    "testcase_082_compact_happy",
    "testcase_083_compact_bad",
];

const engines = [
    // apparantly eyeling is slower for the bigger rdf input :o (weekday testcases)
    // {
    //     name: 'Eyeling Reasoner',
    //     evaluator: new ODRLEvaluator(new ODRLEngineMultipleSteps({ reasoner: new EyelingReasoner() }))
    // },
    {
        name: 'Default Engine',
        evaluator: new ODRLEvaluator(new ODRLEngineMultipleSteps())
    }
];

// Loop over the engines
engines.forEach(({ name, evaluator }) => {
    describe(`The ODRL evaluator with ${name} succeeds following test case`, () => {
        const odrlEvaluator = evaluator;
        
        // loop over test cases
        testcases
            .filter(testCase => !excludedTestcases.includes(testCase.identifier))
            .forEach(testCase => {
                it(testCase.label, async () => {
                    const report = await odrlEvaluator.evaluate(
                        policies.get(testCase.policyID)!.data,
                        requests.get(testCase.requestIdentifier)!.data,
                        sotws.get(testCase.sotwIdentifier)!.data,
                    );

                    expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(
                        blanknodeify(reports.get(testCase.expectedReportIdentifier)!.data as any as Quad[])
                    );
                });
        });            
            
        }
    );
});