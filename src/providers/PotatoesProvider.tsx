import React, {
  Context,
  useEffect,
  useMemo, useState, useCallback,
  useRef
} from 'react';
import { useContext } from 'react';

import { getToken, type TokenReponse } from '../api/spotify';
import { getCredentials, getTracks } from '../api/server';
import { Track } from '../utils/interfaces';
import { RECORD_STATUS } from '../utils/constants';

export interface PotatoesContextType {
  stopAfter: boolean,
  currentTrack?: Track,
  token?: string,
  playlist?: Track[],
  playlistLoading: boolean;
  setToken: (input: string) => void,
  setPlaylist: (tracks: Track[]) => void,
  playTrack: (pl?: Track[]) => void,
  setPlaylistLoading: (input: boolean) => void,
  setStopAfter: (input: boolean) => void,
  loadPlaylist: () => void,
}

export const defaultValue: PotatoesContextType = {
  stopAfter: false,
  playlistLoading: false,
  setToken: () => { },
  setPlaylist: () => { },
  playTrack: () => { },
  setPlaylistLoading: () => { },
  setStopAfter: () => { },
  loadPlaylist: () => { },
};

let potatoesContext: Context<PotatoesContextType>;

const getPotatoesContext = () => {
  if (!potatoesContext) {
    potatoesContext = React.createContext<PotatoesContextType>(defaultValue);
  }
  return potatoesContext;
}

interface PotatoesProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

const PotatoesProvider: React.FC<PotatoesProviderProps> = ({
  children,
}) => {
  const PotatoesContext = getPotatoesContext();
  const [token, setToken] = useState<string>();
  const [playlist, setPlaylist] = useState<Track[]>();
  const [currentTrack, setCurrentTrack] = useState<Track>();
  const [playlistLoading, setPlaylistLoading] = useState(false);
  const [stopAfter, setStopAfter] = useState(false);

  useEffect(() => {
    const getFirstToken = async () => {
      const { clientId, clientSecret } = await getCredentials();
      const response: TokenReponse = await getToken(clientId, clientSecret);
      setToken(response?.token);
    }
    if (!token) {
      getFirstToken()
    }

  }, [token]);

  const loadPlaylist = useCallback(async () => {
    setPlaylistLoading(true);
    const tracks = await getTracks();
    setPlaylist(tracks);
    setPlaylistLoading(false);
  }, [])

  const playTrack = useCallback((given: Track[]) => {
    if (given) {
      setPlaylist(given);
    }
    if(playlist || given) {
      if (!stopAfter) {
        const track: Track = (given || playlist).find(({ status }) => status === RECORD_STATUS.PENDING);
        if (track) {
            setCurrentTrack(track);
        }
      } else {
        setStopAfter(false);
      }
    }
  }, [playlist, stopAfter])

  useEffect(() => {
    if (!playlist?.length && !playlistLoading) {
      loadPlaylist();
    }
  }, [loadPlaylist, playlist, playlistLoading]);

  const context = useMemo(
    () => ({
      stopAfter,
      currentTrack,
      token,
      playlist,
      playlistLoading,
      playTrack,
      setToken,
      setPlaylist,
      setPlaylistLoading,
      setStopAfter,
      loadPlaylist,
    }),
    [stopAfter, currentTrack, token, playlist, playlistLoading, playTrack, loadPlaylist],
  );

  return (
    <PotatoesContext.Provider value={context}>
      {children}
    </PotatoesContext.Provider>
  );
};

export const usePotatoes = () => useContext(getPotatoesContext());

export default PotatoesProvider;

