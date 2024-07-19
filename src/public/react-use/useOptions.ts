import { useRef, useState } from 'react';
import { getLocalStorage } from '../chrome-call';
import { listenOptionsChange } from '../options';
import defaultOptions from '../../constants/defaultOptions';
import useEffectOnce from './useEffectOnce';
import { DefaultOptions } from '../../types';

const useOptions = <T extends keyof DefaultOptions>(keys: T[]) => {
    const [curOptions, setCurOptions] = useState<Pick<DefaultOptions, T>>(defaultOptions);

    const curOptionsRef = useRef<typeof curOptions>(defaultOptions);

    useEffectOnce(() => {
        getLocalStorage<typeof curOptions>(keys, (data) => {
            setCurOptions(data);

            curOptionsRef.current = data;
        });

        const removeListener = listenOptionsChange(keys, (changes) => {
            curOptionsRef.current = { ...curOptionsRef.current, ...changes };

            setCurOptions(curOptionsRef.current);
        });

        return removeListener;
    });

    return curOptions;
};

export default useOptions;