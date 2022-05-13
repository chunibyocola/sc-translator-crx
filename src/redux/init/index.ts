import { init } from '../slice/translationSlice';
import { getDispatch } from '../store';

export const initTranslation = (params: { sourceList: string[]; from: string; to: string; }) => {
    getDispatch()(init(params));
};