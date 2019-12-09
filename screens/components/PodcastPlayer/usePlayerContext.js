import { useContext } from "react";

import { DispatchContext, StateContext} from './PlayerProvider'

import Animated, { Easing } from 'react-native-reanimated';
const { Value, timing } = Animated;

//Custom hook through which UI componenets can read and mutate state of the 
//global player context 
function togglePodcast(podcast)  {
    //const {podcast} =playerGlobalState;
    animation = new Value(0);

    timing(
      animation,
      {
        toValue: podcast ? 1 : 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      },
    ).start();
  };

function usePlayerStateContext() {
    const playerGlobalState = useContext(StateContext);

    {console.log("Inside usePlayerStateContext to access Global State")}
  
    if (playerGlobalState=== undefined) {
      throw new Error("Ut oh, where is my state?");
    }
  
    return playerGlobalState; 
  }


  function usePlayerDispatchContext() {
    const playerGlobalDispatch = useContext(DispatchContext);
    {console.log("Inside usePlayerDispatchContextto change the Global State")}
  
    if (playerGlobalDispatch === undefined) {
      throw new Error("Ut oh, where is my dispatch?");
    }

    function setPodcast(podcast, eventSource ) {

      if (podcast!==undefined ){
        playerGlobalDispatch(draft => {
            draft.podcast = podcast;
            draft.eventSource = eventSource;
            console.log(draft)

          });
          togglePodcast(podcast)

        }

    
      };

      

      return {setPodcast}; 
  
}

//usePlayerStateContext is for accessing the state 
//usePlayerDispatch is for accessing the dispatch.
const usePlayerContext = () => {
    return [usePlayerStateContext(), usePlayerDispatchContext()];
  };

  export {usePlayerContext};
  