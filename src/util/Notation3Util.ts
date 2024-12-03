// Reason for these support functions is the lack of support for Notation3 parsing and writing
// notation3 parsing: https://github.com/rdfjs/N3.js/issues/324
// notation3 writing: https://github.com/rdfjs/N3.js/issues/316
// might be overcome with support for TriG (https://www.w3.org/TR/trig/) in reasoners as that is a standard
import { readFileSync } from "fs";

/**
 * Represents the result of splitting a Notation3 rule into its prefixes and the remaining Notation3 text.
 */
type SplitNotation3 = {
    /**
     * The prefixes part of the Notation3 text.
     */
    prefixes: string,
    /**
     * The remaining Notation3 text without prefixes.
     */
    notation3: string
}

/**
 * Combines multiple Notation3 files into a single Notation3 text.
 * 
 * @param {string[]} paths - An array of file paths to Notation3 files.
 * @returns {string} The combined Notation3 text from the files.
 */
export function combineNotation3Files(paths: string[]): string {
    const notation3Texts: string[] = []
    for (const path of paths) {
        const text = readFileSync(path, "utf-8");
        notation3Texts.push(text);
    }
    return combineNotation3(notation3Texts);
}

/**
 * Combines multiple Notation3 texts into a single Notation3 text.
 * 
 * @param {string[]} notation3Texts - An array of Notation3 texts to combine.
 * @returns {string} The combined Notation3 text.
 */
export function combineNotation3(notation3Texts: string[]): string {
    const prefixes: string[] = [];
    const notation3: string[] = [];

    // loop over all prefixes and put them at top
    for (const notation3Text of notation3Texts) {
        const splitN3 = splitPrefixRules(notation3Text);
        prefixes.push(splitN3.prefixes);
        notation3.push(splitN3.notation3);
    }
    return prefixes.join("\n") + "\n" + notation3.join("\n");
}



/**
 * Splits a Notation3 rule into its prefixes and the remaining Notation3 text.
 * 
 * @param {string} rule - The Notation3 rule to split.
 * @returns {SplitNotation3} An object containing the prefixes and the remaining Notation3 text.
 */
export function splitPrefixRules(rule: string): SplitNotation3 {
    const lines = rule.split("\n");
    const prefixes: string[] = [];
    const ruleLines: string[] = [];

    for (const line of lines) {
        const re = /^(@prefix [a-zA-Z]*:|@base |(P|p)(R|r)(E|e)(F|f)(I|i)(X|x) [a-zA-Z]*:|(B|b)(A|a)(S|s)(E|e) )/g;
        if (re.test(line)) {
            prefixes.push(line);
        }
        else {
            ruleLines.push(line);
        }
    }
    return { prefixes: prefixes.join("\n"), notation3: ruleLines.join("\n") };
}

