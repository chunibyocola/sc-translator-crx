import { useCallback, useState } from "react";
import { getInsertConfirmed, insertResultToggle } from "../insert-result";
import useOptions from "./useOptions";

const useOptionsDependency = ['enableInsertResult'];

/**
 * You need to confirm before insert toggle.
 */
const useInsertResult = () => {
    const [canInsert, setCanInsert] = useState(false);

    const { enableInsertResult } = useOptions(useOptionsDependency);

    const confirmInsert = useCallback((text, translateId) => {
        setCanInsert(enableInsertResult && getInsertConfirmed(text, translateId));
    }, [enableInsertResult]);

    const insertToggle = useCallback((translateId, translateSource, result) => {
        insertResultToggle(translateId, translateSource, result);
    }, []);

    return [canInsert, confirmInsert, insertToggle];
};

export default useInsertResult;