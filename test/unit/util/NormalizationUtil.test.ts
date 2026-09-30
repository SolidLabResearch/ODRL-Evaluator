import { Parser, Store } from "n3";
import { ActivationState, parseComplianceReport } from "../../../src";
import { ODRLEngineMultipleSteps } from "../../../src/evaluator/Engine";
import { ODRLEvaluator } from "../../../src/evaluator/Evaluate";
import { RDF, REPORT } from "../../../src/util/Vocabularies";
import { countSatisfiedPremises } from "../../util/ReportTest";
import { Normalizer } from "odrl-validator/dist/Normalisation";
import { mergeDerivedRuleReports } from "../../../src/util/NormalizationUtil";

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
// Compact rule where only the read action matches the request
const compactPolicyInactive = `
@prefix ex: <http://example.org/>.
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

ex:usagePolicy1 a odrl:Agreement ;
  odrl:permission ex:permission1 .

ex:permission1 a odrl:Permission ;
  odrl:action odrl:modify, odrl:read ;
  odrl:target <http://localhost:3000/alice/other/resource.ttl> ;
  odrl:assignee <https://both.pod.knows.idlab.ugent.be/profile/card#me> .
`
// Can Alice READ http://localhost:3000/alice/other/resource.txt
const evaluationRequest = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix sotw: <https://w3id.org/force/sotw#> .

<urn:uuid:2a797ad7-232a-4e1f-853f-81388969e4a1> a sotw:EvaluationRequest ;
    sotw:requestedAction odrl:read ;
    sotw:requestingParty <https://both.pod.knows.idlab.ugent.be/profile/card#me> ;
    sotw:requestedTarget <http://localhost:3000/alice/other/resource.txt> ;
    sotw:requestParameter [
        a sotw:RequestParameter ;
        sotw:value "2024-02-12T11:20:10.999Z"^^xsd:dateTime ;
        sotw:describesFeature sotw:TemporalData
    ] .
`

const sotw = `
@prefix sotw: <https://w3id.org/force/sotw#> .

<urn:uuid:d63ea76e-0aed-4e4e-9a8c-0b7083ebc6e2> a sotw:SotW .
`

describe('Merging the rule reports of a normalized policy', () => {
    const evaluator = new ODRLEvaluator(new ODRLEngineMultipleSteps());
    const parser = new Parser();
    const sotwQuads = parser.parse(sotw);
    const requestQuads = parser.parse(evaluationRequest);

    const compactPolicyID = "http://example.org/usagePolicy1";
    const secondPolicyID = "urn:uuid:95efe0e8-4fb7-496d-8f3c-4d78c97829bc";
    const permission1ID = 'http://example.org/permission1';
    const permission2ID = 'http://example.org/permission2';

    /**
     * Utility function: normalize the policy, evaluate it and merge the atomized rule reports.
     */
    async function evaluateAndMerge(policy: string): Promise<Store> {
        const normalizedPolicy = await new Normalizer().normalise(parser.parse(policy));
        const report = await evaluator.evaluate(normalizedPolicy, requestQuads, sotwQuads);
        return new Store(mergeDerivedRuleReports(report, normalizedPolicy));
    }

    /**
     * Utility function: the parsed policy report of a given policy.
     */
    function getPolicyReport(complianceReportStore: Store, policyID: string) {
        const complianceReportNodes = complianceReportStore.getSubjects(RDF.type, REPORT.PolicyReport, null);
        const reports = complianceReportNodes.map(node => parseComplianceReport(node as any, complianceReportStore));
        return reports.find(report => report.policy.id === policyID)!;
    }

    it('on a policy with one compact rule produces one rule report.', async () => {
        const complianceReportStore = await evaluateAndMerge(compactPolicy);
        expect(complianceReportStore.getSubjects(RDF.type, REPORT.PolicyReport, null).length).toEqual(1);

        const report = getPolicyReport(complianceReportStore, compactPolicyID);
        expect(report.ruleReport.length).toBe(1);
        expect(report.ruleReport[0].rule.id).toBe(permission1ID);
        expect(report.ruleReport[0].activationState).toBe(ActivationState.Active);
    });

    it('on a policy with a compact rule and a normal rule produces one rule report per rule.', async () => {
        const complianceReportStore = await evaluateAndMerge(compactPolicyTwoRules);
        expect(complianceReportStore.getSubjects(RDF.type, REPORT.PolicyReport, null).length).toEqual(1);

        const report = getPolicyReport(complianceReportStore, compactPolicyID);
        expect(report.ruleReport.length).toBe(2);

        const ruleReport1 = report.ruleReport.find(ruleReport => ruleReport.rule.id === permission1ID)!;
        expect(ruleReport1.activationState).toBe(ActivationState.Active);

        const ruleReport2 = report.ruleReport.find(ruleReport => ruleReport.rule.id === permission2ID)!;
        expect(ruleReport2.activationState).toBe(ActivationState.Inactive);
    });

    it('on a policy with a compact rule and a policy with normal rule produces two policy reports with each one rule report.', async () => {
        const complianceReportStore = await evaluateAndMerge(twoPolicies);
        expect(complianceReportStore.getSubjects(RDF.type, REPORT.PolicyReport, null).length).toEqual(2);

        const report = getPolicyReport(complianceReportStore, compactPolicyID);
        expect(report.ruleReport.length).toBe(1);
        expect(report.ruleReport[0].rule.id).toBe(permission1ID);
        expect(report.ruleReport[0].activationState).toBe(ActivationState.Active);

        const reportTwo = getPolicyReport(complianceReportStore, secondPolicyID);
        expect(reportTwo.ruleReport.length).toBe(1);
        expect(reportTwo.ruleReport[0].rule.id).toBe("urn:uuid:f5199b0a-d824-45a0-bc08-1caa8d19a001");
        expect(reportTwo.ruleReport[0].activationState).toBe(ActivationState.Inactive);
    });

    it('on inactive evaluation, picks the rule report with most premises satisfied.', async () => {
        const complianceReportStore = await evaluateAndMerge(compactPolicyInactive);
        expect(complianceReportStore.getSubjects(RDF.type, REPORT.PolicyReport, null).length).toEqual(1);

        const report = getPolicyReport(complianceReportStore, compactPolicyID);
        expect(report.ruleReport.length).toBe(1);
        expect(report.ruleReport[0].rule.id).toBe(permission1ID);
        expect(report.ruleReport[0].activationState).toBe(ActivationState.Inactive);

        // party and action satisfied (read), target not
        expect(countSatisfiedPremises(report.ruleReport[0].premiseReport)).toBe(2);
    });
});