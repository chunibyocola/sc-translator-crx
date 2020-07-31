import { useEffect, useState } from 'react';
import { getLocalStorage } from '../chrome-call';
import { listenOptionsChange } from '../options';
import defaultOptions from '../../constants/defaultOptions';

const useOptions = (keys) => {
    const [curOptions, setCurOptions] = useState(defaultOptions);

    useEffect(
        () => {
            getLocalStorage(keys, (data) => { setCurOptions(data); });

            const removeListener = listenOptionsChange(keys, () => {
                getLocalStorage(keys, data => setCurOptions(data));
            });

            return removeListener;
        },
        []
    );

    return curOptions;
};

export default useOptions;