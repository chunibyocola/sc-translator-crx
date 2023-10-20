import { createContext } from 'react';

const TagSetContext = createContext<Set<string>>(new Set());

export default TagSetContext;