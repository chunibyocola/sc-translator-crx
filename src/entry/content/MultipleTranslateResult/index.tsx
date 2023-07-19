import React, { useRef, useState, useLayoutEffect } from 'react';
import MtResult from '../../../components/MtResult';
import MtAddSource from '../../../components/MtAddSource';
import LanguageSelection from '../../../components/LanguageSelection';
import RawText from '../../../components/RawText';
import { mtLangCode } from '../../../constants/langCode';
import './style.css';
import { getMessage } from '../../../public/i18n';
import { useAppSelector, useIsHistoryEnabled, useTranslation } from '../../../public/react-use';

type MultipleTranslateResultProps = {
    maxHeightGap: number;
};

const MultipleTranslateResult: React.FC<MultipleTranslateResultProps> = React.memo(({ maxHeightGap }) => {
    const [resultMaxHeight, setResultMaxHeight] = useState(500);

    const resultContainerEle = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!resultContainerEle.current) { return; }

        const maxHeight = maxHeightGap + resultContainerEle.current.offsetHeight;
        setResultMaxHeight(maxHeight < 40 ? 40 : maxHeight);
    }, [maxHeightGap]);

    const { displayEditArea } = useAppSelector(state => state.panelStatus);

    const historyEnabled = useIsHistoryEnabled(window.location.host);

    const {
        state: { translations, text, from, to },
        actions: { setText, setLanguage, retry, addSource, removeSource },
        insertToggle
    } = useTranslation({ recordTranslation: historyEnabled, insertTranslation: true });

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
                    languageCodes={mtLangCode}
                />
            </div>
            <div className='multiple-result scrollbar' style={{maxHeight: `${resultMaxHeight}px`}} ref={resultContainerEle}>
                {translations.length === 0 ? 
                    <div className='multiple-result__add-source'>{getMessage('sentenceAddTranslateSource')}</div> :
                translations.map(({ source, translateRequest }) => (
                    <MtResult
                        source={source}
                        translateRequest={translateRequest}
                        key={source}
                        remove={() => removeSource(source)}
                        retry={() => retry(source)}
                        setText={setText}
                        insertResult={insertToggle && (translation => insertToggle(source, translation))}
                    />
                ))}
            </div>
            <MtAddSource translations={translations} addSource={addSource} />
        </>
    );
});

export default MultipleTranslateResult;