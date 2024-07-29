import { useRef, useState } from 'react';
import { getLocalStorage } from '../chrome-call';
import defaultOptions from '../../constants/defaultOptions';
import useEffectOnce from './useEffectOnce';
import { DefaultOptions } from '../../types';
import scOptions from '../sc-options';

const useOptions = <T extends keyof DefaultOptions>(keys: T[]) => {
    const [curOptions, setCurOptions] = useState<Pick<DefaultOptions, T>>(defaultOptions);

    const curOptionsRef = useRef<typeof curOptions>(defaultOptions);

    useEffectOnce(() => {
        getLocalStorage<typeof curOptions>(keys, (data) => {
            setCurOptions(data);

            curOptionsRef.current = data;
        });

        const removeListener = scOptions.listen(keys, (changes) => {
            curOptionsRef.current = { ...curOptionsRef.current, ...changes };

            setCurOptions(curOptionsRef.current);
        });

        return removeListener;
    });

    return curOptions;
};

export default useOptions;