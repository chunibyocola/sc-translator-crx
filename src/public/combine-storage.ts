import { contextMenusContexts, defaultContextMenus } from '../constants/contextMenusIds';
import { styleVarsList } from '../constants/defaultStyleVars';
import { langCode, LANG_EN, userLangs } from '../constants/langCode';
import { translateButtonContext } from '../constants/translateButtonTypes';
import { audioSource, GOOGLE_COM, translateSource, webPageTranslateSource } from '../constants/translateSource';
import { CustomTranslateSource, DefaultOptions, OptionsContextMenu, SyncOptions, TextPreprocessingRegExp } from '../types';
import { SerializableObject } from './sc-file';
import { langCode as googleLangCode } from './translate/google/lang-code';
import scOptions from './sc-options';

const { auto, ...preferredLangCode } = googleLangCode;

type Addition = {
    availableSources: string[];
    wpAvailableSources: string[];
};

const CheckData = (() => {
    const getTypeOf = (value: any) => {
        if (Array.isArray(value)) { return 'array'; }
        if (value === null) { return 'null'; }
        return typeof value;
    };

    const isSameStucture = (comparison: SerializableObject, obj: SerializableObject): boolean => {
        if (getTypeOf(comparison) !== 'object' || getTypeOf(comparison) !== getTypeOf(obj)) { return false; }

        const keys = Object.keys(comparison);

        if (keys.length !== Object.keys(obj).length) { return false; }

        for (let key of keys) {
            if (!(key in obj)) { return false; }

            const typeOfComparison = getTypeOf(comparison[key]);

            if (typeOfComparison !== getTypeOf(obj[key])) { return false; }

            if (typeOfComparison === 'object' && !isSameStucture(comparison[key] as SerializableObject, obj[key] as SerializableObject)) { return false; }
        }

        return true;
    };

    const isArrayOf = (item: any, arr: any[]) => {
        if (!Array.isArray(arr)) { return false; }

        const type = getTypeOf(item);

        for (let value of arr) {
            if (getTypeOf(item) !== getTypeOf(value)) { return false; }

            if (type === 'object' && !isSameStucture(item, value)) { return false; }
        }

        return true;
    };

    return {
        isArrayOf,
        isSameStucture,
        getTypeOf
    };
})();

const reducerMap: [(keyof DefaultOptions)[], <S>(origin: S, next: any, addition: Addition) => S][] = [[
    ['customTranslateSourceList'],
    (origin, next) => {
        const comparison: CustomTranslateSource = { name: '', source: '', url: '' };
        return CheckData.isArrayOf(comparison, next) ? (next as any[]).filter(v => !translateSource.map(s => s.source).includes(v.source)) as any : origin;
    }
], [
    ['customWebpageTranslateSourceList'],
    (origin, next) => {
        const comparison: CustomTranslateSource = { name: '', source: '', url: '' };
        return CheckData.isArrayOf(comparison, next) ? (next as any[]).filter(v => !webPageTranslateSource.map(s => s.source).includes(v.source)) as any : origin;
    }
], [
    ['userLanguage'],
    (origin, next) => {
        return userLangs.map(v => v.code).includes(next) ? next : origin;
    }
], [
    ['translateHostList', 'historyHostList', 'autoTranslateWebpageHostList'],
    (origin, next) => {
        return CheckData.isArrayOf('', next) ? next : origin;
    }
], [
    ['defaultAudioSource'],
    (origin, next) => {
        return audioSource.map(v => v.source).includes(next) ? next : origin;
    }
], [
    ['multipleTranslateSourceList'],
    (origin, next, { availableSources }) => {
        return CheckData.isArrayOf('', next) ? (next as string[]).filter(v => availableSources.includes(v)) : (origin as any as string[]).filter(v => availableSources.includes(v)) as any;
    }
], [
    ['multipleTranslateFrom', 'multipleTranslateTo'],
    (origin, next) => {
        return (next in preferredLangCode || next === '') ? next : origin;
    }
], [
    ['preferredLanguage', 'secondPreferredLanguage', 'webPageTranslateTo'],
    (origin, next) => {
        return next in preferredLangCode ? next : origin;
    }
], [
    ['styleVarsList'],
    (origin, next) => {
        const comparison = styleVarsList[0];
        return CheckData.isArrayOf(comparison, next) && next.length > 0 ? [styleVarsList[0], ...(next as any[]).slice(1)] as any : origin;
    }
], [
    ['btnPosition', 'stwSizeAndPosition', 'positionOfPinnedPanel', 'translatePanelMaxHeight', 'translatePanelWidth', 'historyPanelStatus', 'translateButtonsTL'],
    (origin, next) => {
        return CheckData.isSameStucture(origin as any, next) ? next : origin;
    }
], [
    ['recentTranslateFromList', 'recentTranslateToList', 'autoPlayAudioLangs'],
    (origin, next) => {
        return CheckData.isArrayOf('', next) ? next : origin;
    }
], [
    ['contextMenus'],
    (origin, next) => {
        if (CheckData.isArrayOf(defaultContextMenus[0], next) && (next as OptionsContextMenu[]).length === defaultContextMenus.length) {
            const map: Record<string, boolean> = {};

            (next as OptionsContextMenu[]).forEach((value) => {
                if (value.id in contextMenusContexts) {
                    map[value.id] = value.enabled;
                }
            });

            const keys = Object.keys(map);

            if (keys.length === defaultContextMenus.length) {
                return next;
            }
        }
        return origin;
    }
], [
    ['textPreprocessingRegExpList', 'afterSelectingTextRegExpList'],
    (origin, next) => {
        const comparison: TextPreprocessingRegExp = { pattern: '', replacement: '', flags: '' };
        return CheckData.isArrayOf(comparison, next) ? next : origin;
    }
], [
    ['textPreprocessingPreset', 'displayOfTranslation', 'displayModeEnhancement'],
    (origin, next) => {
        Object.keys(next).forEach((key) => {
            if (!(key in (origin as { [K: string]: boolean; })) || typeof next[key] !== 'boolean') {
                delete next[key];
            }
        });

        return { ...origin, ...next };
    }
], [
    ['comparisonCustomization'],
    (origin, next) => {
        Object.keys(next).forEach((key) => {
            if (!(key in (origin as { [K: string]: string; })) || typeof next[key] !== 'string') {
                delete next[key];
            }
        });

        return { ...origin, ...next };
    }
], [
    ['translateButtons'],
    (origin, next) => {
        return CheckData.isArrayOf('', next) ? (next as string[]).filter(v => v in translateButtonContext) as any : origin;
    }
], [
    ['webPageTranslateSource'],
    (origin, next, { wpAvailableSources }) => {
        return wpAvailableSources.includes(next) ? next : wpAvailableSources.includes(origin as any) ? origin : GOOGLE_COM;
    }
], [
    ['customizeStyleText'],
    (origin, next) => {
        return next;
    }
]];

const nextValue = <S>(key: keyof DefaultOptions, origin: S, next: any, addition: Addition) => {
    const item = reducerMap.find(([keys]) => (keys.includes(key)));
    if (item) {
        try {
            const [, reducer] = item;
            return reducer(origin, next, addition);
        }
        catch {
            return origin;
        }
    }
    return origin;
};

export const combineStorage = async (newData: any) => {
    if (CheckData.getTypeOf(newData) !== 'object') { throw new Error('Error: Data is not an "object".'); }
    const { sourceParamsCache, ...data } = await scOptions.get(null);
    const oldData: SyncOptions = data;
    const addition: Addition = { availableSources: [], wpAvailableSources: [] };
    oldData.customTranslateSourceList = nextValue('customTranslateSourceList', oldData.customTranslateSourceList, newData.customTranslateSourceList, addition);
    addition.availableSources = translateSource.concat(oldData.customTranslateSourceList).map(v => v.source);

    oldData.customWebpageTranslateSourceList = nextValue('customWebpageTranslateSourceList', oldData.customWebpageTranslateSourceList, newData.customWebpageTranslateSourceList, addition);
    addition.wpAvailableSources = webPageTranslateSource.concat(oldData.customWebpageTranslateSourceList).map(v => v.source);

    delete newData.customTranslateSourceList;
    delete newData.customWebpageTranslateSourceList;
    delete newData.defaultTranslateSource;

    Object.keys(newData).forEach((k) => {
        if (!(k in oldData)) { return; }

        const key = k as keyof SyncOptions;

        if (CheckData.getTypeOf(oldData[key]) !== CheckData.getTypeOf(newData[key])) { return; }

        if (typeof oldData[key] === 'boolean' || typeof oldData[key] === 'number') {
            oldData[key] = newData[key] as never;
            return;
        }

        oldData[key] = nextValue(key, oldData[key], newData[key], addition) as never;
    });

    return oldData;
};