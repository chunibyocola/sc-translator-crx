import React, { useCallback, useRef, useState } from 'react';
import { defaultStyleVars, darkStyleVars, StyleVars } from '../../../../constants/defaultStyleVars';
import { getMessage } from '../../../../public/i18n';
import ColorSelector from '../../ColorSelector';
import './style.css';

const initChanging = { targetColor: '', saved: false, offsetColor: '' };
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

    const saveColor = useCallback((targetColor, styleVar) => {
        setCustomizeStyleVars({ ...styleVars, [targetColor]: styleVar });
        updateCallback({ ...styleVars, [targetColor]: styleVar });
        setChanging({ targetColor, saved: true, offsetColor: styleVar });
    }, [styleVars, updateCallback]);

    const updateColor = useCallback((targetColor, styleVar) => {
        updateCallback({ ...styleVars, [targetColor]: styleVar });
    }, [styleVars, updateCallback]);

    const handleColorClick = useCallback((targetColor, offsetColor) => {
        !changing.saved && changing.targetColor && updateColor(changing.targetColor, changing.offsetColor);

        setChanging({ targetColor, saved: false, offsetColor });
    }, [changing, updateColor]);

    const handleSaveBtnClick = useCallback(() => {
        const name = themeNameEle.current?.value ?? 'NewTheme';
        let tempName = name.substring(0, 14);
        !tempName && (tempName = 'New Theme');
        finishCallback(customizeStyleVars, tempName);
    }, [finishCallback, customizeStyleVars]);

    const handleOffsetStyleClick = useCallback((styleVars) => {
        setChanging(initChanging);
        updateCallback(styleVars);
        setCustomizeStyleVars(styleVars);
    }, [updateCallback]);

    return (
        <div className='customize-board-options'>
            <div className='customize-board-options-colors'>
                <p className='colors-head'>{getMessage('themePreset')}</p>
                <div className='customize-offset'>
                    <div
                        className='customize-offset-item ts-button'
                        onClick={() => handleOffsetStyleClick(defaultStyleVars)}
                        style={({background: defaultStyleVars['--bg-content']})}
                    />
                    <div
                        className='customize-offset-item ts-button'
                        onClick={() => handleOffsetStyleClick(darkStyleVars)}
                        style={{background: darkStyleVars['--bg-content']}}
                    />
                </div>
                <p className='colors-head'>{getMessage('themeTextColor')}</p>
                {textKeyList.map((v) => (<div className='colors-title'>
                    <span className='colors-label' style={{color: v === changing.targetColor ? '#1F88D6' : '#666666'}}>{i18nMessage[v]}</span>
                    <div
                        className='colors-color ts-button'
                        style={{background: customizeStyleVars[v]}}
                        onClick={() => handleColorClick(v, customizeStyleVars[v])}
                    />
                </div>))}
                <p className='colors-head'>{getMessage('themeBackgroundColor')}</p>
                {bgKeyList.map((v) => (<div className='colors-title'>
                    <span className='colors-label' style={{color: v === changing.targetColor ? '#1F88D6' : '#666666'}}>{i18nMessage[v]}</span>
                    <div
                        className='colors-color ts-button'
                        style={{background: customizeStyleVars[v]}}
                        onClick={() => handleColorClick(v, customizeStyleVars[v])}
                    />
                </div>))}
                <p className='colors-head'>{getMessage('themeThemeName')}</p>
                <input className='colors-theme-name' ref={themeNameEle} type='text' defaultValue={themeName} />
                <div className='ts-dividing-line' style={{background: '#000', margin: '10px 0'}}></div>
                <button className='colors-save' onClick={() => handleSaveBtnClick()}>{getMessage('wordSave')}</button>
            </div>
            {changing.targetColor && <ColorSelector
                initColor={changing.offsetColor}
                save={color => saveColor(changing.targetColor, color)}
                update={color => updateColor(changing.targetColor, color)}
            />}
        </div>
    );
};

export default CustomizeBoardOptions;