import React, { useState } from 'react';
import './style.css';
import IconFont from '../IconFont';
import SourceFavicon from '../SourceFavicon';
import { TranslateRequest } from '../../types';
import TranslateResult from '../TranslateResult';

type MtResultProps = {
    source: string;
    translateRequest: TranslateRequest;
    remove: () => void;
    readText: (text: string, from: string) => void;
    retry: () => void;
    setText: (text: string) => void;
    insertResult?: (result: string) => void;
};

const MtResult: React.FC<MtResultProps> = ({ source, translateRequest, remove, readText, retry, setText, insertResult }) => {
    const [fold, setFold] = useState(false);

    return (
        <div className='ts-mt-result'>
            <div
                className='ts-mt-result-head ts-button flex-justify-content-space-between'
                onClick={() => setFold(!fold)}
            >
                <span className='flex-align-items-center'>
                    <SourceFavicon source={source} />
                    {translateRequest.status === 'loading' && <IconsLoadingSkeleton />}
                    {translateRequest.status === 'finished' && <>
                        <IconFont
                            className='ts-iconbutton'
                            iconName='#icon-copy'
                            style={{marginLeft: '5px'}}
                            onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(translateRequest.result.text); }}
                        />
                        <IconFont
                            className='ts-iconbutton'
                            iconName='#icon-GoUnmute'
                            onClick={(e) => { e.stopPropagation(); readText(translateRequest.result.text, translateRequest.result.from); }}
                        />
                    </>}
                </span>
                <span className='ts-mt-result-head-icons flex-align-items-center'>
                    <IconFont
                        iconName='#icon-GoChevronDown'
                        style={!fold ? {transform: 'rotate(180deg)'} : {}}
                    />
                    <IconFont
                        iconName='#icon-GoX'
                        onClick={remove}
                        className='ts-iconbutton'
                    />
                </span>
            </div>
            <div className='ts-dividing-line' style={fold ? {display: 'none'} : {}}></div>
            <TranslateResult
                translateRequest={translateRequest}
                style={fold ? {display: 'none'} : {}}
                readText={readText}
                retry={retry}
                insertResult={insertResult}
                setText={setText}
            />
        </div>
    );
};

const IconsLoadingSkeleton: React.FC = () => (<div className='skeleton' style={{width: '2em', height: '1em', marginLeft: '5px'}}></div>);

export default MtResult;