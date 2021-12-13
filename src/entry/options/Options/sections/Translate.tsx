import React from 'react';
import { GenericOptionsProps } from '..';
import Slider, { SliderFormat, SliderMarks } from '../../../../components/Slider';
import Switch from '../../../../components/Switch';
import { getMessage } from '../../../../public/i18n';
import { DefaultOptions } from '../../../../types';
import BetaIcon from '../../BetaIcon';
import BtnPostion from '../../BtnPosition';
import HostList from '../../HostList';
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
    'translateButtons' |
    'translateButtonsTL' |
    'userLanguage'
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
    translateButtons,
    translateButtonsTL,
    userLanguage
}) => {
    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsTranslateWithKeyPress')}
                    checked={translateWithKeyPress}
                    onChange={v => updateStorage('translateWithKeyPress', v)}
                />
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsTranslateDirectly')}
                    checked={translateDirectly}
                    onChange={v => updateStorage('translateDirectly', v)}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsShowButtonAfterSelect')}
                <div className='item-description'>{getMessage('optionsShowButtonAfterSelectDescription')}</div>
                <div className='mt10-ml30'>
                    <TranslateButtonDisplay
                        translateButtons={translateButtons}
                        translateButtonsTL={translateButtonsTL}
                        onTranslateButtonsUpdate={value => updateStorage('translateButtons', value)}
                        onTranslateButtonsTLUpdate={value => updateStorage('translateButtonsTL', value)}
                        userLanguage={userLanguage}
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
                <Switch
                    label={getMessage('optionsHideButtonAfterFixedTime')}
                    checked={hideButtonAfterFixedTime}
                    onChange={v => updateStorage('hideButtonAfterFixedTime', v)}
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
                <Switch
                    label={getMessage('optionsRespondToSeparateWindow')}
                    checked={respondToSeparateWindow}
                    onChange={v => updateStorage('respondToSeparateWindow', v)}
                />
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsTranslateDirectlyWhilePinning')}
                    checked={translateDirectlyWhilePinning}
                    onChange={v => updateStorage('translateDirectlyWhilePinning', v)}
                />
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsDoNotRespondInTextBox')}
                    checked={doNotRespondInTextBox}
                    onChange={v => updateStorage('doNotRespondInTextBox', v)}
                />
                <div className='item-description'>{getMessage('optionsDoNotRespondInTextBoxDescription')}</div>
            </div>
            <div className='opt-section-row'>
                <div className='flex-align-items-center'>
                    <Switch
                        label={getMessage('optionsEnableInsertResult')}
                        checked={enableInsertResult}
                        onChange={v => updateStorage('enableInsertResult', v)}
                    />
                    <BetaIcon />
                </div>
                <div className='item-description'>{getMessage('optionsEnableInsertResultDescription')}</div>
                <div className='mt10-ml30'>
                    <Switch
                        label={getMessage('optionsAutoInsertResult')}
                        checked={autoInsertResult}
                        onChange={v => updateStorage('autoInsertResult', v)}
                    />
                    <div className='item-description'>{getMessage('optionsAutoInsertResultDescription')}</div>
                </div>
            </div>
            <div className='opt-section-row'>
                <div className='options-mode'>
                    {getMessage('optionsDomainfilter')}
                    <Switch
                        label={getMessage('optionsTranslateBlackListMode')}
                        checked={translateBlackListMode}
                        onChange={v => updateStorage('translateBlackListMode', v)}
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