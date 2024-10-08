import { getError } from '../utils';
import { RESULT_ERROR } from '../error-codes';
import { DetectParams } from '../translate-types';
import { getTranslateParams } from './get-params';
import { fetchBing } from './fetch-bing';
import { switchToGoogleLangCode } from './switch-lang-code';

export const detect = async ({ text, com = true }: DetectParams): Promise<string> => {
    const { token, key, IG, IID } = await getTranslateParams(com);

    const url = `https://${com ? 'www' : 'cn'}.bing.com/ttranslatev3?isVertical=1&&IG=${IG}&IID=${IID}`;

    let searchParams = new URLSearchParams();
    searchParams.append('fromLang', 'auto-detect');
    searchParams.append('text', text);
    searchParams.append('to', 'en');
    searchParams.append('token', token);
    searchParams.append('key', key.toString());

    const res = await fetchBing(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams.toString()
    });

    try {
        const data = await res.json();

        const langCode = data[0].detectedLanguage.language;

        return switchToGoogleLangCode(langCode);
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};