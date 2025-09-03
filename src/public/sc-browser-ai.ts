import scOptions from './sc-options';

const scBrowserAI = (() => {
    let translator: typeof window.Translator | null = null;
    let sourceLang = '';
    let targetLang = '';

    let detector: typeof window.LanguageDetector | null = null;

    let available = ('LanguageDetector' in self) && ('Translator' in self);

    return {
        detect: async (text: string) => {
            if (!available) { throw new Error('unavailable'); }

            // if (!detector) {
            //     const availability = await self.LanguageDetector.availability();
            //     if (availability !== 'available') {
            //         if (availability === 'unavailable') {
            //             available = false;
            //             throw new Error('unavailable');
            //         }

            //         throw new Error(`target=LanguageDetector&availability=${availability}`);
            //     }
            // }

            // detector = detector ?? await self.LanguageDetector.create();
            // const result = await detector.detect(text);

            // return result.at(0)?.detectedLanguage;
            const availability = await self.LanguageDetector.availability();
            if (availability === 'unavailable') {
                available = false;
                throw new Error('unavailable');
            }

            const detection = await chrome.i18n.detectLanguage(text);
            return detection.languages[0].language;
        },
        translate: async (params: { text: string; sourceLanguage: string; targetLanguage: string; }) => {
            if (!available) { throw new Error('unavailable'); }

            let { text, sourceLanguage, targetLanguage } = params;
            let { preferredLanguage, secondPreferredLanguage } = scOptions.getInit();

            if (text.length > 4096) {
                throw new Error('Error: The text length is too long. (text length > 4096)');
            }

            [sourceLanguage, targetLanguage, preferredLanguage, secondPreferredLanguage] = [sourceLanguage, targetLanguage, preferredLanguage, secondPreferredLanguage].map(v => v.includes('zh') ? 'zh' : v);

            let from = 'en', to = targetLanguage;

            if (sourceLanguage) {
                from = sourceLanguage;
            }
            else {
                const detectedLanguage = await scBrowserAI.detect(text);

                if (detectedLanguage) {
                    from = detectedLanguage;
                }
            }

            if (!to) {
                if (from === preferredLanguage) {
                    to = secondPreferredLanguage;
                }
                else {
                    to = preferredLanguage;
                }
            }

            if (sourceLang === from && targetLang === to && translator) {
                const result = await translator.translate(text);

                return { translation: result, from, to };
            }

            const availability = await self.Translator.availability({ sourceLanguage: from, targetLanguage: to });

            if (availability !== 'available') {
                throw new Error(`target=Translator&availability=${availability}&from=${from}&to=${to}`);
            }

            translator = await self.Translator.create({ sourceLanguage: from, targetLanguage: to });
            const result = await translator.translate(text);

            sourceLang = from;
            targetLang = to;

            return { translation: result, from, to };
        },
        downloadDetector: async (params: { loaded?: (loaded: string) => void; }) => {
            if (!available) { throw new Error('unavailable'); }

            const { loaded } = params;

            const availability = await self.LanguageDetector.availability();

            if (availability === 'unavailable') {
                throw new Error(`target=LanguageDetector&availability=${availability}`);
            }

            if (availability === 'available') {
                return scBrowserAI;
            }

            detector = await self.LanguageDetector.create({ monitor: (monitor) => {
                monitor.addEventListener('downloadprogress', (e) => {
                    console.log(e)
                    loaded?.(`${Math.floor((e as ProgressEvent).loaded * 100)}%`);
                });
            } });

            await detector.ready;

            return scBrowserAI;
        },
        downloadTranslator: async (params: { sourceLanguage: string; targetLanguage: string; loaded?: (loaded: string) => void; }) => {
            if (!available) { throw new Error('unavailable'); }

            const { sourceLanguage, targetLanguage, loaded } = params;

            const availability = await self.Translator.availability({ sourceLanguage, targetLanguage });

            if (availability === 'unavailable') {
                throw new Error(`target=Translator&availability=${availability}`);
            }

            if (availability === 'available') {
                return scBrowserAI;
            }

            translator = await self.Translator.create({ sourceLanguage, targetLanguage, monitor: (monitor) => {
                monitor.addEventListener('downloadprogress', (e) => {
                    loaded?.(`${Math.floor((e as ProgressEvent).loaded * 100)}%`);
                });
            } });

            await translator.ready;

            return scBrowserAI;
        }
    }
})();

export default scBrowserAI;