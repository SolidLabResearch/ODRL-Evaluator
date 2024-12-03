import * as fs from 'fs';
import { spawn } from 'node:child_process';
import { fileSync } from "tmp";
import { Reasoner } from "./Reasoner";

/**
 * A reasoner implementing the command line EYE
 * See also https://github.com/eyereasoner/eye
 */
export class EyeReasoner extends Reasoner {
    private eye   : string;
    private args  : string[];

    /**
     * Constructor
     * @param eye - The path to the eye reasoner
     * @param args - Default startup parameters
     */
    constructor(eye: string, args: string[]) {
        super();
        this.eye = eye;
        this.args = args;
    }

    /**
     * Run the reasoner
     * @returns An N3 string containing the result of the inferences
     */
    public async run(abox: string[], tbox: string[]) : Promise<string> {
        const tmpobj = fileSync();

        abox.forEach( (str) => {
          fs.appendFileSync(tmpobj.name,str);
        });

        tbox.forEach( (str) => {
          fs.appendFileSync(tmpobj.name,str);
        });

        const all_args = this.args.concat(tmpobj.name);

        return new Promise<string>(async (resolve, reject) => {
            let errorData = '';
            let resultData = '';
            
            const ls = spawn(this.eye, all_args);
            ls.stdout.on('data', (data) => {
              resultData += data;
            });
            ls.stderr.on('data', (data) => {
              errorData += data;
            });
            ls.on('close', (code) => {
              if (code != 0) {
                tmpobj.removeCallback();
                return reject(errorData);
              }
              else {
                tmpobj.removeCallback();
                return resolve(resultData);
              }
            });
        });
    }
}