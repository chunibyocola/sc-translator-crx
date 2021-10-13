import React, { useState } from 'react';
import './style.css';
import IconFont from '../IconFont';
import SourceFavicon from '../SourceFavicon';
import { TranslateRequest } from '../../types';
import TranslateResult from '../TranslateResult';
import ListenButton from '../ListenButton';

type MtResultProps = {
    source: string;
    translateRequest: TranslateRequest;
    remove: () => void;
    retry: () => void;
    setText: (text: string) => void;
    insertResult?: (result: string) => void;
};

const MtResult: React.FC<MtResultProps> = ({ source, translateRequest, remove, retry, setText, insertResult }) => {
    const [fold, setFold] = useState(false);

    return (
        <div className='mt-result'>
            <div
                className='mt-result__head button flex-justify-content-space-between'
                onClick={() => setFold(!fold)}
            >
                <span className='flex-align-items-center'>
                    <SourceFavicon source={source} />
                    {translateRequest.status === 'loading' && <IconsLoadingSkeleton />}
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
                </span>
                <span className='mt-result__head-icons flex-align-items-center'>
                    <IconFont
                        iconName='#icon-GoChevronDown'
                        style={!fold ? {transform: 'rotate(180deg)'} : {}}
                    />
                    <IconFont
                        iconName='#icon-GoX'
                        onClick={remove}
                        className='iconbutton'
                    />
                </span>
            </div>
            <div className='dividing-line' style={fold ? {display: 'none'} : {}}></div>
            <TranslateResult
                translateRequest={translateRequest}
                source={source}
                style={fold ? {display: 'none'} : {}}
                retry={retry}
                insertResult={insertResult}
                setText={setText}
            />
        </div>
    );
};

const IconsLoadingSkeleton: React.FC = () => (<div className='skeleton' style={{width: '2em', height: '1em', marginLeft: '5px'}}></div>);

export default MtResult;