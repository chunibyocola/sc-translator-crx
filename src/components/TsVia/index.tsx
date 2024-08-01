import React from 'react';
import SourceSelect from '../SourceSelect';
import { translateSource } from '../../constants/translateSource';
import './style.css';
import { TranslateRequest } from '../../types';
import IconFont from '../IconFont';
import ListenButton from '../ListenButton';
import scOptions from '../../public/sc-options';

type TsViaProps = {
    sourceChange: (source: string) => void;
    source: string;
    disableSourceChange?: boolean;
    translateRequest: TranslateRequest;
};

const TsVia: React.FC<TsViaProps> = ({ sourceChange, source, disableSourceChange, translateRequest }) => {
    return (
        <div className='via'>
            <div className='via__content'>
                <SourceSelect
                    source={source}
                    sourceList={translateSource.concat(scOptions.getInit().customTranslateSourceList)}
                    onChange={sourceChange}
                    className='via__content-select'
                    disabled={disableSourceChange}
                />
                {translateRequest.status === 'loading' && <div className='skeleton' style={{width: '2em', height: '1em', marginLeft: '5px'}}></div>}
                {translateRequest.status === 'finished' && <>
                    <IconFont
                        className='iconbutton'
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
            </div>
            <div className='dividing-line'></div>
        </div>
    );
};

export default TsVia;