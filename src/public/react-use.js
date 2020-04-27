import {useState, useEffect} from 'react';
import {listenOptionsChange} from './options';
import {getLocalStorage, onExtensionMessage} from './chrome-call';
import defaultOptions from '../constants/defaultOptions';
import {getCurrentTabHost} from './utils';

export const useOptions = (keys) => {
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

export const useOnExtensionMessage = () => {
    const [message, setMessage] = useState({});

    useEffect(
        () => onExtensionMessage(msg => setMessage(msg)),
        []
    );

    return message;
};

export const useIsEnable = (enableType, host = '') => {
    const [enable, setEnable] = useState(false);

    const {
        [`${enableType}HostList`]: list,
        [`${enableType}BlackListMode`]: bMode
    } = useOptions([`${enableType}HostList`, `${enableType}BlackListMode`]);

    useEffect(
        () => {
            if (host) {
                const find = list.some(v => host.endsWith(v));
                setEnable(bMode? !find: find);
            }
            else {
                getCurrentTabHost((tabHost) => {
                    const find = list.some(v => tabHost.endsWith(v));
                    setEnable(bMode? !find: find);
                });
            }
        },
        [list, bMode, host]
    );

    return enable;
};