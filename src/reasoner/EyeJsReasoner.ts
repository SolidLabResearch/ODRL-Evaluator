import { n3reasoner } from "eyereasoner/dist";
import { Reasoner } from "./Reasoner";

export class EyeJsReasoner extends Reasoner {
    constructor() {
        super();
    }

    public async run(abox: string[], tbox: string[]): Promise<string> {
        const data = abox.join("\n");
        const query = tbox.join("\n");

        // Does the same as `npx eyereasoner --nope --quiet --pass-only-new data&query.n3`
        return await n3reasoner(data + query, undefined, { output: "derivations" })
    }
}
