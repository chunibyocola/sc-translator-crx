import React from 'react';
import Button from '../../../../components/Button';
import Slider, { SliderFormat, SliderMarks } from '../../../../components/Slider';
import SourceSelect from '../../../../components/SourceSelect';
import { audioSource } from '../../../../constants/translateSource';
import { setLocalStorage } from '../../../../public/chrome-call';
import { getMessage } from '../../../../public/i18n';
import { playAudio } from '../../../../public/play-audio';
import { useOptions } from '../../../../public/react-use';
import { DefaultOptions } from '../../../../types';
import Switch from '../../../../components/Switch';
import AutoPlayAudioLangs from '../../components/AutoPlayAudioLangs';

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
const volumeFormat = (v: number) => Number(Number(v).toFixed(0));
const playbackRateFormat = (v: number) => Number(Number(v).toFixed(2));
const volumeLabelFormat: SliderFormat = v => `${Number(v).toFixed(0)}`;
const playbackRateLabelFormat: SliderFormat = v => `${Number(v).toFixed(2)}x`;


type PickedOptions = Pick<
    DefaultOptions,
    'defaultAudioSource' |
    'audioVolume' |
    'audioPlaybackRate' |
    'keepUsingDefaultAudioSource' |
    'autoPlayAudio' |
    'autoPlayAudioLangs'
>;
const useOptionsDependency: (keyof PickedOptions)[] = [
    'defaultAudioSource',
    'audioVolume',
    'audioPlaybackRate',
    'keepUsingDefaultAudioSource',
    'autoPlayAudio',
    'autoPlayAudioLangs'
];

const Audio: React.FC = () => {
    const {
        defaultAudioSource,
        audioVolume,
        audioPlaybackRate,
        keepUsingDefaultAudioSource,
        autoPlayAudio,
        autoPlayAudioLangs
    } = useOptions<PickedOptions>(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                {getMessage('optionsSource')}
                <SourceSelect
                    className='border-bottom-select opt-source-select'
                    sourceList={audioSource}
                    source={defaultAudioSource}
                    onChange={value => setLocalStorage({ defaultAudioSource: value })}
                />
                <div className='mt10-ml30'>
                    <Switch
                        label={getMessage('optionsKeepUsingDefaultAudioSource')}
                        checked={keepUsingDefaultAudioSource}
                        onChange={v => setLocalStorage({ keepUsingDefaultAudioSource: v })}
                    />
                </div>
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsAutoplayAudio')}
                    checked={autoPlayAudio}
                    onChange={v => setLocalStorage({ autoPlayAudio: v })}
                />
                <div className='item-description'>{getMessage('optionsAutoplayAudioDescription')}</div>
                <div className='mt10-ml30'>
                    {getMessage('optionsSelectAutoplayLanguage')}
                    <div className='item-description'>{getMessage('optionsSelectAutoplayLanguageDescription')}</div>
                    <div className='mt10-ml30'>
                        <AutoPlayAudioLangs langs={autoPlayAudioLangs} onChange={v => setLocalStorage({ autoPlayAudioLangs: v })} />
                    </div>
                </div>
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
                    mouseUpCallback={v => setLocalStorage({ audioVolume: volumeFormat(v) })}
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
                    mouseUpCallback={v => setLocalStorage({ audioPlaybackRate: playbackRateFormat(v) })}
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