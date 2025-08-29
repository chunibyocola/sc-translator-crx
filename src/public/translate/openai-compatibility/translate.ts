import { langCodeI18n } from '../../../constants/langCode';
import { defaultChatGPTValue } from '../../../constants/thirdPartyServiceValues';
import { TranslateResult } from '../../../types';
import { getMessage } from '../../i18n';
import scOptions from '../../sc-options';
import { RESULT_ERROR } from '../error-codes';
import { TranslateParams } from '../translate-types';
import { determineFromAndTo, fetchTPS, getError } from '../utils';

export const translate: (params: TranslateParams, serviceName: string) => Promise<TranslateResult> = async ({ text, from, to, preferredLanguage, secondPreferredLanguage }, serviceName) => {
    const { from: nextFrom, to: nextTo } = await determineFromAndTo({ text, from, to, preferredLanguage, secondPreferredLanguage });
    from = nextFrom;
    to = nextTo;

    if (!to) { throw getError('Error: Target language is required.'); }

    const { enabledThirdPartyServices: services } = await scOptions.get(['enabledThirdPartyServices']);
    const currentService = services.find(service => service.name === serviceName);

    if (!currentService) { throw getError('Error: Service value not found.'); }

    const serviceValue = { ...defaultChatGPTValue, ...currentService };

    if (!serviceValue.key) { throw getError('Error: Key is required.'); }

    const url = serviceValue.url;
    const prompt = (serviceValue.prompt || getMessage('commonPrompt')).replace('{target}', langCodeI18n['zh-CN'][to]).replace('{text}', text);

    const fetchJSON = { model: serviceValue.model, messages: [{ role: 'user', content: prompt  }] };

    const res = await fetchTPS(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceValue.key}`,
        },
        body: JSON.stringify(fetchJSON)
    });

    try {
        const result = await res.json();

        if (!res.ok) {
            throw getError(`[Error Code] ${result[0].error.code} [Message] ${result[0].error.message}`);
        }

        const translation: string = result.choices[0].message.content;

        return {
            text,
            from: '',
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