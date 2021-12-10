import React from 'react';
import { GenericOptionsProps } from '..';
import Button from '../../../../components/Button';
import Slider, { SliderFormat, SliderMarks } from '../../../../components/Slider';
import SourceSelect from '../../../../components/SourceSelect';
import { audioSource } from '../../../../constants/translateSource';
import { getMessage } from '../../../../public/i18n';
import { playAudio } from '../../../../public/play-audio';
import { DefaultOptions } from '../../../../types';

const marksVolume: SliderMarks = [
    { value: 5, label: '5' },
    { value: 20, label: '20' },
    { value: 40, label: '40' },
    { value: 60, label: '60' },
    { value: 80, label: '80' },
    { value: 100, label: '100' }
];
const marksPlaybackRate: SliderMarks = [
    { value: 0.5, label: '0.50x' },
    { value: 0.75, label: '0.75x' },
    { value: 1, label: '1.00x' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 1.75, label: '1.75x' },
    { value: 2, label: '2.00x' }
];
const volumeFormat: SliderFormat = v => Number(Number(v).toFixed(0));
const playbackRateFormat: SliderFormat = v => Number(Number(v).toFixed(2));
const volumeLabelFormat: SliderFormat = v => `${Number(v).toFixed(0)}`;
const playbackRateLabelFormat: SliderFormat = v => `${Number(v).toFixed(2)}x`;

type AudioProps = GenericOptionsProps<Pick<
    DefaultOptions,
    'defaultAudioSource' |
    'audioVolume' |
    'audioPlaybackRate'
>>;

const Audio: React.FC<AudioProps> = ({ updateStorage, defaultAudioSource, audioVolume, audioPlaybackRate }) => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                {getMessage('optionsSource')}
                <SourceSelect
                    className='border-bottom-select opt-source-select'
                    sourceList={audioSource}
                    source={defaultAudioSource}
                    onChange={value => updateStorage('defaultAudioSource', value)}
                />
            </div>
            <div className='opt-section-row'>
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
            </div>
            <div className='opt-section-row'>
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
            </div>
            <div className='opt-section-row'>
                <Button variant='outlined' onClick={() => playAudio({ text: 'this is a test audio', from: 'en' })}>{getMessage('optionsPlayTestAudio')}</Button>
            </div>
        </div>
    );
};

export default Audio;