import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getMessage } from '../../public/i18n';
import { useAppSelector } from '../../public/react-use';
import { sendAddToCollection, sendIsCollected, sendRemoveFromCollection } from '../../public/send';
import { Translation } from '../../redux/slice/multipleTranslateSlice';
import IconFont from '../IconFont';
import PanelIconButtonWrapper from './PanelIconButtonWrapper';

const collectionMessage = {
    addToCollection: getMessage('contentAddToCollection'),
    removeFromCollection: getMessage('contentRemoveFromCollection')
};

const useIsCollected = (text: string) => {
    const [modifiable, setModifiable] = useState(false);
    const [isCollected, setIsCollected] = useState(false);

    const oldTextRef = useRef('');

    useEffect(() => {
        setModifiable(false);
        setIsCollected(false);

        oldTextRef.current = text;

        if (!text) { return; }

        sendIsCollected(text).then((response) => {
            if ('code' in response) { return; }

            if (response.text !== oldTextRef.current) { return; }

            setModifiable(true);
            setIsCollected(response.isCollected);
        });
    }, [text]);

    return { modifiable, isCollected, setIsCollected };
};

const CollectButton: React.FC = () => {
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
                translations = multipleTranslations.filter(v => v.translateRequest.status === 'finished');
            }
            else if (singleText && singleTranslateRequest.status === 'finished') {
                translations = [{ source: singleSource, translateRequest: singleTranslateRequest }];
            }

            sendAddToCollection(text, translations);
        }

        setIsCollected(value => !value);
    };

    return (
        <PanelIconButtonWrapper
            disabled={!modifiable}
            onClick={onCollectButtonClick}
            title={isCollected ? collectionMessage.removeFromCollection : collectionMessage.addToCollection}
            iconGrey={!isCollected}
        >
            <IconFont
                iconName='#icon-collect'
            />
        </PanelIconButtonWrapper>
    );
};

export default CollectButton;