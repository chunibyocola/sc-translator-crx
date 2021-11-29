import React from 'react';
import { GOOGLE_COM, BING_COM, MOJIDICT_COM, BAIDU_COM, MICROSOFT_COM } from '../../constants/translateSource';
import google from './favicons/google.png';
import bing from './favicons/bing.png';
import mojidict from './favicons/mojidict.png';
import baidu from './favicons/baidu.png';
import microsoft from './favicons/microsofttranslator.png';
import './style.css';
import { getOptions } from '../../public/options';

type SourceFaviconProps = {
    source: string;
} & Pick<React.HtmlHTMLAttributes<HTMLSpanElement>, 'className'>;

const SourceFavicon: React.FC<SourceFaviconProps> = ({ source, className }) => {
    return (
        <span className={className}>
            {getFavicon(source)}
            {getName(source)}
        </span>
    );
};

const getFavicon = (source: string) => {
    switch (source) {
        case GOOGLE_COM: return FaviconImg(google);
        case BING_COM: return FaviconImg(bing);
        case MOJIDICT_COM: return FaviconImg(mojidict);
        case BAIDU_COM: return FaviconImg(baidu);
        case MICROSOFT_COM: return FaviconImg(microsoft);
        default: return (<div className='favicon favicon--mock'>{(getOptions().customTranslateSourceList.find(v => v.source === source)?.name ?? source)[0]}</div>);
    }
};

const FaviconImg = (src: string) => (<img className='favicon' src={src} alt='favicon' />);

const getName = (source: string) => {
    switch (source) {
        case GOOGLE_COM: return 'Google';
        case BING_COM: return 'Bing';
        case MOJIDICT_COM: return 'Mojidict';
        case BAIDU_COM: return 'Baidu';
        case MICROSOFT_COM: return 'Microsoft';
        default: return getOptions().customTranslateSourceList.find(v => v.source === source)?.name ?? source;
    }
};

export default SourceFavicon;