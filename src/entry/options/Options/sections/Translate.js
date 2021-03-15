import React from 'react';
import Slider from '../../../../components/Slider';
import { getMessage } from '../../../../public/i18n';
import BtnPostion from '../../BtnPosition';
import HostList from '../../HostList';
import OptionToggle from '../../OptionToggle';

const marksHideButtonFixedTime = [
    { value: 500, label: '0.50s' },
    { value: 1000, label: '1.00s' },
    { value: 2000, label: '2.00s' },
    { value: 3000, label: '3.00s' },
    { value: 4000, label: '4.00s' }
];
const hideButtonFixedTimeLabelFormat = v => `${(v / 1000).toFixed(2)}s`

const Translate = ({
    updateStorage,
    translateWithKeyPress,
    enableContextMenus,
    translateDirectly,
    showButtonAfterSelect,
    btnPosition,
    hideButtonAfterFixedTime,
    hideButtonFixedTime,
    translateBlackListMode,
    translateHostList,
    respondToSeparateWindow
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
                    id='context-menus-checkbox'
                    message='optionsEnableContextMenus'
                    checked={enableContextMenus}
                    onClick={() => updateStorage('enableContextMenus', !enableContextMenus)}
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
                <OptionToggle
                    id='show-button-after-select-checkbox'
                    message='optionsShowButtonAfterSelect'
                    checked={showButtonAfterSelect}
                    onClick={() => updateStorage('showButtonAfterSelect', !showButtonAfterSelect)}
                />
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsButtonsPosition')}
                <div className='mt10-ml30'>
                    <BtnPostion currentPos={btnPosition} updateBtnPostion={pos => updateStorage('btnPosition', pos)} />
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