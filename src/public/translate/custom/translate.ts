import { SOURCE_ERROR } from '../../../constants/errorCodes';
import { TranslateResult } from '../../../types';
import { TranslateParams } from '../translate-types';
import { fetchData, getError } from '../utils';
import { langCode } from '../google/lang-code';
import { LANGUAGE_NOT_SOPPORTED, RESULT_ERROR } from '../error-codes';
import { checkResultFromCustomSource } from './check-result';
import scOptions from '../../sc-options';

type FetchCustomSourceJSON = {
    text: string;
    from: string;
    to: string;
    userLang: string;
    preferred: [string, string];
};

// type DataFromCustomSource = {
//     result: string[];
//     from: string;
//     to: string;
//     dict?: string[];
//     phonetic?: string;
//     related?: string[];
//     example?: string[];
// } | {
//     code: string;
// };

export const translate = async ({ text, from = '', to = '', preferredLanguage = '', secondPreferredLanguage = '' }: TranslateParams, source: string) => {
    const { customTranslateSourceList } = await scOptions.get(['customTranslateSourceList']);
    const customTranslateSource = customTranslateSourceList.find(value => value.source === source);

    if (!customTranslateSource) { throw getError(SOURCE_ERROR); }

    preferredLanguage = preferredLanguage || 'en';
    secondPreferredLanguage = secondPreferredLanguage || 'en';

    const originTo = to;
    const originFrom = from;

    from = from || 'auto';
    to = to || (from === preferredLanguage ? secondPreferredLanguage : preferredLanguage);

    if (!(from in langCode) || !(to in langCode)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    let fetchJSON: FetchCustomSourceJSON = {
        text,
        from,
        to,
        userLang: navigator.language,
        preferred: [preferredLanguage, secondPreferredLanguage]
    };

    const res = await fetchData(customTranslateSource.url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(fetchJSON)
    });

    try {
        let data = await res.json();

        if (data.code) { throw getError(data.code); }

        checkResultFromCustomSource(data);

        if (!originFrom && !originTo && data.from === to && data.to === to && preferredLanguage !== secondPreferredLanguage) {
            to = secondPreferredLanguage;

            const newRes = await fetchData(customTranslateSource.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ...fetchJSON, from: data.from, to })
            });

            data = await newRes.json();

            if (data.code) { throw getError(data.code); }

            checkResultFromCustomSource(data);
        }

        const result: TranslateResult = {
            text,
            from: data.from,
            to,
            result: data.result,
            dict: data.dict,
            phonetic: data.phonetic,
            related: data.related,
            example: data.example
        };

        return result;
    }
    catch (err) {
        if ((err as ReturnType<typeof getError>).code) {
            throw err;
        }
        else {
            throw getError(RESULT_ERROR);
        }
    }
};