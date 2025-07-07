import { DependencyList, useEffect, useRef } from 'react';

const useDebounce = (fn: () => void, ms: number, deps: DependencyList) => {
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const debounceRef = useRef<() => void>(undefined);
    const callbackRef = useRef(fn);

    useEffect(() => {
        callbackRef.current = fn;
    }, [fn]);

    useEffect(() => {
        debounceRef.current = () => {
            timerRef.current && clearTimeout(timerRef.current);
            timerRef.current = setTimeout(callbackRef.current, ms);
        };

        return () => {
            timerRef.current && clearTimeout(timerRef.current)
        };
    }, [ms]);

    useEffect(() => {
        debounceRef.current?.();
        // eslint-disable-next-line
    }, deps);
};

export default useDebounce;