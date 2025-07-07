import { startTransition, useCallback, useRef, useState } from 'react';

const useRippleActivationClassName = (activationClassName: string, deactivationClassName: string): [string, () => void] => {
    const [className, setClassName] = useState('');

    const clearClassNameTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
    const classNameRef = useRef('');

    const setClassNameWithRef = useCallback((className: string) => {
        setClassName(className);
        classNameRef.current = className;
    }, []);

    const onDeactivate = useCallback(() => {
        clearClassNameTimeoutRef.current = setTimeout(() => {
            setClassNameWithRef(deactivationClassName);

            clearClassNameTimeoutRef.current = setTimeout(() => setClassNameWithRef(''), 200);
        }, 100);

        window.removeEventListener('mouseup', onDeactivate, true);
    }, [deactivationClassName, setClassNameWithRef]);

    const onActivate = useCallback(() => {
        clearClassNameTimeoutRef.current && clearTimeout(clearClassNameTimeoutRef.current);

        classNameRef.current && setClassNameWithRef('');
        startTransition(() => setClassNameWithRef(activationClassName));

        window.addEventListener('mouseup', onDeactivate, true);
    }, [activationClassName, onDeactivate, setClassNameWithRef]);

    return [className, onActivate];
};

export default useRippleActivationClassName;