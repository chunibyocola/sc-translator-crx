import React, { useEffect, useState } from 'react';
import { useSignal } from 'react-signal-slot';
import IconFont from '../../../../components/IconFont';
import Logo from '../../../../components/Logo';
import { getMessage } from '../../../../public/i18n';
import { useWindowSize } from '../../../../public/react-use';
import { classNames } from '../../../../public/utils';
import './style.css';

const menusItems = [
    { title: getMessage('optionsTheme'), id: 'theme' },
    { title: 'PDF', id: 'pdf' },
    { title: getMessage('optionsClipboard'), id: 'clipboard' },
    { title: getMessage('optionsWebPageTranslating'), id: 'web-page-translating' },
    { title: getMessage('optionsAudio'), id: 'audio' },
    { title: getMessage('titleSeparateWindow'), id: 'separate-window' },
    { title: getMessage('optionsTranslatePanel'), id: 'translate-panel' },
    { title: getMessage('optionsDefaultTranslateOptions'), id: 'default-translate-options' },
    { title: getMessage('optionsTextPreprocessing'), id: 'text-preprocessing' },
    { title: getMessage('optionsInWebPage'), id: 'in-web-page' },
    { title: getMessage('optionsHistory'), id: 'history' },
    { title: getMessage('optionsContextMenus'), id: 'context-menus' },
    { title: getMessage('optionsKeyboardShortcut'), id: 'keyboard-shortcut' },
    { title: getMessage('optionsSyncSettings'), id: 'sync-settings' },
    { title: getMessage('optionsMore'), id: 'more' }
];

const OptionsMenu: React.FC = () => {
    const [sideBar, setSideBar] = useState(!(window.innerWidth < 1234));

    const signal = useSignal();

    const windowSize = useWindowSize();

    useEffect(() => {
        setSideBar(!(window.innerWidth < 1234));
    }, [windowSize.width]);

    return (
        <>
            {sideBar ? <SideBarMenu signal={signal} /> : <NavBarMenu signal={signal} />}
        </>
    );
};

type BarMenuProps = {
    signal: ReturnType<typeof useSignal>;
};

const SideBarMenu: React.FC<BarMenuProps> = ({ signal }) => {
    return (
        <div className='side-bar-menu'>
            <div className='side-bar-menu__items'>
                {menusItems.map((item) => (<div
                    className='options-menu__item button'
                    key={item.id}
                    onClick={() => signal('menu-item-click', item.id)}
                >
                    {item.title}
                </div>))}
            </div>
        </div>
    );
};

const NavBarMenu: React.FC<BarMenuProps> = ({ signal }) => {
    const [showNavBarMenu, setShowNavBarMenu] = useState(false);

    return (
        <div className={classNames('nav-bar-menu', showNavBarMenu && 'nav-bar-menu--show')}>
            <IconFont className='nav-bar-menu__icon button' onClick={() => setShowNavBarMenu(true)} iconName='#icon-menu' />
            <div className='nav-bar-menu__backdrop' onClick={() => setShowNavBarMenu(false)}></div>
            <div className='nav-bar-menu__sidebar'>
                <div className='nav-bar-menu__sidebar-brand'>
                    <Logo style={{fontSize: '30px', marginRight: '10px'}} />
                    {getMessage('optionsTitle')}
                </div>
                <div className='nav-bar-menu__sidebar-items'>
                    {menusItems.map((item) => (<div
                        className='options-menu__item button'
                        key={item.id}
                        onClick={() => {
                            setShowNavBarMenu(false);
                            signal('menu-item-click', item.id);
                        }}
                    >
                        {item.title}
                    </div>))}
                </div>
            </div>
        </div>
    );
};

export default OptionsMenu;