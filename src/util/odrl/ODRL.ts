import { Quad, Store } from "n3";
import { RDF } from "../Vocabulary";
/**
 * Policy from ODRL information Model 2.2
 */
interface Policy {
    uid: string;
    /** Policy | Set | Agreement | Request
     * Note that Request only has one rule ( a permission)
     */
    type: string;
    rule: Rule[]; // replaces odrl:permission, odrl:prohibition and odrl:duty
    profile: string[];
    inheritFrom: Policy[];
    conflict: string[];
}


interface Rule {
    type: string;
    action: Action;
    assigner?: Party;
    assignee?: Party;
    target?: Asset;
    constraint: Constraint[]
}

interface Permission extends Rule {
    target: Asset;
    duty: Duty[];
}

interface Prohibition extends Rule {
    target: Asset;
    remedy: Duty[];
}

interface Duty extends Rule {
    consequence: Duty[];
}

interface Action {
    type: string;
}

interface Party {
    /** Denotes whether the Party is a PartyCollection or just a Party */
    type: string;
    // identifies the party
    uid: string;
}

interface PartyCollection extends Party {
    /** Used to search for the party members in the state of the world */
    source: string
    members(quads: Quad[]): string[];
}

interface Asset {
    /** Denotes whether the Asset is a AssetCollection or just an Asset */
    type: string;
    // identifies the asset
    uid: string;

}

interface AssetCollection extends Asset {
    /** Used to search for the asset members in the state of the world */
    source: string
    members(quads: Quad[]): string[];
}

type Constraint = LogicalConstraint | NormalConstraint

interface LogicalConstraint {
    uid: string;
    operand: string;
    constraints: Constraint[];
}

interface NormalConstraint {
    uid: string;
    leftOperand: string;
    operator: string;
    rightOperand: string
}

//
function parseODRLPolicies(input: {
    policy: Store | Quad[],
    stateOfTheWorld: Store | Quad[]
}): Policy[]{
    throw new Error("Not defined");

}

// expect one valid ODRL policy
function parseODRLPolicy(input:
    {
        policy: Store | Quad[],
        policyIdentifier: string,
        stateOfTheWorld: Store | Quad[]
    }): Policy {
    
    const store: Store = input.policy instanceof Store ? input.policy : new Store(input.policy);

    const type = store.getObjects(input.policyIdentifier, RDF.type, null)
    // must be at least 1
    // must be either Policy, Set, Agreement or Request


    const policy: Policy = {
        uid: input.policyIdentifier,
        type: "",
        rule: [],
        profile: [],
        inheritFrom: [],
        conflict: []
    }

    throw new Error("Not defined");
}

/**
 * Filters over the policies to only get the relevant rules.
 * 
 * The query is executed over the policies.
 * All rules (and the policies they belong to) that conform to the filter are returned.
 * 
 * @param query 
 * @param storage 
 */
function filterRules(
    query: { subject?: string, accessRight?: string, resource?: string },
    storage: { policies: Store | Quad[], stateOfTheWorld?: Store | Quad[] }, 
    options?: {
        inferences: {
            exactMatch: boolean,
            includedIn: boolean,
        },
        collection: boolean
    }): Policy[]{
        throw new Error("Not defined");

}

