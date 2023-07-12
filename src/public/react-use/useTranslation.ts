import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector, useInsertResult } from '../../public/react-use';
import { sendTranslate } from '../../public/send';
import { textPreprocessing } from '../../public/text-preprocessing';
import {
    nextTranslaion,
    requestError,
    requestFinish,
    requestStart,
    removeSource as removeSourceAction,
    addSource as addSourceAction,
    singleChangeSource as singleChangeSourceAction
} from '../../redux/slice/translationSlice';
import { switchTranslateSource } from '../../public/switch-translate-source';
import { addHistory, updateHistoryError, updateHistoryFinish } from '../../redux/slice/translateHistorySlice';

const useTranslation = (extra?: { recordTranslation?: boolean; insertTranslation?: boolean; }) => {
    const recordTranslation = extra?.recordTranslation;
    const insertTranslation = extra?.insertTranslation;

    const state = useAppSelector(state => state.translation);
    const dispatch = useAppDispatch();

    const { text, from, to, translateId, translations } = state;

    const translateIdRef = useRef(0);
    const lastTranslateIdRef = useRef(translateId);

    translateIdRef.current = translateId;

    const [insertable, confirmInsert, insertTranslationToggle, autoInsert] = useInsertResult();

    const translate = useCallback(async (source: string) => {
        const preprocessedText = textPreprocessing(text);

        if (!preprocessedText) { return; }

        dispatch(requestStart({ source }));

        const response = await sendTranslate({ source, text: preprocessedText, from, to }, translateId);

        if (response.translateId !== translateIdRef.current) { return; }

        if ('code' in response) {
            dispatch(requestError({ source, errorCode: response.code }));

            if (recordTranslation) {
                dispatch(updateHistoryError({ translateId: response.translateId, source, errorCode: response.code }));
            }

            return;
        }

        dispatch(requestFinish({ source, result: response.translation }));

        if (recordTranslation) {
            dispatch(updateHistoryFinish({ translateId: response.translateId, source, result: response.translation }));
        }

        if (insertTranslation) {
            autoInsert(translateId, source, response.translation.result);
        }
    }, [dispatch, text, from, to, translateId, recordTranslation, insertTranslation, autoInsert]);

    const setText = useCallback((text: string) => {
        dispatch(nextTranslaion({ text }));
    }, [dispatch]);

    const setLanguage = useCallback((from: string, to: string) => {
        dispatch(nextTranslaion({ from, to }));
    }, [dispatch]);

    const setTextAndTo = useCallback((text: string, to?: string) => {
        dispatch(nextTranslaion({ text, to }));
    }, [dispatch]);

    const removeSource = useCallback((source: string) => {
        dispatch(removeSourceAction({ source }));
    }, [dispatch]);

    const retry = useCallback((source: string) => {
        translate(source);
    }, [translate]);

    const addSource = useCallback((source: string, addType: number) => {
        dispatch(addSourceAction({ source, addType }));

        text && translate(source);
    }, [dispatch, translate, text]);

    const changeSource = useCallback((source: string) => {
        const originalSource = translations[0]?.source;

        originalSource && dispatch(singleChangeSourceAction(switchTranslateSource(source, { source: originalSource, from, to })));
    }, [dispatch, translations, from, to]);

    useEffect(() => {
        if (lastTranslateIdRef.current === translateId) { return; }

        if (!text) { return; }

        if (recordTranslation) {
            dispatch(addHistory({ translateId, text, sourceList: translations.map(({ source }) => source) }));
        }

        translations.forEach(({ source }) => translate(source));

        if (insertTranslation) {
            confirmInsert(text, translateId);
        }

        lastTranslateIdRef.current = translateId;
    }, [translateId, translate, translations, text, recordTranslation, insertTranslation, confirmInsert, dispatch]);

    const insertToggle = useCallback((source: string, translation: string) => {
        insertTranslationToggle(translateId, source, translation);
    }, [translateId, insertTranslationToggle]);

    return {
        state,
        actions: {
            setText,
            setLanguage,
            setTextAndTo,
            removeSource,
            retry,
            addSource,
            changeSource
        },
        insertToggle: insertable ? insertToggle : undefined
    };
};

export default useTranslation;