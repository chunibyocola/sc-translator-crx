import { fetchStream, getError } from '../utils';
import { detect } from './detect';
import { RESULT_ERROR, LANGUAGE_NOT_SOPPORTED } from '../error-codes';
import { langCode } from './lang-code';
import { TranslateParams } from '../translate-types';
import { TranslateResult } from '../../../types';

export const translate = async ({ text, from = '', to = '', preferredLanguage = '', secondPreferredLanguage = '' }: TranslateParams) => {
    preferredLanguage = preferredLanguage || 'en';
    secondPreferredLanguage = secondPreferredLanguage || 'en';
    from = from || await detect({ text });
    to = to || (from === preferredLanguage ? secondPreferredLanguage : preferredLanguage);

    if (!(from in langCode) || !(to in langCode)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    try {
        const data = await fetchStream('https://fanyi.baidu.com/ait/text/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: text,
                from,
                to,
                reference: '',
                corpusIds: [],
                qcSettings: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
                needPhonetic: false,
                domain: 'common',
                milliTimestamp: Number(new Date())
            })
        });

        let r: string[] | undefined = undefined;
        let example: string[] | undefined = undefined;
        let dict: string[] | undefined = undefined;
        let phonetic: string | undefined = undefined;
        let related: string[] | undefined = undefined;

        data.forEach((value: { data: { event: string; [K: string]: any; } }) => {
            switch (value?.data?.event) {
                case 'GetSentSucceed':
                    try {
                        const double: [string, string, string, number, string | undefined][][] = value.data.sentResult.double.slice(0, 3).map((v: any[]) => (v[0]));
                        example = double.map(value => value.reduce((total, current) => (`${total}${current[3] === 1 ? '<b>' + current[0] + '</b>' : current[0]}${current[4] ?? ''}`), ''));
                    }
                    catch {
                        example = undefined;
                    }

                    return;
                case 'Translating':
                    try {
                        r = value.data.list.map((value: { dst: string; }) => (value.dst));
                    }
                    catch {
                        r = undefined;
                    }

                    return;
                case 'GetDictSucceed':
                    try {
                        const parts: any[] = value.data.dictResult.simple_means.symbols[0].parts;

                        if (parts && (typeof parts?.[0]?.means?.[0] === 'string')) {
                            dict = parts.map((value: { means: string[]; part: string; part_name: string; }) => (`${value.part ?? value.part_name ?? ''} ${value.means.join('; ')}`));
                        }
                        else if (parts && (typeof parts?.[0]?.means?.[0]?.part === 'string')) {
                            const s = new Map<string, string[]>();

                            parts[0].means.forEach((value: { part: string; text: string; }) => {
                                if (s.has(value.part)) {
                                    s.get(value.part)?.push(value.text);
                                }
                                else {
                                    s.set(value.part, [value.text]);
                                }
                            });

                            dict = [];

                            [...s.keys()].forEach((key) => {
                                dict?.push(`${key ? key + ' ' : ''}${s.get(key)?.reduce((t, c, i) => (`${t}${i !== 0 ? ', ' : ''}${c}`), '')}`);
                            });
                        }
                    }
                    catch {
                        dict = undefined;
                    }

                    try {
                        const p: { ph_am: string; ph_en: string; word_symbol: string; } = value.data.dictResult.simple_means.symbols[0];
                        if (p.ph_am || p.ph_en) {
                            phonetic = `${p.ph_en ? 'UK: [' + p.ph_en  + '] ': ''}${p.ph_am ? 'US: [' + p.ph_am + '] ': ''}`;
                        }
                        else if (p.word_symbol) {
                            phonetic = `[${p.word_symbol}]`;
                        }
                    }
                    catch {
                        phonetic = undefined;
                    }

                    try {
                        if (Array.isArray(value.data.dictResult.simple_means.exchange.word_proto)) {
                            related = value.data.dictResult.simple_means.exchange.word_proto;
                        }
                    }
                    catch {
                        related = undefined;
                    }

                    return;
            }
        });

        if (!r) { throw getError(RESULT_ERROR); }

        const result: TranslateResult = {
            text,
            from,
            to,
            dict,
            phonetic,
            result: r,
            related,
            example
        };

        return result;
    } catch (e) {
        throw getError(RESULT_ERROR);
    }
};