import { Parser, Store } from "n3";
import { ActivationState, parseComplianceReport, SatisfactionState } from "../../../src";
import { AtomizedEvaluatedRule, Atomizer } from "../../../src/evaluator/Atomizer";
import { ODRLEngineMultipleSteps } from "../../../src/evaluator/Engine";
import { ODRLEvaluator } from "../../../src/evaluator/Evaluate";
import { EyeReasoner } from "../../../src/reasoner/EyeReasoner";
import { ODRL, RDF, REPORT } from "../../../src/util/Vocabularies";
import { countSatisfiedPremises } from "../../util/ReportTest";

const normalPolicy = `
@prefix ex: <http://example.org/>.
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

ex:usagePolicy1 a odrl:Agreement ;
  odrl:permission ex:permission1 .

ex:permission1 a odrl:Permission ;
  odrl:action odrl:read ;
  odrl:target <http://localhost:3000/alice/other/resource.txt> ;
  odrl:assignee <https://both.pod.knows.idlab.ugent.be/profile/card#me> .
`
const compactPolicy = `
@prefix ex: <http://example.org/>.
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

ex:usagePolicy1 a odrl:Agreement ;
  odrl:permission ex:permission1 .

ex:permission1 a odrl:Permission ;
  odrl:action odrl:modify, odrl:read ;
  odrl:target <http://localhost:3000/alice/other/resource.txt> ;
  odrl:assignee <https://both.pod.knows.idlab.ugent.be/profile/card#me> .
`
const compactPolicyTwoRules = `
@prefix ex: <http://example.org/>.
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

ex:usagePolicy1 a odrl:Agreement ;
  odrl:permission ex:permission1, ex:permission2 .

ex:permission1 a odrl:Permission ;
  odrl:action odrl:modify, odrl:read ;
  odrl:target <http://localhost:3000/alice/other/resource.txt> ;
  odrl:assignee <https://both.pod.knows.idlab.ugent.be/profile/card#me> .

ex:permission2 a odrl:Permission ;
  odrl:action odrl:modify ;
  odrl:target <http://localhost:3000/alice/other/resource.txt> ;
  odrl:assignee <https://modify.pod.knows.idlab.ugent.be/profile/card#me> .
`
// Two policies, one compact another not compact
const twoPolicies = `
@prefix ex: <http://example.org/>.
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

ex:usagePolicy1 a odrl:Agreement ;
  odrl:permission ex:permission1 .

ex:permission1 a odrl:Permission ;
  odrl:action odrl:modify, odrl:read ;
  odrl:target <http://localhost:3000/alice/other/resource.txt> ;
  odrl:assignee <https://both.pod.knows.idlab.ugent.be/profile/card#me> .

<urn:uuid:95efe0e8-4fb7-496d-8f3c-4d78c97829bc> a odrl:Set;
    odrl:permission <urn:uuid:f5199b0a-d824-45a0-bc08-1caa8d19a001>.
<urn:uuid:f5199b0a-d824-45a0-bc08-1caa8d19a001> a odrl:Permission;
    odrl:action odrl:read;
    odrl:target ex:x;
    odrl:assignee ex:alice;
    odrl:assigner ex:zeno.
`
// Can Alice READ http://localhost:3000/alice/other/resource.txt
const evaluationRequest = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

<urn:ucp:policy:2a797ad7-232a-4e1f-853f-81388969e4a1> a odrl:Request;
    odrl:permission <urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef>.
<urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef> a odrl:Permission;
    odrl:action odrl:read;
    odrl:target <http://localhost:3000/alice/other/resource.txt>;
    odrl:assignee <https://both.pod.knows.idlab.ugent.be/profile/card#me>.
`

const sotw = `
@prefix temp: <http://example.com/request/>.
@prefix dct: <http://purl.org/dc/terms/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.

temp:currentTime dct:issued "2024-02-12T11:20:10.999Z"^^xsd:dateTime.
`

describe('The Atomizer class', () => {
    // const eye = new EyeReasoner('eye', ["--quiet", "--nope", "--pass-only-new"])
    const engine = new ODRLEngineMultipleSteps()
    const evaluator = new ODRLEvaluator(engine)

    const atomizer = new Atomizer();
    const parser = new Parser();
    const sotwQuads = parser.parse(sotw);
    const requestQuads = parser.parse(evaluationRequest);

    const compactPolicyID = "http://example.org/usagePolicy1";
    const secondPolicyID = "urn:uuid:95efe0e8-4fb7-496d-8f3c-4d78c97829bc";
    const permission1ID = 'http://example.org/permission1';
    const permission2ID = 'http://example.org/permission2';

    describe('atomize function', () => {

        it('does not have to atomize when atomic policies are given.', async () => {
            const policyQuads = parser.parse(normalPolicy);
            const atomizedRules = await atomizer.atomizePolicies(policyQuads);

            // normal policy has one rule
            expect(atomizedRules.length).toBe(1);

            const atomizedRule = atomizedRules[0];
            const policyStore = new Store(atomizedRule.atomizedRuleQuads);
            expect(atomizedRule.ruleID.value).toBe(permission1ID);
            expect(policyStore.getQuads(null, 'http://example.org/ns/derivedFrom', permission1ID, null).length).toBe(1);
            expect(policyStore.getSubjects(RDF.terms.type, ODRL.terms.Permission, null)[0].termType).toBe("BlankNode");
        })

        it('atomizes a policy with a compact rule.', async () => {
            const policyQuads = parser.parse(compactPolicy);
            const atomizedRules = await atomizer.atomizePolicies(policyQuads);

            // compact policy has one rule
            expect(atomizedRules.length).toBe(1);

            const atomizedRule = atomizedRules[0];
            const policyStore = new Store(atomizedRule.atomizedRuleQuads);
            expect(atomizedRule.ruleID.value).toBe(permission1ID);
            expect(policyStore.getQuads(null, 'http://example.org/ns/derivedFrom', permission1ID, null).length).toBe(2);
            expect(policyStore.getSubjects(RDF.terms.type, ODRL.terms.Permission, null)[0].termType).toBe("BlankNode");
        })

        it('atomizes a policy with a compact rule and a normal rule.', async () => {
            const policyQuads = parser.parse(compactPolicyTwoRules);
            const atomizedRules = await atomizer.atomizePolicies(policyQuads);

            // compact policy has one rule
            expect(atomizedRules.length).toBe(2);

            const atomizedRule = atomizedRules[0];
            const policyStore = new Store(atomizedRule.atomizedRuleQuads);
            expect(atomizedRule.ruleID.value).toBe(permission1ID);
            expect(atomizedRule.policyID.value).toBe("http://example.org/usagePolicy1");
            expect(policyStore.getQuads(null, 'http://example.org/ns/derivedFrom', permission1ID, null).length).toBe(2);
            expect(policyStore.getSubjects(RDF.terms.type, ODRL.terms.Permission, null)[0].termType).toBe("BlankNode");

            const atomizedRuleTwo = atomizedRules[1];
            const policyStoreTwo = new Store(atomizedRuleTwo.atomizedRuleQuads);
            expect(atomizedRuleTwo.ruleID.value).toBe(permission2ID);
            expect(atomizedRuleTwo.policyID.value).toBe("http://example.org/usagePolicy1");
            expect(policyStoreTwo.getQuads(null, 'http://example.org/ns/derivedFrom', permission2ID, null).length).toBe(1);
            expect(policyStoreTwo.getSubjects(RDF.terms.type, ODRL.terms.Permission, null)[0].termType).toBe("BlankNode");
        })

        it('atomizes multiple policies', async () => {
            const policyQuads = parser.parse(twoPolicies);
            const atomizedRules = await atomizer.atomizePolicies(policyQuads);

            expect(atomizedRules.length).toBe(2);

            const atomizedRule = atomizedRules[0];
            const policyStore = new Store(atomizedRule.atomizedRuleQuads);
            expect(atomizedRule.ruleID.value).toBe(permission1ID);
            expect(atomizedRule.policyID.value).toBe("http://example.org/usagePolicy1");
            expect(policyStore.getQuads(null, 'http://example.org/ns/derivedFrom', permission1ID, null).length).toBe(2);
            expect(policyStore.getSubjects(RDF.terms.type, ODRL.terms.Permission, null)[0].termType).toBe("BlankNode");

            expect(atomizedRules[1].policyID.value).toBe(secondPolicyID);

        })
    })

    describe('merging atomized evaluated rule reports.', () => {
        /**
         * Utility function to quickly get atomizedRules ready to test the merge Compliance function
         * @param policy 
         */
        async function evaluateAtomizedRules(policy: string): Promise<AtomizedEvaluatedRule[]> {
            const policyQuads = parser.parse(policy);
            const atomizedRules = await atomizer.atomizePolicies(policyQuads);
            const evaluatedAtomizedRules = []
            for (const policy of atomizedRules) {
                const report = await evaluator.evaluate(policy.atomizedRuleQuads, requestQuads, sotwQuads)
                evaluatedAtomizedRules.push({
                    ...policy,
                    policyReportQuads: report
                })
            }
            return evaluatedAtomizedRules
        }
        let evaluatedAtomizedRules: AtomizedEvaluatedRule[];

        it('on a policy with one compact rule produces one rule report.', async () => {
            evaluatedAtomizedRules = await evaluateAtomizedRules(compactPolicy)

            const complianceReportQuads = atomizer.mergeAtomizedRuleReports(evaluatedAtomizedRules);
            const complianceReportStore = new Store(complianceReportQuads);
            const complianceReportNodes = complianceReportStore.getSubjects(RDF.type, REPORT.PolicyReport, null);

            expect(complianceReportNodes.length).toEqual(1);
            const complianceReportSubject = complianceReportNodes[0];
            const report = parseComplianceReport(complianceReportSubject, complianceReportStore);
            expect(report.policy.id).toBe(compactPolicyID);
            expect(report.ruleReport.length).toBe(1);
            expect(report.ruleReport[0].rule.id).toBe(permission1ID);
            expect(report.ruleReport[0].activationState).toBe(ActivationState.Active)
        })

        it('on a policy with a compact rule and a normal rule produces one rule report', async () => {
            evaluatedAtomizedRules = await evaluateAtomizedRules(compactPolicyTwoRules)

            const complianceReportQuads = atomizer.mergeAtomizedRuleReports(evaluatedAtomizedRules);
            const complianceReportStore = new Store(complianceReportQuads);
            const complianceReportNodes = complianceReportStore.getSubjects(RDF.type, REPORT.PolicyReport, null);

            expect(complianceReportNodes.length).toEqual(1);
            const complianceReportSubject = complianceReportNodes[0];
            const report = parseComplianceReport(complianceReportSubject, complianceReportStore);
            expect(report.policy.id).toBe(compactPolicyID);
            expect(report.ruleReport.length).toBe(2);
            expect(report.ruleReport[0].rule.id).toBe(permission1ID);
            expect(report.ruleReport[0].activationState).toBe(ActivationState.Active)


            expect(report.ruleReport[1].rule.id).toBe(permission2ID);
            expect(report.ruleReport[1].activationState).toBe(ActivationState.Inactive)
        })

        it('on a policy with a compact rule and a policy with normal rule produces two policy reports with each one rule report.', async () => {
            evaluatedAtomizedRules = await evaluateAtomizedRules(twoPolicies)

            const complianceReportQuads = atomizer.mergeAtomizedRuleReports(evaluatedAtomizedRules);
            const complianceReportStore = new Store(complianceReportQuads);
            const complianceReportNodes = complianceReportStore.getSubjects(RDF.type, REPORT.PolicyReport, null);

            expect(complianceReportNodes.length).toEqual(2);
            const complianceReportSubject = complianceReportNodes[0];
            const report = parseComplianceReport(complianceReportSubject, complianceReportStore);
            expect(report.policy.id).toBe(compactPolicyID);
            expect(report.ruleReport.length).toBe(1);
            expect(report.ruleReport[0].rule.id).toBe(permission1ID);
            expect(report.ruleReport[0].activationState).toBe(ActivationState.Active)

            const complianceReportSubjectTwo = complianceReportNodes[1];
            const reportTwo = parseComplianceReport(complianceReportSubjectTwo, complianceReportStore);
            expect(reportTwo.policy.id).toBe(secondPolicyID);
            expect(reportTwo.ruleReport.length).toBe(1);
            expect(reportTwo.ruleReport[0].rule.id).toBe("urn:uuid:f5199b0a-d824-45a0-bc08-1caa8d19a001");
            expect(reportTwo.ruleReport[0].activationState).toBe(ActivationState.Inactive);
        })

        it('on inactive evaluation, picks the rule report with most premises active.', async () => {
            const policy = `
@prefix ex: <http://example.org/>.
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

ex:usagePolicy1 a odrl:Agreement ;
odrl:permission ex:permission1, ex:permission2 ;
odrl:prohibition <urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> .


ex:permission1 a odrl:Permission ;
odrl:action odrl:modify, odrl:read ;
odrl:target <http://localhost:3000/alice/other/resource.ttl> ;
odrl:assignee <https://both.pod.knows.idlab.ugent.be/profile/card#me> .
`
            evaluatedAtomizedRules = await evaluateAtomizedRules(policy)

            const complianceReportQuads = atomizer.mergeAtomizedRuleReports(evaluatedAtomizedRules);
            const complianceReportStore = new Store(complianceReportQuads);
            const complianceReportNodes = complianceReportStore.getSubjects(RDF.type, REPORT.PolicyReport, null);

            expect(complianceReportNodes.length).toEqual(1);
            const complianceReportSubject = complianceReportNodes[0];
            const report = parseComplianceReport(complianceReportSubject, complianceReportStore);
            expect(report.policy.id).toBe(compactPolicyID);
            expect(report.ruleReport.length).toBe(1);
            expect(report.ruleReport[0].rule.id).toBe(permission1ID);
            expect(report.ruleReport[0].activationState).toBe(ActivationState.Inactive)

            expect(countSatisfiedPremises(report.ruleReport[0].premiseReport)).toBe(2)
        })
    })

})
