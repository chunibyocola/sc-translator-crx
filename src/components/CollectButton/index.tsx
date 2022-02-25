import React, { useEffect, useMemo, useRef, useState } from 'react';
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

    return { modifiable, isCollected, setIsCollected };
};

const CollectButton: React.FC<CollectButtonProps> = () => {
    const { text: multipleText, translations: multipleTranslations } = useAppSelector(state => state.multipleTranslate);
    const { text: singleText, translateRequest: singleTranslateRequest, source: singleSource } = useAppSelector(state => state.singleTranslate);

    const text = useMemo(() => singleText || multipleText, [singleText, multipleText]);

    const { modifiable, isCollected, setIsCollected } = useIsCollected(text);

    const onCollectButtonClick = () => {
        if (!modifiable) { return; }

        if (isCollected) {
            sendRemoveFromCollection(text)
        }
        else {
            let translations: Translation[] = [];

            if (multipleText) {
                translations = multipleTranslations.reduce((total: Translation[], current) => {
                    if (current.translateRequest.status === 'finished') {
                        total = total.concat(current);
                    }

                    return total;
                }, []);
            }
            else if (singleText && singleTranslateRequest.status === 'finished') {
                translations = [{ source: singleSource, translateRequest: singleTranslateRequest }];
            }

            sendAddToCollection(text, translations);
        }

        setIsCollected(value => !value);
    };

    return (
        <IconFont
            iconName='#icon-collect'
            className={modifiable ? isCollected ? 'iconfont--enable' : 'iconfont--disable button' : 'iconfont--disable'}
            style={modifiable ? undefined : {cursor: 'default'}}
            onClick={onCollectButtonClick}
        />
    );
};

export default CollectButton;