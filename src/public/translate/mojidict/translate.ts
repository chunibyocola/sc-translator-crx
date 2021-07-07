import { fetchData, getError } from '../utils';
import { RESULT_ERROR, NO_RESULT } from '../error-codes';
import { TranslateParams } from '../translate-types';

export const translate = async ({ text }: TranslateParams) => {
    const url = `https://api.mojidict.com/parse/functions/search_v3`;

    const fetchJson = {
        searchText: text,
        needWords :true,
        _ApplicationId:"E62VyFVLMiW7kvbtVq3p"
    };

    const res = await fetchData(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(fetchJson)
    });

    try {
        const data = await res.json();

        if (data.result.words.length === 0) { throw getError(NO_RESULT); }

        const result = {
            text,
            from: '',
            to: 'ja',
            result: [data.result.words[0].spell],
            dict: [data.result.words[0].excerpt, `[平假名] ${data.result.words[0].pron}`, `[罗马音] ${data.result.words[0].romaji}`]
        };

        return result;
    } catch (err) {
        if (err.code === NO_RESULT) {
            throw getError(NO_RESULT);
        }
        else {
            throw getError(RESULT_ERROR);
        }
    }
};