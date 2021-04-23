import Image from 'next/image';
import { useContext, useRef, useEffect } from 'react';
import { PlayerContext } from '../../contexts/PlayerContexts';
import styles from './styles.module.scss';

import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

export function Player() {

    // references
    const audioRef = useRef<HTMLAudioElement>(null);

    // Contexts
    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        setPlayingState,
        togglePlay
    } = useContext(PlayerContext);

    // Variables
    const episode = episodeList[currentEpisodeIndex]

    /* 
    UseEffect(() => {}, [])
    () => {} -- the function that will perform
    [] -- when this changes
    */

    useEffect(() => {

        // If there is no podcast playing
        if (!audioRef.current) {
            return;
        }

        // If you have a podcast playing | not playing
        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause();
        }

    }, [isPlaying])

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando Agora" />
                <strong>Tocando agora</strong>
            </header>

            {/* If you have an episode playing */}
            {episode ? (
                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit="cover"
                    />

                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>

            ) : (

                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}

            <footer className={!episode ? styles.empty : ''}>

                {/* if without else return
                episode && -> if without else
                episode || -> else without if
                */}

                {episode && (
                    <audio
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                    />
                )}

                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>00:00</span>
                </div>

                <div className={styles.buttons}>
                    <button type='button' disabled={!episode}>
                        <img src="/shuffle.svg" alt="Ordem Aleatória" />
                    </button>

                    <button type='button' disabled={!episode}>
                        <img src="/play-previous.svg" alt="Tocar Anterior" />
                    </button>

                    <button
                        type='button'
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={togglePlay}
                    >

                        {isPlaying
                            ? <img src="/pause.svg" alt="Pausar" />
                            : <img src="/play.svg" alt="Tocar" />
                        }
                    </button>

                    <button type='button' disabled={!episode}>
                        <img src="/play-next.svg" alt="Tocar Próxima" />
                    </button>

                    <button type='button' disabled={!episode}>
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    );
}

// useEffect -> When to use? every time a value changes, and I want something to happen.