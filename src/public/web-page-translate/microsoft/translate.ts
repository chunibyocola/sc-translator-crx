import { LANGUAGE_NOT_SOPPORTED, RESULT_ERROR } from '../../translate/error-codes';
import { getError } from '../../translate/utils';
import { getAuthorization } from './getAuthorization';
import { langCode } from '../../translate/bing/lang-code';
import { unescapeText } from '..';

let authorization = '';

export const translate = async (requestArray: { Text: string }[], targetLanguage: string): Promise<string[][]> => {
    if (!(targetLanguage in langCode)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    try {
        let data = await fetchFromMicrosoft(requestArray, targetLanguage);

        if (Array.isArray(data)) {
            return dealWithResult(data);
        }
        else if (data?.error?.code === 401000) {
            authorization = await getAuthorization();
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

const dealWithResult = (result: { translations: [{ text: string }] }[]) => {
    return result.map(v => toResult(v.translations[0].text));
};

const fetchFromMicrosoft = async (requestArray: { Text: string }[], targetLanguage: string) => {
    if (!authorization) {
        authorization = await getAuthorization();
    }

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

const toResult = (rawResult: string) => {
    let result: string[] = [];
    let matchArray = rawResult.match(/(?<=<b)[0-9]+>[\s\S]*?(?=<\/b[0-9]+>)/g);
    if (matchArray) {
        matchArray.map(v => {
            const [index, rawResult] = v.split('>');
            result[Number(index)] = (result[Number(index)] ?? '') + unescapeText(rawResult);
        });
        return result;
    }

    return [unescapeText(rawResult)];
};