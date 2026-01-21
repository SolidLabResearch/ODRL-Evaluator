import { ActivationState, AttemptState, DeonticState, PerformanceState, PolicyReport, PremiseReportType, RuleReportType, SatisfactionState } from '../../../../src/util/report/ComplianceReportTypes'
import { serializeComplianceReport } from '../../../../src/util/report/ComplianceReportSerialization'
import { DataFactory, Parser, } from 'n3'
import { XSD } from '../../../../src/util/Vocabularies'
const { namedNode, literal } = DataFactory
import "jest-rdf";
const parser = new Parser()
// Turtle string serialization of a compliance report most features that are part of the compliance report model
const stringReport = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/>.
@prefix dct: <http://purl.org/dc/terms/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix report: <https://w3id.org/force/compliance-report#>.

<urn:uuid:e001b361-9f6e-4e05-84bd-510d2870c83d> a report:PolicyReport;
    dct:created "2024-02-12T11:20:10.999Z"^^xsd:dateTime;
    report:policy <urn:uuid:5aa7f98c-65e0-4ff2-9846-40203203a58a>;
    report:policyRequest <urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364>;
    report:ruleReport <urn:uuid:ac38b6ef-fd36-4b6c-ac14-d27e8475f499>.
<urn:uuid:ac38b6ef-fd36-4b6c-ac14-d27e8475f499> a report:PermissionReport;
    report:attemptState report:Attempted;
    report:performanceState report:Performed;
    report:deonticState report:Violated;
    report:rule <urn:uuid:f21be2f2-5efd-46ca-ac4c-0b37d9b9a526>;
    report:ruleRequest <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59>;
    report:premiseReport <urn:uuid:9cb53011-6794-4e44-bb4c-b0e585be276b>, <urn:uuid:fdea884d-bd8c-499b-89dc-9c7784a7a6f0>, <urn:uuid:8eaf15bf-b0d1-4cee-bf0f-ffac9bb3fb14> ;
    report:conditionReport <urn:uuid:6122101e-a4d6-4e1a-9e35-a3ed124a09b8> ;
    report:activationState report:Inactive.
<urn:uuid:9cb53011-6794-4e44-bb4c-b0e585be276b> a report:TargetReport;
    report:satisfactionState report:Satisfied.
<urn:uuid:fdea884d-bd8c-499b-89dc-9c7784a7a6f0> a report:PartyReport;
    report:satisfactionState report:Satisfied.
<urn:uuid:8eaf15bf-b0d1-4cee-bf0f-ffac9bb3fb14> a report:ActionReport;
    report:satisfactionState report:Satisfied;
    report:premiseReport <urn:uuid:9d1d8c56-e2ac-467f-a368-3913b7aad001> .
<urn:uuid:9d1d8c56-e2ac-467f-a368-3913b7aad001> a report:ConstraintReport;
    report:constraint <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1>;
    report:satisfactionState report:Unsatisfied.
`
const reportQuads = parser.parse(stringReport);

const report: PolicyReport = {
    id: namedNode("urn:uuid:e001b361-9f6e-4e05-84bd-510d2870c83d"),
    created: literal("2024-02-12T11:20:10.999Z", XSD.terms.dateTime),
    request: namedNode("urn:uuid:1bafee59-006c-46a3-810c-5d176b4be364"),
    policy: namedNode("urn:uuid:5aa7f98c-65e0-4ff2-9846-40203203a58a"),
    ruleReport: [
        {
            id: namedNode("urn:uuid:ac38b6ef-fd36-4b6c-ac14-d27e8475f499"),
            type: RuleReportType.PermissionReport,
            rule: namedNode("urn:uuid:f21be2f2-5efd-46ca-ac4c-0b37d9b9a526"),
            activationState: ActivationState.Inactive,
            performanceState: PerformanceState.Performed,
            deonticState: DeonticState.Violated,
            attemptState: AttemptState.Attempted,
            requestedRule: namedNode("urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59"),
            premiseReport: [
                {
                    id: namedNode("urn:uuid:9cb53011-6794-4e44-bb4c-b0e585be276b"),
                    type: PremiseReportType.TargetReport,
                    premiseReport: [],
                    satisfactionState: SatisfactionState.Satisfied
                },
                {
                    id: namedNode("urn:uuid:fdea884d-bd8c-499b-89dc-9c7784a7a6f0"),
                    type: PremiseReportType.PartyReport,
                    premiseReport: [],
                    satisfactionState: SatisfactionState.Satisfied
                },
                {
                    id: namedNode("urn:uuid:8eaf15bf-b0d1-4cee-bf0f-ffac9bb3fb14"),
                    type: PremiseReportType.ActionReport,
                    premiseReport: [
                        {
                            id: namedNode("urn:uuid:9d1d8c56-e2ac-467f-a368-3913b7aad001"),
                            type: PremiseReportType.ConstraintReport,
                            premiseReport: [],
                            satisfactionState: SatisfactionState.Unsatisfied,
                            constraint: namedNode("urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1")
                        }
                    ],
                    satisfactionState: SatisfactionState.Satisfied
                }
            ],
            conditionReport: [namedNode("urn:uuid:6122101e-a4d6-4e1a-9e35-a3ed124a09b8")]
        }
    ]
}
describe('The Compliance Report Model Serializer', () => {
    it('successfully serializes Compliance Reports', () => {
        const serializedReport = serializeComplianceReport(report)
        
        expect(serializedReport).toBeRdfIsomorphic(reportQuads);
    })

})
