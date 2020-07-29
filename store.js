import userReducer from './reducers/userReducer';
import rootReducer from './reducers/rootReducer';
import flipReducer from './reducers/flipReducer';
import recorderReducer from './reducers/recorderReducer';
import musicReducer from './reducers/musicReducer';
import categoryReducer from './reducers/categoryReducer';
import {createStore,combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';

const mainReducer = combineReducers({
    recorderReducer,
    userReducer,
    rootReducer,
    flipReducer,
    musicReducer,
    categoryReducer
  })

const store = createStore(mainReducer, applyMiddleware(thunk))
//const store = createStore(reducer);

export default store;