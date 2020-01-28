import { createStore, combineReducers, applyMiddleware } from 'redux'
//import thunk from 'redux-thunk'
import  rootReducer from './rootReducer'
import  userReducer from './userReducer'

const mainReducer = combineReducers({
     
     userReducer,
     rootReducer
})
// applyMiddleware supercharges createStore with middleware:
export const store = createStore(mainReducer);//, applyMiddleware(thunk))
{console.log("\n\nWOOAAHAHAHA")}
{console.log(store.getState())}

store.dispatch({
    type : "CHANGE_NAME",
    payload: "Satyam"
})


{console.log("\n\nWOLLLLLLLLLLLLLLLLLLLLaaaaA")}
{console.log(store.getState())}

