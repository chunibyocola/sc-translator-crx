import { getTokenAndSign } from './getTokenAndSign';
import { fetchData, getError } from '../utils';
import { detect } from './detect';
import { RESULT_ERROR, LANGUAGE_NOT_SOPPORTED } from '../error-codes';
import { langCode } from './lang-code';

export const translate = async ({ text, from = '', to = '', preferredLanguage = '', secondPreferredLanguage = '' }) => {
    preferredLanguage = preferredLanguage || 'en';
    secondPreferredLanguage = secondPreferredLanguage || 'en';
    from = from || await detect({ text });
    to = to || (from === preferredLanguage ? secondPreferredLanguage : preferredLanguage);

    if (!(from in langCode) || !(to in langCode)) { throw getError(LANGUAGE_NOT_SOPPORTED); };

    const { token, sign } = await getTokenAndSign(text);

    let searchParams = new URLSearchParams();
    searchParams.append('from', from);
    searchParams.append('to', to);
    searchParams.append('query', text);
    searchParams.append('token', token);
    searchParams.append('sign', sign);

    const res = await fetchData('https://fanyi.baidu.com/v2transapi', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: searchParams.toString()
    });

    try {
        const data = await res.json();

        let dict = undefined;
        if (data?.dict_result?.content?.[0]?.mean) {
            dict = data.dict_result.content[0].mean.map((v) => (
                `${v.pre ? v.pre + ' ' : ''}${Object.keys(v.cont)[0]}`
            ));
        }
        else if (data?.dict_result?.simple_means?.symbols?.[0]?.parts?.[0]?.part) {
            const tempDict = data.dict_result.simple_means.symbols[0].parts.map((v) => (
                `${v.part} ${v.means.reduce((t, c, i) => (i === 0 ? `${c};` : `${t} ${c};`), '')}`
            ));
            Array.isArray(dict) ? (dict = dict.concat(tempDict)) : (dict = tempDict);
        }
        else if (data?.dict_result?.simple_means?.word_means) {
            const tempDict = [data.dict_result.simple_means.word_means.reduce((t, c, i) => (
                i === 0 ? `${c};` : `${t} ${c};`
            ), '')];
            Array.isArray(dict) ? (dict = dict.concat(tempDict)) : (dict = tempDict);
        }

        let phonetic = undefined;
        if (data?.dict_result?.voice) {
            phonetic = data.dict_result.voice.reduce((t, v) => (
                v.en_phonic ? `${t} UK: ${v.en_phonic}` : v.us_phonic ? `${t} US: ${v.us_phonic}` : t
            ), '').trimLeft();
        }
        else if (data?.dict_result?.simple_means?.symbols?.[0]) {
            const { ph_am, ph_en } = data.dict_result.simple_means.symbols[0];
            phonetic = `${ph_en ? ('UK: [' + ph_en + ']') : ''} ${ph_am ? ('US: [' + ph_am + ']') : ''}`.trimLeft();
        }

        const result = {
            text,
            from: data.trans_result.from,
            to: data.trans_result.to,
            dict,
            phonetic,
            result: data.trans_result.data.map(v => v.dst)
        };

        return result;
    } catch (e) {
        throw getError(RESULT_ERROR);
    }
};