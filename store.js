import userReducer from './reducers/userReducer';
import rootReducer from './reducers/rootReducer';
import flipReducer from './reducers/flipReducer';
import recorderReducer from './reducers/recorderReducer';
import musicReducer from './reducers/musicReducer';
import categoryReducer from './reducers/categoryReducer';
import {createStore,combineReducers, applyMiddleware} from 'redux'
import thunk from 'redux-thunk';

const appReducer = combineReducers({
    recorderReducer,
    userReducer,
    rootReducer,
    flipReducer,
    musicReducer,
    categoryReducer
  })

const mainReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}

const store = createStore(mainReducer, applyMiddleware(thunk))
//const store = createStore(reducer);

export default store;