import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { usePlayer } from '../../contexts/PlayerContexts';
import { api } from '../../services/Api';
import { ConvertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from '../episode.module.scss';


// types
type Episode = {
    id: string;
    title: string;
    thumbnail: string;
    members: string;
    publishedAt: string;
    durationAsString: string;
    duration: number;
    description: string;
    url: string;
}

type EpisodeProps = {
    // Array with Episode type
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
    const { play } = usePlayer();

    return (
        <div className={styles.episode}>

            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>

            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type='button'>
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>

                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                />

                <button type='button' onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Plau" />
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />
        </div>
    )
}


// SSG Dynamic needs getStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {

    // Get data
    const { data } = await api.get('episodes', {
        params: {
            _limit: 12,
            _sort: 'published_at',
            _order: 'desc'
        }
    });

    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id
            }
        }
    })

    // Incremental Static Regeneration
    return {
        paths,
        fallback: 'blocking'
    }
}

// SSG
export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;
    const { data } = await api.get(`/episodes/${slug}`)

    const episode = {
        id: data.id,
        title: data.title,
        thumbnail: data.thumbnail,
        members: data.members,
        publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
        durationAsString: ConvertDurationToTimeString(Number(data.file.duration)),
        description: data.description,
        url: data.file.url
    }

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24
    }
}

/*
Fallback: 'blocking' -> Não tenho á pagina estática,
irá fazer a requisição dos dados e construir a página,
depois de contruida irá mostrar na tela

Fallback: false -> Não tenho á pagina estática, retorna 404.
Fallback: true -> Não tenho á pagina estática, constroí no front-end.
*/