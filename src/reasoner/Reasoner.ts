import { Store, Parser, Writer } from "n3";

// copy from https://github.com/eyereasoner/Koreografeye/tree/e2c980c64b230ccbd65a5d0e0bf22cdf0cd5d21c/src/orchestrator/reasoner + my own util functions
export abstract class Reasoner {
    constructor() {
    }

    /**
     * Run the reasoner
     * @returns An N3 string containing the result of the inferences
     */
    public abstract run(abox: string[], tbox: string[]): Promise<string>;

    /**
     * Reason on an N3 store of triples with zero or more N3 rules descriptions.
     * This is a convenience method for:
     *     reasoner.aboxAppend(n3);
     *     reasoner.tboxAppend(n3_rule);
     *     reasoner.run()
     *     reasoner.cleanup()
     * @param dataStore - An N3 Store containing data
     * @param rules - An array of zero or more N3 rules
     * @returns An N3 Store with the reasoning result
     */
    public async reason(dataStore: Store, rules: string[]): Promise<Store> {

        const n3 = new Writer().quadsToString(dataStore.getQuads(null, null, null, null));

        if (!n3) {
            throw new Error(`failed to transform store to turtle`);
        }

        const result = await this.run([n3], rules);

        const resultStore = new Store(new Parser().parse(result));
    
        return resultStore;
    }
}
