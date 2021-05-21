import { getLocalStorage } from "../../public/chrome-call";
import { listenOptionsChange } from "../../public/options";

const audioPlayer = new Audio();
audioPlayer.crossOrigin = 'anonymous';
let index = 0;
let audioSrcList = [];

audioPlayer.addEventListener('ended', () => {
    if (index < audioSrcList.length) {
        audioPlayer.src = audioSrcList[index];
        audioPlayer.play();
        ++index;
    }
});

export const playAudio = (srcList) => {
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

getLocalStorage(['audioVolume', 'audioPlaybackRate'], (storage) => {
    audioPlayer.volume = (storage.audioVolume ?? 100) / 100;
    audioPlayer.defaultPlaybackRate = storage.audioPlaybackRate ?? 1;
});
listenOptionsChange(['audioVolume', 'audioPlaybackRate'], (changes) => {
    'audioVolume' in changes && (audioPlayer.volume = (changes.audioVolume ?? 100) / 100);
    'audioPlaybackRate' in changes && (audioPlayer.defaultPlaybackRate = changes.audioPlaybackRate ?? 1);
});