import { TranslateRequest } from '../types';
import type { WebpageTranslateResult } from './web-page-translate';

const DB_NAME = 'ScTranslator';
const DB_VERSION = 2;

export const DB_STORE_COLLECTION = 'collection';

export type StoreCollectionValue = {
    text: string;
    date: number;
    translations: {
        translateRequest: TranslateRequest;
        source: string;
    }[];
    note?: string;
    tags?: string[];
};

export const DB_STORE_PAGE_TRANSLATION_CACHE = 'page-translation-cache';

export type StorePageTranslationCacheValue = {
    query: string;
    key: string;
    date: number;
    translation: WebpageTranslateResult;
};

type StoreName = typeof DB_STORE_COLLECTION | typeof DB_STORE_PAGE_TRANSLATION_CACHE;
type StoreValue<T> = 
    T extends typeof DB_STORE_COLLECTION ? StoreCollectionValue :
    T extends typeof DB_STORE_PAGE_TRANSLATION_CACHE ? StorePageTranslationCacheValue :
    never;

const scIndexedDB = (() => {
    let instance: IDBDatabase;

    const getInstance = async (): Promise<IDBDatabase> => {
        if (instance) { return instance; }

        const request = indexedDB.open(DB_NAME, DB_VERSION);

        instance = await new Promise((resolve, reject) => {
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
            request.onupgradeneeded = () => {
                if (!request.result.objectStoreNames.contains(DB_STORE_COLLECTION)) {
                    request.result.createObjectStore(DB_STORE_COLLECTION, { keyPath: 'text' });
                }

                if (!request.result.objectStoreNames.contains(DB_STORE_PAGE_TRANSLATION_CACHE)) {
                    const pageTranslationCacheStore = request.result.createObjectStore(DB_STORE_PAGE_TRANSLATION_CACHE, { keyPath: 'query' });
                    pageTranslationCacheStore.createIndex('date', 'date');
                    pageTranslationCacheStore.createIndex('key', 'key');
                }
            };
        });

        return instance;
    };

    const withStore = async (storeName: string, mode: IDBTransactionMode): Promise<[IDBObjectStore, Promise<void>]> => {
        const instance = await getInstance();
        const transaction = instance.transaction([storeName], mode);

        const done = new Promise<void>((resolve, reject) => {
            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });

        return [transaction.objectStore(storeName), done];
    };

    return {
        get: async <T extends StoreName>(storeName: T, query: IDBValidKey | IDBKeyRange): Promise<undefined | StoreValue<T>> => {
            const [store, done] = await withStore(storeName, 'readonly');

            let request = store.get(query);

            await done;

            return request.result;
        },
        getAllByQueries: async <T extends StoreName>(storeName: T, queries: (IDBValidKey | IDBKeyRange)[]): Promise<(undefined | StoreValue<T>)[]> => {
            const [store, done] = await withStore(storeName, 'readonly');

            const requests: IDBRequest<StoreValue<T>>[] = [];

            queries.forEach(query => requests.push(store.get(query)));

            await done;

            return requests.map(request => request.result);
        },
        getAll: async <T extends StoreName>(storeName: T): Promise<StoreValue<T>[]> => {
            const [store, done] = await withStore(storeName, 'readonly');

            let request = store.getAll();

            await done;

            return request.result;
        },
        add: async <T extends StoreName>(storeName: T, value: StoreValue<T>, key?: IDBValidKey ) => {
            const [store] = await withStore(storeName, 'readwrite');

            store.put(value, key);
        },
        addAll: async <T extends StoreName>(storeName: T, values: StoreValue<T>[]) => {
            const [store, done] = await withStore(storeName, 'readwrite');

            values.forEach(value => store.put(value));

            await done;
        },
        delete: async <T extends StoreName>(storeName: T, query: IDBValidKey | IDBKeyRange | (IDBValidKey | IDBKeyRange)[]) => {
            const [store, done] = await withStore(storeName, 'readwrite');

            Array.isArray(query) ? query.forEach((value) => store.delete(value)) : store.delete(query);

            await done;
        },
        clear: async <T extends StoreName>(storeName: T) => {
            const [store] = await withStore(storeName, 'readwrite');

            store.clear();
        }
    }
})();

export default scIndexedDB;