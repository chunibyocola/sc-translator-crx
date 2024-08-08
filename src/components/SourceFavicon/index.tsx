import React from 'react';
import { GOOGLE_COM, BING_COM, MOJIDICT_COM, MICROSOFT_COM } from '../../constants/translateSource';
import google from './favicons/google.png';
import bing from './favicons/bing.png';
import mojidict from './favicons/mojidict.png';
import microsoft from './favicons/microsofttranslator.png';
import './style.css';
import scOptions from '../../public/sc-options';

type SourceFaviconProps = {
    source: string;
    faviconOnly?: boolean;
} & Pick<React.HtmlHTMLAttributes<HTMLSpanElement>, 'className'>;

const SourceFavicon: React.FC<SourceFaviconProps> = ({ source, className, faviconOnly }) => {
    return (
        <span className={className}>
            {getFavicon(source)}
            {!faviconOnly && <span>{getName(source)}</span>}
        </span>
    );
};

const getSourceNameFromCustomSources = (source: string) => {
    return scOptions.getInit().customTranslateSourceList.concat(scOptions.getInit().customWebpageTranslateSourceList).find(v => v.source === source)?.name ?? source;
}

const getFavicon = (source: string) => {
    switch (source) {
        case GOOGLE_COM: return FaviconImg(google);
        case BING_COM: return FaviconImg(bing);
        case MOJIDICT_COM: return FaviconImg(mojidict);
        case MICROSOFT_COM: return FaviconImg(microsoft);
        default: return (<div className='favicon favicon--mock'>{getSourceNameFromCustomSources(source)[0]}</div>);
    }
};

const FaviconImg = (src: string) => (<img className='favicon' src={src} alt='favicon' />);

const getName = (source: string) => {
    switch (source) {
        case GOOGLE_COM: return 'Google';
        case BING_COM: return 'Bing';
        case MOJIDICT_COM: return 'Mojidict';
        case MICROSOFT_COM: return 'Microsoft';
        default: return getSourceNameFromCustomSources(source);
    }
};

export default SourceFavicon;