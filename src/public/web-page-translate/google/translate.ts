import { unescapeText, WebpageTranslateFn } from '..';
import { RESULT_ERROR } from '../../translate/error-codes';
import { fetchData, getError } from '../../translate/utils';
import { getTk } from './getTk';

export const translate: WebpageTranslateFn = async ({ keys, targetLanguage }) => {
    const searchParams = new URLSearchParams();
    keys.forEach(key => searchParams.append('q', key));

    const totalQText = keys.join('');

    const url = `https://translate.googleapis.com/translate_a/t?anno=3&client=te_lib&format=html&v=1.0&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw&logld=vTE_20230724&sl=auto&tl=${targetLanguage}&tc=1&dom=1&sr=1&tk=${getTk(totalQText)}&mode=1`;

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
            const language = Array.isArray(value) ? (value[1] ?? undefined) : undefined;
            value = Array.isArray(value) ? (value[0] ?? '') : value;

            return { detectedLanguage: language, ...interpreter(value) };
        });
    }
    catch {
        throw getError(RESULT_ERROR);
    }
};

const interpreter = (sentence: string) => {
    const stack: number[] = [];
    const aNum = sentence.match(/<a i=[0-9]+>/g)?.length ?? 1;
    const translations: string[] = new Array(aNum).fill('');
    const comparisons: string[] = new Array(aNum).fill('');
    let anchor = 0;
    const matchRegExp = new RegExp('<a i=([0-9]+)>|</a>');
    sentence = sentence.replace(/<i>.*?<\/i>/g, '').replace(/\s*?<b>|<\/b>/g, '');
    let match = sentence.match(matchRegExp);

    while (match?.index !== undefined) {
        const [text, i] = match;

        if (text === '</a>') {
            const pop = stack.pop();

            if (pop !== undefined) {
                comparisons[pop] += unescapeText(sentence.substring(0, match.index));
            }
        }
        else if (i !== undefined) {
            const numI = Number(i);
            stack.push(numI);
            if (stack.length === 1 && anchor !== numI) {
                anchor = Math.min(Math.max(numI, anchor + 1), aNum - 1);
            }

            if (stack.length > 1) {
                comparisons[stack[0]] += unescapeText(sentence.substring(0, match.index));
            }
        }

        if (anchor > 0 && translations[anchor - 1] === '' && i !== undefined) {
            translations[anchor - 1] += unescapeText(sentence.substring(0, match.index));
        }
        else {
            translations[anchor] += unescapeText(sentence.substring(0, match.index));
        }

        sentence = sentence.substring(match.index + text.length);

        match = sentence.match(matchRegExp);
    }

    translations[translations.length - 1] += unescapeText(sentence);
    comparisons[comparisons.length - 1] += unescapeText(sentence);

    return { translations, comparisons };
};