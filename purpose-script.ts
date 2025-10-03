// Goal: 
// - purpose constraint
// - odrl:anyOf (perhaps also the others?)
// - proper asset and target collection: https://github.com/SolidLabResearch/ODRL-Evaluator/issues/8

import { Quad } from "@rdfjs/types"
import { EyeJsReasoner, EyeReasoner, ODRL, ODRLEngineMultipleSteps, CompositeODRLEvaluator, parseComplianceReport, Policy, PolicyReport, prefixes, RDF, REPORT, RuleReport, SatisfactionState, ODRLEvaluator, AtomizedEvaluatedRule, Atomizer } from "./dist"
import { Parser, Store, Writer } from "n3"
import { write } from "@jeswr/pretty-turtle/dist"


// input: https://github.com/besteves4/pacsoi-policies/tree/main/PoC2
// https://github.com/besteves4/pacsoi-policies/blob/main/PoC2/policy-22.ttl
const policy22 = `
@prefix dcterms:       <http://purl.org/dc/terms/> .
@prefix dpv:           <https://w3id.org/dpv#> .
@prefix dpv-odrl:      <https://w3id.org/dpv/mappings/odrl#> .
@prefix ex:            <https://example.org/> .
@prefix faqir:         <https://faqir.org/> .
@prefix odrl:          <http://www.w3.org/ns/odrl/2/> .
@prefix sector-health: <https://w3id.org/dpv/sector/health#> .

ex:uc22-p-pod-accountManagement-faqirPodManagSerDC-accountManagement a odrl:Set ;
    odrl:uid ex:uc22-p-pod-accountManagement-faqirPodManagSerDC-accountManagement ;
    odrl:profile dpv-odrl: ;
    dcterms:description "User allows FAQIR Pod Management Service full access to manage his Pod."@en ;
    odrl:permission ex:uc22-rule .
ex:uc22-rule a odrl:Permission;
    odrl:action odrl:read, odrl:modify ;
    odrl:target faqir:patientPod ; 
    odrl:assigner ex:patient ;
    odrl:assignee faqir:podManagementService ;
    odrl:constraint [
        odrl:leftOperand odrl:purpose ;
        odrl:operator odrl:eq ;
        odrl:rightOperand dpv:AccountManagement ]  .



faqir:podManagementService a dpv:ServiceProvider, dpv:NonProfitOrganisation .
`
//  ex:uc22-rule   odrl:constraint ex:uc22-constraint .
// ex:uc22-constraint
//     odrl:leftOperand odrl:purpose ;
//     odrl:operator odrl:eq ;
//     odrl:rightOperand dpv:AccountManagement  .
// https://github.com/besteves4/pacsoi-policies/blob/main/PoC2/policy-23.ttl
const policy23 = `
@prefix dcterms:       <http://purl.org/dc/terms/> .
@prefix dpv:           <https://w3id.org/dpv#> .
@prefix dpv-odrl:      <https://w3id.org/dpv/mappings/odrl#> .
@prefix ex:            <https://example.org/> .
@prefix odrl:          <http://www.w3.org/ns/odrl/2/> .
@prefix sector-health: <https://w3id.org/dpv/sector/health#> .
@prefix faqir:         <https://faqir.org/> .

ex:uc23-p-sensorSlice-serviceProvision-faqirDC-read a odrl:Set ;
    odrl:uid ex:uc23-p-sensorSlice-serviceProvision-faqirDC-read ;
    odrl:profile dpv-odrl: ;
    dcterms:description "User allows FAQIR Aggregator read access to its sensor slice."@en ;
    odrl:permission ex:uc23-rule .
    ex:uc23-rule
        a odrl:Permission;
        odrl:action odrl:read ; 
        odrl:target <https://faqir.org/patientPod/sensor/slice> ; 
        odrl:assigner ex:patient ;
        odrl:assignee faqir:aggregator ;
        odrl:constraint [
            odrl:leftOperand odrl:purpose ;
            odrl:operator odrl:isAnyOf ;
            odrl:rightOperand dpv:ServiceProvision, dpv:NonCommercialResearch,
                sector-health:ResourceManagement ] .

faqir:aggregator a dpv:ServiceProvider .
`
// https://github.com/besteves4/pacsoi-policies/blob/main/PoC2/policy-24.ttl
const policy24 = `
@prefix dcterms:       <http://purl.org/dc/terms/> .
@prefix dpv:           <https://w3id.org/dpv#> .
@prefix dpv-odrl:      <https://w3id.org/dpv/mappings/odrl#> .
@prefix ex:            <https://example.org/> .
@prefix odrl:          <http://www.w3.org/ns/odrl/2/> .
@prefix sector-health: <https://w3id.org/dpv/sector/health#> .
@prefix moveUp:        <https://www.moveup.care/> .

ex:uc24-p-profileQuestionnaireSensor-serviceProvision-moveUpProfileDC-readModify a odrl:Set ;
    odrl:uid ex:uc24-p-profileQuestionnaireSensor-serviceProvision-moveUpProfileDC-readModify ;
    odrl:profile dpv-odrl: ;
    dcterms:description "User allows his own MoveUp profile read and write (modify) access to his profile, questionnaire, and sensor slices."@en ;
    odrl:permission ex:uc24-rule .
    ex:uc24-rule
        a odrl:Permission;
        odrl:action odrl:read, odrl:modify ; 
        odrl:target <https://faqir.org/patientPod/sensor>, <https://faqir.org/patientPod/profile>, <https://faqir.org/patientPod/questionnaire> ; 
        odrl:assigner ex:patient ;
        odrl:assignee moveUp:patient ;
        odrl:constraint [
            odrl:leftOperand odrl:purpose ;
            odrl:operator odrl:isAnyOf ;
            odrl:rightOperand dpv:ServiceProvision, dpv:AccountManagement, 
                sector-health:ResourceManagement ] .
`
// https://github.com/besteves4/pacsoi-policies/blob/main/PoC2/policy-25.ttl
const policy25 = `
@prefix dcterms:       <http://purl.org/dc/terms/> .
@prefix dpv:           <https://w3id.org/dpv#> .
@prefix dpv-odrl:      <https://w3id.org/dpv/mappings/odrl#> .
@prefix ex:            <https://example.org/> .
@prefix odrl:          <http://www.w3.org/ns/odrl/2/> .
@prefix sector-health: <https://w3id.org/dpv/sector/health#> .
@prefix moveUp:        <https://www.moveup.care/> .

ex:uc25-p-profileQuestionnaireSensor-serviceProvision-moveUpServiceDC-readModify a odrl:Set ;
    odrl:uid ex:uc25-p-profileQuestionnaireSensor-serviceProvision-moveUpServiceDC-readModify ;
    odrl:profile dpv-odrl: ;
    dcterms:description "User allows MoveUp's Service read and write (modify) access to his profile, questionnaire, and sensor slices."@en ;
    odrl:permission [
        odrl:action odrl:read, odrl:modify ; 
        odrl:target <https://faqir.org/patientPod/sensor>, <https://faqir.org/patientPod/profile>, <https://faqir.org/patientPod/questionnaire> ; 
        odrl:assigner ex:patient ;
        odrl:assignee moveUp:service ;
        odrl:constraint [
            odrl:leftOperand odrl:purpose ;
            odrl:operator odrl:isAnyOf ;
            odrl:rightOperand dpv:ServiceProvision, dpv:AccountManagement, 
            sector-health:ResourceManagement, dpv:DataQualityManagement ] ] .
`
// https://github.com/besteves4/pacsoi-policies/blob/main/PoC2/policy-26.ttl
const policy26 = `
@prefix dcterms:       <http://purl.org/dc/terms/> .
@prefix dpv:           <https://w3id.org/dpv#> .
@prefix dpv-odrl:      <https://w3id.org/dpv/mappings/odrl#> .
@prefix eu-ehds:       <https://w3id.org/dpv/legal/eu/ehds#> .
@prefix ex:            <https://example.org/> .
@prefix odrl:          <http://www.w3.org/ns/odrl/2/> .
@prefix sector-health: <https://w3id.org/dpv/sector/health#> .
@prefix moveUp:        <https://www.moveup.care/> .

ex:uc26-p-profileQuestionnaireSensor-primarycare-patientDC-read a odrl:Set ;
    odrl:uid ex:uc26-p-profileQuestionnaireSensor-primarycare-patientDC-read ;
    odrl:profile dpv-odrl: ;
    dcterms:description "User allows anyone with a healthcare relationship with his own MoveUp patient ID read access to his profile, questionnaire, and sensor slices for primary use."@en ;
    odrl:permission [
        odrl:action odrl:read ; 
        odrl:target <https://faqir.org/patientPod/sensor>, <https://faqir.org/patientPod/profile>, <https://faqir.org/patientPod/questionnaire> ; 
        odrl:assigner ex:patient ;
        odrl:assignee ex:healthcareProfessional ;
        odrl:constraint [
            odrl:leftOperand odrl:purpose ;
            odrl:operator odrl:isAnyOf ;
            odrl:rightOperand sector-health:PrimaryCareManagement, sector-health:PatientMonitoring] ] .

ex:healthcareProfessional a eu-ehds:HealthProfessional ;
    dpv:hasRelationWithDataSubject ex:patient .
`

const requestOld = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix faqir:         <https://faqir.org/> .
@prefix dcterms: <http://purl.org/dc/terms/>.

<urn:ucp:policy:2a797ad7-232a-4e1f-853f-81388969e4a1> a odrl:Request;
    odrl:permission <urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef>.
<urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef> a odrl:Permission;
    odrl:action odrl:read;
    odrl:target <https://faqir.org/patientPod/sensor>;
    odrl:assignee faqir:aggregator .
`

const requestOldPurposeAccountManagement = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix faqir:         <https://faqir.org/> .
@prefix dcterms: <http://purl.org/dc/terms/>.
@prefix sotw:    <https://w3id.org/force/sotw#> .
@prefix dpv: <https://w3id.org/dpv#>.

<urn:ucp:policy:2a797ad7-232a-4e1f-853f-81388969e4a1> a odrl:Request;
    odrl:permission <urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef>.
<urn:ucp:rule:e3ba21f7-57b0-4a43-988a-3221aba858ef> a odrl:Permission;
    odrl:action odrl:read;
    odrl:target <https://faqir.org/patientPod/sensor>;
    odrl:assignee faqir:aggregator ;
    sotw:context <urn:ucp:purposeConstraint:4061bd8d-a82c-4b5f-bdf4-7dcb2583b3d2> .

<urn:ucp:purposeConstraint:4061bd8d-a82c-4b5f-bdf4-7dcb2583b3d2> a odrl:Constraint ;
    odrl:leftOperand odrl:purpose ;
    odrl:operator odrl:eq ;
    odrl:rightOperand dpv:AccountManagement .
`
const requestNoPurpose = `
@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix faqir:         <https://faqir.org/> .
@prefix sotw:    <https://w3id.org/force/sotw#> .
@prefix dcterms: <http://purl.org/dc/terms/>.

ex:request a sotw:EvaluationRequest ;
    dcterms:issued "2024-02-12T11:20:10.999Z"^^xsd:dateTime ;
    sotw:requestedAction odrl:read ;
    sotw:requestingParty faqir:aggregator ;
    sotw:requestedTarget <https://faqir.org/patientPod/sensor> .
`

const requestPurposeAccountManagement = `
@prefix odrl:    <http://www.w3.org/ns/odrl/2/> .
@prefix faqir:   <https://faqir.org/> .
@prefix sotw:    <https://w3id.org/force/sotw#> .
@prefix dcterms: <http://purl.org/dc/terms/>.
@prefix dpv: <https://w3id.org/dpv#>.

ex:requestPurpose a sotw:EvaluationRequest ;
    dcterms:issued "2024-02-12T11:20:10.999Z"^^xsd:dateTime ;
    sotw:requestedAction odrl:read ;
    sotw:requestingParty faqir:aggregator ;
    sotw:requestedTarget <https://faqir.org/patientPod/sensor> ;
    sotw:context ex:accountManagementPurpose .

ex:accountManagementPurpose a odrl:Constraint ;
    odrl:leftOperand odrl:purpose ;
    odrl:operator odrl:eq ;
    odrl:rightOperand dpv:AccountManagement .

`
const sotwOld = `
@prefix temp: <http://example.com/request/> .
@prefix dct: <http://purl.org/dc/terms/> .

temp:currentTime dct:issued "2017-02-12T11:20:10.999Z"^^<http://www.w3.org/2001/XMLSchema#dateTime> .
`
const sotwTime = `
@prefix sotw:    <https://w3id.org/force/sotw#> .
@prefix dct: <http://purl.org/dc/terms/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix ex: <http://example.org/>. 

ex:sotw a sotw:SotW ;
    sotw:currentTime ex:currentTime .

ex:currentTime dct:issued "2024-02-12T11:20:10.999Z"^^xsd:dateTime.
    `



/**
 * transforms state of the world (quads; the mandatory triples) (old version*)
 * to the new version using Notation3 and EyeJs
 * 
 * old version: see `Interoperable Interpretation and Evaluation of ODRL Policies`, https://link.springer.com/chapter/10.1007/978-3-031-94578-6_11
 * new version: https://spec.knows.idlab.ugent.be/sotw/latest/ (15 august)
 */
async function transformSotw(oldsotw: Quad[]): Promise<Quad[]> {
    const notation3Rule = `
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix ex: <http://example.org/> .
@prefix temp: <http://example.com/request/> .
@prefix dct: <http://purl.org/dc/terms/> .
@prefix string: <http://www.w3.org/2000/10/swap/string#> .
@prefix log: <http://www.w3.org/2000/10/swap/log#> .
@prefix sotw: <https://w3id.org/force/sotw#> .


{
    temp:currentTime dct:issued ?issuedTime .

    ( temp:currentTime ) :getUUID ?urnUuidSotw .
    ( ?issuedTime ) :getUUID ?urnUuidTime .
}
=>
{
    ?urnUuidSotw a sotw:SotW ;
    sotw:currentTime ?urnUuidTime .        
    ?urnUuidTime dct:issued "2024-02-12T11:20:10.999Z"^^xsd:dateTime.

} .

# uuid backward rule (component)
{
   ?input :getUUID ?urnUuid 
}
<= 
{
   ?input log:skolem ?uniqueNode .
   ?uniqueNode log:uuid ?uuidString .
   ( "urn:uuid:" ?uuidString ) string:concatenation ?urnUuidString .
   ?urnUuid log:uri ?urnUuidString .
} .`
    const eye = new EyeJsReasoner();
    const newSotwStore = await eye.reason(new Store(oldsotw), [notation3Rule])
    return newSotwStore.getQuads(null, null, null, null)
}

/**
 * Transforms the evaluation request (quads) (old version*) 
 * to the new version using Notation3 and EyeJs
 * 
 * Note: as the new request requires time, this is added as well.
 * 
 * old version: see `Interoperable Interpretation and Evaluation of ODRL Policies`, https://link.springer.com/chapter/10.1007/978-3-031-94578-6_11
 * new version: https://spec.knows.idlab.ugent.be/sotw/latest/ (15 august)
 */
async function transformRequest(oldRequest: Quad[], time = new Date()): Promise<Quad[]> {
    // transfer old requests to the new version as defined in https://spec.knows.idlab.ugent.be/sotw/latest/
    // requires the new state of the world representation and the old request
    const notation3Rule =
        `@prefix odrl: <http://www.w3.org/ns/odrl/2/> .
@prefix sotw: <https://w3id.org/force/sotw#> .
@prefix faqir: <https://faqir.org/> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
@prefix ex: <http://example.org/> .
@prefix string: <http://www.w3.org/2000/10/swap/string#> .
@prefix log: <http://www.w3.org/2000/10/swap/log#> .

{
    ?policy a odrl:Request ;
        odrl:permission ?perm .
    ?perm a odrl:Permission ;
        odrl:action ?action ;
        odrl:target ?target ;
        odrl:assignee ?assignee .
        ( ?policy ) :getUUID ?urnUuid .

    ex:sotw a sotw:SotW ;
        sotw:currentTime ?timeNode .
    ?timeNode dcterms:issued ?issuedTime .
}
=>
{
    ?urnUuid a sotw:EvaluationRequest ;
        dcterms:issued ?issuedTime ;
        sotw:requestedAction ?action ;
        sotw:requestingParty ?assignee ;
        sotw:requestedTarget ?target .
} .

# uuid backward rule (component)
{
   ?input :getUUID ?urnUuid 
}
<= 
{
   ?input log:skolem ?uniqueNode .
   ?uniqueNode log:uuid ?uuidString .
   ( "urn:uuid:" ?uuidString ) string:concatenation ?urnUuidString .
   ?urnUuid log:uri ?urnUuidString .
} .`

    const sotwTime = `
@prefix sotw:    <https://w3id.org/force/sotw#> .
@prefix dct: <http://purl.org/dc/terms/>.
@prefix xsd: <http://www.w3.org/2001/XMLSchema#>.
@prefix ex: <http://example.org/>. 

ex:sotw a sotw:SotW ;
    sotw:currentTime ex:currentTime .
    
ex:currentTime dct:issued "${time.toISOString()}"^^xsd:dateTime.
    `
    const timeQuads = new Parser().parse(sotwTime);
    const eye = new EyeJsReasoner();
    const newSotwStore = await eye.reason(new Store([...oldRequest, ...timeQuads]), [notation3Rule])
    return newSotwStore.getQuads(null, null, null, null)
}
async function main() {
    const parser = new Parser()
    // testing old vs new sotw and evaluation requests
    // console.log(new Writer().quadsToString(await transformSotw(new Parser().parse(sotwOld))));
    // console.log(new Writer().quadsToString(await transformRequest(new Parser().parse(requestOld))));

    const eye = new EyeReasoner('eye', ["--quiet", "--nope", "--pass-only-new"])
    const engine = new ODRLEngineMultipleSteps({ reasoner: eye })
    const odrlEvaluator = new CompositeODRLEvaluator(engine);

    const requestQuads = parser.parse(requestOld);
    const requestPurposeQuads = parser.parse(requestOldPurposeAccountManagement);
    const sotwQuads = parser.parse(sotwOld);

    // TODO: util function to create evaluation request, output old and output new
    // TODO: util function to create state of the world, output old and output new
    const policySinglePurpose = parser.parse(policy22); // target and subject will not match 
    const policyMultipleNonManagementPurpose = parser.parse(policy23); // target and purpose will not match
    const policyMultiplePurpose = parser.parse(policy24); // subject will not match

    const reportSinglePurpose_Absent = await odrlEvaluator.evaluate(policySinglePurpose, requestQuads, sotwQuads);
    const reportSinglePurpose_Present = await odrlEvaluator.evaluate(policySinglePurpose, requestPurposeQuads, sotwQuads);
    const reportMultipleNonManagementPurpose_Absent = await odrlEvaluator.evaluate(policyMultipleNonManagementPurpose, requestQuads, sotwQuads);
    const reportMultipleNonManagementPurpose_Present = await odrlEvaluator.evaluate(policyMultipleNonManagementPurpose, requestPurposeQuads, sotwQuads);
    const reportMultiplePurpose_Absent = await odrlEvaluator.evaluate(policyMultiplePurpose, requestQuads, sotwQuads);
    const reportMultiplePurpose_Present = await odrlEvaluator.evaluate(policyMultiplePurpose, requestPurposeQuads, sotwQuads);

    await printTestCase(reportSinglePurpose_Absent, 1, 4, "(action)");
    await printTestCase(reportSinglePurpose_Present, 2, 4, "(action and purpose)");
    await printTestCase(reportMultipleNonManagementPurpose_Absent, 2, 4, "(subject and action)");
    await printTestCase(reportMultipleNonManagementPurpose_Present, 2, 4, "(subject and action)");
    await printTestCase(reportMultiplePurpose_Absent, 2, 4, "(action and target)");
    await printTestCase(reportMultiplePurpose_Present, 3, 4, "(action, target and purpose)");

    // const atomizer = new Atomizer();
    // const atomizedRules = await atomizer.atomizePolicies(policyMultipleNonManagementPurpose);
    // console.log(await write(atomizedRules[0].atomizedRuleQuads, {prefixes}));

    // const atomizedEvaluatedRules: AtomizedEvaluatedRule[] = []
    // for (const policy of atomizedRules) {
    //     const report = await new ODRLEvaluator(engine).evaluate(policy.atomizedRuleQuads, requestQuads, sotwQuads);
    //     atomizedEvaluatedRules.push({
    //         ...policy,
    //         policyReportQuads: report
    //     });
    // }

    // const report = atomizer.mergeAtomizedRuleReports(atomizedEvaluatedRules);
}
main()

// assumes one permission per policy to be evaluated
async function printTestCase(report: Quad[], expectedPremises: number, expectedTotalPremises: number, reason?: string): Promise<void> {
    const parsedReport = parseSingleComplianceReport(report);

    const actualSatisfiedPremises = countPremisesSatisfied(parsedReport.ruleReport[0]);
    const actualTotalPremises = parsedReport.ruleReport[0].premiseReport.length
    console.log(`Expecting (${expectedPremises}/${expectedTotalPremises}) premises ${reason}. Actual amount:(${actualSatisfiedPremises}/${actualTotalPremises})`);
    // console.log(await write(report));
    console.log("#######################################################################################################################")
    console.log();
}

function parseSingleComplianceReport(quads: Quad[]): PolicyReport {
    const store = new Store(quads)
    const reportID = store.getSubjects(RDF.type, REPORT.PolicyReport, null)[0]
    return parseComplianceReport(reportID, store);
}

function countPremisesSatisfied(ruleReport: RuleReport) {
    return ruleReport.premiseReport.filter(premiseReport => premiseReport.satisfactionState === SatisfactionState.Satisfied).length
}
