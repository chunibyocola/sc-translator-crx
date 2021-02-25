import { useRef, useState } from 'react';
import { getLocalStorage } from '../chrome-call';
import { listenOptionsChange } from '../options';
import defaultOptions from '../../constants/defaultOptions';
import useEffectOnce from './useEffectOnce';

const useOptions = (keys) => {
    const [curOptions, setCurOptions] = useState(defaultOptions);

    const curOptionsRef = useRef(null);

    useEffectOnce(() => {
        getLocalStorage(keys, (data) => {
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