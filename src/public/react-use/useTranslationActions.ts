import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../public/react-use';
import {
    nextTranslaion,
    removeSource as removeSourceAction,
    addSource as addSourceAction,
    singleChangeSource as singleChangeSourceAction,
    fetchTranslationFromSource as fetchTranslationFromSourceAction
} from '../../redux/slice/translationSlice';
import { switchTranslateSource } from '../../public/switch-translate-source';

const useTranslationActions = () => {
    const state = useAppSelector(state => state.translation);
    const dispatch = useAppDispatch();

    const { text, from, to, translations } = state;

    const fetchTranslationFromSource = useCallback(async (source: string) => {
        return dispatch(fetchTranslationFromSourceAction(source)).unwrap();
    }, [dispatch]);

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
        fetchTranslationFromSource(source);
    }, [fetchTranslationFromSource]);

    const addSource = useCallback((source: string, addType: number) => {
        dispatch(addSourceAction({ source, addType }));

        text && fetchTranslationFromSource(source);
    }, [dispatch, fetchTranslationFromSource, text]);

    const changeSource = useCallback((source: string) => {
        const originalSource = translations[0]?.source;

        originalSource && dispatch(singleChangeSourceAction(switchTranslateSource(source, from, to)));
    }, [dispatch, translations, from, to]);

    return {
        state,
        actions: {
            fetchTranslationFromSource,
            setText,
            setLanguage,
            setTextAndTo,
            removeSource,
            retry,
            addSource,
            changeSource
        }
    };
};

export default useTranslationActions;