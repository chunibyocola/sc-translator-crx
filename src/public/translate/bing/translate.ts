import { getError } from '../utils';
import { LANGUAGE_NOT_SOPPORTED, RESULT_ERROR } from '../error-codes';
import { TranslateParams } from '../translate-types';
import { TranslateResult } from '../../../types';
import { getTranslateParams } from './get-params';
import { fetchBing } from './fetch-bing';
import { isLangCodeSupported, switchToBingLangCode, switchToGoogleLangCode } from './switch-lang-code';

export const translate = async ({ text, from, to, preferredLanguage, secondPreferredLanguage, com = true }: TranslateParams) => {
    [from, to, preferredLanguage, secondPreferredLanguage] = [from, to, preferredLanguage, secondPreferredLanguage].map(switchToBingLangCode);

    const originTo = to;
    const originFrom = from;
    from = from || 'auto-detect';
    to = to || (from === preferredLanguage ? secondPreferredLanguage : preferredLanguage);

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
            from: switchToGoogleLangCode(data[0].detectedLanguage.language),
            to: switchToGoogleLangCode(to),
            result: (data[0].translations[0].text as string).split('\n').filter(v => v.trim())
        };

        let dict: undefined | string[] = undefined;
        let example: undefined | string[] = undefined;

        try {
            if (!text.includes(' ') && (result.from === 'en' || to === 'en')) {
                const params = { text, from: result.from, to, com, translation: result.result[0] };
                const [dictP, exampleP] = await Promise.allSettled([fetchDictFromBing(params), fetchExampleFromBing(params)]);
                dict = dictP.status === 'fulfilled' ? dictP.value : undefined;
                example = exampleP.status === 'fulfilled' ? exampleP.value : undefined;
            }
        }
        catch {
            dict = undefined;
            example = undefined;
        }

        result.dict = dict;
        result.example = example;

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

const fetchExampleFromBing = async ({ text, from, to, com, translation }: FetchFromBingParams & { translation: string; }): Promise<string[]> => {
    const { token, key, IG, richIID } = await getTranslateParams(com);

    const url = `https://${com ? 'www' : 'cn'}.bing.com/texamplev3?isVertical=1&IG=${IG}&IID=${richIID}`;

    const searchParams = new URLSearchParams();
    searchParams.append('from', from);
    searchParams.append('text', text);
    searchParams.append('to', to);
    searchParams.append('token', token);
    searchParams.append('key', key.toString());
    searchParams.append('translation', translation);

    const res = await fetchBing(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: '&' + searchParams.toString()
    });
    
    const data = await res.json();

    return data[0]?.examples?.slice(0, 3).map(({ sourcePrefix, sourceTerm, sourceSuffix }: { [K: string]: string; }) => (`${sourcePrefix}${sourceTerm}${sourceSuffix}`));
};

const fetchDictFromBing = async ({ text, from, to, com }: FetchFromBingParams): Promise<string[]> => {
    const { token, key, IG, richIID } = await getTranslateParams(com);

    const url = `https://${com ? 'www' : 'cn'}.bing.com/tlookupv3?isVertical=1&&IG=${IG}&IID=${richIID}`;

    const searchParams = new URLSearchParams();
    searchParams.append('from', from);
    searchParams.append('text', text);
    searchParams.append('to', to);
    searchParams.append('token', token);
    searchParams.append('key', key.toString());

    const res = await fetchBing(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: '&' + searchParams.toString()
    });

    const data = await res.json();

    const dictObject = data[0]?.translations.reduce((t: any, c: any) => ({ ...t, [c.posTag]: t[c.posTag] ? t[c.posTag].concat(c.normalizedTarget) : [c.normalizedTarget] }), {});

    return dictObject && Object.keys(dictObject).map(v => `${v}: ${dictObject[v].join(', ')}`);
};

const fetchResultFromBing = async ({ text, from, to, com }: FetchFromBingParams) => {
    if (![from, to].every(isLangCodeSupported)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    const { token, key, IG, IID } = await getTranslateParams(com);

    const url = `https://${com ? 'www' : 'cn'}.bing.com/ttranslatev3?isVertical=1&&IG=${IG}&IID=${IID}`;

    const searchParams = new URLSearchParams();
    searchParams.append('fromLang', from);
    searchParams.append('text', text);
    searchParams.append('to', to);
    searchParams.append('token', token);
    searchParams.append('key', key.toString());

    return await fetchBing(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: '&' + searchParams.toString()
    });
};