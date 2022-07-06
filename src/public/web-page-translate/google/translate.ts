import { unescapeText, WebpageTranslateFn } from '..';
import { RESULT_ERROR } from '../../translate/error-codes';
import { fetchData, getError } from '../../translate/utils';
import { getTk } from './getTk';

export const translate: WebpageTranslateFn = async ({ keys, targetLanguage }) => {
    const searchParams = new URLSearchParams();
    keys.forEach(key => searchParams.append('q', key));

    const totalQText = keys.join('');

    const url = `https://translate.googleapis.com/translate_a/t?anno=3&client=te_lib&format=html&v=1.0&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&logld=vTE_20210503_00&sl=auto&tl=${targetLanguage}&tc=1&dom=1&sr=1&tk=${getTk(totalQText)}&mode=1`;

    const res = await fetchData(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams.toString()
    });

    try {
        const data: string | string[] | [string, string][] = await res.json();

        if (!Array.isArray(data)) { return []; }

        return data.map((value) => {
            value = Array.isArray(value) ? (value[0] ?? '') : value;

            return { translations: toTranslations(value), comparisons: toComparisons(value) };
        });
    }
    catch {
        throw getError(RESULT_ERROR);
    }
};

const dealWithSentence = (sentence: string, startIndex?: number, tagANum?: number) => {
    let results: string[] = [];
    let match = sentence.match(/<a i=[0-9]+>[\s\S]*?<\/a>/);
    let flag = false;

    startIndex ??= 0;
    tagANum ??= (match && sentence.match(/<a i=[0-9]+>[\s\S]*?<\/a>/g)?.length) ?? 0;

    while (match?.[0] && match.index !== undefined) {
        const str = match[0];
        const [index, text] = str.replace(/(<a i=)|(<\/a>)/g, '').split('>');
        const i = Number(index);

        if (!flag) {
            if (startIndex < i) {
                results = new Array(i - startIndex).fill('');
            }

            flag = true;
        }

        let length = results.length;

        if (match.index !== 0) {
            const index = Math.max(0, length - 1);
            results[index] = (results[index] ?? '') + sentence.substring(0, match.index);
        }

        const nextIndex = Math.min(length, tagANum - 1);

        results[nextIndex] = (results[nextIndex] ?? '') + unescapeText(text);

        sentence = sentence.substring(match.index + str.length);
        match = sentence.match(/<a i=[0-9]+>[\s\S]*?<\/a>/);
    }

    const index = Math.max(0, results.length - 1);
    results[index] = (results[index] ?? '') + unescapeText(sentence);

    return results;
};

const toComparisons = (rawResult: string) => {
    let result: string[] = [];
    let preprocessText = rawResult.replace(/\s?<i>[\s\S]*?<\/i>/g, '').replace(/<\/?b>/g, '');
    let matchArray = preprocessText.match(/(?<=<a i=)[0-9]+>[\s\S]*?(?=<\/a>)/g);
    if (matchArray) {
        matchArray.forEach((v) => {
            const [index, rawResult] = v.split('>');
            result[Number(index)] = (result[Number(index)] ?? '') + unescapeText(rawResult);
        });
        return result;
    }

    return [unescapeText(preprocessText)];
};

const toTranslations = (rawResult: string) => {
    let results: string[] = [];
    const originalRawResult = rawResult;

    let matchI = rawResult.match(/(?<=<i>)[\s\S]*?(?=<\/i>)/);

    if (!matchI) {
        return dealWithSentence(rawResult);
    }
    
    while (matchI?.[0] && matchI.index !== undefined) {
        const indexArray = matchI[0].match(/(?<=<a i=)[0-9]+(?=>[\s\S]*?<\/a>)/g)?.map(Number) ?? [0];
        const matchB = rawResult.match(/<b>[\s\S]*?<\/b>/);

        if (matchB?.[0] && matchB.index !== undefined) {
            rawResult = rawResult.substring(matchB.index + matchB[0].length);

            const r = dealWithSentence(matchB[0].replace(/(<b>)|(<\/b>)/g, ''), indexArray[0], indexArray.length);
            r.forEach((value, index) => {
                const nextIndex = indexArray[Math.min(index, indexArray.length - 1)];

                results[nextIndex] = (results[nextIndex] ?? '') + value;
            });

            matchI = rawResult.match(/(?<=<i>)[\s\S]*?(?=<\/i>)/);
        }
        else {
            return toComparisons(originalRawResult);
        }
    }

    return results;
};