import React, { useLayoutEffect, useRef, useState } from 'react';
import { LANG_EN } from '../../../constants/langCode';
import { getMessage } from '../../../public/i18n';
import { sendAudio } from '../../../public/send';
import { calculatePosition, resultToString } from '../../../public/utils';
import { Translation } from '../../../redux/slice/multipleTranslateSlice';
import ErrorMessage from '../../ErrorMessage';
import IconFont from '../../IconFont';
import SourceFavicon from '../../SourceFavicon';
import './style.css';

type HistoryResultPanelProps = {
    translations: Translation[];
    top: number;
    historyWidth: number;
};

const HistoryResultPanel: React.FC<HistoryResultPanelProps> = ({ translations, top, historyWidth }) => {
    const [pos, setPos] = useState({ x: 5, y: 5 });

    const panelEle = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!panelEle.current) { return; }

        calculatePosition(panelEle.current, { x: historyWidth - 5, y: top }, pos => setPos(pos));
    }, [top, historyWidth]);

    return (
        <div
            className='ts-history-result-panel-wrap'
            style={{left: `${pos.x}px`, top: `${pos.y}px`, display: translations?.length > 0 ? 'block' : 'none'}}
        >
            <div
                className='ts-history-result-panel ts-scrollbar'
                ref={panelEle}
            >
                {translations.map(({ source, translateRequest }) => (<div className='ts-mt-result' key={source}>
                    <div className='ts-mt-result-head'>
                        <span className='flex-align-items-center'>
                            <SourceFavicon source={source} />
                            {translateRequest.status === 'finished' && <IconFont
                                className='ts-iconbutton ts-button'
                                iconName='#icon-GoUnmute'
                                style={{marginLeft: '5px'}}
                                onClick={(e) => { e.stopPropagation(); sendAudio(translateRequest.result.text, { source, from: translateRequest.result.from }); }}
                            />}
                        </span>
                    </div>
                    <div className='ts-dividing-line'></div>
                    <div className='ts-mt-result-result'>
                        {translateRequest.status === 'loading' ?
                            getMessage('wordRequesting') :
                        translateRequest.status === 'init' ?
                            getMessage('contentTranslateAfterInput') :
                        translateRequest.status === 'error' ?
                            <ErrorMessage errorCode={translateRequest.errorCode} /> :
                        <>
                            {translateRequest.result.phonetic && translateRequest.result.from === LANG_EN && <div style={{marginBottom: '10px'}}>
                                {translateRequest.result.phonetic}
                            </div>}
                            <div className='flex-align-items-center'>
                                <span style={{marginRight: '5px'}}>
                                    {resultToString(translateRequest.result.result)}
                                </span>
                                <IconFont
                                    className='ts-iconbutton ts-button'
                                    iconName='#icon-GoUnmute'
                                    onClick={() => sendAudio(resultToString(translateRequest.result.result), { source, from: translateRequest.result.to })}
                                />
                            </div>
                            {translateRequest.result.dict?.map((v, i) => (
                                <div key={i} style={i === 0 ? {marginTop: '10px'} : {}}>{v}</div>
                            ))}
                        </>}
                    </div>
                </div>))}
            </div>
        </div>
    );
};

export default HistoryResultPanel;