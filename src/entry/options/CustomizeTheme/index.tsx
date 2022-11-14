import React, { useCallback, useEffect, useState } from 'react';
import { defaultStyleVars, StyleVars, StyleVarsList } from '../../../constants/defaultStyleVars';
import IconFont from '../../../components/IconFont';
import CustomizeBoardDisplay from './CustomizeBoardDisplay';
import CustomizeBoardOptions from './CustomizeBoardOptions';
import './style.css';

type CustomizeThemeProps = {
    styleVarsList: StyleVarsList;
    styleVarsIndex: number;
    updateStyleVarsList: (styleVarsList: StyleVarsList) => void;
    updateStyleVarsIndex: (styleVarsIndex: number) => void;
};

const CustomizeTheme: React.FC<CustomizeThemeProps> = ({ styleVarsList, styleVarsIndex, updateStyleVarsList, updateStyleVarsIndex }) => {
    const [styleVars, setStyleVars] = useState(defaultStyleVars);
    const [themeName, setThemeName] = useState('');
    const [showBoard, setShowBoard] = useState(false);
    const [hoverIndex, setHoverIndex] = useState<number | null>(null);
    const [clickIndex, setClickIndex] = useState<number | null>(null);
    const [editIndex, setEditIndex] = useState<number | null>(null);

    const handleAdd = useCallback((styleVars: StyleVars, name: string) => {
        updateStyleVarsList([...styleVarsList, { name, styleVars, editable: true }]);
        setShowBoard(false);
    }, [styleVarsList, updateStyleVarsList]);

    const handleDelete = useCallback((index: number) => {
        updateStyleVarsList(styleVarsList.filter((v, i) => (i !== index)));
        if (index === styleVarsIndex) {
            updateStyleVarsIndex(0);
        }
        else if (index < styleVarsIndex) {
            updateStyleVarsIndex(styleVarsIndex - 1);
        }
    }, [updateStyleVarsList, styleVarsList, styleVarsIndex, updateStyleVarsIndex]);

    const handleUpdate = useCallback((styleVars: StyleVars, name: string) => {
        updateStyleVarsList(styleVarsList.map((v, i) => (i !== editIndex ? v : { name, styleVars, editable: true })));
        setShowBoard(false);
        setEditIndex(null);
    }, [editIndex, styleVarsList, updateStyleVarsList]);

    useEffect(() => {
        showBoard ? (document.body.style.overflow = 'hidden') : (document.body.style.overflow = '');
    }, [showBoard]);

    return (
        <div className='customize-theme'>
            {styleVarsList.map(({ name, styleVars, editable }, i) => (<div
                key={i}
                className='customize-theme__item'
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => {
                    setHoverIndex(null);
                    setClickIndex(null);
                }}
            >
                <div
                    className='customize-theme__item-badge button'
                    style={{
                        background: styleVars['--bg-content'],
                        color: styleVars['--text-normal'],
                        boxShadow: `0px 0px 10px 0px rgba(${i === styleVarsIndex ? '14,231,13,' : '0,0,0,'}0.8)`
                    }}
                    onClick={() => updateStyleVarsIndex(i)}
                >
                    {name}
                </div>
                <div className='customize-theme__item-box'>
                    <div
                        className='customize-theme__item-box-content'
                        style={{transition: 'all 0.3s', marginTop: `${clickIndex === i ? '-60' : hoverIndex === i ? '-30' : '0'}px`}}
                    >
                        {name}
                    </div>
                    <div className='customize-theme__item-box-content'>
                        <IconFont iconName='#icon-horizontalDots' className={!editable ? 'not-editable' : ''} onClick={() => editable && setClickIndex(i)} />
                    </div>
                    <div className='customize-theme__item-box-content'>
                        <IconFont
                            iconName='#icon-MdDelete'
                            onClick={() => {
                                handleDelete(i);
                                setClickIndex(null);
                                setHoverIndex(null);
                            }}
                        />
                        <IconFont
                            iconName='#icon-edit'
                            style={{marginLeft: '20px'}}
                            onClick={() => {
                                setStyleVars(styleVars);
                                setShowBoard(true);
                                setEditIndex(i);
                                setThemeName(name);
                            }}
                        />
                    </div>
                </div>
            </div>))}
            <div
                className='customize-theme__add'
                onClick={() => {
                    setShowBoard(true);
                    setStyleVars(defaultStyleVars);
                    setThemeName('');
                }}>
                <IconFont iconName='#icon-MdAdd' />
            </div>
            {showBoard && <div className='customize-theme__board'>
                <span className='customize-theme__board-close button'>
                    <IconFont
                        className='customize-board-close-icon'
                        iconName='#icon-GoX'
                        onClick={() => {
                            setShowBoard(false);
                            setEditIndex(null);
                        }}
                    />
                </span>
                <CustomizeBoardDisplay styleVars={styleVars} />
                <CustomizeBoardOptions
                    styleVars={styleVars}
                    themeName={themeName}
                    updateCallback={setStyleVars}
                    finishCallback={editIndex !== null ? handleUpdate : handleAdd}
                />
            </div>}
        </div>
    );
};

export default CustomizeTheme;