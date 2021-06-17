import { useCallback, useRef, useState } from "react";
import { getInsertConfirmed, insertResultToggle } from "../insert-result";
import { resultToString } from "../utils";
import useOptions from "./useOptions";

const useOptionsDependency = ['enableInsertResult', 'autoInsertResult'];

/**
 * You need to confirm before insert toggle.
 */
const useInsertResult = () => {
    const [canInsert, setCanInsert] = useState(false);

    const autoInsertedRef = useRef(false);

    const { enableInsertResult, autoInsertResult } = useOptions(useOptionsDependency);

    const confirmInsert = useCallback((text, translateId) => {
        setCanInsert(enableInsertResult && getInsertConfirmed(text, translateId));

        autoInsertedRef.current = false;
    }, [enableInsertResult]);

    const insertToggle = useCallback((translateId, translateSource, result) => {
        insertResultToggle(translateId, translateSource, result);
    }, []);

    const autoInsert = useCallback((translateId, translateSource, result) => {
        if (!autoInsertResult || autoInsertedRef.current) { return; }

        result = Array.isArray(result) ? resultToString(result) : result;
        insertResultToggle(translateId, translateSource, result);

        autoInsertedRef.current = true;
    }, [autoInsertResult]);

    return [canInsert, confirmInsert, insertToggle, autoInsert];
};

export default useInsertResult;