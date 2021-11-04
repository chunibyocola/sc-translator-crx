import { fetchData, getError } from '../utils';
import { langCode } from './lang-code';
import { LANGUAGE_NOT_SOPPORTED, RESULT_ERROR } from '../error-codes';
import { TranslateParams } from '../translate-types';
import { TranslateResult } from '../../../types';
import { getTranslateParams } from './get-params';

export const translate = async ({ text, from = '', to = '', preferredLanguage = '', secondPreferredLanguage = '', com = true　}: TranslateParams) => {
    preferredLanguage = preferredLanguage || 'en';
    secondPreferredLanguage = secondPreferredLanguage || 'en';
    const originTo = to;
    const originFrom = from;
    from = from || 'auto-detect';
    to = to || (from === preferredLanguage ? secondPreferredLanguage : preferredLanguage);

    if (!(from in langCode) || !(to in langCode)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    const res = await fetchResultFromBing({ text, from, to, com });

    try {
        let data = await res.json();

        // Re-request with second preferred language.
        // Triggered only in the situation of "'from' and 'to' are both empty('')" and
        // "source language is same as 'to'" (set as preferred language above).
        if (!originFrom && !originTo && data[0].detectedLanguage.language === to && preferredLanguage !== secondPreferredLanguage) {
            from = data[0].detectedLanguage.language;
            to = secondPreferredLanguage;

            const newRes = await fetchResultFromBing({ text, from, to, com });

            data = await newRes.json();
        }

        let result: TranslateResult = {
            text,
            from: data[0].detectedLanguage.language,
            to,
            result: [data[0].translations[0].text]
        };

        let dict: undefined | string[] = undefined;
        try {
            if (!text.includes(' ') && (result.from === 'en' || to === 'en')) {
                const dictRes = await fetchDictFromBing({ text, from: result.from, to, com });
                const dictData = await dictRes.json();

                const dictObject = dictData[0]?.translations.reduce((t: any, c: any) => ({ ...t, [c.posTag]: t[c.posTag] ? t[c.posTag].concat(c.normalizedTarget) : [c.normalizedTarget] }), {});
                dict = dictObject && Object.keys(dictObject).map(v => `${v}: ${dictObject[v].join(', ')}`);
            }
        }
        catch {
            dict = undefined;
        }

        result.dict = dict;

        return result;
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};

type FetchFromBingParams = {
    text: string;
    from: string;
    to: string;
    com: boolean;
};

const fetchDictFromBing = async ({ text, from, to, com }: FetchFromBingParams) => {
    const { token, key, IG, IID } = await getTranslateParams(com);

    const url = `https://${com ? 'www' : 'cn'}.bing.com/tlookupv3?isVertical=1&IG=${IG}&IID=${IID}`;

    const searchParams = new URLSearchParams();
    searchParams.append('from', from);
    searchParams.append('text', text);
    searchParams.append('to', to);
    searchParams.append('token', token);
    searchParams.append('key', key.toString());

    return await fetchData(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams.toString()
    });
};

const fetchResultFromBing = async ({ text, from, to, com }: FetchFromBingParams) => {
    const { token, key, IG, IID } = await getTranslateParams(com);

    const url = `https://${com ? 'www' : 'cn'}.bing.com/ttranslatev3?isVertical=1&IG=${IG}&IID=${IID}`;

    const searchParams = new URLSearchParams();
    searchParams.append('fromLang', from);
    searchParams.append('text', text);
    searchParams.append('to', to);
    searchParams.append('token', token);
    searchParams.append('key', key.toString());

    return await fetchData(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams.toString()
    });
};