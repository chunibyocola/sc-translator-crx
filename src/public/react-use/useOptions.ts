import { useRef, useState } from 'react';
import { getLocalStorage } from '../chrome-call';
import { listenOptionsChange } from '../options';
import defaultOptions from '../../constants/defaultOptions';
import useEffectOnce from './useEffectOnce';
import { DefaultOptions } from '../../types';

const useOptions = <T>(keys: (keyof DefaultOptions)[]) => {
    const [curOptions, setCurOptions] = useState<Partial<DefaultOptions>>(defaultOptions);

    const curOptionsRef = useRef<Partial<DefaultOptions>>(defaultOptions);

    useEffectOnce(() => {
        getLocalStorage<Partial<DefaultOptions>>(keys, (data) => {
            setCurOptions(data);

            curOptionsRef.current = data;
        });

        const removeListener = listenOptionsChange<Partial<DefaultOptions>>(keys, (changes) => {
            curOptionsRef.current = { ...curOptionsRef.current, ...changes };

            setCurOptions(curOptionsRef.current);
        });

        return removeListener;
    });

    return curOptions as T;
};

export default useOptions;