import {SET_PODCAST} from './actionTypes';



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
        default:
            return state;
            
    }
}

//reducers are pure functions