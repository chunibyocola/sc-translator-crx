import React, { useRef, useState } from 'react';
import ColorSelector, { ColorSelectorForwardRef } from '../ColorSelector';
import './style.css';
import { flushSync } from 'react-dom';
import Button from '../../../components/Button';
import SelectOptions from '../../../components/SelectOptions';
import { ComparisonCustomization } from '../../../types';
import { useMouseEventOutside } from '../../../public/react-use';
import { getMessage } from '../../../public/i18n';

const presetColors = [
    'rgba(220,53,95,1)',
    'rgba(223,78,39,1)',
    'rgba(231,149,57,1)',
    'rgba(85,166,87,1)',
    'rgba(77,167,147,1)',
    'rgba(144,236,233,1)',
    'rgba(74,69,172,1)'
];
const currentColorStr = 'currentcolor';
const defaultColorStr = 'rgba(0,0,0,1)';

const underlineStyles = ['solid', 'dashed', 'dotted'];

type CustomizeTranslationProps = {
    comparisonCustomization: ComparisonCustomization;
    addUnderline: boolean;
    children?: React.ReactNode;
    onChange: (comparisonCustomization: ComparisonCustomization) => void;
}

const CustomizeTranslation: React.FC<CustomizeTranslationProps> = ({ comparisonCustomization, addUnderline, onChange, children }) => {
    const [editing, setEditing] = useState<{ name: keyof typeof comparisonCustomization; initColor: string; nextColor: string; } | null>(null);
    const [showOptions, setShowOptions] = useState(false);

    const colorSelectorRef = useRef<ColorSelectorForwardRef>(null);
    const underlineStyleElementRef = useRef<HTMLDivElement>(null);

    useMouseEventOutside(() => setShowOptions(false), 'mousedown', underlineStyleElementRef.current, showOptions);

    const getComparisonStyle = () => {
        const color = editing?.name === 'color' ? editing.nextColor : comparisonCustomization.color
        const underlineColor = editing?.name === 'underlineColor' ? editing.nextColor : comparisonCustomization.underlineColor;

        return {
            color,
            borderBottom: addUnderline ? `2px ${comparisonCustomization.underlineStyle} ${underlineColor}` : undefined
        };
    };

    const ColorItem = (name: keyof Omit<ComparisonCustomization, 'underlineStyle'>, color: string) => (
        <div
            className='customize-translation__items__item'
            onClick={() => {
                if (editing?.name !== name) {
                    setEditing({ name, initColor: color === currentColorStr ? defaultColorStr : color, nextColor: color });
                }
                else if (editing?.name === name) {
                    setEditing(null);
                }
            }}
            {...(name === editing?.name && { style: { borderColor: 'rgb(25, 118, 210)' } })}
        >
            {((editing?.name === name && editing?.nextColor === currentColorStr) || (editing?.name !== name && color === currentColorStr)) ? <span
                className='customize-translation__current-color-icon'
            /> : <span
                className='customize-translation__items__item__color'
                style={{ backgroundColor: editing?.name === name ? editing.nextColor : color }}
            />}
            <span className='customize-translation__items__item__name'>
                {name === 'color' ? getMessage('optionsColor') : name === 'underlineColor' ? getMessage('optionsUnderlineColor') : name}
            </span>
        </div>
    );

    return (
        <div className='customize-translation'>
            <fieldset className='customize-translation__example'>
                <legend>{getMessage('optionsPreview')}</legend>
                <div className='mt10-ml30'>
                    <span className='customize-translation__example__translation'>{getMessage('optionsOriginalText')}</span>
                    <span
                        className='customize-translation__example__comparison'
                        style={getComparisonStyle()}
                    >
                        {getMessage('optionsTranslation')}
                    </span>
                </div>
            </fieldset>
            <div style={{ marginBottom: '8px' }}>
                {children}
            </div>
            <div className='customize-translation__items'>
                {ColorItem('color', comparisonCustomization.color)}
                {ColorItem('underlineColor', comparisonCustomization.underlineColor)}
                <div
                    className='customize-translation__items__item'
                    ref={underlineStyleElementRef}
                    style={{ position: 'relative', borderColor: showOptions ? 'rgb(25, 118, 210)' : 'transparent' }}
                    onClick={() => {
                        setShowOptions(!showOptions);
                        setEditing(null);
                    }}
                >
                    <span
                        className='customize-translation__items__item__name'
                        style={{
                            borderBottom: `2px ${comparisonCustomization.underlineStyle} rgba(147,52,230,1)`,
                            padding: '0 5px',
                            margin: '0 5px'
                        }}
                    >
                        {getMessage('optionsUnderlineStyle')}
                    </span>
                    <SelectOptions
                        show={showOptions}
                    >
                        {underlineStyles.map((underlineStyle) => (<div
                            key={underlineStyle}
                            className='underline-style__item'
                            onClick={() => {
                                onChange({ ...comparisonCustomization, underlineStyle });
                            }}
                        >
                            <span
                                className='underline-style__item__example'
                                style={{ borderBottom: `2px ${underlineStyle} rgba(147,52,230,1)` }}
                            >
                                {underlineStyle}
                            </span>
                        </div>))}
                    </SelectOptions>
                </div>
            </div>
            {editing && <div className='customize-translation__color-selector'>
                <div className='customize-translation__color-selector__bar'>
                    <div className='customize-translation__color-selector__bar__left'>
                        <Button
                            variant='text'
                            onClick={() => {
                                flushSync(() => {
                                    colorSelectorRef.current?.setRGBA(defaultColorStr);
                                });
                                setEditing({ ...editing, nextColor: currentColorStr });
                            }}
                        >
                            <span className='customize-translation__current-color-icon' />
                            {getMessage('optionsUnset')}
                        </Button>
                        {presetColors.map((value) => (<span
                            key={value}
                            className='customize-translation__color'
                            style={{ backgroundColor: value }}
                            onClick={() => {
                                colorSelectorRef.current?.setRGBA(value);
                            }}
                        />))}
                    </div>
                    <div className='customize-translation__color-selector__bar__right'>
                        <Button
                            variant='text'
                            onClick={() => setEditing(null)}
                        >
                            {getMessage('optionsClose')}
                        </Button>
                    </div>
                </div>
                <ColorSelector
                    ref={colorSelectorRef}
                    initColor={editing.initColor}
                    update={rgba => setEditing({ ...editing, nextColor: rgba })}
                    save={() => {
                        setEditing((editing) => {
                            editing && onChange({ ...comparisonCustomization, [editing.name]: editing.nextColor});

                            return null;
                        })
                    }}
                />
            </div>}
        </div>
    );
};

export default CustomizeTranslation;