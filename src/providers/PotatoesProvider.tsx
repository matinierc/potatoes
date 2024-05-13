import React, {
  Context,
  useEffect,
  useMemo, useState,
} from 'react';
import { useContext } from 'react';

import { getToken, type TokenReponse } from '../api/spotify';
import { Track } from '../utils/interfaces';

export interface PotatoesContextType {
  currentTrack?: Track,
  token?: string,
  playlist?: Track[],
  recording: boolean;
  initialized: boolean;
  setToken: (input: string) => void,
  setPlaylist: (tracks: Track[]) => void,
  setCurrentTrack: (tracks: Track) => void,
  setInitialized: (input: boolean) => void,
  setRecording: (input: boolean) => void,
}

export const defaultValue: PotatoesContextType = {
  recording: false,
  initialized: false,
  setToken: () => { },
  setPlaylist: () => { },
  setCurrentTrack: () => { },
  setInitialized: () => { },
  setRecording: () => { },
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
  const [initialized, setInitialized] = useState(false);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    const getFirstToken = async () => {
      const response: TokenReponse = await getToken();
      setToken(response?.token);
    }
    if (!token) {
      getFirstToken()
    }

  }, [token]);

  const context = useMemo(
    () => ({
      currentTrack,
      token,
      playlist,
      initialized,
      recording,
      setToken,
      setCurrentTrack,
      setPlaylist,
      setInitialized,
      setRecording,
    }),
    [currentTrack, token, playlist, initialized, recording],
  );

  return (
    <PotatoesContext.Provider value={context}>
      {children}
    </PotatoesContext.Provider>
  );
};

export const usePotatoes = () => useContext(getPotatoesContext());

export default PotatoesProvider;
