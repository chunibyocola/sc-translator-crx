import { LANGUAGE_NOT_SOPPORTED, RESULT_ERROR } from '../../translate/error-codes';
import { getError } from '../../translate/utils';
import { getAuthorization } from './getAuthorization';
import { langCode } from '../../translate/bing/lang-code';
import { unescapeText, WebpageTranslateResult } from '..';

export const translate = async (requestArray: { Text: string }[], targetLanguage: string): Promise<WebpageTranslateResult[]> => {
    if (!(targetLanguage in langCode)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

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
                throw data?.error?.code;
            }
        }
        else {
            throw data?.error?.code;
        }
    }
    catch {
        throw getError(RESULT_ERROR);
    }
};

const dealWithResult = (result: { translations: [{ text: string }] }[]): WebpageTranslateResult[] => {
    return result.map((v) => ({ translations: toTranslations(v.translations[0].text), comparisons: toComparisons(v.translations[0].text) }));
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