import { getQueryString, getError } from '../utils';
import { detect } from './detect';
import { langCode } from './lang-code';
import { LANGUAGE_NOT_SOPPORTED } from '../error-codes';

export const audio = async ({ text, from }) => {
    from = from || await detect({ text });

    if (!(from in langCode)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    let url = 'https://fanyi.baidu.com/gettts';

    const params = {
        lan: from,
        text: encodeURIComponent(text),
        spd: 3,
        source: 'web'
    };
    url += getQueryString(params);

    return url;
};