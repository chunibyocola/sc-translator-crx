import { useState, useEffect } from 'react';
import { onExtensionMessage } from '../chrome-call';

const useOnExtensionMessage = () => {
    const [message, setMessage] = useState<any>({});

    useEffect(() => onExtensionMessage(msg => setMessage(msg)), []);

    return message;
};

export default useOnExtensionMessage;