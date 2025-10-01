import * as path from "path"
import * as fs from "fs"
import { combineNotation3Files } from "../src/util/Notation3Util";

const shapeDir = path.join(path.dirname(__filename), "..", "src", "shapes");
// initialize the shapes as a ts file (constant) such that it can be used in the browser

function shapes(){
    const fileNames = ["shape.ttl"]

    const shapePaths = fileNames.map(fileName => path.join(shapeDir, fileName));
    const shapes = combineNotation3Files(shapePaths); // note: this could be done more elegantly, but it should do the trick. Combining multiple shape files (ttl) in as one string.
    const shapeTSContent = `export const SHAPES: string = \`${shapes}\``;
    fs.writeFileSync(path.join(shapeDir, "Shapes.ts"), shapeTSContent);
}
shapes()