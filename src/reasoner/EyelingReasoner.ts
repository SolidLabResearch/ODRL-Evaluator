import { Reasoner } from "./Reasoner";
import { reason } from "eyeling"

export class EyelingReasoner extends Reasoner {
    constructor() {
        super();
    }

    public async run(abox: string[], tbox: string[]): Promise<string> {
        const data = abox.join("\n");
        const query = tbox.join("\n");

        return reason({ output: "derivations", proofComments: false }, data + query)
    }
}
