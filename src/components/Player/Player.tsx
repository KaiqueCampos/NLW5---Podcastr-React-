import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '../../contexts/PlayerContexts';
import { ConvertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './styles.module.scss';

export function Player() {

    // references
    const audioRef = useRef<HTMLAudioElement>(null);

    // Contexts
    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        hasNext,
        hasPrevious,
        isLooping,
        isShuffling,
        toggleShuffle,
        setPlayingState,
        togglePlay,
        toggleLooping,
        playNext,
        playPrevious,
        clearPlayerState
    } = usePlayer();

    // Variables
    const episode = episodeList[currentEpisodeIndex];
    const [progress, setProgress] = useState(0);

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

    function setupProgressListener() {
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        })
    }

    function handleSeek(amount: number) {
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleSongEnded() {
        if (hasNext) {
            playNext();
        } else {
            clearPlayerState();
        }
    }

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
                        onEnded={handleSongEnded}
                        loop={isLooping}
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)}
                        onLoadedMetadata={setupProgressListener}
                    />
                )}

                <div className={styles.progress}>
                    <span>{ConvertDurationToTimeString(progress)}</span>

                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>

                    {/* ?. -> f the episode does not exist, it will not fetch the duration property */}
                    <span>{ConvertDurationToTimeString(episode?.duration ?? 0)}</span>
                </div>

                <div className={styles.buttons}>
                    <button
                        type='button'
                        disabled={!episode || episodeList.length <= 2}
                        onClick={toggleShuffle}
                        className={isShuffling ? styles.isActive : ''}
                    >
                        <img src="/shuffle.svg" alt="Ordem Aleatória" />
                    </button>

                    <button type='button' onClick={playPrevious} disabled={!episode || !hasPrevious}>
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

                    <button type='button' onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar Próxima" />
                    </button>

                    <button
                        type='button'
                        onClick={toggleLooping}
                        disabled={!episode}
                        className={isLooping ? styles.isActive : ''}
                    >
                        <img src="/repeat.svg" alt="Repetir" />
                    </button>
                </div>
            </footer>
        </div>
    );
}

// useEffect -> When to use? every time a value changes, and I want something to happen.