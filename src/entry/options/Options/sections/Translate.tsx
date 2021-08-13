import React from 'react';
import { GenericOptionsProps } from '..';
import Slider, { SliderFormat, SliderMarks } from '../../../../components/Slider';
import { getMessage } from '../../../../public/i18n';
import { DefaultOptions } from '../../../../types';
import BetaIcon from '../../BetaIcon';
import BtnPostion from '../../BtnPosition';
import HostList from '../../HostList';
import OptionToggle from '../../OptionToggle';
import TranslateButtonDisplay from '../../TranslateButtonDisplay';

const marksHideButtonFixedTime: SliderMarks = [
    { value: 500, label: '0.50s' },
    { value: 1000, label: '1.00s' },
    { value: 2000, label: '2.00s' },
    { value: 3000, label: '3.00s' },
    { value: 4000, label: '4.00s' }
];
const hideButtonFixedTimeLabelFormat: SliderFormat = v => `${(v / 1000).toFixed(2)}s`

type TranslateProps = GenericOptionsProps<Pick<
    DefaultOptions,
    'translateWithKeyPress' |
    'translateDirectly' |
    'btnPosition' |
    'hideButtonAfterFixedTime' |
    'hideButtonFixedTime' |
    'translateBlackListMode' |
    'translateHostList' |
    'respondToSeparateWindow' |
    'translateDirectlyWhilePinning' |
    'doNotRespondInTextBox' |
    'enableInsertResult' |
    'autoInsertResult' |
    'translateButtons'
>>;

const Translate: React.FC<TranslateProps> = ({
    updateStorage,
    translateWithKeyPress,
    translateDirectly,
    btnPosition,
    hideButtonAfterFixedTime,
    hideButtonFixedTime,
    translateBlackListMode,
    translateHostList,
    respondToSeparateWindow,
    translateDirectlyWhilePinning,
    doNotRespondInTextBox,
    enableInsertResult,
    autoInsertResult,
    translateButtons
}) => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <OptionToggle
                    id='translate-with-key-press-checkbox'
                    message='optionsTranslateWithKeyPress'
                    checked={translateWithKeyPress}
                    onClick={() => updateStorage('translateWithKeyPress', !translateWithKeyPress)}
                />
            </div>
            <div className='opt-section-row'>
                <OptionToggle
                    id='translate-directly-checkbox'
                    message='optionsTranslateDirectly'
                    checked={translateDirectly}
                    onClick={() => updateStorage('translateDirectly', !translateDirectly)}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsShowButtonAfterSelect')}
                <div className='item-description'>{getMessage('optionsShowButtonAfterSelectDescription')}</div>
                <div className='mt10-ml30'>
                    <TranslateButtonDisplay
                        translateButtons={translateButtons}
                        onUpdate={value => updateStorage('translateButtons', value)}
                    />
                </div>
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsButtonsPosition')}
                <div className='mt10-ml30'>
                    <BtnPostion currentPos={btnPosition} updateBtnPosition={pos => updateStorage('btnPosition', pos)} />
                </div>
            </div>
            <div className='opt-section-row'>
                <OptionToggle
                    id='hide-button-after-fixed-time'
                    message='optionsHideButtonAfterFixedTime'
                    checked={hideButtonAfterFixedTime}
                    onClick={() => updateStorage('hideButtonAfterFixedTime', !hideButtonAfterFixedTime)}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsTheFixedTimeOfHidingButton')}
                <Slider
                    defaultValue={hideButtonFixedTime}
                    min={500}
                    max={4000}
                    step={250}
                    marks={marksHideButtonFixedTime}
                    valueLabelDisplay
                    valueLabelFormat={hideButtonFixedTimeLabelFormat}
                    mouseUpCallback={v => updateStorage('hideButtonFixedTime', v)}
                />
            </div>
            <div className='opt-section-row'>
                <OptionToggle
                    id='respond-to-separate-window'
                    message='optionsRespondToSeparateWindow'
                    checked={respondToSeparateWindow}
                    onClick={() => updateStorage('respondToSeparateWindow', !respondToSeparateWindow)}
                />
            </div>
            <div className='opt-section-row'>
                <OptionToggle
                    id='translate-directly-while-pinning'
                    message='optionsTranslateDirectlyWhilePinning'
                    checked={translateDirectlyWhilePinning}
                    onClick={() => updateStorage('translateDirectlyWhilePinning', !translateDirectlyWhilePinning)}
                />
            </div>
            <div className='opt-section-row'>
                <OptionToggle
                    id='do-not-respond-in-text-box'
                    message='optionsDoNotRespondInTextBox'
                    checked={doNotRespondInTextBox}
                    onClick={() => updateStorage('doNotRespondInTextBox', !doNotRespondInTextBox)}
                />
                <div className='item-description'>{getMessage('optionsDoNotRespondInTextBoxDescription')}</div>
            </div>
            <div className='opt-section-row'>
                <div className='flex-align-items-center'>
                    <OptionToggle
                        id='enable-insert-result'
                        message='optionsEnableInsertResult'
                        checked={enableInsertResult}
                        onClick={() => updateStorage('enableInsertResult', !enableInsertResult)}
                    />
                    <BetaIcon />
                </div>
                <div className='item-description'>{getMessage('optionsEnableInsertResultDescription')}</div>
                <div className='mt10-ml30'>
                    <OptionToggle
                        id='auto-insert-result'
                        message='optionsAutoInsertResult'
                        checked={autoInsertResult}
                        onClick={() => updateStorage('autoInsertResult', !autoInsertResult)}
                    />
                    <div className='item-description'>{getMessage('optionsAutoInsertResultDescription')}</div>
                </div>
            </div>
            <div className='opt-section-row'>
                <div className='options-mode'>
                    {getMessage('optionsDomainfilter')}
                    <OptionToggle
                        id='translate-black-list-mode-checkbox'
                        message='optionsTranslateBlackListMode'
                        checked={translateBlackListMode}
                        onClick={() => updateStorage('translateBlackListMode', !translateBlackListMode)}
                    />
                </div>
                <div className='mt10-ml30'>
                    <HostList
                        list={translateHostList}
                        updateList={list => updateStorage('translateHostList', list)}
                    />
                </div>
            </div>
        </div>
    );
};

export default Translate;