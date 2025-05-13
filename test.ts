import { PolicyAtomizer } from "odrl-atomizer"
import { Parser, Writer, Literal, NamedNode, Store, DataFactory, Quad_Subject } from 'n3'
import { Quad, Term } from "@rdfjs/types";
import { BasicLensM, CBDLens, Cont, pred, ShaclPath } from "rdf-lens";
import { ODRL, ODRLUC, RDF } from "./src/util/Vocabularies";
import { DC, ODRLEngineMultipleSteps, ODRLEvaluator, REPORT } from "./dist";
const { namedNode, quad } = DataFactory

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

const nonCompactPolicy = `
@prefix ex: <http://example.org/>.
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .

ex:usagePolicy2 a odrl:Agreement ;
  odrl:permission ex:permission2 .
ex:permission2 a odrl:Permission ;
  odrl:action odrl:modify ;
  odrl:target <http://localhost:3000/alice/other/resource.txt> ;
  odrl:assignee <https://modify.pod.knows.idlab.ugent.be/profile/card#me> .
`
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

async function policy_Atomization_algorithm() {<http://example.org/usagePolicy1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Set> .
<http://example.org/usagePolicy1> <http://www.w3.org/ns/odrl/2/Permission> <http://example.org/permission1> .
<http://example.org/permission1> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/ns/odrl/2/Permission> .
<http://example.org/permission1> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/modify> .
<http://example.org/permission1> <http://www.w3.org/ns/odrl/2/action> <http://www.w3.org/ns/odrl/2/read> .
<http://example.org/permission1> <http://www.w3.org/ns/odrl/2/target> <http://localhost:3000/alice/other/resource.txt> .
<http://example.org/permission1> <http://www.w3.org/ns/odrl/2/assignee> <https://both.pod.knows.idlab.ugent.be/profile/card#me> .
  // extract all policyIDs -> for all rules in policies
  // TODO: do it via querying the store instead of using the Lenses

  // extract all rules, individually

  // TODO: fix after Arthur - > get all permission, prohibition and duty policies
  // use RDF lens instead of clownface for SHACL Property Paths: https://ceur-ws.org/Vol-3759/paper13.pdf
  const pathLensPermission = pred(ODRL.terms.permission)
    .one()
    .then(ShaclPath)
    .map((permissionPath) => ({ permissionPath })); // map naar {permissionPath: BasicLens} object

  const pathLensProhibition = pred(ODRL.terms.prohibition)
    .one()
    .then(ShaclPath)
    .map((prohibitionPath) => ({ prohibitionPath })); // map naar {prohibitionPath: BasicLens} object


  const pathLensDuty = pred(ODRL.terms.duty)
    .one()
    .then(ShaclPath)
    .map((dutyPath) => ({ dutyPath })); // map naar {dutyPath: BasicLens} object



  const fullLens = pathLensPermission.and(pathLensProhibition, pathLensDuty).map((xs) => Object.assign({}, ...xs))

  // Utility function to extract the value from an external resource using a SHACL Property path
  function usePath(id: Term, quads: Quad[], lens: BasicLensM<Cont, Term>): Term[] {
    return lens.execute({ id, quads })
  }


  const policyTerm = namedNode("http://example.org/usagePolicy1")
  const permissionID1 = namedNode("http://example.org/permission1")
  const permissionID2 = namedNode("http://example.org/permission2")

  const compactPolicyQuads = parser.parse(compactPolicy)
  const quads = CBDLens.execute({ id: permissionID1, quads: compactPolicyQuads })

  // TODO: Automatically do this, based on all possible deontic concepts
  const rules: { policyID: Term, ruleID: Term, deonticConcept: Term, ruleQuads: Quad[] }[] = []
  // NOTE: lens would not solve assetcollection extraction from complex target
  rules.push({
    policyID: policyTerm,
    ruleID: permissionID1,
    deonticConcept: ODRL.terms.permission,
    ruleQuads: CBDLens.execute({ id: permissionID1, quads: compactPolicyQuads })
  })
  rules.push({
    policyID: policyTerm,
    ruleID: permissionID2,
    deonticConcept: ODRL.terms.permission,
    ruleQuads: CBDLens.execute({ id: permissionID2, quads: compactPolicyQuads })
  })

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
    const reportStore = new Store(reasoningResult);

    const policyReportNodes = reportStore.getSubjects(RDF.type, REPORT.PolicyReport, null);
    const policyReport = parseComplianceReport(policyReportNodes[0], new Store(reasoningResult))
    // TODO: take blank node identifier of active rule
    // if none, take one with most premiseReports satsified -> TODO: optimisiation + will slow it down?
    for (const ruleReport of policyReport.ruleReport) {
      console.log(ruleReport.activationState);
      console.log("Blank node identifier: ", ruleReport.rule);
      console.log("Original Rule ID: ", ruleID)
      console.log();

    }

    // TODO: use blank node identifier and transform all instances to original IRI

    // TODO: instead of doing this outside of the ODRL, do it inside
  }

  console.timeEnd()


}
policy_Atomization_algorithm()


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
  PermissionReport = 'http://example.com/report/temp/PermissionReport',
  ProhibitionReport = 'http://example.com/report/temp/ProhibitionReport',
  ObligationReport = 'http://example.com/report/temp/ObligationReport',
}
enum SatisfactionState {
  Satisfied = 'http://example.com/report/temp/Satisfied',
  Unsatisfied = 'http://example.com/report/temp/Unsatisfied',
}

enum PremiseReportType {
  ConstraintReport = 'http://example.com/report/temp/ConstraintReport',
  PartyReport = 'http://example.com/report/temp/PartyReport',
  TargetReport = 'http://example.com/report/temp/TargetReport',
  ActionReport = 'http://example.com/report/temp/ActionReport',
}

enum ActivationState {
  Active = 'http://example.com/report/temp/Active',
  Inactive = 'http://example.com/report/temp/Inactive',
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