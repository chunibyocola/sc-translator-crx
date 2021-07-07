import { useCallback, useRef, useState } from "react";
import { DefaultOptions } from "../../types";
import { getInsertConfirmed, insertResultToggle } from "../insert-result";
import { resultToString } from "../utils";
import useOptions from "./useOptions";

type PickedOptions = Pick<DefaultOptions, 'enableInsertResult' | 'autoInsertResult'>
const useOptionsDependency: (keyof PickedOptions)[] = ['enableInsertResult', 'autoInsertResult'];

type UseInsertResultReturnType = [
    boolean,
    (text: string, translateId: number) => void,
    (translateId: number, translateSource: string, result: string) => void,
    (translateId: number, translateSource: string, result: string | string[]) => void
];

/**
 * You need to confirm before insert toggle.
 */
const useInsertResult = (): UseInsertResultReturnType => {
    const [canInsert, setCanInsert] = useState(false);

    const autoInsertedRef = useRef(false);

    const { enableInsertResult, autoInsertResult } = useOptions<PickedOptions>(useOptionsDependency);

    const confirmInsert = useCallback((text: string, translateId: number) => {
        setCanInsert(enableInsertResult && getInsertConfirmed(text, translateId));

        autoInsertedRef.current = false;
    }, [enableInsertResult]);

    const insertToggle = useCallback((translateId: number, translateSource: string, result: string) => {
        insertResultToggle(translateId, translateSource, result);
    }, []);

    const autoInsert = useCallback((translateId: number, translateSource: string, result: string | string[]) => {
        if (!autoInsertResult || autoInsertedRef.current) { return; }

        result = Array.isArray(result) ? resultToString(result) : result;
        insertResultToggle(translateId, translateSource, result);

        autoInsertedRef.current = true;
    }, [autoInsertResult]);

    return [canInsert, confirmInsert, insertToggle, autoInsert];
};

export default useInsertResult;