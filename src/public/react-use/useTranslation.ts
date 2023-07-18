import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useInsertResult, useTranslationActions } from '../../public/react-use';
import { addHistory, updateHistoryError, updateHistoryFinish } from '../../redux/slice/translateHistorySlice';

const useTranslation = (extra?: { recordTranslation?: boolean; insertTranslation?: boolean; }) => {
    const recordTranslation = extra?.recordTranslation;
    const insertTranslation = extra?.insertTranslation;

    const { state, actions } = useTranslationActions();

    const { fetchTranslationFromSource } = actions;

    const dispatch = useAppDispatch();

    const { text, translateId, translations } = state;

    const lastTranslateIdRef = useRef(translateId);

    const [insertable, confirmInsert, insertTranslationToggle, autoInsert] = useInsertResult();

    const translate = useCallback(async (source: string) => {
        const response = await fetchTranslationFromSource(source);

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

        if (insertTranslation) {
            autoInsert(response.translateId, source, response.translation.result);
        }
    }, [fetchTranslationFromSource, autoInsert, dispatch, insertTranslation, recordTranslation]);

    useEffect(() => {
        if (lastTranslateIdRef.current === translateId) { return; }

        lastTranslateIdRef.current = translateId;

        if (!text) { return; }

        if (recordTranslation) {
            dispatch(addHistory({ translateId, text, sourceList: translations.map(({ source }) => source) }));
        }

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