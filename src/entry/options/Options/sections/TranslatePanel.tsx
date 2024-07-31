import React from 'react';
import Slider, { SliderFormat, SliderMarks } from '../../../../components/Slider';
import Switch from '../../../../components/Switch';
import { getMessage } from '../../../../public/i18n';
import { useOptions } from '../../../../public/react-use';
import { GetStorageKeys } from '../../../../types';
import scOptions from '../../../../public/sc-options';

const marksPercentage: SliderMarks = [
    { value: 10, label: '10%' },
    { value: 40, label: '40%' },
    { value: 70, label: '70%' },
    { value: 100, label: '100%' }
];
const percentageLabelFormat: SliderFormat = v => `${v}%`

const marksPx: SliderMarks = [
    { value: 100, label: '100px' },
    { value: 250, label: '250px' },
    { value: 500, label: '500px' },
    { value: 750, label: '750px' },
    { value: 1000, label: '1000px' }
];
const marksWidthPx: SliderMarks = [
    { value: 250, label: '250px' },
    { value: 750, label: '750px' },
    { value: 1250, label: '1250px' },
    { value: 1750, label: '1750px' },
    { value: 1910, label: '1910px' }
];
const marksFontSize: SliderMarks = [
    { value: 12, label: '12px' },
    { value: 14, label: '14px' },
    { value: 16, label: '16px' },
    { value: 20, label: '20px' },
    { value: 24, label: '24px' },
    { value: 28, label: '28px' }
];
const pxLabelFormat: SliderFormat = v => `${v}px`

const useOptionsDependency: GetStorageKeys<
    'pinThePanelWhileOpeningIt' |
    'rememberPositionOfPinnedPanel' |
    'translatePanelMaxHeight' |
    'translatePanelWidth' |
    'translatePanelFontSize' |
    'autoTranslateAfterInput'
> = [
    'pinThePanelWhileOpeningIt',
    'rememberPositionOfPinnedPanel',
    'translatePanelMaxHeight',
    'translatePanelWidth',
    'translatePanelFontSize',
    'autoTranslateAfterInput'
];

const TranslatePanel: React.FC = () => {
    const {
        pinThePanelWhileOpeningIt,
        rememberPositionOfPinnedPanel,
        translatePanelMaxHeight,
        translatePanelWidth,
        translatePanelFontSize,
        autoTranslateAfterInput
    } = useOptions(useOptionsDependency);

    const { percentage: hPercentage, px: hPx, percent: hPercent } = translatePanelMaxHeight;
    const { percentage: wPercentage, px: wPx, percent: wPercent } = translatePanelWidth;

    return (
        <div className='opt-section'>
            <div className='opt-section-row'>
                <div className='options-mode'>
                    {getMessage('optionsMaxHeightOfTranslatePanel')}
                    <Switch
                        label={getMessage('optionsPercentage')}
                        checked={hPercentage}
                        onChange={v => scOptions.set({ translatePanelMaxHeight: { ...translatePanelMaxHeight, percentage: v } })}
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
                    mouseUpCallback={v => scOptions.set({ translatePanelMaxHeight: { ...translatePanelMaxHeight, 'percent': v } })}
                /> : <Slider
                    defaultValue={hPx}
                    min={100}
                    max={1000}
                    step={5}
                    marks={marksPx}
                    valueLabelDisplay
                    valueLabelFormat={pxLabelFormat}
                    mouseUpCallback={v => scOptions.set({ translatePanelMaxHeight: { ...translatePanelMaxHeight, 'px': v } })}
                />}
            </div>
            <div className='opt-section-row'>
                <div className='options-mode'>
                    {getMessage('optionsWidthOfTranslatePanel')}
                    <Switch
                        label={getMessage('optionsPercentage')}
                        checked={wPercentage}
                        onChange={v => scOptions.set({ translatePanelWidth: { ...translatePanelWidth, percentage: v } })}
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
                    mouseUpCallback={v => scOptions.set({ translatePanelWidth: { ...translatePanelWidth, 'percent': v } })}
                /> : <Slider
                    defaultValue={wPx}
                    min={250}
                    max={1910}
                    step={5}
                    marks={marksWidthPx}
                    valueLabelDisplay
                    valueLabelFormat={pxLabelFormat}
                    mouseUpCallback={v => scOptions.set({ translatePanelWidth: { ...translatePanelWidth, 'px': v } })}
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
                    mouseUpCallback={v => scOptions.set({ translatePanelFontSize: v })}
                />
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsPinThePanelWhileOpeningIt')}
                    checked={pinThePanelWhileOpeningIt}
                    onChange={v => scOptions.set({ pinThePanelWhileOpeningIt: v })}
                />
                <div className='item-description'>{getMessage('optionsPinThePanelWhileOpeningItDescription')}</div>
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsRememberPositionOfPinnedPanel')}
                    checked={rememberPositionOfPinnedPanel}
                    onChange={v => scOptions.set({ rememberPositionOfPinnedPanel: v })}
                />
                <div className='item-description'>{getMessage('optionsRememberPositionOfPinnedPanelDescription')}</div>
            </div>
            <div className='opt-section-row'>
                <Switch
                    label={getMessage('optionsAutoTranslateAfterInput')}
                    checked={autoTranslateAfterInput}
                    onChange={v => scOptions.set({ autoTranslateAfterInput: v })}
                />
                <div className='item-description'>{getMessage('optionsAutoTranslateAfterInputDescription')}</div>
            </div>
        </div>
    );
};

export default TranslatePanel;