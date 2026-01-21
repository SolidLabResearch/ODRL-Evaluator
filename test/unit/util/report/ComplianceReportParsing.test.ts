import { ActivationState, AttemptState, PolicyReport, PremiseReportType, RuleReportType, SatisfactionState } from '../../../../src/util/report/ComplianceReportTypes'
import { parseComplianceReport, parsePremiseReport, parseRuleReport, parseSingleComplianceReport } from '../../../../src/util/report/ComplianceReportParsing'
import { DataFactory, Parser, Store } from 'n3'
import { XSD } from '../../../../src/util/Vocabularies'
const { namedNode, literal } = DataFactory

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
    report:rule <urn:uuid:f21be2f2-5efd-46ca-ac4c-0b37d9b9a526>;
    report:ruleRequest <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59>;
    report:premiseReport <urn:uuid:9cb53011-6794-4e44-bb4c-b0e585be276b>, <urn:uuid:fdea884d-bd8c-499b-89dc-9c7784a7a6f0>, <urn:uuid:8eaf15bf-b0d1-4cee-bf0f-ffac9bb3fb14>, <urn:uuid:9d1d8c56-e2ac-467f-a368-3913b7aad001> ;
    report:conditionReport <urn:uuid:6122101e-a4d6-4e1a-9e35-a3ed124a09b8> ;
    report:activationState report:Inactive.
<urn:uuid:9cb53011-6794-4e44-bb4c-b0e585be276b> a report:TargetReport;
    report:satisfactionState report:Satisfied.
<urn:uuid:fdea884d-bd8c-499b-89dc-9c7784a7a6f0> a report:PartyReport;
    report:satisfactionState report:Satisfied.
<urn:uuid:8eaf15bf-b0d1-4cee-bf0f-ffac9bb3fb14> a report:ActionReport;
    report:satisfactionState report:Satisfied.
<urn:uuid:9d1d8c56-e2ac-467f-a368-3913b7aad001> a report:ConstraintReport;
    report:constraint <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1>;
    report:constraintLeftOperand "2017-02-12T11:20:10.999Z"^^xsd:dateTime; # NOTE: this will be ignored
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
            performanceState: undefined,
            deonticState: undefined,
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
                    premiseReport: [],
                    satisfactionState: SatisfactionState.Satisfied
                },
                {
                    id: namedNode("urn:uuid:9d1d8c56-e2ac-467f-a368-3913b7aad001"),
                    type: PremiseReportType.ConstraintReport,
                    premiseReport: [],
                    satisfactionState: SatisfactionState.Unsatisfied,
                    constraint: namedNode("urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1")
                },
            ],
            conditionReport: [namedNode("urn:uuid:6122101e-a4d6-4e1a-9e35-a3ed124a09b8")]
        }
    ]
}
describe('The Compliance Report Model Parser', () => {

    it('successfully parses single Compliance Reports', () => {
        const parsedReport = parseSingleComplianceReport(reportQuads);

        expect(parsedReport).toEqual(report);
    })

    it('throws an error when no compliance report is found.', () => {
        expect(() => parseSingleComplianceReport([])).toThrow();
    })
    it('throws an error when no compliance report is found with that given identifier.', () => {
        expect(() => parseComplianceReport(namedNode("urn:uuid:policy"), new Store(reportQuads))).toThrow();
    })


    describe('its Rule Report Parser', () => {
        it('throws an error when the activation state is not one of the allowed options.', () => {
            const ruleReportString = `
@prefix report: <https://w3id.org/force/compliance-report#>.
<urn:uuid:rule> a report:PermissionReport;
    report:rule <urn:uuid:rule-id>;
    report:ruleRequest <urn:uuid:req>;
    report:activationState <https://w3id.org/force/compliance-report#NotARealState>.`

            const quads = parser.parse(ruleReportString);
            const store = new Store(quads);
            expect(() => parseRuleReport(namedNode("urn:uuid:rule"), store)).toThrow();
        });

        it('throws an error when multiple activation states are present.', () => {
            const ruleReportString = `
@prefix report: <https://w3id.org/force/compliance-report#>.
<urn:uuid:ac38b6ef-fd36-4b6c-ac14-d27e8475f499> a report:PermissionReport;
    report:rule <urn:uuid:f21be2f2-5efd-46ca-ac4c-0b37d9b9a526>;
    report:ruleRequest <urn:uuid:186be541-5857-4ce3-9f03-1a274f16bf59>;
    report:activationState report:Inactive, report:Active.`
            expect(() => parseRuleReport(namedNode("urn:uuid:ac38b6ef-fd36-4b6c-ac14-d27e8475f499"), new Store(parser.parse(ruleReportString)))).toThrow()
        })
        it('throws an error when multiple attempted states are present.', () => {
            const ruleReportString = `
@prefix report: <https://w3id.org/force/compliance-report#>.
<urn:uuid:rule> a report:PermissionReport;
    report:rule <urn:uuid:rule-id>;
    report:ruleRequest <urn:uuid:req>;
    report:attemptState report:Attempted, report:NotAttempted.`
            expect(() => parseRuleReport(namedNode("urn:uuid:rule"), new Store(parser.parse(ruleReportString)))).toThrow()
        })

        it('throws an error when multiple performed states are present.', () => {
            const ruleReportString = `
@prefix report: <https://w3id.org/force/compliance-report#>.
<urn:uuid:rule> a report:PermissionReport;
    report:rule <urn:uuid:rule-id>;
    report:ruleRequest <urn:uuid:req>;
    report:performanceState report:Performed, report:Unperformed.`
            expect(() => parseRuleReport(namedNode("urn:uuid:rule"), new Store(parser.parse(ruleReportString)))).toThrow()
        })

        it('throws an error when multiple deontic states are present.', () => {
            const ruleReportString = `
@prefix report: <https://w3id.org/force/compliance-report#>.
<urn:uuid:rule> a report:PermissionReport;
    report:rule <urn:uuid:rule-id>;
    report:ruleRequest <urn:uuid:req>;
    report:deonticState report:Fulfilled, report:Violated.`
            expect(() => parseRuleReport(namedNode("urn:uuid:rule"), new Store(parser.parse(ruleReportString)))).toThrow()
        })

    })
    describe('its Premise Report Parser', () => {

        it('succesfully parses a recursivily premise reports', () => {
            const premiseReportString = `
@prefix report: <https://w3id.org/force/compliance-report#>.

<urn:uuid:8eaf15bf-b0d1-4cee-bf0f-ffac9bb3fb14> a report:ActionReport;
    report:satisfactionState report:Satisfied;
    report:premiseReport <urn:uuid:9d1d8c56-e2ac-467f-a368-3913b7aad001> .
<urn:uuid:9d1d8c56-e2ac-467f-a368-3913b7aad001> a report:ConstraintReport;
    report:constraint <urn:uuid:constraint:86526f9b-57c2-4c94-b079-9762fec562f1>;
    report:satisfactionState report:Unsatisfied.`
            const premiseReportQuads = parser.parse(premiseReportString);
            const premiseReport =
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
            expect(parsePremiseReport(namedNode("urn:uuid:8eaf15bf-b0d1-4cee-bf0f-ffac9bb3fb14"), new Store(premiseReportQuads))).toEqual(premiseReport)
        })

        it('throws an error when there are circular premise Reports.', () => {
            const circularString = `
@prefix report: <https://w3id.org/force/compliance-report#>.

<urn:uuid:A> a report:ActionReport;
    report:satisfactionState report:Satisfied;
    report:premiseReport <urn:uuid:B>.

<urn:uuid:B> a report:ConstraintReport;
    report:satisfactionState report:Unsatisfied;
    report:premiseReport <urn:uuid:A>.`
            const quads = parser.parse(circularString);

            expect(() => parsePremiseReport(namedNode("urn:uuid:A"), new Store(quads))).toThrow()
        })


        it('throws an error when a constraint report does not have a `report:constraint` property.', () => {
            const invalidConstraintString = `
@prefix report: <https://w3id.org/force/compliance-report#>.

<urn:uuid:C> a report:ConstraintReport;
    report:satisfactionState report:Unsatisfied.`
            const quads = parser.parse(invalidConstraintString);

            expect(() => parsePremiseReport(namedNode("urn:uuid:C"), new Store(quads))).toThrow()
        })

    })

})