import React, { useRef, useLayoutEffect, useState } from 'react';
import LanguageSelection from '../../../components/LanguageSelection';
import RawText from '../../../components/RawText';
import { googleLangCode, langCode } from '../../../constants/langCode';
import TsVia from '../../../components/TsVia';
import { useAppSelector, useIsHistoryEnabled, useTranslation } from '../../../public/react-use';
import './style.css';
import TranslateResult from '../../../components/TranslateResult';

type SingleTranslateResultProps = {
    maxHeightGap: number;
};

const SingleTranslateResult: React.FC<SingleTranslateResultProps> = React.memo(({ maxHeightGap }) => {
    const [resultMaxHeight, setResultMaxHeight] = useState(500);

    const { displayEditArea } = useAppSelector(state => state.panelStatus);

    const resultContainerEle = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!resultContainerEle.current) { return; }

        const maxHeight = maxHeightGap + resultContainerEle.current.offsetHeight;
        setResultMaxHeight(maxHeight < 40 ? 40 : maxHeight);
    }, [maxHeightGap]);

    const historyEnabled = useIsHistoryEnabled(window.location.host);

    const {
        state: { translations, text, from, to },
        actions: { setText, setLanguage, retry, changeSource },
        insertToggle
    } = useTranslation({ recordTranslation: historyEnabled, insertTranslation: true });

    const { source, translateRequest } = translations[0];

    return (
        <>
            <div style={displayEditArea ? {height: 'auto'} : {height: '0px', overflow: 'hidden'}}>
                <RawText
                    defaultValue={text}
                    rawTextTranslate={setText}
                />
                <LanguageSelection
                    onChange={setLanguage}
                    from={from}
                    to={to}
                    languageCodes={langCode[source] ?? googleLangCode}
                />
            </div>
            <div className='single-translation'>
                <TsVia
                    sourceChange={changeSource}
                    source={source}
                    translateRequest={translateRequest}
                />
                <div className='single-translation__translation scrollbar' style={{maxHeight: `${resultMaxHeight}px`}} ref={resultContainerEle}>
                    <TranslateResult
                        translateRequest={translateRequest}
                        source={source}
                        retry={() => retry(source)}
                        setText={setText}
                        insertResult={insertToggle && (translation => insertToggle(source, translation))}
                    />
                </div>
            </div>
        </>
    );
});

export default SingleTranslateResult;