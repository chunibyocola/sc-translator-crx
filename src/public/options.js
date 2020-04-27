import {onStorageChanged} from './chrome-call';
import defaultOptions from '../constants/defaultOptions';

const listeners = [];

let options = defaultOptions;

export const initOptions = (init) => {
    options = init;
};

export const getOptions = () => {
    return options;
};

export const listenOptionsChange = (keys, listener) => {
    if (!Array.isArray(keys)) return;

    const onChange = (changes) => {
        const tempObj = {};

        keys.map((v) => (v in changes && (tempObj[v] = changes[v].newValue)));

        Object.keys(tempObj).length && listener && listener(tempObj);
    };

    listeners.push(onChange);

    return () => listeners.splice(listeners.indexOf(onChange), 1);
};

onStorageChanged(
    changes => listeners.map(v => v && v(changes))
);