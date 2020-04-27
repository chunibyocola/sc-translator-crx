const audioPlayer = new Audio();
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
    if (1 > srcList.length) return;

    audioSrcList = srcList;
    index = 1;

    audioPlayer.src = srcList[0];
    audioPlayer.play();
}