

/*import React, { createContext } from 'react'
const PlayerContext = React.createContext({});

export const PlayerProvider = PlayerContext.Provider

export const PlayerConsumer = PlayerContext.Consumer

export const withPlayerHOC = Component => props => (
  <PlayerConsumer>
    {state => <Component {...props} playerGlobalContext={state} />}
  </PlayerConsumer>
)*/


import React, { createContext } from 'react'

const PlayerContext = React.createContext({
  //podcast :null, 
  //setPodcast:(podcast)=>{}, 
  //isPlaying : false, 
  //isBuffering: false
});

export default PlayerContext
