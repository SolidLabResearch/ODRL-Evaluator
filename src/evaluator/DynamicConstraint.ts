import { Quad, Term } from "@rdfjs/types";
import { Literal, NamedNode, Store } from 'n3';
import { BasicLensM, CBDLens, Cont, pred, ShaclPath } from "rdf-lens";
import { ODRL, ODRLUC, RDF } from "../util/Vocabularies";

// use RDF lens instead of clownface for SHACL Property Paths: https://ceur-ws.org/Vol-3759/paper13.pdf
export const pathLens = pred(ODRLUC.terms.path)
  .one()
  .then(ShaclPath);

// Utility function to extract the SHACL property path of the Dynamic ODRL Policy using `odrluc:path`
export function getPath(id: Term, quads: Quad[]): BasicLensM<Cont, Term> {
  return pathLens.execute({ id, quads }).mapAll((x) => x.id);
}

// Utility function to extract the value from an external resource using a SHACL Property path
export function usePath(id: Term, quads: Quad[], lens: BasicLensM<Cont, Term>): Term[] {
  return lens.execute({ id, quads })
}

// implements dynamic policy constraint algorithm
// algorithm to fetch value using SHACL path from sotw in policy
// will only materialize when RightOperandReference class is present
export function materializePolicy(dynamicPolicy: Quad[], stateOfTheWorld: Quad[]): Quad[] {
    const odrlPolicyStore = new Store(dynamicPolicy)
    const odrlDynamicPolicyStore = new Store(dynamicPolicy)
  
    // get all constraints containing references
    const operandReferenceNodes = odrlDynamicPolicyStore.getSubjects(RDF.terms.type, ODRLUC.terms.OperandReference, null);
  
    for (const operandReferenceNode of operandReferenceNodes) {
      // ODRL constraint that has that given rightOperandReference
      const constraintNodes = odrlDynamicPolicyStore.getSubjects(ODRL.terms.rightOperandReference, operandReferenceNode, null)

      // external resource
      const externalResource = odrlDynamicPolicyStore.getObjects(operandReferenceNode, ODRLUC.terms.reference, null)[0]
      if (!externalResource) { 
          throw Error("There is no source present in the Dynamic Policy Constraint.")
      }
      
      // SHACL Property path
      const lens = getPath(operandReferenceNode, dynamicPolicy); 
  
      // extract SHACL Property Path using clownface
      const getValue = usePath(externalResource, stateOfTheWorld, lens);
      const instantiatedValue = getValue[0]; // according to the algorithm (see paper), there should be only one term
      
      if (!(instantiatedValue instanceof NamedNode || instantiatedValue instanceof Literal)) {
          // Now term is a valid Quad_Object
          throw Error("Instantiated value is not a proper value.");
      }
      for (const constraintNode of constraintNodes) {
        // remove rightOperandRefrence triple from constraint
        odrlPolicyStore.removeQuad(constraintNode, ODRL.terms.rightOperandReference, operandReferenceNode)
        // add materialized rightOperand
        odrlPolicyStore.addQuad(constraintNode, ODRL.terms.rightOperand, instantiatedValue)
      }
  
      // remove OperandReference triples from Policy store
      const operandReferenceQuads = CBDLens.execute({id:operandReferenceNode, quads: dynamicPolicy})
      odrlPolicyStore.removeQuads(operandReferenceQuads)
    }
    return odrlPolicyStore.getQuads(null, null, null, null)
  }
  
  