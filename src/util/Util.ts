import { v4 as uuidv4 } from 'uuid';

/**
 * Helper to generate URNs from UUIDs.
 * Produces identifiers in the form: urn:uuid:<UUID>
 */
export function createRandomUrn(): string {
  return `urn:uuid:${uuidv4()}`;
}