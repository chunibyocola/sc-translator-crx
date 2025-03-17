import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useInsertResult, useTranslationActions } from '../../public/react-use';
import { addHistory, updateHistoryError, updateHistoryFinish } from '../../redux/slice/translateHistorySlice';
import { playAudio } from '../play-audio';
import { TranslateResult } from '../../types';
import { textPreprocessing } from '../text-preprocessing';

const translateResultCacheMap = new Map<string, TranslateResult>();

const useTranslation = (extra?: { recordTranslation?: boolean; insertTranslation?: boolean; }) => {
    const recordTranslation = extra?.recordTranslation;
    const insertTranslation = extra?.insertTranslation;

    const { state, actions } = useTranslationActions();

    const { fetchTranslationFromSource, requestFinish } = actions;

    const dispatch = useAppDispatch();

    const { text, translateId, translations, from, to } = state;

    const lastTranslateIdRef = useRef(translateId);
    const firstFinished = useRef(false);

    const { insertable, confirmInsert, insertToggle: insertTranslationToggle, autoInsert } = useInsertResult();

    const translate = useCallback(async (source: string) => {
        const cacheKey = [textPreprocessing(text), source, from, to].join('&');
        const cache = translateResultCacheMap.get(cacheKey);

        if (cache) {
            requestFinish(source, cache);
        }

        const response = cache ? { translateId, translation: cache } : await fetchTranslationFromSource(source);

        if (!response) { return; }

        if ('code' in response) {

            if (recordTranslation) {
                dispatch(updateHistoryError({ translateId: response.translateId, source, errorCode: response.code }));
            }

            return;
        }

        if (recordTranslation) {
            dispatch(updateHistoryFinish({ translateId: response.translateId, source, result: response.translation }));
        }

        translateResultCacheMap.set(cacheKey, response.translation);

        if (!firstFinished.current) {
            firstFinished.current = true;

            const { text, from } = response.translation;

            text.length <= 30 && playAudio({ text, source, from, auto: true });

            if (insertTranslation) {
                autoInsert(response.translateId, source, response.translation.result);
            }
        }
    }, [fetchTranslationFromSource, autoInsert, dispatch, insertTranslation, recordTranslation, from, to, text, translateId, requestFinish]);

    useEffect(() => {
        if (lastTranslateIdRef.current === translateId) { return; }

        lastTranslateIdRef.current = translateId;

        if (!text) { return; }

        if (recordTranslation) {
            dispatch(addHistory({ translateId, text, sourceList: translations.map(({ source }) => source) }));
        }

        firstFinished.current = false;

        translations.forEach(({ source }) => translate(source));

        if (insertTranslation) {
            confirmInsert(text, translateId);
        }
    }, [translateId, translations, text, recordTranslation, insertTranslation, confirmInsert, dispatch, translate]);

    const insertToggle = useCallback((source: string, translation: string) => {
        insertTranslationToggle(translateId, source, translation);
    }, [translateId, insertTranslationToggle]);

    return {
        state,
        actions,
        insertToggle: insertable ? insertToggle : undefined
    };
};

export default useTranslation;