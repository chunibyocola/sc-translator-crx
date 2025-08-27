import { langCodeI18n } from '../../../constants/langCode';
import { defaultGeminiValue } from '../../../constants/thirdPartyServiceValues';
import { TranslateResult } from '../../../types';
import { getMessage } from '../../i18n';
import scOptions from '../../sc-options';
import { RESULT_ERROR } from '../error-codes';
import { TranslateParams } from '../translate-types';
import { determineFromAndTo, fetchTPS, getError } from '../utils';

export const translate: (params: TranslateParams) => Promise<TranslateResult> = async ({ text, from, to, preferredLanguage, secondPreferredLanguage }) => {
    const { from: nextFrom, to: nextTo } = await determineFromAndTo({ text, from, to, preferredLanguage, secondPreferredLanguage });
    from = nextFrom;
    to = nextTo;

    if (!to) { throw getError('Error: Unable to determine a target language, please provide the target language.'); }

    const { enabledThirdPartyServices: services } = await scOptions.get(['enabledThirdPartyServices']);
    const currentService = services.find(service => service.name === 'Gemini');

    if (!currentService) { throw getError('Error: Service value not found.'); }

    const serviceValue = { ...defaultGeminiValue, ...currentService };

    if (!serviceValue.key) { throw getError('Error: Key is required.'); }

    const url = serviceValue.url.replace('{model}', serviceValue.model);
    const prompt = (serviceValue.prompt || getMessage('commonPrompt')).replace('{target}', langCodeI18n['zh-CN'][to]).replace('{text}', text);

    const fetchJSON = { contents: [{ parts: [{ text: prompt }] }] };

    const res = await fetchTPS(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': serviceValue.key
        },
        body: JSON.stringify(fetchJSON)
    });

    try {
        const result = await res.json();

        if (!res.ok) {
            throw getError(`[Error Code] ${result.error.code} [Message] ${result.error.message}`);
        }

        const translation: string = result.candidates[0].content.parts[0].text;

        return {
            text,
            from,
            to,
            result: translation.split('\n')
        };
    }
    catch (err) {
        if ((err as ReturnType<typeof getError>).code) {
            throw err;
        }
        else {
            throw getError(RESULT_ERROR);
        }
    }
};