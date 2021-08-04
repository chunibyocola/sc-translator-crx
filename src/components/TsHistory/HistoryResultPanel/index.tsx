import React, { useLayoutEffect, useRef, useState } from 'react';
import { sendAudio } from '../../../public/send';
import { calculatePosition } from '../../../public/utils';
import { Translation } from '../../../redux/slice/multipleTranslateSlice';
import IconFont from '../../IconFont';
import SourceFavicon from '../../SourceFavicon';
import TranslateResult from '../../TranslateResult';
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
            className='history-result-panel'
            style={{left: `${pos.x}px`, top: `${pos.y}px`, display: translations?.length > 0 ? 'block' : 'none'}}
        >
            <div
                className='history-result-panel__container scrollbar'
                ref={panelEle}
            >
                {translations.map(({ source, translateRequest }) => (<div className='mt-result' key={source}>
                    <div className='mt-result__head'>
                        <span className='flex-align-items-center'>
                            <SourceFavicon source={source} />
                            {translateRequest.status === 'finished' && <>
                                <IconFont
                                    className='iconbutton button'
                                    iconName='#icon-copy'
                                    style={{marginLeft: '5px'}}
                                    onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(translateRequest.result.text); }}
                                />
                                <IconFont
                                    className='iconbutton button'
                                    iconName='#icon-GoUnmute'
                                    onClick={(e) => { e.stopPropagation(); sendAudio(translateRequest.result.text, { source, from: translateRequest.result.from }); }}
                                />
                            </>}
                        </span>
                    </div>
                    <div className='dividing-line'></div>
                    <TranslateResult
                        translateRequest={translateRequest}
                        readText={(text, from) => sendAudio(text, { source, from })}
                    />
                </div>))}
            </div>
        </div>
    );
};

export default HistoryResultPanel;