import { GOOGLE_COM } from '../constants/translateSource';
import { DefaultOptions } from '../types';
import { getLocalStorage } from './chrome-call';
import { listenOptionsChange } from './options';
import { sendDetect, sendAudio } from './send';

const audio = new Audio();

let defaultAudioSource = GOOGLE_COM;

type AudioCache = {
    textList: string[];
    source: string;
    text: string;
    from: string;
    detectedFrom: string;
    dataUriList: string[];
    index: number;
    requesting: boolean;
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
    onPause: undefined,
    id: 0
};

export const playAudio = ({ text, source, from = '' }: { text: string, source?: string, from?: string }, onPause?: () => void) => {
    if (!audio.paused) {
        pauseAudio();
    }

    if (!source) {
        source = defaultAudioSource;
    }

    if (audioCache.text === text && audioCache.source === source && audioCache.from === from && audioCache.detectedFrom) {
        audioCache.index = 0;
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
    audioCache.onPause = onPause;
    audioCache.id = audioCache.id + 1;

    if (audioCache.detectedFrom) {
        startPlaying();
    }
    else {
        sendDetect({ text: audioCache.textList[0], source }, (result) => {
            if (result.suc && result.text === audioCache.textList[0] && source === audioCache.source) {
                audioCache.detectedFrom = result.data;
                startPlaying();
            }
        });
    }
};

export const pauseAudio = () => {
    audio.pause();
    audioCache.onPause?.();
};

const startPlaying = () => {
    const { textList, source, detectedFrom, index, dataUriList, id } = audioCache;

    if (index >= textList.length) {
        audioCache.onPause?.();
        return;
    }

    if (dataUriList[index]) {
        play(dataUriList[index]);
        return;
    }

    if (!audioCache.requesting) {
        sendAudio({ text: textList[index], source, from: detectedFrom, index }, (result) => {
            if (id === audioCache.id) {
                if (result.suc) {
                    audioCache.dataUriList[index] = result.data;
                    play(result.data);
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

const play = (dataURL: string) => {
    audio.src = dataURL;
    audio.play().catch();

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

type PickedOptions = Pick<DefaultOptions, 'audioVolume' | 'audioPlaybackRate' | 'defaultAudioSource'>;
const keys: (keyof PickedOptions)[] = ['audioVolume', 'audioPlaybackRate', 'defaultAudioSource'];
getLocalStorage<PickedOptions>(keys, (storage) => {
    audio.volume = storage.audioVolume / 100;
    audio.defaultPlaybackRate = storage.audioPlaybackRate;
    defaultAudioSource = storage.defaultAudioSource;
});
listenOptionsChange<PickedOptions>(keys, (changes) => {
    changes.audioVolume !== undefined && (audio.volume = changes.audioVolume / 100);
    changes.audioPlaybackRate !== undefined && (audio.defaultPlaybackRate = changes.audioPlaybackRate);
    changes.defaultAudioSource !== undefined && (defaultAudioSource = changes.defaultAudioSource);
});