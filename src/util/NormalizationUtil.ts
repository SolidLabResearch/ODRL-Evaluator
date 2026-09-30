import { Quad, Term } from "@rdfjs/types";
import { DataFactory, Store } from "n3";
import { REPORT } from "./Vocabularies";

const { namedNode, quad } = DataFactory;

// Link added by odrl-atomization from each atomic rule to the rule it was split from
const DERIVED_FROM = namedNode("http://example.org/ns/derivedFrom");

/**
 * Maps the rule reports of atomic rules back to the original (composite) rules.
 *
 * For each original rule only one rule report is kept: the active one,
 * otherwise the one with the most satisfied premises.
 * Its `cr:rule` is set to the original rule identifier.
 *
 * @param report compliance report of the normalized policy
 * @param normalizedPolicy the normalized policy (contains the derivedFrom links)
 */
export function mergeDerivedRuleReports(report: Quad[], normalizedPolicy: Quad[]): Quad[] {
    const policyStore = new Store(normalizedPolicy);
    const reportStore = new Store(report);

    // group rule reports by original rule
    const groups = new Map<string, { original: Term, ruleReports: Term[] }>();
    for (const { subject: ruleReport, object: rule } of reportStore.getQuads(null, REPORT.terms.rule, null, null)) {
        const original = policyStore.getObjects(rule, DERIVED_FROM, null)[0] ?? rule;
        const group = groups.get(original.value) ?? { original, ruleReports: [] as Term[] };
        group.ruleReports.push(ruleReport);
        groups.set(original.value, group);
    }

    for (const { original, ruleReports } of Array.from(groups.values())) {
        const best = selectBestRuleReport(reportStore, ruleReports);

        // drop the other rule reports (and their premise reports)
        for (const ruleReport of ruleReports.filter(r => !r.equals(best))) {
            reportStore.removeQuads(reportStore.getQuads(null, REPORT.terms.ruleReport, ruleReport, null));
            for (const premiseReport of reportStore.getObjects(ruleReport, REPORT.terms.premiseReport, null)) {
                // premise reports can be shared between rule reports
                if (reportStore.getQuads(null, REPORT.terms.premiseReport, premiseReport, null).length === 1) {
                    reportStore.removeQuads(reportStore.getQuads(premiseReport, null, null, null));
                }
            }
            reportStore.removeQuads(reportStore.getQuads(ruleReport, null, null, null));
        }

        // point the kept rule report to the original rule
        reportStore.removeQuads(reportStore.getQuads(best, REPORT.terms.rule, null, null));
        reportStore.addQuad(quad(best as any, REPORT.terms.rule, original as any));
    }
    return reportStore.getQuads(null, null, null, null);
}

/**
 * The active rule report, otherwise the one with the most satisfied premises.
 */
function selectBestRuleReport(store: Store, ruleReports: Term[]): Term {
    const active = ruleReports.find(r => store.has(quad(r as any, REPORT.terms.activationState, REPORT.terms.Active)));
    if (active) return active;

    const satisfiedPremises = (ruleReport: Term) => store.getObjects(ruleReport, REPORT.terms.premiseReport, null)
        .filter(p => store.has(quad(p as any, REPORT.terms.satisfactionState, REPORT.terms.Satisfied))).length;
    return ruleReports.reduce((best, r) => satisfiedPremises(r) > satisfiedPremises(best) ? r : best);
}