import {onStorageChanged} from './chrome-call';
import defaultOptions from '../constants/defaultOptions';
import { DefaultOptions } from '../types';

const listeners: ((changes: { [key: string]: chrome.storage.StorageChange; }) => void)[] = [];

let options = defaultOptions;

export const initOptions = (init: DefaultOptions) => {
    options = init;
};

export const getOptions = () => {
    return options;
};

export const listenOptionsChange = <T>(keys: (keyof DefaultOptions)[], listener: (changes: Partial<T>) => void) => {
    const onChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
        const tempObj: { [key: string]: any } = {};

        keys.map((v) => (v in changes && (tempObj[v] = changes[v].newValue)));

        Object.keys(tempObj).length && listener && listener(tempObj as Partial<T>);
    };

    listeners.push(onChange);

    return () => {
        listeners.splice(listeners.indexOf(onChange), 1);
    };
};

onStorageChanged(
    changes => listeners.map(v => v && v(changes))
);