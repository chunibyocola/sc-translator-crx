import { GOOGLE_COM, BING_COM, MOJIDICT_COM } from '../constants/translateSource';
import { bingSwitchLangCode } from '../public/switch-lang-code';
import { langCode as googleLangCode } from '../public/translate/google/lang-code';
import { langCode as bingLangCode } from '../public/translate/bing/lang-code';

export const switchTranslateSource = (targetSource: string, { source, from, to }: { source: string; from: string; to: string; }) => {
    if (!targetSource) { return { source, from, to }; }

    switch (targetSource) {
        case GOOGLE_COM:
            from = from in googleLangCode ? from : '';
            to = to in googleLangCode ? to : '';
            return { source: targetSource, from, to };
        case BING_COM:
            from = bingSwitchLangCode(from) in bingLangCode ? from : '';
            to = bingSwitchLangCode(to) in bingLangCode ? to : '';
            return { source: targetSource, from, to };
        case MOJIDICT_COM:
            return { source: targetSource, from: '', to: '' };
        default:
            from = from in googleLangCode ? from : '';
            to = to in googleLangCode ? to : '';
            return { source: targetSource, from, to };
    }
};