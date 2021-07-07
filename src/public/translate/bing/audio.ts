import { fetchData, getError } from '../utils';
import { detect } from './detect';
import { LANGUAGE_NOT_SOPPORTED, RESULT_ERROR } from '../error-codes';
import { getTokenAndKey } from './getTokenAndKey';
import { AudioParams } from '../translate-types';

export const audio = async ({ text, from = '', com = true }: AudioParams) => {
    from = from || await detect({ text, com });

    const { region, token } = await getAuthorization(com);

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

let authorization = {
    expiry: '0',
    region: '',
    token: ''
};
const getAuthorization = async (com: boolean) => {
    if (Math.floor(new Date().getTime() / 1000) < Number.parseInt(authorization.expiry)) return authorization;

    const url = `https://${com ? 'www' : 'cn'}.bing.com/tfetspktok`;

    const { token, key } = await getTokenAndKey(com);

    const searchParams = new URLSearchParams();
    searchParams.append('token', token);
    searchParams.append('key', key.toString());
    const res = await fetchData(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: searchParams.toString()
    });

    try {
        const data = await res.json();

        authorization = { expiry: data.expiry, region: data.region, token: data.token };

        return authorization;
    } catch (err) {
        throw getError(RESULT_ERROR);
    }
};

const getXMLParams = (langCode: string) => {
    let t = '', i = '', r = '';

    switch (langCode) {
        case "ar": t = "ar-SA"; i = "Male"; r = "ar-SA-Naayf"; break;
        case "bg": t = "bg-BG"; i = "Male"; r = "bg-BG-Ivan"; break;
        case "ca": t = "ca-ES"; i = "Female"; r = "ca-ES-HerenaRUS"; break;
        case "cs": t = "cs-CZ"; i = "Male"; r = "cs-CZ-Jakub"; break;
        case "da": t = "da-DK"; i = "Female"; r = "da-DK-HelleRUS"; break;
        case "de": t = "de-DE"; i = "Female"; r = "de-DE-Hedda"; break;
        case "el": t = "el-GR"; i = "Male"; r = "el-GR-Stefanos"; break;
        case "en": t = "en-US"; i = "Female"; r = "en-US-JessaRUS"; break;
        case "es": t = "es-ES"; i = "Female"; r = "es-ES-Laura-Apollo"; break;
        case "fi": t = "fi-FI"; i = "Female"; r = "fi-FI-HeidiRUS"; break;
        case "fr": t = "fr-FR"; i = "Female"; r = "fr-FR-Julie-Apollo"; break;
        case "he": t = "he-IL"; i = "Male"; r = "he-IL-Asaf"; break;
        case "hi": t = "hi-IN"; i = "Female"; r = "hi-IN-Kalpana-Apollo"; break;
        case "hr": t = "hr-HR"; i = "Male"; r = "hr-HR-Matej"; break;
        case "hu": t = "hu-HU"; i = "Male"; r = "hu-HU-Szabolcs"; break;
        case "id": t = "id-ID"; i = "Male"; r = "id-ID-Andika"; break;
        case "it": t = "it-IT"; i = "Male"; r = "it-IT-Cosimo-Apollo"; break;
        case "ja": t = "ja-JP"; i = "Female"; r = "ja-JP-Ayumi-Apollo"; break;
        case "ko": t = "ko-KR"; i = "Female"; r = "ko-KR-HeamiRUS"; break;
        case "ms": t = "ms-MY"; i = "Male"; r = "ms-MY-Rizwan"; break;
        case "nl": t = "nl-NL"; i = "Female"; r = "nl-NL-HannaRUS"; break;
        case "nb": t = "nb-NO"; i = "Female"; r = "nb-NO-HuldaRUS"; break;
        case "no": t = "nb-NO"; i = "Female"; r = "nb-NO-HuldaRUS"; break;
        case "pl": t = "pl-PL"; i = "Female"; r = "pl-PL-PaulinaRUS"; break;
        case "pt": t = "pt-PT"; i = "Female"; r = "pt-PT-HeliaRUS"; break;
        case "pt-pt": t = "pt-PT"; i = "Female"; r = "pt-PT-HeliaRUS"; break;
        case "ro": t = "ro-RO"; i = "Male"; r = "ro-RO-Andrei"; break;
        case "ru": t = "ru-RU"; i = "Female"; r = "ru-RU-Irina-Apollo"; break;
        case "sk": t = "sk-SK"; i = "Male"; r = "sk-SK-Filip"; break;
        case "sl": t = "sl-SL"; i = "Male"; r = "sl-SI-Lado"; break;
        case "sv": t = "sv-SE"; i = "Female"; r = "sv-SE-HedvigRUS"; break;
        case "ta": t = "ta-IN"; i = "Female"; r = "ta-IN-Valluvar"; break;
        case "te": t = "te-IN"; i = "Male"; r = "te-IN-Chitra"; break;
        case "th": t = "th-TH"; i = "Male"; r = "th-TH-Pattara"; break;
        case "tr": t = "tr-TR"; i = "Female"; r = "tr-TR-SedaRUS"; break;
        case "vi": t = "vi-VN"; i = "Male"; r = "vi-VN-An"; break;
        case "zh-Hans": t = "zh-CN"; i = "Female"; r = "zh-CN-HuihuiRUS"; break;
        case "zh-Hant": t = "zh-CN"; i = "Female"; r = "zh-CN-HuihuiRUS"; break;
        case "yue": t = "zh-HK"; i = "Female"; r = "zh-HK-TracyRUS"; break;
        default: break;
    };

    return { lang: t, gender: i, name: r };
};