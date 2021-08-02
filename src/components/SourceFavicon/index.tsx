import React from 'react';
import { GOOGLE_COM, BING_COM, MOJIDICT_COM, BAIDU_COM, MICROSOFT_COM } from '../../constants/translateSource';
import google from './favicons/google.png';
import bing from './favicons/bing.png';
import mojidict from './favicons/mojidict.png';
import baidu from './favicons/baidu.png';
import microsoft from './favicons/microsofttranslator.png';
import './style.css';

type SourceFaviconProps = {
    source: string;
};

const SourceFavicon: React.FC<SourceFaviconProps> = ({ source }) => {
    return (
        <>
            <img
                className='ts-favicon'
                src={getFavicon(source)}
                alt='favicon'
            />
            {getName(source)}
        </>
    );
};

const getFavicon = (source: string) => {
    switch (source) {
        case GOOGLE_COM: return google;
        case BING_COM: return bing;
        case MOJIDICT_COM: return mojidict;
        case BAIDU_COM: return baidu;
        case MICROSOFT_COM: return microsoft;
        default: return;
    }
};

const getName = (source: string) => {
    switch (source) {
        case GOOGLE_COM: return 'Google';
        case BING_COM: return 'Bing';
        case MOJIDICT_COM: return 'Mojidict';
        case BAIDU_COM: return 'Baidu';
        case MICROSOFT_COM: return 'Microsoft';
        default: return;
    }
}

export default SourceFavicon;