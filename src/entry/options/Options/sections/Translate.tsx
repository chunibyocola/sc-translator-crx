import React from 'react';
import Slider, { SliderFormat, SliderMarks } from '../../../../components/Slider';
import Switch from '../../../../components/Switch';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import BetaIcon from '../../components/BetaIcon';
import BtnPostion from '../../components/BtnPosition';
import HostList from '../../components/HostList';
import TranslateButtonDisplay from '../../components/TranslateButtonDisplay';
import scOptions from '../../../../public/sc-options';

const marksHideButtonFixedTime: SliderMarks = [
    { value: 500, label: '0.50s' },
    { value: 1000, label: '1.00s' },
    { value: 2000, label: '2.00s' },
    { value: 3000, label: '3.00s' },
    { value: 4000, label: '4.00s' }
];
const hideButtonFixedTimeLabelFormat: SliderFormat = v => `${(v / 1000).toFixed(2)}s`

const useOptionsDependency: GetStorageKeys<
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
> = [
    'translateWithKeyPress',
    'translateDirectly',
    'btnPosition',
    'hideButtonAfterFixedTime',
    'hideButtonFixedTime',
    'translateBlackListMode',
    'translateHostList',
    'respondToSeparateWindow',
    'translateDirectlyWhilePinning',
    'doNotRespondInTextBox',
    'enableInsertResult',
    'autoInsertResult',
    'translateButtons',
    'translateButtonsTL',
    'userLanguage'
];

const Translate: React.FC = () => {
    const {
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
    } = useOptions(useOptionsDependency);

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsTranslateWithKeyPress')}
                    checked={translateWithKeyPress}
                    onChange={v => scOptions.set({ translateWithKeyPress: v })}
                />
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsTranslateDirectly')}
                    checked={translateDirectly}
                    onChange={v => scOptions.set({ translateDirectly: v })}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsShowButtonAfterSelect')}
                <div className='item-description'>{getMessage('optionsShowButtonAfterSelectDescription')}</div>
                <div className='mt10-ml30'>
                    <TranslateButtonDisplay
                        translateButtons={translateButtons}
                        translateButtonsTL={translateButtonsTL}
                        onTranslateButtonsUpdate={value => scOptions.set({ translateButtons: value })}
                        onTranslateButtonsTLUpdate={value => scOptions.set({ translateButtonsTL: value })}
                        userLanguage={userLanguage}
                    />
                </div>
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsButtonsPosition')}
                <div className='mt10-ml30'>
                    <BtnPostion currentPos={btnPosition} updateBtnPosition={pos => scOptions.set({ btnPosition: pos })} />
                </div>
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsHideButtonAfterFixedTime')}
                    checked={hideButtonAfterFixedTime}
                    onChange={v => scOptions.set({ hideButtonAfterFixedTime: v })}
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
                    mouseUpCallback={v => scOptions.set({ hideButtonFixedTime: v })}
                />
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsRespondToSeparateWindow')}
                    checked={respondToSeparateWindow}
                    onChange={v => scOptions.set({ respondToSeparateWindow: v })}
                />
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsTranslateDirectlyWhilePinning')}
                    checked={translateDirectlyWhilePinning}
                    onChange={v => scOptions.set({ translateDirectlyWhilePinning: v })}
                />
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsDoNotRespondInTextBox')}
                    checked={doNotRespondInTextBox}
                    onChange={v => scOptions.set({ doNotRespondInTextBox: v })}
                />
                <div className='item-description'>{getMessage('optionsDoNotRespondInTextBoxDescription')}</div>
            </div>
            <div className='opt-section-row'>
                <div className='flex-align-items-center'>
                    <Switch
                        label={getMessage('optionsEnableInsertResult')}
                        checked={enableInsertResult}
                        onChange={v => scOptions.set({ enableInsertResult: v })}
                    />
                    <BetaIcon />
                </div>
                <div className='item-description'>{getMessage('optionsEnableInsertResultDescription')}</div>
                <div className='mt10-ml30'>
                    <Switch
                        label={getMessage('optionsAutoInsertResult')}
                        checked={autoInsertResult}
                        onChange={v => scOptions.set({ autoInsertResult: v })}
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
                        onChange={v => scOptions.set({ translateBlackListMode: v })}
                    />
                </div>
                <div className='mt10-ml30'>
                    <HostList
                        list={translateHostList}
                        updateList={list => scOptions.set({ translateHostList: list })}
                    />
                </div>
            </div>
        </div>
    );
};

export default Translate;