import { PlayerContext } from '../contexts/PlayerContexts';
import { Header } from '../components/Header/Header';
import { Player } from '../components/Player/Player';
import '../styles/global.scss';
import styles from '../styles/app.module.scss';
import { useState } from 'react';

function MyApp({ Component, pageProps }) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true)
  }

  function togglePlay(){
    setIsPlaying(!isPlaying) // opposite of its value

  }

  function setPlayingState(state : boolean){
    setIsPlaying(state);
  }

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        episodeList,
        currentEpisodeIndex,
        setPlayingState,
        play,
        togglePlay
      }}
    >

      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>

        <Player />

      </div>
    </PlayerContext.Provider>
  )
}

export default MyApp
