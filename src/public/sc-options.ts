import defaultOptions from '../constants/defaultOptions';
import { DefaultOptions } from '../types';

const listeners: ((changes: { [key: string]: chrome.storage.StorageChange; }) => void)[] = [];

chrome.storage.onChanged.addListener((changes, areaName) => {
    areaName === 'local' && listeners.map(listener => listener(changes));
});

const scOptions = (() => {
    let initOptions = defaultOptions;

    return {
        get: <T extends keyof DefaultOptions>(keys: T[] | null): Promise<typeof keys extends null ? DefaultOptions : Pick<DefaultOptions, T>> => {
            return new Promise((resolve) => {
                chrome.storage.local.get(keys, items => resolve(items as Pick<DefaultOptions, T>))
            });
        },
        set: (items: Partial<DefaultOptions>) => {
            chrome.storage.local.set(items);
        },
        init: async () => {
            initOptions = await scOptions.get(null);

            return initOptions;
        },
        getInit: () => initOptions,
        setInit: (items: Partial<DefaultOptions>) => {
            initOptions = { ...initOptions, ...items };
        },
        listen: <T extends keyof DefaultOptions>(keys: T[], listener: (changes: Partial<Pick<DefaultOptions, T>>) => void) => {
            const onChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
                const changed: { [key: string]: any; } = {};

                keys.forEach((key) => {
                    if (key in changes) {
                        changed[key] = changes[key].newValue
                    }
                });

                Object.keys(changed).length && listener(changed as Partial<Pick<DefaultOptions, T>>);
            };

            listeners.push(onChange);

            return () => {
                listeners.splice(listeners.indexOf(onChange), 1);
            };
        }
    }
})();

export default scOptions;