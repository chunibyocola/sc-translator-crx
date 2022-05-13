import { configureStore } from '@reduxjs/toolkit';
import panelStatus from '../slice/panelStatusSlice';
import translateHistory from '../slice/translateHistorySlice';
import translation from '../slice/translationSlice';

const store = configureStore({
    reducer: {
        panelStatus,
        translateHistory,
        translation
    }
});

export const getDispatch = () => store.dispatch;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;