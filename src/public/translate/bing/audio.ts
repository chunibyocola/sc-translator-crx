import { fetchData, getError } from '../utils';
import { detect } from './detect';
import { LANGUAGE_NOT_SOPPORTED, RESULT_ERROR } from '../error-codes';
import { AudioParams } from '../translate-types';
import { getAudioParams } from './get-params';

export const audio = async ({ text, from = '', com = true }: AudioParams) => {
    from = from || await detect({ text, com });

    const { region, token } = await getAudioParams(com);

    const url = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;
    const { lang, gender, name } = getXMLParams(from);
    if (!lang) { throw getError(LANGUAGE_NOT_SOPPORTED); }
    const rawXML = `
        <speak version='1.0' xml:lang='${lang}'>
            <voice xml:lang='${lang}' xml:gender='${gender}' name='${name}'>
                <prosody rate='-20.00%'>
                    ${text}
                </prosody>
            </voice>
        </speak>
    `;

    const res = await fetchData(url, {
        method: 'POST',
        headers: {
            'X-MICROSOFT-OutputFormat': 'audio-16khz-32kbitrate-mono-mp3',
            'Authorization': `Bearer ${token}`
        },
        body: rawXML
    });

    try {
        const data = await res.blob();

        const dataURL: string = await new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = () => {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(data);
        });
        
        return dataURL;
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};

const getXMLParams = (langCode: string) => {
    let t = '', i = '', r = '';

    switch (langCode) {
        case "ar": t = "ar-SA"; i = "Male"; r = "ar-SA-HamedNeural"; break;
        case "bg": t = "bg-BG"; i = "Male"; r = "bg-BG-BorislavNeural"; break;
        case "ca": t = "ca-ES"; i = "Female"; r = "ca-ES-JoanaNeural"; break;
        case "cs": t = "cs-CZ"; i = "Male"; r = "cs-CZ-AntoninNeural"; break;
        case "da": t = "da-DK"; i = "Female"; r = "da-DK-ChristelNeural"; break;
        case "de": t = "de-DE"; i = "Female"; r = "de-DE-KatjaNeural"; break;
        case "el": t = "el-GR"; i = "Male"; r = "el-GR-NestorasNeural"; break;
        case "en": t = "en-US"; i = "Female"; r = "en-US-AriaNeural"; break;
        case "es": t = "es-ES"; i = "Female"; r = "es-ES-ElviraNeural"; break;
        case "fi": t = "fi-FI"; i = "Female"; r = "fi-FI-NooraNeural"; break;
        case "fr": t = "fr-FR"; i = "Female"; r = "fr-FR-DeniseNeural"; break
        case "fr-CA": t = "fr-CA"; i = "Female"; r = "fr-CA-SylvieNeural"; break;
        case "he": t = "he-IL"; i = "Male"; r = "he-IL-AvriNeural"; break;
        case "hi": t = "hi-IN"; i = "Female"; r = "hi-IN-SwaraNeural"; break;
        case "hr": t = "hr-HR"; i = "Male"; r = "hr-HR-SreckoNeural"; break;
        case "hu": t = "hu-HU"; i = "Male"; r = "hu-HU-TamasNeural"; break;
        case "id": t = "id-ID"; i = "Male"; r = "id-ID-ArdiNeural"; break;
        case "it": t = "it-IT"; i = "Male"; r = "it-IT-DiegoNeural"; break;
        case "ja": t = "ja-JP"; i = "Female"; r = "ja-JP-NanamiNeural"; break;
        case "ko": t = "ko-KR"; i = "Female"; r = "ko-KR-SunHiNeural"; break;
        case "ms": t = "ms-MY"; i = "Male"; r = "ms-MY-OsmanNeural"; break;
        case "nl": t = "nl-NL"; i = "Female"; r = "nl-NL-ColetteNeural"; break;
        case "nb": t = "nb-NO"; i = "Female"; r = "nb-NO-PernilleNeural"; break;
        case "pl": t = "pl-PL"; i = "Female"; r = "pl-PL-ZofiaNeural"; break;
        case "pt": t = "pt-BR"; i = "Female"; r = "pt-BR-FranciscaNeural"; break;
        case "pt-PT": t = "pt-PT"; i = "Female"; r = "pt-PT-FernandaNeural"; break;
        case "ro": t = "ro-RO"; i = "Male"; r = "ro-RO-EmilNeural"; break;
        case "ru": t = "ru-RU"; i = "Female"; r = "ru-RU-DariyaNeural"; break;
        case "sk": t = "sk-SK"; i = "Male"; r = "sk-SK-LukasNeural"; break;
        case "sl": t = "sl-SI"; i = "Male"; r = "sl-SI-RokNeural"; break;
        case "sv": t = "sv-SE"; i = "Female"; r = "sv-SE-SofieNeural"; break;
        case "ta": t = "ta-IN"; i = "Female"; r = "ta-IN-PallaviNeural"; break;
        case "te": t = "te-IN"; i = "Male"; r = "te-IN-ShrutiNeural"; break;
        case "th": t = "th-TH"; i = "Male"; r = "th-TH-NiwatNeural"; break;
        case "tr": t = "tr-TR"; i = "Female"; r = "tr-TR-EmelNeural"; break;
        case "vi": t = "vi-VN"; i = "Male"; r = "vi-VN-NamMinhNeural"; break;
        case "zh-Hans": t = "zh-CN"; i = "Female"; r = "zh-CN-XiaoxiaoNeural"; break;
        case "zh-Hant": t = "zh-CN"; i = "Female"; r = "zh-CN-XiaoxiaoNeural"; break;
        case "yue": t = "zh-HK"; i = "Female"; r = "zh-HK-HiuGaaiNeural"; break;
        default: break;
    };

    return { lang: t, gender: i, name: r };
};