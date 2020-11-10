import { getQueryString, fetchData, getError } from '../utils';
import getTk from './getTk';
import { langCode } from './lang-code';
import { RESULT_ERROR, LANGUAGE_NOT_SOPPORTED } from '../error-codes';
import { detect } from './detect';

export const translate = async ({ text, from = '', to = '', com = true, userLang = '', autoDetect = true }) => {
    userLang = userLang || 'en';
    from = from || (autoDetect ? await detect({ text, com }) : 'auto');
    to = to || (from === userLang ? 'en' : userLang);

    if (!(from in langCode) || !(to in langCode)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    let url = `https://translate.google.${com ? 'com' : 'cn'}/translate_a/single`;
    let params = {
        client: 'webapp',
        sl: from,
        tl: to,
        hl: userLang || to,
        dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
        ie: 'UTF-8',
        oe: 'UTF-8',
        ssel: 0,
        tsel: 0,
        kc: 1,
        tk: await getTk(text, com),
        q: encodeURIComponent(text)
    };

    url += getQueryString(params);

    const res = await fetchData(url);

    try {
        const data = await res.json();

        const result = {
            text,
            from: data[2],
            to,
            result: data[0].reduce((t, v) => (v[0] ? t.concat(v[0]) : t), []),
            dict: data[1] && data[1].reduce((t, v) => (t.concat(v[0] + ': ' + v[1].reduce((t1, v1, i1) => (i1? `${t1}, ${v1}`: v1), ''))), []),
            phonetic: data[0][data[0].length - 1][3],
            raw: data
        };

        return result;
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};