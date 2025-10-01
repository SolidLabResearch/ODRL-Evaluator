import type { Quad } from '@rdfjs/types';
import { ODRLEngine, Engine } from './Engine';
import { RDFValidator, TripleTermValidator, SHACLValidator } from './Validate';
import { materializePolicy } from './DynamicConstraint';
import { AtomizedEvaluatedRule, Atomizer } from './Atomizer';

export interface Evaluator {
    /**
     * Based on a set of policies, a formal description of the world,
     * and, in the case of access control, an access control,
     * determine whether the usage of data was and is permitted 
     * and whether all obligations have been met.
     * 
     * @param policy - A Usage Control Policy (represented in RDF).
     * @param request - An Access Control Request (represented in RDF).
     * @param state - The state of the world (represented in RDF).
     * @returns A conformance report
     */
    evaluate: (policy: Quad[], request: Quad[], state: Quad[]) => Promise<Quad[]>;
}

export class ODRLEvaluator implements Evaluator {
    private readonly rdfValidator: RDFValidator;
    private readonly tripleTermValidator: TripleTermValidator;
    private readonly shaclValidator: SHACLValidator;
    private readonly engine: Engine

    constructor(engine = new ODRLEngine()) {
        this.rdfValidator = new RDFValidator();
        this.tripleTermValidator = new TripleTermValidator();
        this.shaclValidator = new SHACLValidator();

        // note the following is ugly, but for a first prototype it is fine
        this.engine = engine;
    }

    public async evaluate(policy: Quad[], request: Quad[], state: Quad[]): Promise<Quad[]> {
        // check if all parameters are RDF
        // if the parameters are not RDF, it is impossible to reason over them (or validate some structure)
        const policyValidRDF = await this.rdfValidator.simpleValidate(policy)
        const requestValidRDF = await this.rdfValidator.simpleValidate(request)
        const stateValidRDF = await this.rdfValidator.simpleValidate(state)
        if (!(policyValidRDF && requestValidRDF && stateValidRDF)) {
            const errorMessage = `Following input is not RDF: ${policyValidRDF ? "" : "policy, "} ${requestValidRDF ? "" : "request, "} ${stateValidRDF ? "" : "state"}.`
            throw Error(errorMessage);
        }

        // check whether parameters are true triples
        // if some parameters are quads, the reasoner might not execute
        const policyOnlyTriples = await this.tripleTermValidator.simpleValidate(policy)
        const requestOnlyTriples = await this.tripleTermValidator.simpleValidate(request)
        const stateOnlyTriples = await this.tripleTermValidator.simpleValidate(state)
        if (!(policyOnlyTriples && requestOnlyTriples && stateOnlyTriples)) {
            const errorMessage = `Following input contains quads: ${policyOnlyTriples ? "" : "policy, "} ${requestOnlyTriples ? "" : "request, "} ${stateOnlyTriples ? "" : "state"}.`
            throw Error(errorMessage);
        }
        // check whether the policy and request conform to the SHACL shape of ODRL
        // if not, it makes no sense to do ODRL evaluation

        // cardinality check: if there is no policy, nothing can be evaluated
        // Questions: can there be more than 1 policy or must it be exactly one?
        // There can be multiple policies -> see formal semantics group

        // policy decomposition must happen to reduce the rules in the policy to atomic rules
        // see ODRL § 2.7 Policy Rule Composition (https://www.w3.org/TR/odrl-model/#composition)

        // if there are compact policies -> they must be expanded (also reocmmended by ODRL § 2.7.1 Compact Policy)

        // handle dynamic policies
        const instantiatedPolicies = materializePolicy(policy, state);
        // evaluate
        // the evaluation will result into a conformance report
        const evaluation = await this.engine.evaluate([...instantiatedPolicies, ...request, ...state])

        // TODO: think about when the report can be empty
        // does it always mean there is not enough information?
        // Is there any way to detect the missing information?

        return evaluation;
    }
}

/**
 * ODRL Evaluator that deals with § 2.7 Policy Rule Composition (https://www.w3.org/TR/odrl-model/#composition)
 */
export class CompositeODRLEvaluator extends ODRLEvaluator {
    constructor(engine = new ODRLEngine()) {
        super(engine);
    }

    public async evaluate(policy: Quad[], request: Quad[], state: Quad[]): Promise<Quad[]> {
        const atomizer = new Atomizer();
        const atomizedRules = await atomizer.atomizePolicies(policy);

        const atomizedEvaluatedRules: AtomizedEvaluatedRule[] = []
        for (const policy of atomizedRules) {
            const report = await super.evaluate(policy.atomizedRuleQuads, request, state);
            atomizedEvaluatedRules.push({
                ...policy,
                policyReportQuads: report
            });
        }
        
        const report = atomizer.mergeAtomizedRuleReports(atomizedEvaluatedRules);
        return report;
    }
}