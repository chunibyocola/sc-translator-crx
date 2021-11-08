import React, { useCallback, useEffect, useRef, useState } from 'react';
import { pauseAudio, playAudio } from '../../public/play-audio';
import IconFont from '../IconFont';

type ListenButtonProps = {
    text: string;
    source: string;
    from: string;
};

const ListenButton: React.FC<ListenButtonProps> = ({ text, source, from }) => {
    const [playing, setPlaying] = useState(false);

    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;

        return () => { isMounted.current = false; }
    });

    const onAudioPaused = useCallback(() => {
        isMounted.current && setPlaying(false);
    }, []);

    const onListenButtonClick: React.MouseEventHandler<SVGSVGElement> = useCallback((e) => {
        e.stopPropagation();

        if (playing) {
            pauseAudio();
        }
        else {
            playAudio({ text, source, from }, onAudioPaused);
            setPlaying(true);
        }
    }, [text, source, from, playing, onAudioPaused]);

    return (
        <IconFont
            iconName={playing ? '#icon-stop' : '#icon-GoUnmute'}
            className='iconbutton button'
            onClick={onListenButtonClick}
        />
    );
};

export default ListenButton;