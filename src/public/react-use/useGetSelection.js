import { useEffect, useCallback, useState } from 'react';
import getSelection from '../utils/getSelection';

const initText = '';
const initPos = { x: 5, y: 5 };

const useGetSelection = () => {
    const [text, setText] = useState(initText);
    const [pos, setPos] = useState(initPos);

    const selectCallback = useCallback(({text, pos}) => {
        setPos(pos);
        setText(text);
    }, []);

    const unselectCallback = useCallback(() => {
        setText(initText);
        setPos(initPos)
    }, []);

    useEffect(() => {
        getSelection(selectCallback, unselectCallback);
    }, [selectCallback, unselectCallback]);

    return [text, pos];
};

export default useGetSelection;