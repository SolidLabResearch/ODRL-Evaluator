import { readFile } from "fs/promises";
import { PolicyAtomizer } from "odrl-atomizer"
import { Parser, Writer, Literal, NamedNode, Store, DataFactory, Quad_Subject, Quad_Object } from 'n3'
import { Quad, Term } from "@rdfjs/types";
import { BasicLens, BasicLensM, CBDLens, Cont, extractShapes, match, pred, ShaclPath, subject } from "rdf-lens";
import { ODRL, ODRLUC, RDF } from "./src/util/Vocabularies";
import { AtomizedEvaluatedRule, Atomizer, DC, ODRLEngineMultipleSteps, ODRLEvaluator, REPORT } from "./dist";
const { namedNode, quad } = DataFactory

const shape = `

`;

const sotw = `
@prefix temp: <http://example.com/request/>.
@prefix dct: <http://purl.org/dc/terms/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.

temp:currentTime dct:issued "2024-02-12T11:20:10.999Z"^^xsd:dateTime.
`

const request = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

<urn:ucp:policy:2a797ad7-232a-4e1f-853f-81388969e4a1> a odrl:Request;
    odrl:permission <urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef>.
<urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef> a odrl:Permission;
    odrl:action odrl:read;
    odrl:target <http://localhost:3000/alice/other/resource.txt>;
    odrl:assignee <https://both.pod.knows.idlab.ugent.be/profile/card#me>.
`
const compactPolicy = `
@prefix ex: <http://example.org/>.
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

ex:usagePolicy1 a odrl:Agreement ;
  odrl:permission ex:permission1, ex:permission2 ;
  odrl:prohibition <urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> .


ex:permission1 a odrl:Permission ;
  odrl:action odrl:modify, odrl:read ;
  odrl:target <http://localhost:3000/alice/other/resource.txt> ;
  odrl:assignee <https://both.pod.knows.idlab.ugent.be/profile/card#me> .

ex:permission2 a odrl:Permission ;
  odrl:action odrl:modify ;
  odrl:target <http://localhost:3000/alice/other/resource.txt> ;
  odrl:assignee <https://modify.pod.knows.idlab.ugent.be/profile/card#me> .


<urn:uuid:9477c997-adc1-4d64-a12c-fa9e0f6b80f0> a odrl:Prohibition ;
  odrl:assignee ex:bob ;
  odrl:target <http://localhost:3000/alice/other/resource.txt> ;
  odrl:action odrl:use .
`

const nonCompactPolicy = `
@prefix ex: <http://example.org/>.
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

ex:usagePolicy2 a odrl:Agreement ;
  odrl:permission ex:permission3 .
ex:permission3 a odrl:Permission ;
  odrl:action odrl:modify ;
  odrl:target <http://localhost:3000/alice/other/resource.txt> ;
  odrl:assignee <https://modify.pod.knows.idlab.ugent.be/profile/card#me> .
`

const NamedCBDLens = new BasicLens<Cont, Quad[]>(({ id, quads }) => {
    const done = new Set<string>();
    const todo = [id];
    const out: Quad[] = [];
    let item = todo.pop();
    while (item) {
        const found = quads.filter((x) => x.subject.equals(item));
        out.push(...found);
        for (const option of found) {
            const object = option.object;
            if (object.termType !== "BlankNode" && object.termType !== "NamedNode") {
                continue;
            }

            if (done.has(object.value)) continue;
            done.add(object.value);
            todo.push(object);
        }
        item = todo.pop();
    }
    return out;
});
function TypesLens(types: Term[]): BasicLensM<Quad[], Cont<Quad>> {
    return new BasicLensM(quads => {
        return quads
            // filter on incoming types
            .filter(x => x.predicate.equals(RDF.terms.type) && types.some(ty => x.object.equals(ty)))
            // extend Quad to Cont<Quad>
            .map(id => ({ id, quads }));
    })
}
async function main() {
    const parser = new Parser()
    const writer = new Writer();
    const compactPolicyQuads = parser.parse(compactPolicy)

    const atomizer = new PolicyAtomizer();
    const atomized = atomizer.loadQuads(compactPolicyQuads).atomize();
    const atomizedPolicies = await atomized.getPolicies()


    console.log(writer.quadsToString(atomizedPolicies[0].quads));


    // const rules = await atomized.getRules()
    // console.log(writer.quadsToString(rules[0].quads));
    // console.log(writer.quadsToString(rules[1].quads));

}
// main()

type Aggreement = {
    identifier: Term,
    permission: Rule[],
    prohibition: Rule[],
    duty: Rule[]
}
type Rule = {
    policyID: Term,
    ruleID: Term,
    deonticConcept: Term,
    ruleQuads: Quad[]
}
// TODO: clean up
// TODO: fix the fact that for the same policy, I now get three policy reports. They should in fact be combined somehow?
//  maybe have a list (atomized rule ID and actual rule ID, then evaluate and then go back?)
async function policy_Atomization_algorithm() {
    const parser = new Parser()
    const writer = new Writer();
    // ODRL Evaluator inputs
    const sotwQuads = parser.parse(sotw)
    const requestQuads = parser.parse(request)
    const evaluator = new ODRLEvaluator(new ODRLEngineMultipleSteps());

    // ODRL Policy -> composite policies
    const compactPolicyQuads = parser.parse(compactPolicy)

    // ODRL Policy -> atomic policy
    const policyQuads = parser.parse(nonCompactPolicy)

    console.time();

    // Create Lens -> ask Arthur for more info: https://github.com/ajuvercr
    const shapeQuads = await readFile("./shape.ttl", { encoding: "utf-8" });
    const shapes = extractShapes(new Parser().parse(shapeQuads), {
        "Permission": ((permission: Rule): Rule => { permission.deonticConcept = ODRL.terms.permission; return permission }) as (item: unknown) => unknown,
        "Prohibition": ((prohibition: Rule): Rule => { prohibition.deonticConcept = ODRL.terms.prohibition; return prohibition }) as (item: unknown) => unknown,
        "Duty": ((duty: Rule): Rule => { duty.deonticConcept = ODRL.terms.duty; return duty }) as (item: unknown) => unknown,
    }, { NamedCBD: NamedCBDLens });
    // console.log(Object.keys(shapes.lenses));
    const aggrementsLens = TypesLens([ODRL.terms.Agreement, ODRL.terms.Set, ODRL.terms.Policy, ODRL.terms.Offer]).thenAll(subject.then(shapes.lenses["Aggreement"]));

    // extract all rules within all policies, using LENS
    const aggreements = <Aggreement[]>aggrementsLens.execute(compactPolicyQuads);
    const rules = aggreements.flatMap(agreement => [...agreement.permission, ...agreement.prohibition, ...agreement.duty])
    // console.log(aggreements);
    // console.log(rules);
    // for all rules in policies
    // for (const rule of aggreements.flatMap(agreement =>[...agreement.permission, ...agreement.prohibition, ...agreement.duty ] )) {
    //     console.log(writer.quadsToString(rule.ruleQuads));
    // }


    for (const rule of rules) {
        const policyID = rule.policyID as NamedNode;
        const deonticConcept = rule.deonticConcept as NamedNode;
        const ruleID = rule.ruleID as NamedNode;
        // reconstructed policy, possible wrong type of policy, but with the right identifiers
        const policy: Quad[] = [
            quad(policyID, RDF.terms.type, ODRL.terms.Set),
            quad(policyID, deonticConcept, ruleID),
            ...rule.ruleQuads
        ]
        const policySerialized = writer.quadsToString(policy)
        // console.log(policySerialized);

        const atomizer = new PolicyAtomizer();
        const atomized = atomizer.loadQuads(policy).atomize();
        const atomizedPolicies = await atomized.getPolicies()
        // will always be one policy
        const atomizedPolicy = atomizedPolicies[0].quads

        const reasoningResult = await evaluator.evaluate(
            atomizedPolicy,
            requestQuads,
            sotwQuads
        )
        // console.log(writer.quadsToString(reasoningResult));

        const reportStore = new Store(reasoningResult);

        const policyReportNodes = reportStore.getSubjects(RDF.type, REPORT.PolicyReport, null);
        const policyReport = parseComplianceReport(policyReportNodes[0], reportStore)

        let candidateRuleReport: { id: Term, satisfiedPremises: number, ruleID: Term } = {
             id: policyReport.ruleReport[0].id, 
             satisfiedPremises: policyReport.ruleReport[0].premiseReport.filter(report => report.satisfactionState === SatisfactionState.Satisfied).length,
             ruleID: policyReport.ruleReport[0].rule
            }
        let ruleReportQuads = reportStore.getQuads(policyReportNodes[0], REPORT.terms.ruleReport, null, null);
        // TODO: take blank node identifier of active rule
        // if none, take one with most premiseReports satsified -> TODO: optimisiation + will slow it down?
        for (const ruleReport of policyReport.ruleReport) {
            // console.log("amount premises satisfied:", ruleReport.premiseReport.filter(report => report.satisfactionState === SatisfactionState.Satisfied).length);
            // console.log("blanknode ID", ruleReport.rule);
            
            if (ruleReport.activationState === ActivationState.Active) {
                candidateRuleReport.id = ruleReport.id
                candidateRuleReport.ruleID = ruleReport.rule
                break;
            }
            const premisesSatisfied = ruleReport.premiseReport.filter(report => report.satisfactionState === SatisfactionState.Satisfied).length
            if (premisesSatisfied > candidateRuleReport.satisfiedPremises){
                candidateRuleReport.id = ruleReport.id
                candidateRuleReport.satisfiedPremises = premisesSatisfied
                candidateRuleReport.ruleID = ruleReport.rule

            }
        }
        // TODO: remove all references to ruleReports from the policy report triples that cof <PolicyReport> report:ruleReport blank node.  (the atomized rule reports)
        reportStore.removeQuads(ruleReportQuads);
        // TODO: add candidate report back <PolicyReport> report:ruleReport <candidateRuleReport.id> .
        reportStore.addQuad(policyReportNodes[0], REPORT.terms.ruleReport, candidateRuleReport.id as Quad_Object)
        // TODO: remove quad <candidateRuleReport.id> report:rule <any> .
        reportStore.removeQuad(candidateRuleReport.id as Quad_Subject, REPORT.terms.rule, candidateRuleReport.ruleID as Quad_Object)
        // TODO: add quad <candidateRuleReport.id> report:rule <any> 
        reportStore.addQuad(candidateRuleReport.id as Quad_Subject, REPORT.terms.rule, ruleID)

        // extract CBD of reportStore with policy report ID
        const outputReport = NamedCBDLens.execute({id: policyReportNodes[0], quads: reportStore.getQuads(null, null, null, null)})
        // TODO: instead of doing this outside of the ODRL, do it inside
        console.log(writer.quadsToString(outputReport));

        
    }

    console.timeEnd()


}
// policy_Atomization_algorithm()


async function policyAtomizationv2(){
    const parser = new Parser()
    const writer = new Writer();
    // ODRL Evaluator inputs
    const sotwQuads = parser.parse(sotw)
    const requestQuads = parser.parse(request)
    const evaluator = new ODRLEvaluator(new ODRLEngineMultipleSteps());
    const compactPolicyQuads = parser.parse(compactPolicy)

    const atomizer = new Atomizer();
    const policies = await atomizer.atomizePolicies(compactPolicyQuads);

    const atomizedEvaluatedRules: AtomizedEvaluatedRule[] = []
    for (const policy of policies) {
        const report = await evaluator.evaluate(policy.atomizedRuleQuads, requestQuads, sotwQuads)
        atomizedEvaluatedRules.push({
            ...policy,
            policyReportQuads: report
        })
    }

    const report = atomizer.cleanUp(atomizedEvaluatedRules);
    console.log(writer.quadsToString(report));
}
policyAtomizationv2()

type PolicyReport = {
    id: NamedNode;
    created: Literal;
    request: NamedNode;
    policy: NamedNode;
    ruleReport: RuleReport[];
}
type RuleReport = {
    id: NamedNode;
    type: RuleReportType;
    activationState: ActivationState
    rule: NamedNode;
    requestedRule: NamedNode;
    premiseReport: PremiseReport[]
}

type PremiseReport = {
    id: NamedNode;
    type: PremiseReportType;
    premiseReport: PremiseReport[];
    satisfactionState: SatisfactionState
}

// is it possible to just use REPORT.namespace + "term"?
// https://github.com/microsoft/TypeScript/issues/40793
enum RuleReportType {
    PermissionReport = 'https://w3id.org/force/compliance-report#PermissionReport',
    ProhibitionReport = 'https://w3id.org/force/compliance-report#ProhibitionReport',
    ObligationReport = 'https://w3id.org/force/compliance-report#ObligationReport',
}
enum SatisfactionState {
    Satisfied = 'https://w3id.org/force/compliance-report#Satisfied',
    Unsatisfied = 'https://w3id.org/force/compliance-report#Unsatisfied',
}

enum PremiseReportType {
    ConstraintReport = 'https://w3id.org/force/compliance-report#ConstraintReport',
    PartyReport = 'https://w3id.org/force/compliance-report#PartyReport',
    TargetReport = 'https://w3id.org/force/compliance-report#TargetReport',
    ActionReport = 'https://w3id.org/force/compliance-report#ActionReport',
}

enum ActivationState {
    Active = 'https://w3id.org/force/compliance-report#Active',
    Inactive = 'https://w3id.org/force/compliance-report#Inactive',
}

function parseComplianceReport(identifier: Quad_Subject, store: Store): PolicyReport {
    const exists = store.getQuads(identifier, RDF.type, REPORT.PolicyReport, null).length === 1;
    if (!exists) { throw Error(`No Policy Report found with: ${identifier}.`); }
    const ruleReportNodes = store.getObjects(identifier, REPORT.ruleReport, null) as NamedNode[];

    return {
        id: identifier as NamedNode,
        created: store.getObjects(identifier, DC.created, null)[0] as Literal,
        policy: store.getObjects(identifier, REPORT.policy, null)[0] as NamedNode,
        request: store.getObjects(identifier, REPORT.policyRequest, null)[0] as NamedNode,
        ruleReport: ruleReportNodes.map(ruleReportNode => parseRuleReport(ruleReportNode, store))
    }
}

/**
* Parses Rule Reports from a Compliance Report, including its premises
* @param identifier
* @param store
*/
function parseRuleReport(identifier: Quad_Subject, store: Store): RuleReport {
    const premiseNodes = store.getObjects(identifier, REPORT.premiseReport, null) as NamedNode[];
    return {
        id: identifier as NamedNode,
        type: store.getObjects(identifier, RDF.type, null)[0].value as RuleReportType,
        activationState: store.getObjects(identifier, REPORT.activationState, null)[0].value as ActivationState,
        requestedRule: store.getObjects(identifier, REPORT.ruleRequest, null)[0] as NamedNode,
        rule: store.getObjects(identifier, REPORT.rule, null)[0] as NamedNode,
        premiseReport: premiseNodes.map((prem) => parsePremiseReport(prem, store))
    }
}

/**
* Parses Premise Reports, including premises of a Premise Report itself.
* Note that if for some reason there are circular premise reports, this will result into an infinite loop
* @param identifier
* @param store
*/
function parsePremiseReport(identifier: Quad_Subject, store: Store): PremiseReport {
    const nestedPremises = store.getObjects(identifier, REPORT.PremiseReport, null) as NamedNode[];
    return {
        id: identifier as NamedNode,
        type: store.getObjects(identifier, RDF.type, null)[0].value as PremiseReportType,
        premiseReport: nestedPremises.map((prem) => parsePremiseReport(prem, store)),
        satisfactionState: store.getObjects(identifier, REPORT.satisfactionState, null)[0].value as SatisfactionState
    }
}
