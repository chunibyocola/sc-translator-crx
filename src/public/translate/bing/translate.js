import { fetchData, getError } from '../utils';
import { langCode } from './lang-code';
import { LANGUAGE_NOT_SOPPORTED, RESULT_ERROR } from '../error-codes';
import { detect } from './detect';

export const translate = async ({ text, from = '', to = '', preferredLanguage = '', secondPreferredLanguage = '', com = true, autoDetect = true}) => {
    preferredLanguage = preferredLanguage || 'en';
    secondPreferredLanguage = secondPreferredLanguage || 'en';
    from = from || (autoDetect && !to ? await detect({ text, com }) : 'auto-detect');
    to = to || (from === preferredLanguage ? secondPreferredLanguage : preferredLanguage);

    if (!(from in langCode) || !(to in langCode)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    const url = `https://${com ? 'www' : 'cn'}.bing.com/ttranslatev3`;

    let searchParams = new URLSearchParams();
    searchParams.append('fromLang', from);
    searchParams.append('text', text);
    searchParams.append('to', to);

    const res = await fetchData(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams.toString()
    });

    try {
        const data = await res.json();

        const result = {
            text,
            from: data[0].detectedLanguage.language,
            to,
            result: [data[0].translations[0].text]
        };

        return result;
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};