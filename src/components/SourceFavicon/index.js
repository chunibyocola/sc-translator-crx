import React from 'react';
import { GOOGLE_COM, BING_COM, MOJIDICT_COM } from '../../constants/translateSource';
import google from './favicons/google.png';
import bing from './favicons/bing.png';
import mojidict from './favicons/mojidict.png';

const SourceFavicon = ({ source }) => {
    return (
        <>
            <img
                style={{verticalAlign: 'bottom', marginRight: '5px', userSelect: 'none'}}
                src={getFavicon(source)}
                width='20'
                height='20'
                alt='favicon'
            />
            {getName(source)}
        </>
    );
};

const getFavicon = (source) => {
    switch (source) {
        case GOOGLE_COM: return google;
        case BING_COM: return bing;
        case MOJIDICT_COM: return mojidict;
        default: return;
    }
};

const getName = (source) => {
    switch (source) {
        case GOOGLE_COM: return 'Google';
        case BING_COM: return 'Bing';
        case MOJIDICT_COM: return 'Mojidict';
        default: return;
    }
}

export default SourceFavicon;