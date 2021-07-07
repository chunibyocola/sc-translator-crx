import { GOOGLE_COM, BING_COM, MOJIDICT_COM, BAIDU_COM } from '../constants/translateSource';
import { bingSwitchLangCode, baiduSwitchLangCode } from '../public/switch-lang-code';
import { langCode as googleLangCode } from '../public/translate/google/lang-code';
import { langCode as bingLangCode } from '../public/translate/bing/lang-code';
import { langCode as baiduLangCode } from '../public/translate/baidu/lang-code';

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
        case BAIDU_COM:
            from = baiduSwitchLangCode(from) in baiduLangCode ? from : '';
            to = baiduSwitchLangCode(to) in baiduLangCode ? to : '';
            return { source: targetSource, from, to };
        default: return { source, from, to };
    }
};