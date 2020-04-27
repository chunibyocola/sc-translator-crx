import {createStore} from 'redux';
import rootReducer from '../reducers';

const store = createStore(rootReducer);

export const getStoreState = () => {
    return store.getState();
};

export const getStoreDispatch = () => {
    return store.dispatch;
};

export default store;