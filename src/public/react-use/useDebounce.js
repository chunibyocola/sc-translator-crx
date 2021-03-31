import { useEffect, useRef } from 'react';

const useDebounce = (fn, ms, deps) => {
    const timerRef = useRef(null);
    const debounceRef = useRef(null);
    const callbackRef = useRef(fn);

    useEffect(() => {
        callbackRef.current = fn;
    }, [fn]);

    useEffect(() => {
        debounceRef.current = () => {
            timerRef.current && clearTimeout(timerRef.current);
            timerRef.current = setTimeout(callbackRef.current, ms);
        };

        return () => clearTimeout(timerRef.current);
    }, [ms]);

    useEffect(() => {
        debounceRef.current();
        // eslint-disable-next-line
    }, deps);
};

export default useDebounce;