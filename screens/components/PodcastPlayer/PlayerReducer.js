import {SET_PODCAST} from './actionTypes';
import {SET_GLOBAL_FROM_PODCAST} from './actionTypes'




/*const setPodcast=(globalPodcast,state )=>
{
    const state=[...state, podcast];
    return 
    {
        ...state, 
        podcast:globalPodcast
    };
};*/

export default PlayerReducer=(state, action )=>
{
    switch(action.type){
        case SET_PODCAST:
            return {...state, podcast:action.payload}
        case SET_GLOBAL_FROM_PODCAST:
            return {...state, podcast:action.payload}
        default: {
                throw new Error(`Unhandled action type: ${action.type}`)
              }
            
    }
}

//reducers are pure functions