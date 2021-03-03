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
const pxLabelFormat = v => `${v}px`

const TranslatePanel = ({ updateStorage, pinThePanelWhileOpeningIt, rememberPositionOfPinnedPanel, translatePanelMaxHeight }) => {
    const { percentage, px, percent } = translatePanelMaxHeight;

    return (
        <div className='opt-item'>
            <div className='options-mode'>
                {getMessage('optionsMaxHeightOfTranslatePanel')}
                <OptionToggle
                    id='max-height-percentage'
                    message='optionsPercentage'
                    checked={percentage}
                    onClick={() => updateStorage('translatePanelMaxHeight', { ...translatePanelMaxHeight, percentage: !percentage })}
                />
            </div>
            {percentage ? <Slider
                defaultValue={percent}
                min={10}
                max={100}
                step={1}
                marks={marksPercentage}
                valueLabelDisplay
                valueLabelFormat={percentageLabelFormat}
                mouseUpCallback={v => updateStorage('translatePanelMaxHeight', { ...translatePanelMaxHeight, 'percent': v })}
            /> : <Slider
                defaultValue={px}
                min={100}
                max={1000}
                step={5}
                marks={marksPx}
                valueLabelDisplay
                valueLabelFormat={pxLabelFormat}
                mouseUpCallback={v => updateStorage('translatePanelMaxHeight', { ...translatePanelMaxHeight, 'px': v })}
            />}
            <OptionToggle
                id='pin-the-panel-after-translating'
                message='optionsPinThePanelWhileOpeningIt'
                checked={pinThePanelWhileOpeningIt}
                onClick={() => updateStorage('pinThePanelWhileOpeningIt', !pinThePanelWhileOpeningIt)}
            />
            <div className='item-description'>{getMessage('optionsPinThePanelWhileOpeningItDescription')}</div>
            <OptionToggle
                id='remember-position-of-pinned-panel'
                message='optionsRememberPositionOfPinnedPanel'
                checked={rememberPositionOfPinnedPanel}
                onClick={() => updateStorage('rememberPositionOfPinnedPanel', !rememberPositionOfPinnedPanel)}
            />
            <div className='item-description'>{getMessage('optionsRememberPositionOfPinnedPanelDescription')}</div>
        </div>
    );
};

export default TranslatePanel;