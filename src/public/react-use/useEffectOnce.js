import { useEffect } from 'react';

/* from https://github.com/streamich/react-use/blob/master/src/useEffectOnce.ts */
const useEffectOnce = (effect) => {
    // eslint-disable-next-line
    useEffect(effect, []);
};

export default useEffectOnce;