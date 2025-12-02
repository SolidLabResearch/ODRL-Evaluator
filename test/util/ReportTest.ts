import { PremiseReport, SatisfactionState } from "../../src/util/report/ComplianceReportTypes";


export function countSatisfiedPremises(premiseReports: PremiseReport[]): number {
    return premiseReports.filter(premiseReport => premiseReport.satisfactionState === SatisfactionState.Satisfied).length
}