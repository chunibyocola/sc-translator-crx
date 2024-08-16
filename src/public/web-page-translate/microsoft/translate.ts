import { LANGUAGE_NOT_SOPPORTED, RESULT_ERROR } from '../../translate/error-codes';
import { getError } from '../../translate/utils';
import { getAuthorization } from './getAuthorization';
import { unescapeText, WebpageTranslateFn, WebpageTranslateResult } from '..';
import { bingSupportedLangCodes } from '../../../constants/langCode';

const switchToMicrosoftCodeMap = new Map(Object.entries({'zh-CN':'zh-Hans','zh-TW':'zh-Hant','tl':'fil','iw':'he','hmn':'mww','sr':'sr-Cyrl','no':'nb'}));
const switchToMicrosoftLangCode = (code: string) => {
    return switchToMicrosoftCodeMap.get(code) ?? code;
};

const switchToGoogleCodeMap = new Map(Object.entries({'zh-Hans':'zh-CN','zh-Hant':'zh-TW','fil':'tl','he':'iw','mww':'hmn','sr-Cyrl':'sr','nb':'no'}));
const switchToGoogleLangCode = (code: string) => {
    return switchToGoogleCodeMap.get(code) ?? code;
};

export const translate: WebpageTranslateFn = async ({ keys, targetLanguage }) => {
    if (!bingSupportedLangCodes.has(targetLanguage)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    targetLanguage = switchToMicrosoftLangCode(targetLanguage);

    const requestArray = keys.map((key) => ({ Text: key }));

    try {
        let data = await fetchFromMicrosoft(requestArray, targetLanguage);

        if (Array.isArray(data)) {
            return dealWithResult(data);
        }
        else if (data?.error?.code === 401000) {
            await getAuthorization(true);
            data = await fetchFromMicrosoft(requestArray, targetLanguage);
            if (Array.isArray(data)) {
                return dealWithResult(data);
            }
            else {
                throw getError(`Error: ${data?.error?.code ?? 'Unknown'}`);
            }
        }
        else {
            throw getError(`Error: ${data?.error?.code ?? 'Unknown'}`);
        }
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

type MicrosoftPageTranslationResult = {
    detectedLanguage: { language: string; };
    translations: [{ text: string; to: string; }];
}[];

const dealWithResult = (result: MicrosoftPageTranslationResult): WebpageTranslateResult[] => {
    return result.map((v) => ({
        translations: toTranslations(v.translations[0].text),
        comparisons: toComparisons(v.translations[0].text),
        detectedLanguage: switchToGoogleLangCode(v.detectedLanguage?.language)
    }));
};

const fetchFromMicrosoft = async (requestArray: { Text: string }[], targetLanguage: string) => {
    const authorization = await getAuthorization();

    const url = `https://api.cognitive.microsofttranslator.com/translate?to=${targetLanguage}&api-version=3.0`;

    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authorization}`
        },
        body: JSON.stringify(requestArray)
    });

    const data = await res.json();

    return data;
};

const toComparisons = (rawResult: string) => {
    let result: string[] = [];
    let matchArray = rawResult.match(/(?<=<b)[0-9]+>[\s\S]*?(?=<\/b[0-9]+>)/g);
    if (matchArray) {
        matchArray.forEach(v => {
            const [index, rawResult] = v.split('>');
            result[Number(index)] = (result[Number(index)] ?? '') + unescapeText(rawResult);
        });
        return result;
    }

    return [unescapeText(rawResult)];
};

const toTranslations = (rawResult: string) => {
    let results: string[] = [];
    let match = rawResult.match(/<b[0-9]+>[\s\S]*?<\/b[0-9]+>/);
    let tagBNum = (match && rawResult.match(/<b[0-9]+>[\s\S]*?<\/b[0-9]+>/g)?.length) ?? 0

    while (match?.[0] && match.index !== undefined) {
        const str = match[0];
        const text = str.replace(/(<b[0-9]+>)|(<\/b[0-9]+>)/g, '');
        const nextIndex = Math.min(results.length, tagBNum - 1);

        if (match.index !== 0) {
            results[nextIndex] = (results[nextIndex] ?? '') + rawResult.substring(0, match.index);
        }

        results[nextIndex] = (results[nextIndex] ?? '') + unescapeText(text);

        rawResult = rawResult.substring(match.index + str.length);
        match = rawResult.match(/<b[0-9]+>[\s\S]*?<\/b[0-9]+>/);
    }

    const nextIndex = Math.max(0, results.length - 1);
    results[nextIndex] = (results[nextIndex] ?? '') + unescapeText(rawResult);

    return results;
};