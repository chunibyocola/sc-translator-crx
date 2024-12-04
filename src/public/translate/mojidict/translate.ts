import { fetchData, getError } from '../utils';
import { RESULT_ERROR, NO_RESULT } from '../error-codes';
import { TranslateParams } from '../translate-types';
import { TranslateResult } from '../../../types';

export const translate = async ({ text }: TranslateParams) => {
    const url = `https://api.mojidict.com/parse/functions/union-api`;

    const fetchJson = {
        functions: [
          { name: 'search-all', params: { text, types: [102, 106, 103] } },
          { name: 'mojitest-examV2-searchQuestion-v2', params: { text, limit: 1, page: 1 } },
          { name: 'deconjugateWithKeyWord', params: { text } }
        ],
        _ClientVersion: 'js3.4.1',
        _ApplicationId: 'E62VyFVLMiW7kvbtVq3p',
        g_os: 'PCWeb',
        g_ver: 'v4.9.3.20241122',
        _InstallationId: '0e1d6b85-f10e-4c00-bee4-9f11be8cc379'
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

        if (data.result.code !== 200) { throw `Error Code ${data.result.code}`; }

        const r = data.result.results['search-all'].result;

        if (r.word.searchResult.length === 0) { throw getError(NO_RESULT); }

        const hiragana = r.word.searchResult[0].title.split('|')[1]?.replace(/[\P{L}]/ug, '');
        const hiraganaDict = hiragana ? [`[平假名] ${hiragana}`] : [];

        const result: TranslateResult = {
            text,
            from: '',
            to: 'ja',
            result: [r.word.searchResult[0].title.split('|')[0]],
            dict: [r.word.searchResult[0].excerpt].concat(hiraganaDict)
        };

        return result;
    } catch (err) {
        if ((err as ReturnType<typeof getError>).code === NO_RESULT) {
            throw err;
        }
        else {
            throw getError(RESULT_ERROR);
        }
    }
};