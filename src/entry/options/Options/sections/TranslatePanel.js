import React from 'react';
import Slider from '../../../../components/Slider';
import { getMessage } from '../../../../public/i18n';
import OptionToggle from '../../OptionToggle';

const marksPercentage = [
    { value: 10, label: '10%' },
    { value: 40, label: '40%' },
    { value: 70, label: '70%' },
    { value: 100, label: '100%' }
];
const percentageLabelFormat = v => `${v}%`

const marksPx = [
    { value: 100, label: '100px' },
    { value: 250, label: '250px' },
    { value: 500, label: '500px' },
    { value: 750, label: '750px' },
    { value: 1000, label: '1000px' }
];
const marksWidthPx = [
    { value: 250, label: '250px' },
    { value: 750, label: '750px' },
    { value: 1250, label: '1250px' },
    { value: 1750, label: '1750px' },
    { value: 1910, label: '1910px' }
];
const marksFontSize = [
    { value: 12, label: '12px' },
    { value: 14, label: '14px' },
    { value: 16, label: '16px' },
    { value: 20, label: '20px' },
    { value: 24, label: '24px' },
    { value: 28, label: '28px' }
];
const pxLabelFormat = v => `${v}px`

const TranslatePanel = ({ updateStorage, pinThePanelWhileOpeningIt, rememberPositionOfPinnedPanel, translatePanelMaxHeight, translatePanelWidth, translatePanelFontSize }) => {
    const { percentage: hPercentage, px: hPx, percent: hPercent } = translatePanelMaxHeight;
    const { percentage: wPercentage, px: wPx, percent: wPercent } = translatePanelWidth;

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <div className='options-mode'>
                    {getMessage('optionsMaxHeightOfTranslatePanel')}
                    <OptionToggle
                        id='max-height-percentage'
                        message='optionsPercentage'
                        checked={hPercentage}
                        onClick={() => updateStorage('translatePanelMaxHeight', { ...translatePanelMaxHeight, percentage: !hPercentage })}
                    />
                </div>
                {hPercentage ? <Slider
                    defaultValue={hPercent}
                    min={10}
                    max={100}
                    step={1}
                    marks={marksPercentage}
                    valueLabelDisplay
                    valueLabelFormat={percentageLabelFormat}
                    mouseUpCallback={v => updateStorage('translatePanelMaxHeight', { ...translatePanelMaxHeight, 'percent': v })}
                /> : <Slider
                    defaultValue={hPx}
                    min={100}
                    max={1000}
                    step={5}
                    marks={marksPx}
                    valueLabelDisplay
                    valueLabelFormat={pxLabelFormat}
                    mouseUpCallback={v => updateStorage('translatePanelMaxHeight', { ...translatePanelMaxHeight, 'px': v })}
                />}
            </div>
            <div className='opt-section-row'>
                <div className='options-mode'>
                    {getMessage('optionsWidthOfTranslatePanel')}
                    <OptionToggle
                        id='width-percentage'
                        message='optionsPercentage'
                        checked={wPercentage}
                        onClick={() => updateStorage('translatePanelWidth', { ...translatePanelWidth, percentage: !wPercentage })}
                    />
                </div>
                {wPercentage ? <Slider
                    defaultValue={wPercent}
                    min={10}
                    max={100}
                    step={1}
                    marks={marksPercentage}
                    valueLabelDisplay
                    valueLabelFormat={percentageLabelFormat}
                    mouseUpCallback={v => updateStorage('translatePanelWidth', { ...translatePanelWidth, 'percent': v })}
                /> : <Slider
                    defaultValue={wPx}
                    min={250}
                    max={1910}
                    step={5}
                    marks={marksWidthPx}
                    valueLabelDisplay
                    valueLabelFormat={pxLabelFormat}
                    mouseUpCallback={v => updateStorage('translatePanelWidth', { ...translatePanelWidth, 'px': v })}
                />}
            </div>
            <div className='opt-section-row'>
                {getMessage('optionsFontSizeOfTranslatePanel')}
                <Slider
                    defaultValue={translatePanelFontSize}
                    min={12}
                    max={28}
                    step={1}
                    marks={marksFontSize}
                    valueLabelDisplay
                    valueLabelFormat={pxLabelFormat}
                    mouseUpCallback={v => updateStorage('translatePanelFontSize', v)}
                />
            </div>
            <div className='opt-section-row'>
                <OptionToggle
                    id='pin-the-panel-after-translating'
                    message='optionsPinThePanelWhileOpeningIt'
                    checked={pinThePanelWhileOpeningIt}
                    onClick={() => updateStorage('pinThePanelWhileOpeningIt', !pinThePanelWhileOpeningIt)}
                />
                <div className='item-description'>{getMessage('optionsPinThePanelWhileOpeningItDescription')}</div>
            </div>
            <div className='opt-section-row'>
                <OptionToggle
                    id='remember-position-of-pinned-panel'
                    message='optionsRememberPositionOfPinnedPanel'
                    checked={rememberPositionOfPinnedPanel}
                    onClick={() => updateStorage('rememberPositionOfPinnedPanel', !rememberPositionOfPinnedPanel)}
                />
                <div className='item-description'>{getMessage('optionsRememberPositionOfPinnedPanelDescription')}</div>
            </div>
        </div>
    );
};

export default TranslatePanel;