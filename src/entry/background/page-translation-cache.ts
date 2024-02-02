import scIndexedDB, { DB_STORE_PAGE_TRANSLATION_CACHE } from '../../public/sc-indexed-db';
import type { WebpageTranslateResult } from '../../public/web-page-translate';

const getQuerySuffix = (source: string, from: string, to: string) => (`&source=${source}&from=${from}&to=${to}`);
const getQuery = (key: string, suffix: string) => (`key=${key}${suffix}`);

export const addCache = (cache: { key: string; translation: WebpageTranslateResult; }[], source: string, from: string, to: string) => {
    const querySuffix = getQuerySuffix(source, from, to);

    scIndexedDB.addAll(DB_STORE_PAGE_TRANSLATION_CACHE, cache.map((value) => ({ ...value, date: Number(new Date()), query: getQuery(value.key, querySuffix) })));
};

export const getCache = async (keys: string[], source: string, from: string, to: string): Promise<{ [K: string]: WebpageTranslateResult; }> => {
    const cache: { [K: string]: WebpageTranslateResult; } = {};
    const querySuffix = getQuerySuffix(source, from, to);

    const result = await scIndexedDB.getAllByQueries(DB_STORE_PAGE_TRANSLATION_CACHE, keys.map(key => getQuery(key, querySuffix)));

    result.forEach((v, i) => (v?.key === keys[i] && (cache[keys[i]] = v.translation)));

    return cache;
};