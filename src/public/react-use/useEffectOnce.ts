import { EffectCallback, useEffect } from 'react';

/* from https://github.com/streamich/react-use/blob/master/src/useEffectOnce.ts */
const useEffectOnce = (effect: EffectCallback) => {
    // eslint-disable-next-line
    useEffect(effect, []);
};

export default useEffectOnce;