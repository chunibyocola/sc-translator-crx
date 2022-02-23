import React, { useEffect, useRef, useState } from 'react';
import { getOptions } from '../../public/options';
import { useAppSelector } from '../../public/react-use';
import { sendAddToCollection, sendIsCollected, sendRemoveFromCollection } from '../../public/send';
import { Translation } from '../../redux/slice/multipleTranslateSlice';
import IconFont from '../IconFont';

type CollectButtonProps = {};

const useIsCollected = (text: string) => {
    const [modifiable, setModifiable] = useState(false);
    const [isCollected, setIsCollected] = useState(false);

    const oldTextRef = useRef('');

    useEffect(() => {
        setModifiable(false);
        setIsCollected(false);

        oldTextRef.current = text;

        if (!text) { return; }

        sendIsCollected(text, (result) => {
            if ('code' in result) { return; }

            if (result.text !== oldTextRef.current) { return; }

            setModifiable(true);
            setIsCollected(result.isCollected);
        });
    }, [text]);

    return { modifiable, isCollected };
};

const CollectButton: React.FC<CollectButtonProps> = () => {
    const [text, setText] = useState('');
    const [collected, setCollected] = useState(false);
    const { text: multipleText, translations: multipleTranslations } = useAppSelector(state => state.multipleTranslate);
    const { text: singleText, translateRequest: singleTranslateRequest, source: singleSource } = useAppSelector(state => state.singleTranslate);

    const { modifiable, isCollected } = useIsCollected(text);

    const onCollectButtonClick = () => {
        if (!modifiable) { return; }

        if (collected) {
            sendRemoveFromCollection(text)
        }
        else {
            let translations: Translation[] = [];

            if (getOptions().multipleTranslateMode) {
                translations = multipleTranslations.reduce((total: Translation[], current) => {
                    if (current.translateRequest.status === 'finished') {
                        total = total.concat(current);
                    }

                    return total;
                }, []);
            }
            else if (singleTranslateRequest.status === 'finished') {
                translations = [{ source: singleSource, translateRequest: singleTranslateRequest }];
            }

            sendAddToCollection(text, translations);
        }

        setCollected(value => !value);
    };

    useEffect(() => {
        setText(singleText || multipleText);
    }, [singleText, multipleText]);

    useEffect(() => {
        setCollected(isCollected);
    }, [isCollected]);

    return (
        <IconFont
            iconName='#icon-collect'
            className={(modifiable && collected) ? 'iconfont--enable' : 'iconfont--disable'}
            onClick={onCollectButtonClick}
        />
    );
};

export default CollectButton;