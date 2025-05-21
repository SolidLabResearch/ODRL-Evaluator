import { createVocabulary } from 'rdf-vocabulary';

export const RDF = createVocabulary(
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    'type',
);

export const ODRL = createVocabulary(
    'http://www.w3.org/ns/odrl/2/',
    'Agreement',
    'Offer',
    'Permission',
    'Policy',
    'Request',
    'Set',
    'action',
    'target',
    'assignee',
    'assigner',
    'constraint',
    'operator',
    'permission',
    'dateTime',
    'purpose',
    'uid',
    'leftOperand',
    'rightOperand',
    'rightOperandReference',
    'gt',
    'gteq',
    'lt',
    'lteq',
    'eq',
    'neq',
    'read'
);

export const ODRLUC = createVocabulary("https://w3id.org/force/odrl3proposal#",
    "OperandReference",
    "reference",
    "path"
)