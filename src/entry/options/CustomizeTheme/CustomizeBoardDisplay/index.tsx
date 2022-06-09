import React from 'react';
import './style.css';
import '../../../content/ResultBox/style.css';
import '../../../../components/TsResult/style.css';
import '../../../../components/TsVia/style.css';
import '../../../../components/LanguageSelection/style.css';
import '../../../../components/RawText/style.css';
import '../../../../components/PopupHeader/style.css';
import '../../../popup/ResultBox/style.css';
import '../../../popup/MultipleTranslateResult/style.css';
import '../../../../components/MtAddSource/style.css';
import '../../../../components/MtResult/style.css';
import '../../../../components/LanguageSelect/style.css';
import '../../../../components/TranslateResult/style.css';
import SourceFavicon from '../../../../components/SourceFavicon';
import IconFont from '../../../../components/IconFont';
import { StyleVars } from '../../../../constants/defaultStyleVars';
import Logo from '../../../../components/Logo';

type CustomizeBoardDisplayProps = {
    styleVars: StyleVars;
};

const CustomizeBoardDisplay: React.FC<CustomizeBoardDisplayProps> = ({ styleVars }) => {
    return (
        <div className='customize-board-display'>
            {/* TsResult */}
            <div
                className="panel"
                style={{
                    background: styleVars['--bg-total'],
                    position: 'unset',
                    height: 'fit-content'
                }}
                ref={node => node && node.style.setProperty('color', styleVars['--text-normal'], 'important')}
            >
                <div
                    className="panel__header flex-justify-content-space-between"
                    style={{
                        color: styleVars['--text-icon']
                    }}
                >
                    <div className="panel__header-logo flex-align-items-center"></div>
                    <span className="panel__header-icons flex-align-items-center">
                        <IconFont iconName='#icon-GoChevronDown' style={{transform: 'rotate(180deg)', opacity: '1', color: styleVars['--text-icon']}} />
                        <IconFont iconName='#icon-GoPin' style={{color: styleVars['--text-icon']}} />
                    </span>
                </div>
                <div className="panel__content">
                    <div style={{color: styleVars['--text-normal']}}>
                        <div className="raw-text">
                            <textarea placeholder="Input here" className="raw-text__textarea" defaultValue='welcome'></textarea>
                        </div>
                        <div className="language-selection">
                            <div className="language-select language-selection__select border-bottom-select" style={{color: styleVars['--text-normal']}}>
                                <span className="language-select__badge">
                                    <span className="language-select__badge-text">自动选择</span>
                                    <IconFont iconName='#icon-GoChevronDown' />
                                </span>
                            </div>
                            <IconFont iconName='#icon-MdSwap' />
                            <div className="language-select language-selection__select border-bottom-select" style={{color: styleVars['--text-normal'], background: styleVars['--bg-select-focus']}}>
                                <span className="language-select__badge">
                                    <span className="language-select__badge-text">自动选择</span>
                                    <IconFont iconName='#icon-GoChevronDown' />
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="single-result scrollbar">
                        <div className='st-result' style={{background: styleVars['--bg-content']}}>
                            <div className="st-result__item-stack">
                                <span>欢迎</span>
                                <IconFont iconName='#icon-copy' className='iconbutton button' />
                                <IconFont iconName='#icon-GoUnmute' className='iconbutton button' />
                            </div>
                            <div className="st-result__item-stack">
                                <div>名词: 欢迎, 欢迎光临</div>
                                <div>动词: 欢迎, 迎, 迎接, 赞同, 赞成, 赞许, 揖, 迓, 赞, 接</div>
                                <div>形容词: 受欢迎, 爽快, 顗</div>
                            </div>
                            <div className="st-result__item-stack">
                                <span className="st-result__text">welcome</span>
                                <IconFont iconName='#icon-copy' className='iconbutton button' />
                                <IconFont iconName='#icon-GoUnmute' className='iconbutton button' />
                            </div>
                            <div className="tss-phonetic">[ˈwelkəm]</div>
                        </div>
                    </div>
                    <div className="via" style={{background: styleVars['--bg-content']}}>
                        <div className='dividing-line' style={{background: styleVars['--text-normal']}}></div>
                        <div className="via__content">
                            <span className="via__content-pre">via</span>
                            <div className="source-select via__content-select">
                                <span className="source-select__value">
                                    <SourceFavicon source='google.com' />
                                </span>
                                <IconFont iconName='#icon-GoChevronDown' style={{position: 'absolute', right: '2px'}} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* MultiplePopup */}
            <div 
                className="popup-container"
                style={{margin: '0 25px', transition: 'unset', background: styleVars['--bg-total']}}
                ref={node => node && node.style.setProperty('color', styleVars['--text-normal'], 'important')}
            >
                <div
                    className="popup-header flex-justify-content-space-between"
                    style={{
                        color: styleVars['--text-icon']
                    }}
                >
                    <div className="popup-header__logo flex-align-items-center">
                        <Logo />
                    </div>
                    <div className="popup-header__icons flex-align-items-center">
                        <IconFont iconName='#icon-theme' className='iconfont--enable' style={{color: styleVars['--text-icon']}} />
                        <IconFont iconName='#icon-MdTranslate' className='iconfont--enable' style={{color: styleVars['--text-icon']}} />
                        <IconFont iconName='#icon-MdHistory' className='iconfont--disable' style={{color: styleVars['--text-icon']}} />
                        <IconFont iconName='#icon-MdSettings' className='iconfont--enable' style={{color: styleVars['--text-icon']}} />
                    </div>
                </div>
                <div className="popup-container__content" style={{color: styleVars['--text-normal']}}>
                    <div className="raw-text">
                        <textarea placeholder="Input here" className="raw-text__textarea" defaultValue='welcome'></textarea>
                    </div>
                    <div className="language-selection">
                        <div className="language-select language-selection__select border-bottom-select" style={{color: styleVars['--text-normal'], background: styleVars['--bg-select-focus']}}>
                            <span className="language-select__badge">
                                <span className="language-select__badge-text">自动选择</span>
                                <IconFont iconName='#icon-GoChevronDown' />
                            </span>
                        </div>
                        <IconFont iconName='#icon-MdSwap' />
                        <div className="language-select language-selection__select border-bottom-select" style={{color: styleVars['--text-normal']}}>
                            <span className="language-select__badge">
                                <span className="language-select__badge-text">日语</span>
                                <IconFont iconName='#icon-GoChevronDown' />
                            </span>
                        </div>
                    </div>
                    <div className="popup-multiple-result scrollbar">
                        <div className="mt-result" style={{background: styleVars['--bg-content']}}>
                            <div className="mt-result__head button flex-justify-content-space-between" style={{color: styleVars['--text-normal']}}>
                                <span className="flex-align-items-center">
                                    <SourceFavicon source='google.com' />
                                    <IconFont iconName='#icon-copy' className='iconbutton button' style={{marginLeft: '5px'}} />
                                    <IconFont iconName='#icon-GoUnmute' className='iconbutton' />
                                </span>
                                <span className="mt-result__head-icons flex-align-items-center">
                                    <IconFont iconName='#icon-GoChevronDown' style={{transform: 'rotate(180deg)'}} />
                                    <IconFont iconName='#icon-GoX' className='iconbutton' />
                                </span>
                            </div>
                            <div className='dividing-line' style={{background: styleVars['--text-normal']}}></div>
                            <div className="translate-result">
                                <div className="translate-result__item-stack">[ˈwelkəm]</div>
                                <div className='translate-result__item-stack'>
                                    <span>ようこそ</span>
                                    <IconFont iconName='#icon-copy' className='iconbutton button' />
                                    <IconFont iconName='#icon-GoUnmute' className='iconbutton button' />
                                </div>
                                <div className="translate-result__item-stack">
                                    <div>名词: 歓迎, ウエルカム, 優待, 奉迎, 遠見, 接待</div>
                                    <div>动词: 歓迎する</div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-result" style={{background: styleVars['--bg-content']}}>
                            <div className="mt-result__head button flex-justify-content-space-between" style={{color: styleVars['--text-normal']}}>
                                <span className="flex-align-items-center">
                                    <SourceFavicon source='bing.com' />
                                    <IconFont iconName='#icon-copy' className='iconbutton button' style={{marginLeft: '5px'}} />
                                    <IconFont iconName='#icon-GoUnmute' className='iconbutton' />
                                </span>
                                <span className="mt-result__head-icons flex-align-items-center">
                                    <IconFont iconName='#icon-GoChevronDown' style={{transform: 'rotate(180deg)'}} />
                                    <IconFont iconName='#icon-GoX' className='iconbutton' />
                                </span>
                            </div>
                            <div className='dividing-line' style={{background: styleVars['--text-normal']}}></div>
                            <div className="translate-result">
                                <div className='translate-result__item-stack'>
                                    <span>ようこそ</span>
                                    <IconFont iconName='#icon-copy' className='iconbutton button' />
                                    <IconFont iconName='#icon-GoUnmute' className='iconbutton button' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="add-source">
                        <IconFont iconName='#icon-plus' style={{color: styleVars['--text-icon']}} />
                    </div>
                </div>
            </div>
            {/* SourceSelector */}
            <div className="select-options scrollbar"
                style={{
                    background: styleVars['--bg-content'],
                    color: styleVars['--text-normal'],
                    maxHeight: '100%',
                    height: 'fit-content',
                    position: 'unset',
                    width: '200px'
                }}
            >
                <div className="source-selector__item button">
                    <span className="source-selector__item-source"><SourceFavicon source='google.com' /></span>
                    <span className="source-selector__item-icons"><IconFont iconName='#icon-top' /></span>
                </div>
                <div className="source-selector__item button" style={{background: styleVars['--bg-item-hover']}}>
                    <span className="source-selector__item-source"><SourceFavicon source='bing.com' /></span>
                    <span className="source-selector__item-icons"><IconFont iconName='#icon-top' /></span>
                </div>
                <div className="source-selector__item button">
                    <span className="source-selector__item-source"><SourceFavicon source='baidu.com' /></span>
                    <span className="source-selector__item-icons"><IconFont iconName='#icon-top' /></span>
                </div>
                <div className="source-selector__item button">
                    <span className="source-selector__item-source"><SourceFavicon source='mojidict.com' /></span>
                    <span className="source-selector__item-icons"><IconFont iconName='#icon-top' /></span>
                </div>
            </div>
        </div>
    );
};

export default CustomizeBoardDisplay;