import {
    GOOGLE_COM,
    BING_COM,
    MOJIDICT_COM
} from './translateSource';

export const LANG_ZH_CN = 'zh-CN';
export const LANG_JA = 'ja';
export const LANG_EN = 'en';

export type LangCodes = { code: string; name: string; }[];
export type LocaleLangCodes = {
    [key: string]: LangCodes;
}
type SourceLocaleLangCodes = {
    [key: string]: LocaleLangCodes;
};

export const langCodeI18n = Object.entries({
    '': { 'en': 'auto', 'ja': '自動選択', 'zh-CN': '自动选择' },
    'af': { 'en': 'Afrikaans', 'ja': 'アフリカーンス語', 'zh-CN': '布尔语(南非荷兰语)' },
    'sq': { 'en': 'Albanian', 'ja': 'アルバニア語', 'zh-CN': '阿尔巴尼亚语' },
    'am': { 'en': 'Amharic', 'ja': 'アムハラ語', 'zh-CN': '阿姆哈拉语' },
    'ar': { 'en': 'Arabic', 'ja': 'アラビア語', 'zh-CN': '阿拉伯语' },
    'hy': { 'en': 'Armenian', 'ja': 'アルメニア語', 'zh-CN': '亚美尼亚语' },
    'az': { 'en': 'Azerbaijani', 'ja': 'アゼルバイジャン語', 'zh-CN': '阿塞拜疆语' },
    'eu': { 'en': 'Basque', 'ja': 'バスク語', 'zh-CN': '巴斯克语' },
    'be': { 'en': 'Belarusian', 'ja': 'ベラルーシ語', 'zh-CN': '白俄罗斯语' },
    'bn': { 'en': 'Bengali', 'ja': 'ベンガル語', 'zh-CN': '孟加拉语' },
    'bs': { 'en': 'Bosnian', 'ja': 'ボスニア語', 'zh-CN': '波斯尼亚语' },
    'bg': { 'en': 'Bulgarian', 'ja': 'ブルガリア語', 'zh-CN': '保加利亚语' },
    'yue': { 'en': 'Cantonese', 'ja': '広東語', 'zh-CN': '粤语' },
    'ca': { 'en': 'Catalan', 'ja': 'カタルーニャ語', 'zh-CN': '加泰罗尼亚语' },
    'ceb': { 'en': 'Cebuano', 'ja': 'セブアノ語', 'zh-CN': '宿务语' },
    'ny': { 'en': 'Chichewa', 'ja': 'チェワ語', 'zh-CN': '齐切瓦语' },
    'zh-CN': { 'en': 'Chinese (Simplified)', 'ja': '中国語（簡体）', 'zh-CN': '中文（简体）' },
    'zh-TW': { 'en': 'Chinese (Traditional)', 'ja': '中国語（繁体）', 'zh-CN': '中文（繁体）' },
    'co': { 'en': 'Corsican', 'ja': 'コルシカ語', 'zh-CN': '科西嘉语' },
    'hr': { 'en': 'Croatian', 'ja': 'クロアチア語', 'zh-CN': '克罗地亚语' },
    'cs': { 'en': 'Czech', 'ja': 'チェコ語', 'zh-CN': '捷克语' },
    'da': { 'en': 'Danish', 'ja': 'デンマーク語', 'zh-CN': '丹麦语' },
    'nl': { 'en': 'Dutch', 'ja': 'オランダ語', 'zh-CN': '荷兰语' },
    'en': { 'en': 'English', 'ja': '英語', 'zh-CN': '英语' },
    'eo': { 'en': 'Esperanto', 'ja': 'エスペラント語', 'zh-CN': '世界语' },
    'et': { 'en': 'Estonian', 'ja': 'エストニア語', 'zh-CN': '爱沙尼亚语' },
    'fj': { 'en': 'Fijian', 'ja': 'フィジー語', 'zh-CN': '斐济语' },
    'tl': { 'en': 'Filipino', 'ja': 'タガログ語', 'zh-CN': '菲律宾语' },
    'fi': { 'en': 'Finnish', 'ja': 'フィンランド語', 'zh-CN': '芬兰语' },
    'fr': { 'en': 'French', 'ja': 'フランス語', 'zh-CN': '法语' },
    'fy': { 'en': 'Frisian', 'ja': 'フリジア語', 'zh-CN': '弗里西语' },
    'gl': { 'en': 'Galician', 'ja': 'ガリシア語', 'zh-CN': '加利西亚语' },
    'ka': { 'en': 'Georgian', 'ja': 'ジョージア（グルジア）語', 'zh-CN': '格鲁吉亚语' },
    'de': { 'en': 'German', 'ja': 'ドイツ語', 'zh-CN': '德语' },
    'el': { 'en': 'Greek', 'ja': 'ギリシャ語', 'zh-CN': '希腊语' },
    'gu': { 'en': 'Gujarati', 'ja': 'グジャラト語', 'zh-CN': '古吉拉特语' },
    'ht': { 'en': 'Haitian Creole', 'ja': 'ハイチ語', 'zh-CN': '海地克里奥尔语' },
    'ha': { 'en': 'Hausa', 'ja': 'ハウサ語', 'zh-CN': '豪萨语' },
    'haw': { 'en': 'Hawaiian', 'ja': 'ハワイ語', 'zh-CN': '夏威夷语' },
    'iw': { 'en': 'Hebrew', 'ja': 'ヘブライ語', 'zh-CN': '希伯来语' },
    'hi': { 'en': 'Hindi', 'ja': 'ヒンディー語', 'zh-CN': '印地语' },
    'hmn': { 'en': 'Hmong', 'ja': 'モン語', 'zh-CN': '苗语' },
    'hu': { 'en': 'Hungarian', 'ja': 'ハンガリー語', 'zh-CN': '匈牙利语' },
    'is': { 'en': 'Icelandic', 'ja': 'アイスランド語', 'zh-CN': '冰岛语' },
    'ig': { 'en': 'Igbo', 'ja': 'イボ語', 'zh-CN': '伊博语' },
    'id': { 'en': 'Indonesian', 'ja': 'インドネシア語', 'zh-CN': '印尼语' },
    'ga': { 'en': 'Irish', 'ja': 'アイルランド語', 'zh-CN': '爱尔兰语' },
    'it': { 'en': 'Italian', 'ja': 'イタリア語', 'zh-CN': '意大利语' },
    'ja': { 'en': 'Japanese', 'ja': '日本語', 'zh-CN': '日语' },
    'jw': { 'en': 'Javanese', 'ja': 'ジャワ語', 'zh-CN': '印尼爪哇语' },
    'kn': { 'en': 'Kannada', 'ja': 'カンナダ語', 'zh-CN': '卡纳达语' },
    'kk': { 'en': 'Kazakh', 'ja': 'カザフ語', 'zh-CN': '哈萨克语' },
    'km': { 'en': 'Khmer', 'ja': 'クメール語', 'zh-CN': '高棉语' },
    'rw': { 'en': 'Kinyarwanda', 'ja': 'キニヤルワンダ語', 'zh-CN': '卢旺达语' },
    'ko': { 'en': 'Korean', 'ja': '韓国語', 'zh-CN': '韩语' },
    'ku': { 'en': 'Kurdish (Kurmanji)', 'ja': 'クルド語', 'zh-CN': '库尔德语' },
    'ky': { 'en': 'Kyrgyz', 'ja': 'キルギス語', 'zh-CN': '吉尔吉斯语' },
    'lo': { 'en': 'Lao', 'ja': 'ラオ語', 'zh-CN': '老挝语' },
    'la': { 'en': 'Latin', 'ja': 'ラテン語', 'zh-CN': '拉丁语' },
    'lv': { 'en': 'Latvian', 'ja': 'ラトビア語', 'zh-CN': '拉脱维亚语' },
    'lt': { 'en': 'Lithuanian', 'ja': 'リトアニア語', 'zh-CN': '立陶宛语' },
    'lb': { 'en': 'Luxembourgish', 'ja': 'ルクセンブルク語', 'zh-CN': '卢森堡语' },
    'mk': { 'en': 'Macedonian', 'ja': 'マケドニア語', 'zh-CN': '马其顿语' },
    'mg': { 'en': 'Malagasy', 'ja': 'マラガシ語', 'zh-CN': '马尔加什语' },
    'ms': { 'en': 'Malay', 'ja': 'マレー語', 'zh-CN': '马来语' },
    'ml': { 'en': 'Malayalam', 'ja': 'マラヤーラム語', 'zh-CN': '马拉雅拉姆语' },
    'mt': { 'en': 'Maltese', 'ja': 'マルタ語', 'zh-CN': '马耳他语' },
    'mi': { 'en': 'Maori', 'ja': 'マオリ語', 'zh-CN': '毛利语' },
    'mr': { 'en': 'Marathi', 'ja': 'マラーティー語', 'zh-CN': '马拉地语' },
    'mn': { 'en': 'Mongolian', 'ja': 'モンゴル語', 'zh-CN': '蒙古语' },
    'my': { 'en': 'Myanmar (Burmese)', 'ja': 'ミャンマー語', 'zh-CN': '缅甸语' },
    'ne': { 'en': 'Nepali', 'ja': 'ネパール語', 'zh-CN': '尼泊尔语' },
    'no': { 'en': 'Norwegian', 'ja': 'ノルウェー語', 'zh-CN': '挪威语' },
    'or': { 'en': 'Odia (Oriya)', 'ja': 'オリヤ語', 'zh-CN': '奥里亚语（奥里亚文）' },
    'ps': { 'en': 'Pashto', 'ja': 'パシュト語', 'zh-CN': '普什图语' },
    'fa': { 'en': 'Persian', 'ja': 'ペルシャ語', 'zh-CN': '波斯语' },
    'pl': { 'en': 'Polish', 'ja': 'ポーランド語', 'zh-CN': '波兰语' },
    'pt': { 'en': 'Portuguese (Brazil)', 'ja': 'ポルトガル語（ブラジル）', 'zh-CN': '葡萄牙语（巴西）' },
    'pt-PT': { 'en': 'Portuguese (Portugal)', 'ja': 'ポルトガル語（ポルトガル）', 'zh-CN': '葡萄牙语（葡萄牙）' },
    'pa': { 'en': 'Punjabi', 'ja': 'パンジャブ語', 'zh-CN': '旁遮普语' },
    'ro': { 'en': 'Romanian', 'ja': 'ルーマニア語', 'zh-CN': '罗马尼亚语' },
    'ru': { 'en': 'Russian', 'ja': 'ロシア語', 'zh-CN': '俄语' },
    'sm': { 'en': 'Samoan', 'ja': 'サモア語', 'zh-CN': '萨摩亚语' },
    'gd': { 'en': 'Scots Gaelic', 'ja': 'スコットランド ゲール語', 'zh-CN': '苏格兰盖尔语' },
    'sr': { 'en': 'Serbian', 'ja': 'セルビア語', 'zh-CN': '塞尔维亚语' },
    'st': { 'en': 'Sesotho', 'ja': 'ソト語', 'zh-CN': '塞索托语' },
    'sn': { 'en': 'Shona', 'ja': 'ショナ語', 'zh-CN': '修纳语' },
    'sd': { 'en': 'Sindhi', 'ja': 'シンド語', 'zh-CN': '信德语' },
    'si': { 'en': 'Sinhala', 'ja': 'シンハラ語', 'zh-CN': '僧伽罗语' },
    'sk': { 'en': 'Slovak', 'ja': 'スロバキア語', 'zh-CN': '斯洛伐克语' },
    'sl': { 'en': 'Slovenian', 'ja': 'スロベニア語', 'zh-CN': '斯洛文尼亚语' },
    'so': { 'en': 'Somali', 'ja': 'ソマリ語', 'zh-CN': '索马里语' },
    'es': { 'en': 'Spanish', 'ja': 'スペイン語', 'zh-CN': '西班牙语' },
    'su': { 'en': 'Sundanese', 'ja': 'スンダ語', 'zh-CN': '印尼巽他语' },
    'sw': { 'en': 'Swahili', 'ja': 'スワヒリ語', 'zh-CN': '斯瓦希里语' },
    'sv': { 'en': 'Swedish', 'ja': 'スウェーデン語', 'zh-CN': '瑞典语' },
    'ty': { 'en': 'Tahitian', 'ja': 'タヒチアン語', 'zh-CN': '塔希提语' },
    'tg': { 'en': 'Tajik', 'ja': 'タジク語', 'zh-CN': '塔吉克语' },
    'ta': { 'en': 'Tamil', 'ja': 'タミル語', 'zh-CN': '泰米尔语' },
    'tt': { 'en': 'Tatar', 'ja': 'タタール語', 'zh-CN': '鞑靼语' },
    'te': { 'en': 'Telugu', 'ja': 'テルグ語', 'zh-CN': '泰卢固语' },
    'th': { 'en': 'Thai', 'ja': 'タイ語', 'zh-CN': '泰语' },
    'to': { 'en': 'Tongan', 'ja': 'トンガ語', 'zh-CN': '汤加语' },
    'tr': { 'en': 'Turkish', 'ja': 'トルコ語', 'zh-CN': '土耳其语' },
    'tk': { 'en': 'Turkmen', 'ja': 'トルクメン語', 'zh-CN': '土库曼语' },
    'uk': { 'en': 'Ukrainian', 'ja': 'ウクライナ語', 'zh-CN': '乌克兰语' },
    'ur': { 'en': 'Urdu', 'ja': 'ウルドゥ語', 'zh-CN': '乌尔都语' },
    'ug': { 'en': 'Uyghur', 'ja': 'ウイグル語', 'zh-CN': '维吾尔语' },
    'uz': { 'en': 'Uzbek', 'ja': 'ウズベク語', 'zh-CN': '乌兹别克语' },
    'vi': { 'en': 'Vietnamese', 'ja': 'ベトナム語', 'zh-CN': '越南语' },
    'cy': { 'en': 'Welsh', 'ja': 'ウェールズ語', 'zh-CN': '威尔士语' },
    'xh': { 'en': 'Xhosa', 'ja': 'コーサ語', 'zh-CN': '南非科萨语' },
    'yi': { 'en': 'Yiddish', 'ja': 'イディッシュ語', 'zh-CN': '意第绪语' },
    'yo': { 'en': 'Yoruba', 'ja': 'ヨルバ語', 'zh-CN': '约鲁巴语' },
    'yua': { 'en': 'Yucatec Maya', 'ja': 'ユカテックマヤ語', 'zh-CN': '尤卡特玛雅语' },
    'zu': { 'en': 'Zulu', 'ja': 'ズールー語', 'zh-CN': '南非祖鲁语' }
}).reduce<{ [K: string]: { [O: string]: string; } }>((t, [k, v]) => ({
    'en': { ...t['en'], [k]: v['en'] },
    'ja': { ...t['ja'], [k]: v['ja'] },
    'zh-CN': { ...t['zh-CN'], [k]: v['zh-CN'] }
}), {'en': {}, 'ja': {}, 'zh-CN': {}});

export const userLangs = [
    {code: LANG_ZH_CN, name: '中文(简体)'},
    {code: LANG_JA, name: '日本語'},
    {code: LANG_EN, name: 'English'}
];

export const googleLangCode: LocaleLangCodes = {
    [LANG_EN]: [{code:'',name:'auto'},{code:'af',name:'Afrikaans'},{code:'sq',name:'Albanian'},{code:'am',name:'Amharic'},{code:'ar',name:'Arabic'},{code:'hy',name:'Armenian'},{code:'az',name:'Azerbaijani'},{code:'eu',name:'Basque'},{code:'be',name:'Belarusian'},{code:'bn',name:'Bengali'},{code:'bs',name:'Bosnian'},{code:'bg',name:'Bulgarian'},{code:'ca',name:'Catalan'},{code:'ceb',name:'Cebuano'},{code:'ny',name:'Chichewa'},{code:'zh-CN',name:'Chinese (Simplified)'},{code:'zh-TW',name:'Chinese (Traditional)'},{code:'co',name:'Corsican'},{code:'hr',name:'Croatian'},{code:'cs',name:'Czech'},{code:'da',name:'Danish'},{code:'nl',name:'Dutch'},{code:'en',name:'English'},{code:'eo',name:'Esperanto'},{code:'et',name:'Estonian'},{code:'tl',name:'Filipino'},{code:'fi',name:'Finnish'},{code:'fr',name:'French'},{code:'fy',name:'Frisian'},{code:'gl',name:'Galician'},{code:'ka',name:'Georgian'},{code:'de',name:'German'},{code:'el',name:'Greek'},{code:'gu',name:'Gujarati'},{code:'ht',name:'Haitian Creole'},{code:'ha',name:'Hausa'},{code:'haw',name:'Hawaiian'},{code:'iw',name:'Hebrew'},{code:'hi',name:'Hindi'},{code:'hmn',name:'Hmong'},{code:'hu',name:'Hungarian'},{code:'is',name:'Icelandic'},{code:'ig',name:'Igbo'},{code:'id',name:'Indonesian'},{code:'ga',name:'Irish'},{code:'it',name:'Italian'},{code:'ja',name:'Japanese'},{code:'jw',name:'Javanese'},{code:'kn',name:'Kannada'},{code:'kk',name:'Kazakh'},{code:'km',name:'Khmer'},{code:'rw',name:'Kinyarwanda'},{code:'ko',name:'Korean'},{code:'ku',name:'Kurdish (Kurmanji)'},{code:'ky',name:'Kyrgyz'},{code:'lo',name:'Lao'},{code:'la',name:'Latin'},{code:'lv',name:'Latvian'},{code:'lt',name:'Lithuanian'},{code:'lb',name:'Luxembourgish'},{code:'mk',name:'Macedonian'},{code:'mg',name:'Malagasy'},{code:'ms',name:'Malay'},{code:'ml',name:'Malayalam'},{code:'mt',name:'Maltese'},{code:'mi',name:'Maori'},{code:'mr',name:'Marathi'},{code:'mn',name:'Mongolian'},{code:'my',name:'Myanmar (Burmese)'},{code:'ne',name:'Nepali'},{code:'no',name:'Norwegian'},{code:'or',name:'Odia (Oriya)'},{code:'ps',name:'Pashto'},{code:'fa',name:'Persian'},{code:'pl',name:'Polish'},{code:'pt',name:'Portuguese'},{code:'pa',name:'Punjabi'},{code:'ro',name:'Romanian'},{code:'ru',name:'Russian'},{code:'sm',name:'Samoan'},{code:'gd',name:'Scots Gaelic'},{code:'sr',name:'Serbian'},{code:'st',name:'Sesotho'},{code:'sn',name:'Shona'},{code:'sd',name:'Sindhi'},{code:'si',name:'Sinhala'},{code:'sk',name:'Slovak'},{code:'sl',name:'Slovenian'},{code:'so',name:'Somali'},{code:'es',name:'Spanish'},{code:'su',name:'Sundanese'},{code:'sw',name:'Swahili'},{code:'sv',name:'Swedish'},{code:'tg',name:'Tajik'},{code:'ta',name:'Tamil'},{code:'tt',name:'Tatar'},{code:'te',name:'Telugu'},{code:'th',name:'Thai'},{code:'tr',name:'Turkish'},{code:'tk',name:'Turkmen'},{code:'uk',name:'Ukrainian'},{code:'ur',name:'Urdu'},{code:'ug',name:'Uyghur'},{code:'uz',name:'Uzbek'},{code:'vi',name:'Vietnamese'},{code:'cy',name:'Welsh'},{code:'xh',name:'Xhosa'},{code:'yi',name:'Yiddish'},{code:'yo',name:'Yoruba'},{code:'zu',name:'Zulu'}],
    [LANG_ZH_CN]: [{code:'',name:'自动选择'},{code:'zh-CN',name:'中文（简体）'},{code:'zh-TW',name:'中文（繁体）'},{code:'en',name:'英语'},{code:'ja',name:'日语'},{code:'ko',name:'韩语'},{code:'sq',name:'阿尔巴尼亚语'},{code:'ar',name:'阿拉伯语'},{code:'am',name:'阿姆哈拉语'},{code:'az',name:'阿塞拜疆语'},{code:'ga',name:'爱尔兰语'},{code:'et',name:'爱沙尼亚语'},{code:'or',name:'奥里亚语（奥里亚文）'},{code:'eu',name:'巴斯克语'},{code:'be',name:'白俄罗斯语'},{code:'bg',name:'保加利亚语'},{code:'is',name:'冰岛语'},{code:'pl',name:'波兰语'},{code:'bs',name:'波斯尼亚语'},{code:'fa',name:'波斯语'},{code:'af',name:'布尔语(南非荷兰语)'},{code:'tt',name:'鞑靼语'},{code:'da',name:'丹麦语'},{code:'de',name:'德语'},{code:'ru',name:'俄语'},{code:'fr',name:'法语'},{code:'tl',name:'菲律宾语'},{code:'fi',name:'芬兰语'},{code:'fy',name:'弗里西语'},{code:'km',name:'高棉语'},{code:'ka',name:'格鲁吉亚语'},{code:'gu',name:'古吉拉特语'},{code:'kk',name:'哈萨克语'},{code:'ht',name:'海地克里奥尔语'},{code:'ha',name:'豪萨语'},{code:'nl',name:'荷兰语'},{code:'ky',name:'吉尔吉斯语'},{code:'gl',name:'加利西亚语'},{code:'ca',name:'加泰罗尼亚语'},{code:'cs',name:'捷克语'},{code:'kn',name:'卡纳达语'},{code:'co',name:'科西嘉语'},{code:'hr',name:'克罗地亚语'},{code:'ku',name:'库尔德语'},{code:'la',name:'拉丁语'},{code:'lv',name:'拉脱维亚语'},{code:'lo',name:'老挝语'},{code:'lt',name:'立陶宛语'},{code:'lb',name:'卢森堡语'},{code:'rw',name:'卢旺达语'},{code:'ro',name:'罗马尼亚语'},{code:'mg',name:'马尔加什语'},{code:'mt',name:'马耳他语'},{code:'mr',name:'马拉地语'},{code:'ml',name:'马拉雅拉姆语'},{code:'ms',name:'马来语'},{code:'mk',name:'马其顿语'},{code:'mi',name:'毛利语'},{code:'mn',name:'蒙古语'},{code:'bn',name:'孟加拉语'},{code:'my',name:'缅甸语'},{code:'hmn',name:'苗语'},{code:'xh',name:'南非科萨语'},{code:'zu',name:'南非祖鲁语'},{code:'ne',name:'尼泊尔语'},{code:'no',name:'挪威语'},{code:'pa',name:'旁遮普语'},{code:'pt',name:'葡萄牙语'},{code:'ps',name:'普什图语'},{code:'ny',name:'齐切瓦语'},{code:'sv',name:'瑞典语'},{code:'sm',name:'萨摩亚语'},{code:'sr',name:'塞尔维亚语'},{code:'st',name:'塞索托语'},{code:'si',name:'僧伽罗语'},{code:'eo',name:'世界语'},{code:'sk',name:'斯洛伐克语'},{code:'sl',name:'斯洛文尼亚语'},{code:'sw',name:'斯瓦希里语'},{code:'gd',name:'苏格兰盖尔语'},{code:'ceb',name:'宿务语'},{code:'so',name:'索马里语'},{code:'tg',name:'塔吉克语'},{code:'te',name:'泰卢固语'},{code:'ta',name:'泰米尔语'},{code:'th',name:'泰语'},{code:'tr',name:'土耳其语'},{code:'tk',name:'土库曼语'},{code:'cy',name:'威尔士语'},{code:'ug',name:'维吾尔语'},{code:'ur',name:'乌尔都语'},{code:'uk',name:'乌克兰语'},{code:'uz',name:'乌兹别克语'},{code:'es',name:'西班牙语'},{code:'iw',name:'希伯来语'},{code:'el',name:'希腊语'},{code:'haw',name:'夏威夷语'},{code:'sd',name:'信德语'},{code:'hu',name:'匈牙利语'},{code:'sn',name:'修纳语'},{code:'hy',name:'亚美尼亚语'},{code:'ig',name:'伊博语'},{code:'it',name:'意大利语'},{code:'yi',name:'意第绪语'},{code:'hi',name:'印地语'},{code:'su',name:'印尼巽他语'},{code:'id',name:'印尼语'},{code:'jw',name:'印尼爪哇语'},{code:'yo',name:'约鲁巴语'},{code:'vi',name:'越南语'}],
    [LANG_JA]: [{code:'',name:'自動選択'},{code:'en',name:'英語'},{code:'ko',name:'韓国語'},{code:'zh-CN',name:'中国語（簡体）'},{code:'zh-TW',name:'中国語（繁体）'},{code:'ja',name:'日本語'},{code:'is',name:'アイスランド語'},{code:'ga',name:'アイルランド語'},{code:'az',name:'アゼルバイジャン語'},{code:'af',name:'アフリカーンス語'},{code:'am',name:'アムハラ語'},{code:'ar',name:'アラビア語'},{code:'sq',name:'アルバニア語'},{code:'hy',name:'アルメニア語'},{code:'it',name:'イタリア語'},{code:'yi',name:'イディッシュ語'},{code:'ig',name:'イボ語'},{code:'id',name:'インドネシア語'},{code:'ug',name:'ウイグル語'},{code:'cy',name:'ウェールズ語'},{code:'uk',name:'ウクライナ語'},{code:'uz',name:'ウズベク語'},{code:'ur',name:'ウルドゥ語'},{code:'et',name:'エストニア語'},{code:'eo',name:'エスペラント語'},{code:'nl',name:'オランダ語'},{code:'or',name:'オリヤ語'},{code:'kk',name:'カザフ語'},{code:'ca',name:'カタルーニャ語'},{code:'gl',name:'ガリシア語'},{code:'kn',name:'カンナダ語'},{code:'rw',name:'キニヤルワンダ語'},{code:'el',name:'ギリシャ語'},{code:'ky',name:'キルギス語'},{code:'gu',name:'グジャラト語'},{code:'km',name:'クメール語'},{code:'ku',name:'クルド語'},{code:'hr',name:'クロアチア語'},{code:'xh',name:'コーサ語'},{code:'co',name:'コルシカ語'},{code:'sm',name:'サモア語'},{code:'jw',name:'ジャワ語'},{code:'ka',name:'ジョージア（グルジア）語'},{code:'sn',name:'ショナ語'},{code:'sd',name:'シンド語'},{code:'si',name:'シンハラ語'},{code:'sv',name:'スウェーデン語'},{code:'zu',name:'ズールー語'},{code:'gd',name:'スコットランド ゲール語'},{code:'es',name:'スペイン語'},{code:'sk',name:'スロバキア語'},{code:'sl',name:'スロベニア語'},{code:'sw',name:'スワヒリ語'},{code:'su',name:'スンダ語'},{code:'ceb',name:'セブアノ語'},{code:'sr',name:'セルビア語'},{code:'st',name:'ソト語'},{code:'so',name:'ソマリ語'},{code:'th',name:'タイ語'},{code:'tl',name:'タガログ語'},{code:'tg',name:'タジク語'},{code:'tt',name:'タタール語'},{code:'ta',name:'タミル語'},{code:'cs',name:'チェコ語'},{code:'ny',name:'チェワ語'},{code:'te',name:'テルグ語'},{code:'da',name:'デンマーク語'},{code:'de',name:'ドイツ語'},{code:'tk',name:'トルクメン語'},{code:'tr',name:'トルコ語'},{code:'ne',name:'ネパール語'},{code:'no',name:'ノルウェー語'},{code:'ht',name:'ハイチ語'},{code:'ha',name:'ハウサ語'},{code:'ps',name:'パシュト語'},{code:'eu',name:'バスク語'},{code:'haw',name:'ハワイ語'},{code:'hu',name:'ハンガリー語'},{code:'pa',name:'パンジャブ語'},{code:'hi',name:'ヒンディー語'},{code:'fi',name:'フィンランド語'},{code:'fr',name:'フランス語'},{code:'fy',name:'フリジア語'},{code:'bg',name:'ブルガリア語'},{code:'vi',name:'ベトナム語'},{code:'iw',name:'ヘブライ語'},{code:'be',name:'ベラルーシ語'},{code:'fa',name:'ペルシャ語'},{code:'bn',name:'ベンガル語'},{code:'pl',name:'ポーランド語'},{code:'bs',name:'ボスニア語'},{code:'pt',name:'ポルトガル語'},{code:'mi',name:'マオリ語'},{code:'mk',name:'マケドニア語'},{code:'mr',name:'マラーティー語'},{code:'mg',name:'マラガシ語'},{code:'ml',name:'マラヤーラム語'},{code:'mt',name:'マルタ語'},{code:'ms',name:'マレー語'},{code:'my',name:'ミャンマー語'},{code:'mn',name:'モンゴル語'},{code:'hmn',name:'モン語'},{code:'yo',name:'ヨルバ語'},{code:'lo',name:'ラオ語'},{code:'la',name:'ラテン語'},{code:'lv',name:'ラトビア語'},{code:'lt',name:'リトアニア語'},{code:'ro',name:'ルーマニア語'},{code:'lb',name:'ルクセンブルク語'},{code:'ru',name:'ロシア語'}]
};

export const googleSupportedLangCodes = new Set(['','af','sq','am','ar','hy','az','eu','be','bn','bs','bg','ca','ceb','ny','zh-CN','zh-TW','co','hr','cs','da','nl','en','eo','et','tl','fi','fr','fy','gl','ka','de','el','gu','ht','ha','haw','iw','hi','hmn','hu','is','ig','id','ga','it','ja','jw','kn','kk','km','rw','ko','ku','ky','lo','la','lv','lt','lb','mk','mg','ms','ml','mt','mi','mr','mn','my','ne','no','or','ps','fa','pl','pt','pa','ro','ru','sm','gd','sr','st','sn','sd','si','sk','sl','so','es','su','sw','sv','tg','ta','tt','te','th','tr','tk','uk','ur','ug','uz','vi','cy','xh','yi','yo','zu']);

export const bingLangCode: LocaleLangCodes = {
    [LANG_EN]: [{code:'',name:'auto'},{code:'af',name:'Afrikaans'},{code:'ar',name:'Arabic'},{code:'bn',name:'Bangla'},{code:'bs',name:'Bosnian (Latin)'},{code:'bg',name:'Bulgarian'},{code:'yue',name:'Cantonese (Traditional)'},{code:'ca',name:'Catalan'},{code:'zh-CN',name:'Chinese Simplified'},{code:'zh-TW',name:'Chinese Traditional'},{code:'hr',name:'Croatian'},{code:'cs',name:'Czech'},{code:'da',name:'Danish'},{code:'nl',name:'Dutch'},{code:'en',name:'English'},{code:'et',name:'Estonian'},{code:'fj',name:'Fijian'},{code:'tl',name:'Filipino'},{code:'fi',name:'Finnish'},{code:'fr',name:'French'},{code:'de',name:'German'},{code:'el',name:'Greek'},{code:'gu',name:'Gujarati'},{code:'ht',name:'Haitian Creole'},{code:'iw',name:'Hebrew'},{code:'hi',name:'Hindi'},{code:'hmn',name:'Hmong Daw'},{code:'hu',name:'Hungarian'},{code:'is',name:'Icelandic'},{code:'id',name:'Indonesian'},{code:'ga',name:'Irish'},{code:'it',name:'Italian'},{code:'ja',name:'Japanese'},{code:'kn',name:'Kannada'},{code:'kk',name:'Kazakh'},{code:'sw',name:'Kiswahili'},{code:'ko',name:'Korean'},{code:'lv',name:'Latvian'},{code:'lt',name:'Lithuanian'},{code:'mg',name:'Malagasy'},{code:'ms',name:'Malay (Latin)'},{code:'ml',name:'Malayalam'},{code:'mt',name:'Maltese'},{code:'mi',name:'Maori'},{code:'mr',name:'Marathi'},{code:'no',name:'Norwegian Bokmål'},{code:'fa',name:'Persian'},{code:'pl',name:'Polish'},{code:'pt',name:'Portuguese (Brazil)'},{code:'pt-PT',name:'Portuguese (Portugal)'},{code:'pa',name:'Punjabi (Gurmukhi)'},{code:'ro',name:'Romanian'},{code:'ru',name:'Russian'},{code:'sm',name:'Samoan'},{code:'sr',name:'Serbian (Cyrillic)'},{code:'sk',name:'Slovak'},{code:'sl',name:'Slovenian'},{code:'es',name:'Spanish'},{code:'sv',name:'Swedish'},{code:'ty',name:'Tahitian'},{code:'ta',name:'Tamil'},{code:'te',name:'Telugu'},{code:'th',name:'Thai'},{code:'to',name:'Tongan'},{code:'tr',name:'Turkish'},{code:'uk',name:'Ukrainian'},{code:'ur',name:'Urdu'},{code:'vi',name:'Vietnamese'},{code:'cy',name:'Welsh'},{code:'yua',name:'Yucatec Maya'}],
    [LANG_ZH_CN]: [{code:'',name:'自动选择'},{code:'en',name:'英语'},{code:'zh-CN',name:'中文（简体）'},{code:'zh-TW',name:'中文（繁体）'},{code:'yue',name:'粤语（繁体）'},{code:'ja',name:'日语'},{code:'ko',name:'韩语'},{code:'af',name:'布尔语(南非荷兰语)'},{code:'ar',name:'阿拉伯语'},{code:'bn',name:'孟加拉语'},{code:'bs',name:'波斯尼亚语 (拉丁)'},{code:'bg',name:'保加利亚语'},{code:'ca',name:'加泰罗尼亚语'},{code:'hr',name:'克罗地亚语'},{code:'cs',name:'捷克语'},{code:'da',name:'丹麦语'},{code:'nl',name:'荷兰语'},{code:'et',name:'爱沙尼亚语'},{code:'fj',name:'斐济语'},{code:'tl',name:'菲律宾语'},{code:'fi',name:'芬兰语'},{code:'fr',name:'法语'},{code:'de',name:'德语'},{code:'el',name:'希腊语'},{code:'gu',name:'古吉拉特语'},{code:'ht',name:'海地克里奥尔语'},{code:'iw',name:'希伯来语'},{code:'hi',name:'印地语'},{code:'hmn',name:'苗语'},{code:'hu',name:'匈牙利语'},{code:'is',name:'冰岛语'},{code:'id',name:'印尼语'},{code:'ga',name:'爱尔兰语'},{code:'it',name:'意大利语'},{code:'kn',name:'卡纳达语'},{code:'kk',name:'哈萨克语'},{code:'sw',name:'斯瓦希里语'},{code:'lv',name:'拉脱维亚语'},{code:'lt',name:'立陶宛语'},{code:'mg',name:'马尔加什语'},{code:'ms',name:'马来语'},{code:'ml',name:'马拉雅拉姆语'},{code:'mt',name:'马耳他语'},{code:'mi',name:'毛利语'},{code:'mr',name:'马拉地语'},{code:'no',name:'挪威语（Bokmål ）'},{code:'fa',name:'波斯语'},{code:'pl',name:'波兰语'},{code:'pt',name:'葡萄牙语'},{code:'pt-PT',name:'葡萄牙语（葡萄牙）'},{code:'pa',name:'旁遮普语'},{code:'ro',name:'罗马尼亚语'},{code:'ru',name:'俄语'},{code:'sm',name:'萨摩亚语'},{code:'sr',name:'塞尔维亚语 （西里尔）'},{code:'sk',name:'斯洛伐克语'},{code:'sl',name:'斯洛文尼亚语'},{code:'es',name:'西班牙语'},{code:'sv',name:'瑞典语'},{code:'ty',name:'塔希提语'},{code:'ta',name:'泰米尔语'},{code:'te',name:'泰卢固语'},{code:'th',name:'泰语'},{code:'to',name:'汤加语'},{code:'tr',name:'土耳其语'},{code:'uk',name:'乌克兰语'},{code:'ur',name:'乌尔都语'},{code:'vi',name:'越南语'},{code:'cy',name:'威尔士语'},{code:'yua',name:'尤卡特玛雅语'}],
    [LANG_JA]: [{code:'',name:'自動選択'},{code:'ja',name:'日本語'},{code:'en',name:'英語'},{code:'zh-CN',name:'中国語（簡体）'},{code:'zh-TW',name:'中国語（繁体）'},{code:'yue',name:'広東語（繁体字）'},{code:'ko',name:'韓国語'},{code:'af',name:'アフリカーンス語'},{code:'ar',name:'アラビア語'},{code:'bn',name:'バングラ語'},{code:'bs',name:'ボスニア語（ラテン）'},{code:'bg',name:'ブルガリア語'},{code:'ca',name:'カタルーニャ語'},{code:'hr',name:'クロアチア語'},{code:'cs',name:'チェコ語'},{code:'da',name:'デンマーク語'},{code:'nl',name:'オランダ語'},{code:'et',name:'エストニア語'},{code:'fj',name:'フィジー語'},{code:'tl',name:'フィリピン語'},{code:'fi',name:'フィンランド語'},{code:'fr',name:'フランス語'},{code:'de',name:'ドイツ語'},{code:'el',name:'ギリシャ語'},{code:'gu',name:'グジャラト語'},{code:'ht',name:'ハイチ語'},{code:'iw',name:'ヘブライ語'},{code:'hi',name:'ヒンディー語'},{code:'hmn',name:'モンモンドー語'},{code:'hu',name:'ハンガリー語'},{code:'is',name:'アイスランド語'},{code:'id',name:'インドネシア語'},{code:'ga',name:'アイルランド語'},{code:'it',name:'イタリア語'},{code:'kn',name:'カンナダ語'},{code:'kk',name:'カザフ語'},{code:'sw',name:'スワヒリ語'},{code:'lv',name:'ラトビア語'},{code:'lt',name:'リトアニア語'},{code:'mg',name:'マラガシ語'},{code:'ms',name:'マレー語'},{code:'ml',name:'マラヤーラム語'},{code:'mt',name:'マルタ語'},{code:'mi',name:'マオリ語'},{code:'mr',name:'マラーティー語'},{code:'no',name:'ノルウェー語（ブークモール）'},{code:'fa',name:'ペルシャ語'},{code:'pl',name:'ポーランド語'},{code:'pt',name:'ポルトガル語'},{code:'pt-PT',name:'ポルトガル語 (ポルトガル)'},{code:'pa',name:'パンジャブ語'},{code:'ro',name:'ルーマニア語'},{code:'ru',name:'ロシア語'},{code:'sm',name:'サモア語'},{code:'sr',name:'セルビア語（キリル）'},{code:'sk',name:'スロバキア語'},{code:'sl',name:'スロベニア語'},{code:'es',name:'スペイン語'},{code:'sv',name:'スウェーデン語'},{code:'ty',name:'タヒチアン語'},{code:'ta',name:'タミル語'},{code:'te',name:'テルグ語'},{code:'th',name:'タイ語'},{code:'to',name:'トンガ語'},{code:'tr',name:'トルコ語'},{code:'uk',name:'ウクライナ語'},{code:'ur',name:'ウルドゥ語'},{code:'vi',name:'ベトナム語'},{code:'cy',name:'ウェールズ語'},{code:'yua',name:'ユカテックマヤ語'}]
};

export const bingSupportedLangCodes = new Set(['','af','ar','bn','bs','bg','yue','ca','zh-CN','zh-TW','hr','cs','da','nl','en','et','fj','tl','fi','fr','de','el','gu','ht','iw','hi','hmn','hu','is','id','ga','it','ja','kn','kk','sw','ko','lv','lt','mg','ms','ml','mt','mi','mr','no','fa','pl','pt','pt-PT','pa','ro','ru','sm','sr','sk','sl','es','sv','ty','ta','te','th','to','tr','uk','ur','vi','cy','yua']);

export const mojidictLangCode: LocaleLangCodes = {
    [LANG_EN]: [{code:'',name:'Chinese/Japanese'}],
    [LANG_ZH_CN]: [{code:'',name:'中文/日文'}],
    [LANG_JA]: [{code:'',name:'中国語/日本語'}]
};

export const langCode: SourceLocaleLangCodes = {
    [GOOGLE_COM]: googleLangCode,
    [BING_COM]: bingLangCode,
    [MOJIDICT_COM]: mojidictLangCode
};

export const mtLangCode: LocaleLangCodes = googleLangCode;

export const preferredLangCode: LocaleLangCodes = {
    [LANG_EN]: [{code:'en',name:'English'},{code:'af',name:'Afrikaans'},{code:'sq',name:'Albanian'},{code:'am',name:'Amharic'},{code:'ar',name:'Arabic'},{code:'hy',name:'Armenian'},{code:'az',name:'Azerbaijani'},{code:'eu',name:'Basque'},{code:'be',name:'Belarusian'},{code:'bn',name:'Bengali'},{code:'bs',name:'Bosnian'},{code:'bg',name:'Bulgarian'},{code:'ca',name:'Catalan'},{code:'ceb',name:'Cebuano'},{code:'ny',name:'Chichewa'},{code:'zh-CN',name:'Chinese (Simplified)'},{code:'zh-TW',name:'Chinese (Traditional)'},{code:'co',name:'Corsican'},{code:'hr',name:'Croatian'},{code:'cs',name:'Czech'},{code:'da',name:'Danish'},{code:'nl',name:'Dutch'},{code:'eo',name:'Esperanto'},{code:'et',name:'Estonian'},{code:'tl',name:'Filipino'},{code:'fi',name:'Finnish'},{code:'fr',name:'French'},{code:'fy',name:'Frisian'},{code:'gl',name:'Galician'},{code:'ka',name:'Georgian'},{code:'de',name:'German'},{code:'el',name:'Greek'},{code:'gu',name:'Gujarati'},{code:'ht',name:'Haitian Creole'},{code:'ha',name:'Hausa'},{code:'haw',name:'Hawaiian'},{code:'iw',name:'Hebrew'},{code:'hi',name:'Hindi'},{code:'hmn',name:'Hmong'},{code:'hu',name:'Hungarian'},{code:'is',name:'Icelandic'},{code:'ig',name:'Igbo'},{code:'id',name:'Indonesian'},{code:'ga',name:'Irish'},{code:'it',name:'Italian'},{code:'ja',name:'Japanese'},{code:'jw',name:'Javanese'},{code:'kn',name:'Kannada'},{code:'kk',name:'Kazakh'},{code:'km',name:'Khmer'},{code:'rw',name:'Kinyarwanda'},{code:'ko',name:'Korean'},{code:'ku',name:'Kurdish (Kurmanji)'},{code:'ky',name:'Kyrgyz'},{code:'lo',name:'Lao'},{code:'la',name:'Latin'},{code:'lv',name:'Latvian'},{code:'lt',name:'Lithuanian'},{code:'lb',name:'Luxembourgish'},{code:'mk',name:'Macedonian'},{code:'mg',name:'Malagasy'},{code:'ms',name:'Malay'},{code:'ml',name:'Malayalam'},{code:'mt',name:'Maltese'},{code:'mi',name:'Maori'},{code:'mr',name:'Marathi'},{code:'mn',name:'Mongolian'},{code:'my',name:'Myanmar (Burmese)'},{code:'ne',name:'Nepali'},{code:'no',name:'Norwegian'},{code:'or',name:'Odia (Oriya)'},{code:'ps',name:'Pashto'},{code:'fa',name:'Persian'},{code:'pl',name:'Polish'},{code:'pt',name:'Portuguese'},{code:'pa',name:'Punjabi'},{code:'ro',name:'Romanian'},{code:'ru',name:'Russian'},{code:'sm',name:'Samoan'},{code:'gd',name:'Scots Gaelic'},{code:'sr',name:'Serbian'},{code:'st',name:'Sesotho'},{code:'sn',name:'Shona'},{code:'sd',name:'Sindhi'},{code:'si',name:'Sinhala'},{code:'sk',name:'Slovak'},{code:'sl',name:'Slovenian'},{code:'so',name:'Somali'},{code:'es',name:'Spanish'},{code:'su',name:'Sundanese'},{code:'sw',name:'Swahili'},{code:'sv',name:'Swedish'},{code:'tg',name:'Tajik'},{code:'ta',name:'Tamil'},{code:'tt',name:'Tatar'},{code:'te',name:'Telugu'},{code:'th',name:'Thai'},{code:'tr',name:'Turkish'},{code:'tk',name:'Turkmen'},{code:'uk',name:'Ukrainian'},{code:'ur',name:'Urdu'},{code:'ug',name:'Uyghur'},{code:'uz',name:'Uzbek'},{code:'vi',name:'Vietnamese'},{code:'cy',name:'Welsh'},{code:'xh',name:'Xhosa'},{code:'yi',name:'Yiddish'},{code:'yo',name:'Yoruba'},{code:'zu',name:'Zulu'}],
    [LANG_ZH_CN]: [{code:'zh-CN',name:'中文（简体）'},{code:'zh-TW',name:'中文（繁体）'},{code:'en',name:'英语'},{code:'ja',name:'日语'},{code:'ko',name:'韩语'},{code:'sq',name:'阿尔巴尼亚语'},{code:'ar',name:'阿拉伯语'},{code:'am',name:'阿姆哈拉语'},{code:'az',name:'阿塞拜疆语'},{code:'ga',name:'爱尔兰语'},{code:'et',name:'爱沙尼亚语'},{code:'or',name:'奥里亚语（奥里亚文）'},{code:'eu',name:'巴斯克语'},{code:'be',name:'白俄罗斯语'},{code:'bg',name:'保加利亚语'},{code:'is',name:'冰岛语'},{code:'pl',name:'波兰语'},{code:'bs',name:'波斯尼亚语'},{code:'fa',name:'波斯语'},{code:'af',name:'布尔语(南非荷兰语)'},{code:'tt',name:'鞑靼语'},{code:'da',name:'丹麦语'},{code:'de',name:'德语'},{code:'ru',name:'俄语'},{code:'fr',name:'法语'},{code:'tl',name:'菲律宾语'},{code:'fi',name:'芬兰语'},{code:'fy',name:'弗里西语'},{code:'km',name:'高棉语'},{code:'ka',name:'格鲁吉亚语'},{code:'gu',name:'古吉拉特语'},{code:'kk',name:'哈萨克语'},{code:'ht',name:'海地克里奥尔语'},{code:'ha',name:'豪萨语'},{code:'nl',name:'荷兰语'},{code:'ky',name:'吉尔吉斯语'},{code:'gl',name:'加利西亚语'},{code:'ca',name:'加泰罗尼亚语'},{code:'cs',name:'捷克语'},{code:'kn',name:'卡纳达语'},{code:'co',name:'科西嘉语'},{code:'hr',name:'克罗地亚语'},{code:'ku',name:'库尔德语'},{code:'la',name:'拉丁语'},{code:'lv',name:'拉脱维亚语'},{code:'lo',name:'老挝语'},{code:'lt',name:'立陶宛语'},{code:'lb',name:'卢森堡语'},{code:'rw',name:'卢旺达语'},{code:'ro',name:'罗马尼亚语'},{code:'mg',name:'马尔加什语'},{code:'mt',name:'马耳他语'},{code:'mr',name:'马拉地语'},{code:'ml',name:'马拉雅拉姆语'},{code:'ms',name:'马来语'},{code:'mk',name:'马其顿语'},{code:'mi',name:'毛利语'},{code:'mn',name:'蒙古语'},{code:'bn',name:'孟加拉语'},{code:'my',name:'缅甸语'},{code:'hmn',name:'苗语'},{code:'xh',name:'南非科萨语'},{code:'zu',name:'南非祖鲁语'},{code:'ne',name:'尼泊尔语'},{code:'no',name:'挪威语'},{code:'pa',name:'旁遮普语'},{code:'pt',name:'葡萄牙语'},{code:'ps',name:'普什图语'},{code:'ny',name:'齐切瓦语'},{code:'sv',name:'瑞典语'},{code:'sm',name:'萨摩亚语'},{code:'sr',name:'塞尔维亚语'},{code:'st',name:'塞索托语'},{code:'si',name:'僧伽罗语'},{code:'eo',name:'世界语'},{code:'sk',name:'斯洛伐克语'},{code:'sl',name:'斯洛文尼亚语'},{code:'sw',name:'斯瓦希里语'},{code:'gd',name:'苏格兰盖尔语'},{code:'ceb',name:'宿务语'},{code:'so',name:'索马里语'},{code:'tg',name:'塔吉克语'},{code:'te',name:'泰卢固语'},{code:'ta',name:'泰米尔语'},{code:'th',name:'泰语'},{code:'tr',name:'土耳其语'},{code:'tk',name:'土库曼语'},{code:'cy',name:'威尔士语'},{code:'ug',name:'维吾尔语'},{code:'ur',name:'乌尔都语'},{code:'uk',name:'乌克兰语'},{code:'uz',name:'乌兹别克语'},{code:'es',name:'西班牙语'},{code:'iw',name:'希伯来语'},{code:'el',name:'希腊语'},{code:'haw',name:'夏威夷语'},{code:'sd',name:'信德语'},{code:'hu',name:'匈牙利语'},{code:'sn',name:'修纳语'},{code:'hy',name:'亚美尼亚语'},{code:'ig',name:'伊博语'},{code:'it',name:'意大利语'},{code:'yi',name:'意第绪语'},{code:'hi',name:'印地语'},{code:'su',name:'印尼巽他语'},{code:'id',name:'印尼语'},{code:'jw',name:'印尼爪哇语'},{code:'yo',name:'约鲁巴语'},{code:'vi',name:'越南语'}],
    [LANG_JA]: [{code:'en',name:'英語'},{code:'ko',name:'韓国語'},{code:'zh-CN',name:'中国語（簡体）'},{code:'zh-TW',name:'中国語（繁体）'},{code:'ja',name:'日本語'},{code:'is',name:'アイスランド語'},{code:'ga',name:'アイルランド語'},{code:'az',name:'アゼルバイジャン語'},{code:'af',name:'アフリカーンス語'},{code:'am',name:'アムハラ語'},{code:'ar',name:'アラビア語'},{code:'sq',name:'アルバニア語'},{code:'hy',name:'アルメニア語'},{code:'it',name:'イタリア語'},{code:'yi',name:'イディッシュ語'},{code:'ig',name:'イボ語'},{code:'id',name:'インドネシア語'},{code:'ug',name:'ウイグル語'},{code:'cy',name:'ウェールズ語'},{code:'uk',name:'ウクライナ語'},{code:'uz',name:'ウズベク語'},{code:'ur',name:'ウルドゥ語'},{code:'et',name:'エストニア語'},{code:'eo',name:'エスペラント語'},{code:'nl',name:'オランダ語'},{code:'or',name:'オリヤ語'},{code:'kk',name:'カザフ語'},{code:'ca',name:'カタルーニャ語'},{code:'gl',name:'ガリシア語'},{code:'kn',name:'カンナダ語'},{code:'rw',name:'キニヤルワンダ語'},{code:'el',name:'ギリシャ語'},{code:'ky',name:'キルギス語'},{code:'gu',name:'グジャラト語'},{code:'km',name:'クメール語'},{code:'ku',name:'クルド語'},{code:'hr',name:'クロアチア語'},{code:'xh',name:'コーサ語'},{code:'co',name:'コルシカ語'},{code:'sm',name:'サモア語'},{code:'jw',name:'ジャワ語'},{code:'ka',name:'ジョージア（グルジア）語'},{code:'sn',name:'ショナ語'},{code:'sd',name:'シンド語'},{code:'si',name:'シンハラ語'},{code:'sv',name:'スウェーデン語'},{code:'zu',name:'ズールー語'},{code:'gd',name:'スコットランド ゲール語'},{code:'es',name:'スペイン語'},{code:'sk',name:'スロバキア語'},{code:'sl',name:'スロベニア語'},{code:'sw',name:'スワヒリ語'},{code:'su',name:'スンダ語'},{code:'ceb',name:'セブアノ語'},{code:'sr',name:'セルビア語'},{code:'st',name:'ソト語'},{code:'so',name:'ソマリ語'},{code:'th',name:'タイ語'},{code:'tl',name:'タガログ語'},{code:'tg',name:'タジク語'},{code:'tt',name:'タタール語'},{code:'ta',name:'タミル語'},{code:'cs',name:'チェコ語'},{code:'ny',name:'チェワ語'},{code:'te',name:'テルグ語'},{code:'da',name:'デンマーク語'},{code:'de',name:'ドイツ語'},{code:'tk',name:'トルクメン語'},{code:'tr',name:'トルコ語'},{code:'ne',name:'ネパール語'},{code:'no',name:'ノルウェー語'},{code:'ht',name:'ハイチ語'},{code:'ha',name:'ハウサ語'},{code:'ps',name:'パシュト語'},{code:'eu',name:'バスク語'},{code:'haw',name:'ハワイ語'},{code:'hu',name:'ハンガリー語'},{code:'pa',name:'パンジャブ語'},{code:'hi',name:'ヒンディー語'},{code:'fi',name:'フィンランド語'},{code:'fr',name:'フランス語'},{code:'fy',name:'フリジア語'},{code:'bg',name:'ブルガリア語'},{code:'vi',name:'ベトナム語'},{code:'iw',name:'ヘブライ語'},{code:'be',name:'ベラルーシ語'},{code:'fa',name:'ペルシャ語'},{code:'bn',name:'ベンガル語'},{code:'pl',name:'ポーランド語'},{code:'bs',name:'ボスニア語'},{code:'pt',name:'ポルトガル語'},{code:'mi',name:'マオリ語'},{code:'mk',name:'マケドニア語'},{code:'mr',name:'マラーティー語'},{code:'mg',name:'マラガシ語'},{code:'ml',name:'マラヤーラム語'},{code:'mt',name:'マルタ語'},{code:'ms',name:'マレー語'},{code:'my',name:'ミャンマー語'},{code:'mn',name:'モンゴル語'},{code:'hmn',name:'モン語'},{code:'yo',name:'ヨルバ語'},{code:'lo',name:'ラオ語'},{code:'la',name:'ラテン語'},{code:'lv',name:'ラトビア語'},{code:'lt',name:'リトアニア語'},{code:'ro',name:'ルーマニア語'},{code:'lb',name:'ルクセンブルク語'},{code:'ru',name:'ロシア語'}]
};