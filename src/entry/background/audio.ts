import { getLocalStorage } from "../../public/chrome-call";
import { listenOptionsChange } from "../../public/options";
import { DefaultOptions } from "../../types";

const audioPlayer = new Audio();
audioPlayer.crossOrigin = 'anonymous';
let index = 0;
let audioSrcList: string[] = [];

audioPlayer.addEventListener('ended', () => {
    if (index < audioSrcList.length) {
        audioPlayer.src = audioSrcList[index];
        audioPlayer.play();
        ++index;
    }
});

export const playAudio = (srcList: string | string[]) => {
    if (!Array.isArray(srcList)) {
        audioPlayer.src = srcList;
        audioPlayer.play();
        return;
    }

    if (1 > srcList.length) return;

    audioSrcList = srcList;
    index = 1;

    audioPlayer.src = srcList[0];
    audioPlayer.play();
};

type PickedOptions = Pick<DefaultOptions, 'audioVolume' | 'audioPlaybackRate'>;
const keys: (keyof PickedOptions)[] = ['audioVolume', 'audioPlaybackRate'];
getLocalStorage<PickedOptions>(keys, (storage) => {
    audioPlayer.volume = storage.audioVolume / 100;
    audioPlayer.defaultPlaybackRate = storage.audioPlaybackRate;
});
listenOptionsChange<PickedOptions>(keys, (changes) => {
    changes.audioVolume !== undefined && (audioPlayer.volume = changes.audioVolume / 100);
    changes.audioPlaybackRate !== undefined && (audioPlayer.defaultPlaybackRate = changes.audioPlaybackRate);
});