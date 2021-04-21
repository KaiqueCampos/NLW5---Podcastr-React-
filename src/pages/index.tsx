//Does the complete typing of the function -> Parameters  and Return (can be done separately as well)
import { GetStaticProps } from 'next';
import { api } from '../services/Api';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { ConvertDurationToTimeString } from '../utils/convertDurationToTimeString';

// types
type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  durationAsString: string;
  description: string;
  url: string;
}

type HomeProps = {
  // Array with Episode type
  episodes: Episode[]
}

export default function Home(props: HomeProps) {
  return (
    <div>
      <h1>Hello my friend</h1>
      <p>{JSON.stringify(props.episodes)}</p>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  // Get data
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  });

  // Formatting data
  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      durationAsString: ConvertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    }
  })

  // Return data (SSG)
  return {
    props: {
      episodes,
    },
    revalidate: 60 * 60 * 8,
  }
}

// OBS: Formatting data within the return will execute it in all rendering, it is not performatic.
// So always format them before they reach the component!


