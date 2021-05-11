import React, { useLayoutEffect, useRef, useState } from 'react';
import { LANG_EN } from '../../../constants/langCode';
import { getMessage } from '../../../public/i18n';
import { sendAudio } from '../../../public/send';
import { calculatePosition, resultToString } from '../../../public/utils';
import ErrorMessage from '../../ErrorMessage';
import IconFont from '../../IconFont';
import SourceFavicon from '../../SourceFavicon';
import './style.css';

const HistoryResultPanel = ({ translations, top, historyWidth }) => {
    const [pos, setPos] = useState({ x: 5, y: 5 });

    const panelEle = useRef(null);

    useLayoutEffect(() => {
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
                {translations.map(({ source, status, from, result }) => (<div className='ts-mt-result' key={source}>
                    <div className='ts-mt-result-head'>
                        <span className='flex-align-items-center'>
                            <SourceFavicon source={source} />
                            {status.requestEnd && !status.error && <IconFont
                                className='ts-iconbutton ts-button'
                                iconName='#icon-GoUnmute'
                                style={{marginLeft: '5px'}}
                                onClick={(e) => { e.stopPropagation(); sendAudio(result.text, { source, from }); }}
                            />}
                        </span>
                    </div>
                    <div className='ts-dividing-line'></div>
                    <div className='ts-mt-result-result'>
                        {status.requesting ?
                            getMessage('wordRequesting') :
                        !status.requestEnd ?
                            getMessage('contentTranslateAfterInput') :
                        status.error ?
                            <ErrorMessage errorCode={status.errorCode} /> :
                        <>
                            {result.phonetic && result.from === LANG_EN && <div style={{marginBottom: '10px'}}>
                                {result.phonetic}
                            </div>}
                            <div className='flex-align-items-center'>
                                <span style={{marginRight: '5px'}}>
                                    {resultToString(result.result)}
                                </span>
                                <IconFont
                                    className='ts-iconbutton ts-button'
                                    iconName='#icon-GoUnmute'
                                    onClick={() => sendAudio(resultToString(result.result), { source, from: result.to })}
                                />
                            </div>
                            {result.dict?.map((v, i) => (
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