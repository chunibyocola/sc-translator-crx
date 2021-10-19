import { getLocalStorage } from "../../public/chrome-call";
import { listenOptionsChange } from "../../public/options";
import { DefaultOptions } from "../../types";

type AudioMessage = {
    type: 'play';
    payload: string;
} | {
    type: 'pause';
};

const audio = new Audio();

document.body.appendChild(audio);

window.addEventListener('message', (e) => {
    const data = e.data as AudioMessage;

    switch (data.type) {
        case 'play':
            play(data.payload);
            break;
        case 'pause':
            pause();
            break;
        default: break;
    }
});

const play = (dataUri: string) => {
    audio.src = dataUri;
    audio.play();
};

const pause = () => {
    audio.pause();
};

audio.addEventListener('ended', () => {
    window.parent.postMessage({ 'sc-translator-audio': { type: 'ended' } }, '*');
});

type PickedOptions = Pick<DefaultOptions, 'audioVolume' | 'audioPlaybackRate'>;
const keys: (keyof PickedOptions)[] = ['audioVolume', 'audioPlaybackRate'];
getLocalStorage<PickedOptions>(keys, (storage) => {
    audio.volume = storage.audioVolume / 100;
    audio.defaultPlaybackRate = storage.audioPlaybackRate;
});
listenOptionsChange<PickedOptions>(keys, (changes) => {
    changes.audioVolume !== undefined && (audio.volume = changes.audioVolume / 100);
    changes.audioPlaybackRate !== undefined && (audio.defaultPlaybackRate = changes.audioPlaybackRate);
});