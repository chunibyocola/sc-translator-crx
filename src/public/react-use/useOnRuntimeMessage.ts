import { useEffect, useRef, useState } from 'react';
import { ChromeTabsMessage } from '../send';

const useOnRuntimeMessage = (onMessageChange: (message: ChromeTabsMessage) => void) => {
    const [message, setMessage] = useState<ChromeTabsMessage>();

    const onMessageChangeRef = useRef<typeof onMessageChange>(undefined);

    useEffect(() => {
        onMessageChangeRef.current = onMessageChange;
    }, [onMessageChange]);

    useEffect(() => {
        const onMessage = (msg: ChromeTabsMessage | string | null | undefined | number) => {
            if (!msg || typeof msg !== 'object') { return; }

            setMessage(msg);
        };

        chrome.runtime.onMessage.addListener(onMessage);

        return () => chrome.runtime.onMessage.removeListener(onMessage);
    }, []);

    useEffect(() => {
        message && onMessageChangeRef.current?.(message);
    }, [message]);
};

export default useOnRuntimeMessage;