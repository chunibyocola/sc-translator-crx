import { DependencyList, useMemo } from 'react';
import { debounce } from '../utils';

const useDebounceFn = (fn: () => void, ms: number, deps: DependencyList) => {
    // eslint-disable-next-line
    const debounceFn = useMemo(() => debounce(fn, ms), [ms, ...deps]);

    return debounceFn;
};

export default useDebounceFn;