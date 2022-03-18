import React, { useLayoutEffect, useRef, useState } from 'react';
import { calculatePosition } from '../../../public/utils';
import { Translation } from '../../../redux/slice/multipleTranslateSlice';
import IconFont from '../../IconFont';
import ListenButton from '../../ListenButton';
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

        setPos(calculatePosition(panelEle.current, { x: historyWidth - 5, y: top }));
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
                    <div className='mt-result__head flex-justify-content-space-between'>
                        <span className='mt-result__head__left'>
                            <SourceFavicon source={source} className='mt-result__head__badge' />
                            {translateRequest.status === 'finished' && <>
                                <IconFont
                                    className='iconbutton button'
                                    iconName='#icon-copy'
                                    style={{marginLeft: '5px'}}
                                    onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(translateRequest.result.text); }}
                                />
                                <ListenButton
                                    text={translateRequest.result.text}
                                    source={source}
                                    from={translateRequest.result.from}
                                />
                            </>}
                        </span>
                    </div>
                    <div className='dividing-line'></div>
                    <TranslateResult
                        translateRequest={translateRequest}
                        source={source}
                    />
                </div>))}
            </div>
        </div>
    );
};

export default HistoryResultPanel;