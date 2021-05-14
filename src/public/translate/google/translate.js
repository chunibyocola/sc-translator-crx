import { getQueryString, fetchData, getError } from '../utils';
import { langCode } from './lang-code';
import { RESULT_ERROR, LANGUAGE_NOT_SOPPORTED } from '../error-codes';
import { detect } from './detect';

export const translate = async ({ text, from = '', to = '', preferredLanguage = '', secondPreferredLanguage = '', autoDetect = true }) => {
    preferredLanguage = preferredLanguage || 'en';
    secondPreferredLanguage = secondPreferredLanguage || 'en';
    from = from || (autoDetect && !to ? await detect({ text }) : 'auto');
    to = to || (from === preferredLanguage ? secondPreferredLanguage : preferredLanguage);

    if (!(from in langCode) || !(to in langCode)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    let url = `https://translate.googleapis.com/translate_a/single`;
    let params = {
        client: 'gtx',
        sl: from,
        tl: to,
        hl: preferredLanguage || to,
        dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
        ie: 'UTF-8',
        oe: 'UTF-8',
        dj: 1,
        q: encodeURIComponent(text)
    };

    url += getQueryString(params);

    const res = await fetchData(url);

    try {
        const data = await res.json();

        const result = {
            text,
            from: data.src,
            to,
            result: data.sentences?.reduce((t, v) => (v.trans ? t.concat(v.trans) : t), []),
            dict: data.dict?.reduce((t, v) => (t.concat(v.pos + ': ' + v.terms.join(', '))), []),
            phonetic: data.sentences?.[1]?.src_translit && `[${data.sentences[1].src_translit}]`,
            related: data.related_words?.word
        };

        return result;
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};