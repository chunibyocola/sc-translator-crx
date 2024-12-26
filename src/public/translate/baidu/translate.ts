import { fetchData, getError } from '../utils';
import { LANGUAGE_NOT_SOPPORTED, RESULT_ERROR } from '../error-codes';
import { TranslateParams } from '../translate-types';
import { TranslateResult } from '../../../types';
import { isLangCodeSupported, switchToBaiduLangCode, switchToGoogleLangCode } from './switch-lang-code';
import { detect } from './detect';

export const translate = async ({ text, from, to, preferredLanguage, secondPreferredLanguage }: TranslateParams): Promise<TranslateResult> => {
    [from, to, preferredLanguage, secondPreferredLanguage] = [from, to, preferredLanguage, secondPreferredLanguage].map(switchToBaiduLangCode);

    from = from || switchToBaiduLangCode(await detect({ text }));
    to = to || (from === preferredLanguage ? secondPreferredLanguage : preferredLanguage);

    const res = await fetchFromBaidu({ text, from, to });

    try {
        let data = res;

        if (data.data) {
            return {
                text,
                from: switchToGoogleLangCode(data.from),
                to: switchToGoogleLangCode(to),
                result: data.data.flatMap((v: { dst: string; }) => v.dst.split('\n').filter((v) => v.trim()))
            };
        }

        if (data.result) {
            const r = JSON.parse(data.result);

            let result: TranslateResult = {
                text,
                from: switchToGoogleLangCode(data.from),
                to: switchToGoogleLangCode(to),
                result: [Object.keys(r.content[0].mean[0].cont)[0]]
            };

            try {
                result.dict = r.content[0].mean.map((v: any) => `${v.pre ?? ''} ${Object.keys(v.cont).join(', ')}`.trimStart().trimEnd());
            } catch {}

            try {
                if (r.voice?.length > 0) {
                    result.phonetic = r.voice.map((v: any) => v['en_phonic'] ? `EN ${v['en_phonic']}` : v['us_phonic'] ? `US ${v['us_phonic']}` : '').join(', ');
                }
            } catch {}

            return result;
        }

        throw getError(RESULT_ERROR);
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};

type FetchParams = {
    text: string;
    from: string;
    to: string;
};

const fetchFromBaidu = async ({ text, from, to }: FetchParams): Promise<any> => {
    if (![from, to].every(isLangCodeSupported)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    const url = `https://fanyi.baidu.com/transapi`;

    const searchParams = new URLSearchParams();
    searchParams.append('from', from);
    searchParams.append('query', text);
    searchParams.append('source', 'txt');
    searchParams.append('to', to);

    const res = await fetchData(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams.toString()
    });
    
    const data = await res.json();

    return data;
};