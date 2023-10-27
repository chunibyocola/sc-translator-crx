import React, { useCallback, useRef, useState } from 'react';
import Button from '../../../../../components/Button';
import { defaultStyleVars, darkStyleVars, StyleVars } from '../../../../../constants/defaultStyleVars';
import { getMessage } from '../../../../../public/i18n';
import ColorSelector from '../../ColorSelector';
import './style.css';

const initChanging: { targetColor: keyof StyleVars | null; saved: boolean; offsetColor: string; } = { targetColor: null, saved: false, offsetColor: '' };
const textKeyList: (keyof Pick<StyleVars, '--text-normal' | '--text-icon'>)[] = ['--text-normal', '--text-icon'];
const bgKeyList: (keyof Pick<StyleVars, '--bg-content' | '--bg-total' | '--bg-item-hover' | '--bg-select-focus'>)[] = ['--bg-content', '--bg-total', '--bg-item-hover', '--bg-select-focus'];
const i18nMessage = {
    '--text-normal': 'Normal',
    '--text-icon': 'Icon',
    '--bg-content': 'Content',
    '--bg-total': 'Total',
    '--bg-item-hover': 'Item hover',
    '--bg-select-focus': 'Select focus'
};

type CustomizeBoardOptionsProps = {
    styleVars: StyleVars;
    themeName: string;
    updateCallback: (styleVars: StyleVars) => void;
    finishCallback: (styleVars: StyleVars, themeName: string) => void;
};

const CustomizeBoardOptions: React.FC<CustomizeBoardOptionsProps> = ({ styleVars, themeName, updateCallback, finishCallback }) => {
    const [customizeStyleVars, setCustomizeStyleVars] = useState<StyleVars>(styleVars);
    const [changing, setChanging] = useState(initChanging);

    const themeNameEle = useRef<HTMLInputElement>(null);

    const saveColor = useCallback((targetColor: keyof StyleVars, styleVar: string) => {
        setCustomizeStyleVars({ ...styleVars, [targetColor]: styleVar });
        updateCallback({ ...styleVars, [targetColor]: styleVar });
        setChanging({ targetColor, saved: true, offsetColor: styleVar });
    }, [styleVars, updateCallback]);

    const updateColor = useCallback((targetColor: keyof StyleVars, styleVar: string) => {
        updateCallback({ ...styleVars, [targetColor]: styleVar });
    }, [styleVars, updateCallback]);

    const handleColorClick = useCallback((targetColor: keyof StyleVars, offsetColor: string) => {
        changing.targetColor && changing.offsetColor && updateColor(changing.targetColor, changing.offsetColor);

        setChanging({ targetColor, saved: false, offsetColor });
    }, [changing, updateColor]);

    const handleSaveBtnClick = useCallback(() => {
        const name = themeNameEle.current?.value ?? 'NewTheme';
        let tempName = name.substring(0, 14);
        !tempName && (tempName = 'New Theme');
        finishCallback(customizeStyleVars, tempName);
    }, [finishCallback, customizeStyleVars]);

    const handleOffsetStyleClick = useCallback((styleVars: StyleVars) => {
        setChanging(initChanging);
        updateCallback(styleVars);
        setCustomizeStyleVars(styleVars);
    }, [updateCallback]);

    return (
        <div className='customize-board-options'>
            <div className='customize-board-options__colors'>
                <p className='customize-board-options__colors-head'>{getMessage('themePreset')}</p>
                <div className='customize-board-options__colors-offset'>
                    <div
                        className='customize-board-options__colors-offset-item button'
                        onClick={() => handleOffsetStyleClick(defaultStyleVars)}
                        style={({background: defaultStyleVars['--bg-content']})}
                    />
                    <div
                        className='customize-board-options__colors-offset-item button'
                        onClick={() => handleOffsetStyleClick(darkStyleVars)}
                        style={{background: darkStyleVars['--bg-content']}}
                    />
                </div>
                <p className='customize-board-options__colors-head'>{getMessage('themeTextColor')}</p>
                {textKeyList.map((v) => (<div key={v} className='customize-board-options__colors-title'>
                    <span className='customize-board-options__colors-label' style={{color: v === changing.targetColor ? '#1F88D6' : '#666666'}}>{i18nMessage[v]}</span>
                    <div
                        className='customize-board-options__colors-color button'
                        style={{background: customizeStyleVars[v]}}
                        onClick={() => handleColorClick(v, customizeStyleVars[v])}
                    />
                </div>))}
                <p className='customize-board-options__colors-head'>{getMessage('themeBackgroundColor')}</p>
                {bgKeyList.map((v) => (<div key={v} className='customize-board-options__colors-title'>
                    <span className='customize-board-options__colors-label' style={{color: v === changing.targetColor ? '#1F88D6' : '#666666'}}>{i18nMessage[v]}</span>
                    <div
                        className='customize-board-options__colors-color button'
                        style={{background: customizeStyleVars[v]}}
                        onClick={() => handleColorClick(v, customizeStyleVars[v])}
                    />
                </div>))}
                <p className='customize-board-options__colors-head'>{getMessage('themeThemeName')}</p>
                <input className='customize-board-options__colors-theme-name' ref={themeNameEle} type='text' defaultValue={themeName} />
                <div className='dividing-line' style={{background: '#000', margin: '10px 0'}}></div>
                <Button variant='outlined' className='customize-board-options__colors-save' onClick={() => handleSaveBtnClick()}>{getMessage('wordSave')}</Button>
            </div>
            {changing.targetColor && <ColorSelector
                initColor={changing.offsetColor}
                save={color => changing.targetColor && saveColor(changing.targetColor, color)}
                update={color => changing.targetColor && updateColor(changing.targetColor, color)}
            />}
        </div>
    );
};

export default CustomizeBoardOptions;