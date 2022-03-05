import { unescapeText } from '..';
import { RESULT_ERROR } from '../../translate/error-codes';
import { fetchData, getError } from '../../translate/utils';
import { getTk } from './getTk';

export const translate = async (searchParams: URLSearchParams, totalQText: string, targetLanguage: string): Promise<string[][]> => {
    const url = `https://translate.googleapis.com/translate_a/t?anno=3&client=te_lib&format=html&v=1.0&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&logld=vTE_20210503_00&sl=auto&tl=${targetLanguage}&tc=1&dom=1&sr=1&tk=${getTk(totalQText)}&mode=1`;
    
    const res = await fetchData(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams.toString()
    });

    try {
        const data: string | string[] = await res.json();

        if (!Array.isArray(data)) { return []; }

        return data.map(v => toResult(v));
    }
    catch {
        throw getError(RESULT_ERROR);
    }
};

const toResult = (rawResult: string) => {
    let result: string[] = [];
    let preprocessText = rawResult.replace(/<i>[\s\S]*?<\/i>/g, '').replace(/<\/?b>/g, '');
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