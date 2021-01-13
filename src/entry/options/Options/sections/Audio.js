import React from 'react';
import Slider from '../../../../components/Slider';
import SourceSelect from '../../../../components/SourceSelect';
import { audioSource } from '../../../../constants/translateSource';
import { getMessage } from '../../../../public/i18n';
import { sendAudio } from '../../../../public/send';

const marksVolume = [
    { value: 5, label: '5' },
    { value: 20, label: '20' },
    { value: 40, label: '40' },
    { value: 60, label: '60' },
    { value: 80, label: '80' },
    { value: 100, label: '100' }
];
const marksPlaybackRate = [
    { value: 0.5, label: '0.50x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: '1.00x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 1.75, label: '1.75x' },
    { value: 2, label: '2.00x' }
];
const volumeFormat = v => Number(Number(v).toFixed(0));
const playbackRateFormat = v => Number(Number(v).toFixed(2));
const volumeLabelFormat = v => `${Number(v).toFixed(0)}`;
const playbackRateLabelFormat = v => `${Number(v).toFixed(2)}x`;

const Audio = ({ updateStorage, defaultAudioSource, audioVolume, audioPlaybackRate }) => {
    return (
        <>
            <h3>{getMessage('optionsAudio')}</h3>
            <div className='opt-item'>
                {getMessage('optionsDefaultAudioOptions')}
                <div className='child-mt10-ml30'>
                    <div className='opt-source-select'>
                        {getMessage('optionsSource')}
                        <SourceSelect
                            sourceList={audioSource}
                            source={defaultAudioSource}
                            onChange={value => updateStorage('defaultAudioSource', value)}
                        />
                    </div>
                </div>
            </div>
            <div className='opt-item'>
                {getMessage('optionsVolume')}
                <Slider
                    defaultValue={audioVolume}
                    min={5}
                    max={100}
                    step={5}
                    marks={marksVolume}
                    valueLabelDisplay
                    mouseUpCallback={v => updateStorage('audioVolume', volumeFormat(v))}
                    valueLabelFormat={volumeLabelFormat}
                />
                {getMessage('optionsPlaybackRate')}
                <Slider
                    defaultValue={audioPlaybackRate}
                    min={0.5}
                    max={2}
                    step={0.25}
                    marks={marksPlaybackRate}
                    valueLabelDisplay
                    mouseUpCallback={v => updateStorage('audioPlaybackRate', playbackRateFormat(v))}
                    valueLabelFormat={playbackRateLabelFormat}
                />
                <button onClick={() => sendAudio('this is a test audio', { from: 'en' })}>{getMessage('optionsPlayTestAudio')}</button>
            </div>
        </>
    );
};

export default Audio;