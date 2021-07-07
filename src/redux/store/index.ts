import { configureStore } from '@reduxjs/toolkit';
import multipleTranslate from '../slice/multipleTranslateSlice';
import panelStatus from '../slice/panelStatusSlice';
import singleTranslate from '../slice/singleTranslateSlice';
import translateHistory from '../slice/translateHistorySlice';

const store = configureStore({
    reducer: {
        multipleTranslate,
        panelStatus,
        singleTranslate,
        translateHistory
    }
});

export const getDispatch = () => store.dispatch;

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

export default store;