import { GOOGLE_COM, BING_COM, MOJIDICT_COM, BAIDU_COM } from '../constants/translateSource';
import { bingSupportedLangCodes, googleSupportedLangCodes, baiduSupportedLangCodes } from '../constants/langCode';

export const switchTranslateSource = (targetSource: string, from: string, to: string) => {
    switch (targetSource) {
        case GOOGLE_COM:
            from = googleSupportedLangCodes.has(from) ? from : '';
            to = googleSupportedLangCodes.has(to) ? to : '';
            break;
        case BING_COM:
            from = bingSupportedLangCodes.has(from) ? from : '';
            to = bingSupportedLangCodes.has(to) ? to : '';
            break;
        case BAIDU_COM:
            from = baiduSupportedLangCodes.has(from) ? from : '';
            to = baiduSupportedLangCodes.has(to) ? to : '';
            break;
        case MOJIDICT_COM:
            from = '';
            to = '';
            break;
        default:
            from = googleSupportedLangCodes.has(from) ? from : '';
            to = googleSupportedLangCodes.has(to) ? to : '';
            break;
    }

    return { source: targetSource, from, to };
};