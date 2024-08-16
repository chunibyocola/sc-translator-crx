import { getError } from '../utils';
import { detect } from './detect';
import { LANGUAGE_NOT_SOPPORTED, RESULT_ERROR } from '../error-codes';
import { AudioParams } from '../translate-types';
import { getTranslateParams } from './get-params';
import { fetchBing } from './fetch-bing';
import { bingSupportedLangCodes } from '../../../constants/langCode';
import { switchToBingLangCode } from './switch-lang-code';

export const audio = async ({ text, from = '', com = true }: AudioParams) => {
    if (!bingSupportedLangCodes.has(from)) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    from = switchToBingLangCode(from || await detect({ text, com }));

    const { IG, richIID, token, key } = await getTranslateParams(com);

    const url = `https://${com ? 'www' : 'cn'}.bing.com/tfettts?isVertical=1&&IG=${IG}&IID=${richIID}`;

    const [lang, gender, name] = getXMLParams(from);

    if (!lang) { throw getError(LANGUAGE_NOT_SOPPORTED); }

    const rawXML = `<speak version='1.0' xml:lang='${lang}'><voice xml:lang='${lang}' xml:gender='${gender}' name='${name}'><prosody rate='-20.00%'>${text}`
        + `</prosody></voice></speak>`;

    const searchParams = new URLSearchParams();
    searchParams.append('token', token);
    searchParams.append('key', key.toString());

    const res = await fetchBing(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        body: `&ssml=${rawXML}&` + searchParams.toString()
    });

    try {
        const data = await res.blob();

        const dataURL: string = await new Promise((resolve) => {
            const reader = new FileReader();
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

const getXMLParams = (code: string) => {
    switch (code) {
        case 'af': return ['af-ZA', 'Female', 'af-ZA-AdriNeural'];
        case 'am': return ['am-ET', 'Female', 'am-ET-MekdesNeural'];
        case 'ar': return ['ar-SA', 'Male', 'ar-SA-HamedNeural'];
        case 'ar-EG': return ['ar-EG', 'Male', 'ar-EG-ShakirNeural'];
        case 'bn': return ['bn-IN', 'Female', 'bn-IN-TanishaaNeural'];
        case 'bg': return ['bg-BG', 'Male', 'bg-BG-BorislavNeural'];
        case 'ca': return ['ca-ES', 'Female', 'ca-ES-JoanaNeural'];
        case 'cs': return ['cs-CZ', 'Male', 'cs-CZ-AntoninNeural'];
        case 'cy': return ['cy-GB', 'Female', 'cy-GB-NiaNeural'];
        case 'da': return ['da-DK', 'Female', 'da-DK-ChristelNeural'];
        case 'de': return ['de-DE', 'Female', 'de-DE-KatjaNeural'];
        case 'el': return ['el-GR', 'Male', 'el-GR-NestorasNeural'];
        case 'en': return ['en-US', 'Female', 'en-US-AriaNeural'];
        case 'en-GB': return ['en-GB', 'Female', 'en-GB-SoniaNeural'];
        case 'es': return ['es-ES', 'Female', 'es-ES-ElviraNeural'];
        case 'es-MX': return ['es-MX', 'Female', 'es-MX-DaliaNeural'];
        case 'et': return ['et-EE', 'Female', 'et-EE-AnuNeural'];
        case 'fa': return ['fa-IR', 'Female', 'fa-IR-DilaraNeural'];
        case 'fi': return ['fi-FI', 'Female', 'fi-FI-NooraNeural'];
        case 'fr': return ['fr-FR', 'Female', 'fr-FR-DeniseNeural'];
        case 'fr-CA': return ['fr-CA', 'Female', 'fr-CA-SylvieNeural'];
        case 'ga': return ['ga-IE', 'Female', 'ga-IE-OrlaNeural'];
        case 'gu': return ['gu-IN', 'Female', 'gu-IN-DhwaniNeural'];
        case 'he': return ['he-IL', 'Male', 'he-IL-AvriNeural'];
        case 'hi': return ['hi-IN', 'Female', 'hi-IN-SwaraNeural'];
        case 'hr': return ['hr-HR', 'Male', 'hr-HR-SreckoNeural'];
        case 'hu': return ['hu-HU', 'Male', 'hu-HU-TamasNeural'];
        case 'id': return ['id-ID', 'Male', 'id-ID-ArdiNeural'];
        case 'is': return ['is-IS', 'Female', 'is-IS-GudrunNeural'];
        case 'it': return ['it-IT', 'Male', 'it-IT-DiegoNeural'];
        case 'ja': return ['ja-JP', 'Female', 'ja-JP-NanamiNeural'];
        case 'kk': return ['kk-KZ', 'Female', 'kk-KZ-AigulNeural'];
        case 'km': return ['km-KH', 'Female', 'km-KH-SreymomNeural'];
        case 'kn': return ['kn-IN', 'Female', 'kn-IN-SapnaNeural'];
        case 'ko': return ['ko-KR', 'Female', 'ko-KR-SunHiNeural'];
        case 'lo': return ['lo-LA', 'Female', 'lo-LA-KeomanyNeural'];
        case 'lv': return ['lv-LV', 'Female', 'lv-LV-EveritaNeural'];
        case 'lt': return ['lt-LT', 'Female', 'lt-LT-OnaNeural'];
        case 'mk': return ['mk-MK', 'Female', 'mk-MK-MarijaNeural'];
        case 'ml': return ['ml-IN', 'Female', 'ml-IN-SobhanaNeural'];
        case 'mr': return ['mr-IN', 'Female', 'mr-IN-AarohiNeural'];
        case 'ms': return ['ms-MY', 'Male', 'ms-MY-OsmanNeural'];
        case 'mt': return ['mt-MT', 'Female', 'mt-MT-GraceNeural'];
        case 'my': return ['my-MM', 'Female', 'my-MM-NilarNeural'];
        case 'nl': return ['nl-NL', 'Female', 'nl-NL-ColetteNeural'];
        case 'nb': return ['nb-NO', 'Female', 'nb-NO-PernilleNeural'];
        case 'pl': return ['pl-PL', 'Female', 'pl-PL-ZofiaNeural'];
        case 'ps': return ['ps-AF', 'Female', 'ps-AF-LatifaNeural'];
        case 'pt': return ['pt-BR', 'Female', 'pt-BR-FranciscaNeural'];
        case 'pt-PT': return ['pt-PT', 'Female', 'pt-PT-FernandaNeural'];
        case 'ro': return ['ro-RO', 'Male', 'ro-RO-EmilNeural'];
        case 'ru': return ['ru-RU', 'Female', 'ru-RU-DariyaNeural'];
        case 'sk': return ['sk-SK', 'Male', 'sk-SK-LukasNeural'];
        case 'sl': return ['sl-SI', 'Male', 'sl-SI-RokNeural'];
        case 'sr-Cyrl': return ['sr-RS', 'Female', 'sr-RS-SophieNeural'];
        case 'sv': return ['sv-SE', 'Female', 'sv-SE-SofieNeural'];
        case 'ta': return ['ta-IN', 'Female', 'ta-IN-PallaviNeural'];
        case 'te': return ['te-IN', 'Male', 'te-IN-ShrutiNeural'];
        case 'th': return ['th-TH', 'Male', 'th-TH-NiwatNeural'];
        case 'tr': return ['tr-TR', 'Female', 'tr-TR-EmelNeural'];
        case 'uk': return ['uk-UA', 'Female', 'uk-UA-PolinaNeural'];
        case 'ur': return ['ur-IN', 'Female', 'ur-IN-GulNeural'];
        case 'uz': return ['uz-UZ', 'Female', 'uz-UZ-MadinaNeural'];
        case 'vi': return ['vi-VN', 'Male', 'vi-VN-NamMinhNeural'];
        case 'zh-Hans': return ['zh-CN', 'Female', 'zh-CN-XiaoxiaoNeural'];
        case 'zh-Hant': return ['zh-CN', 'Female', 'zh-CN-XiaoxiaoNeural'];
        case 'yue': return ['zh-HK', 'Female', 'zh-HK-HiuGaaiNeural'];
        default: return ['', '', ''];
    }
};