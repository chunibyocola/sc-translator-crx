import { BAIDU_COM, BING_COM, GOOGLE_COM } from '../constants/translateSource';
import { DefaultOptions } from '../types';
import { getLocalStorage } from './chrome-call';
import { listenOptionsChange } from './options';
import { sendDetect, sendAudio } from './send';
import { baiduSwitchToGoogleLangCode, bingSwitchToGoogleLangCode } from './switch-lang-code';

const audio = new Audio();

let defaultAudioSource = GOOGLE_COM;
let keepUsingDefaultAudioSource = false;

type AudioCache = {
    textList: string[];
    source: string;
    text: string;
    from: string;
    detectedFrom: string;
    dataUriList: string[];
    index: number;
    requesting: boolean;
    manuallyPaused: boolean;
    onPause: undefined | (() => void);
    id: number;
};

let audioCache: AudioCache = {
    textList: [],
    source: '',
    text: '',
    from: '',
    detectedFrom: '',
    dataUriList: [],
    index: 0,
    requesting: false,
    manuallyPaused: false,
    onPause: undefined,
    id: 0
};

let violateCSP = false;
const utter = new SpeechSynthesisUtterance();

export const playAudio = ({ text, source, from = '' }: { text: string, source?: string, from?: string }, onPause?: () => void) => {
    pauseAudio();

    if (source && from) {
        if (source === BING_COM) {
            from = bingSwitchToGoogleLangCode(from);
        }
        else if (source === BAIDU_COM) {
            from = baiduSwitchToGoogleLangCode(from);
        }
    }

    if (!source || keepUsingDefaultAudioSource) {
        source = defaultAudioSource;
    }

    if (audioCache.text === text && audioCache.source === source && audioCache.from === from && audioCache.detectedFrom) {
        audioCache.index = 0;
        audioCache.manuallyPaused = false;
        audioCache.onPause = onPause;
        startPlaying();
        return;
    }

    let textList: string[] = [];

    switch (source) {
        case GOOGLE_COM:
            textList = getTextList(text, 200);
            break;
        default:
            textList = [text];
            break;
    }

    audioCache.textList = textList;
    audioCache.source = source;
    audioCache.text = text;
    audioCache.from = from;
    audioCache.detectedFrom = from;
    audioCache.dataUriList = [];
    audioCache.index = 0;
    audioCache.requesting = false;
    audioCache.manuallyPaused = false;
    audioCache.onPause = onPause;
    audioCache.id = audioCache.id + 1;

    if (audioCache.detectedFrom) {
        startPlaying();
    }
    else {
        const detectingText = audioCache.textList[0];

        sendDetect(detectingText, source).then((response) => {
            if ('code' in response) { return; }

            if (detectingText === audioCache.textList[0] && source === audioCache.source) {
                audioCache.detectedFrom = response.langCode;
                startPlaying();
            }
        });
    }
};

export const pauseAudio = () => {
    if (violateCSP) {
        window.speechSynthesis.cancel();
    }
    else {
        audio.pause();
    }

    audioCache.manuallyPaused = true;
    audioCache.onPause?.();
};

const startPlaying = () => {
    const { textList, source, detectedFrom, index, dataUriList, id } = audioCache;

    if (index >= textList.length) {
        audioCache.onPause?.();
        return;
    }

    if (violateCSP) {
        play(textList[index]);
        return;
    }

    if (dataUriList[index]) {
        play(dataUriList[index]);
        return;
    }

    if (!audioCache.requesting) {
        sendAudio(textList[index], source, detectedFrom).then((response) => {
            if (id === audioCache.id) {
                if (!('code' in response)) {
                    audioCache.dataUriList[index] = response.dataUri;
                    !audioCache.manuallyPaused && play(response.dataUri);
                }
                audioCache.requesting = false;
            }
        });

        audioCache.requesting = true;
    }
};

audio.addEventListener('ended', () => {
    startPlaying();
});

audio.addEventListener('error', () => {
    if (audio.error?.code === 4 && !violateCSP) {
        violateCSP = true;
        --audioCache.index;
        startPlaying();
    }
});

utter.addEventListener('end', () => {
    startPlaying();
});

const play = (dataURL: string) => {
    if (violateCSP) {
        utter.text = dataURL;
        if (audioCache.source === BING_COM) {
            utter.lang = bingSwitchToGoogleLangCode(audioCache.from);
        }
        else if (audioCache.source === BAIDU_COM) {
            utter.lang = baiduSwitchToGoogleLangCode(audioCache.from);
        }
        else {
            utter.lang = audioCache.detectedFrom;
        }
        window.speechSynthesis.speak(utter);
    }
    else {
        audio.src = dataURL;
        audio.play();
    }

    ++audioCache.index;
};

const getTextList = (text: string, textLength: number) => {
    let arr: string[] = [];
    let textArr = [];

    while (text) {
        const index = text.search(/\.|。|\?|？|,|，|:|：|;|；|\s|\n/g);
        if (index >= 0) {
            textArr.push(text.substr(0, index + 1));
            text = text.substr(index + 1, text.length);
        } else {
            textArr.push(text);
            break;
        }
    }

    textArr.reduce((total, value, index) => {
        let { length, str } = total;
        if (length + value.length <= textLength) {
            length += value.length;
            str += value;
        }
        else {
            str && arr.push(str);

            if (value.length > textLength) {
                while (value.length > textLength) {
                    arr.push(value.substr(0, textLength));
                    value = value.substr(textLength, value.length);
                }
            }

            length = value.length;
            str = value;
        }
        (index === textArr.length - 1 && str) && arr.push(str);

        return { length, str };
    }, { length: 0, str: '' });

    return arr;
};

type PickedOptions = Pick<DefaultOptions, 'audioVolume' | 'audioPlaybackRate' | 'defaultAudioSource' | 'keepUsingDefaultAudioSource'>;
const keys: (keyof PickedOptions)[] = ['audioVolume', 'audioPlaybackRate', 'defaultAudioSource', 'keepUsingDefaultAudioSource'];
getLocalStorage<PickedOptions>(keys, (storage) => {
    audio.volume = storage.audioVolume / 100;
    audio.defaultPlaybackRate = storage.audioPlaybackRate;

    utter.volume = storage.audioVolume / 100;
    utter.rate = storage.audioPlaybackRate;

    defaultAudioSource = storage.defaultAudioSource;

    keepUsingDefaultAudioSource = storage.keepUsingDefaultAudioSource;
});
listenOptionsChange<PickedOptions>(keys, (changes) => {
    if (changes.audioVolume !== undefined) {
        audio.volume = changes.audioVolume / 100;
        utter.volume = changes.audioVolume / 100;
    }

    if (changes.audioPlaybackRate !== undefined) {
        audio.defaultPlaybackRate = changes.audioPlaybackRate;
        utter.rate = changes.audioPlaybackRate;
    }
    changes.defaultAudioSource !== undefined && (defaultAudioSource = changes.defaultAudioSource);

    changes.keepUsingDefaultAudioSource !== undefined && (keepUsingDefaultAudioSource = changes.keepUsingDefaultAudioSource);
});