import React, { useEffect, useState } from 'react';
import { useSignal } from 'react-signal-slot';
import IconFont from '../../../components/IconFont';
import { getMessage } from '../../../public/i18n';
import { useWindowSize } from '../../../public/react-use';
import './style.css';

const menusItems = [
    { title: getMessage('optionsTheme'), id: 'theme' },
    { title: 'PDF', id: 'pdf' },
    { title: getMessage('optionsAudio'), id: 'audio' },
    { title: getMessage('titleSeparateWindow'), id: 'separate-window' },
    { title: getMessage('optionsTranslatePanel'), id: 'translate-panel' },
    { title: getMessage('optionsDefaultTranslateOptions'), id: 'default-translate-options' },
    { title: getMessage('optionsInWebPage'), id: 'in-web-page' },
    { title: getMessage('optionsHistory'), id: 'history' },
    { title: getMessage('optionsKeyboardShortcut'), id: 'keyboard-shortcut' },
    { title: getMessage('optionsMoreFeaturesOrBugReports'), id: 'more-features-or-bug-reports' }
];

const OptionsMenu = () => {
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

const SideBarMenu = ({ signal }) => {
    return (
        <div className='options-sidebar-menu'>
            <div className='options-sidebar-items'>
                {menusItems.map((item) => (<div
                    className='options-menu-item ts-button'
                    key={item.id}
                    onClick={() => signal('menu-item-click', item.id)}
                >
                    {item.title}
                </div>))}
            </div>
        </div>
    );
};

const NavBarMenu = ({ signal }) => {
    const [showNavBarMenu, setShowNavBarMenu] = useState(false);

    return (
        <div className={`options-navbar-menu${showNavBarMenu ? ' options-navbar-sidebar-show' : ''}`}>
            <IconFont className='options-navbar-menu-icon ts-button' onClick={() => setShowNavBarMenu(true)} iconName='#icon-menu' />
            <div className='options-navbar-menu-backdrop' onClick={() => setShowNavBarMenu(false)}></div>
            <div className='options-navbar-sidebar'>
                <div className='options-navbar-sidebar-brand'>
                    <span style={{fontWeight: 'bold', marginRight: '10px'}}>Sc</span>
                    {getMessage('optionsTitle')}
                </div>
                <div className='options-navbar-sidebar-items'>
                    {menusItems.map((item) => (<div
                        className='options-menu-item ts-button'
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