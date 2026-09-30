import { reports, testcases, policies, sotws, requests } from "../util/test-suite/Source"
import { EyelingReasoner, ODRLEngineMultipleSteps, ODRLEvaluator, blanknodeify } from "../../src";
import { Quad } from "n3";
import "jest-rdf";

const engines = [
    {
        name: 'Eyeling Reasoner',
        evaluator: new ODRLEvaluator(new ODRLEngineMultipleSteps({ reasoner: new EyelingReasoner() }))
    },
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
        testcases.forEach(testCase => {
            it(testCase.label, async () => {
                const report = await odrlEvaluator.evaluate(
                    policies.get(testCase.policyID)!.data,
                    requests.get(testCase.requestIdentifier)!.data,
                    sotws.get(testCase.sotwIdentifier)!.data,
                );

                expect(blanknodeify(report as any as Quad[])).toBeRdfIsomorphic(
                    reports.get(testCase.expectedReportIdentifier)!.data
                );
            });
        });            
            
        }
    );
});