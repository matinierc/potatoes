import React, {
  Context,
  useCallback,
  useEffect,
  useMemo, useRef, useState,
} from 'react';
import { useContext } from 'react';


export interface RecorderContextType {
  initMediaStream: () => void,
  setStartRecording: (input: boolean) => void,
  setStopRecording: (input: boolean) => void,
  resetBlob: () => void,
  blob?: Blob,
  recording: boolean;
}

export const defaultValue: RecorderContextType = {
  initMediaStream: () => { },
  setStartRecording: () => { },
  setStopRecording: () => { },
  resetBlob: () => {},
  recording: false,
};

let recorderContext: Context<RecorderContextType>;

const getRecorderContext = () => {
  if (!recorderContext) {
    recorderContext = React.createContext<RecorderContextType>(defaultValue);
  }
  return recorderContext;
}

interface RecorderProviderProps {
  children: React.ReactNode | React.ReactNode[] | null;
}

const RecorderProvider: React.FC<RecorderProviderProps> = ({
  children,
}) => {
  const RecorderContext = getRecorderContext();
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(null);
  const [blob, setBlob] = useState<Blob>();
  const audioBlobs = useRef([]);
  // const initialized = useRef<boolean>(false);
  const locked = useRef<boolean>(false);
  const [initialized, setInitialized] = useState<boolean>(false);
  const [startRecording, setStartRecording] = useState<boolean>();
  const [stopRecording, setStopRecording] = useState<boolean>();
  const [recording, setRecording] = useState(false);

  // Mediastream callbacks
  const onDataAvailable = useCallback((event) => {
    audioBlobs.current.push(event.data);
  }, []);

  const onStopRecording = useCallback((event) => {
    const cblob = new Blob(audioBlobs.current, { type: event.srcElement.mimeType });
    setBlob(cblob);
    setRecording(false);
  }, []);

  // Initialisation
  const initMediaStream = useCallback(() => {
    const initMediaRecorder = async () => {
      if (!mediaRecorder) {
        try {
          const stream = await (navigator as any).mediaDevices.getDisplayMedia({
            audio: {
              suppressLocalAudioPlayback: false,
              autoGainControl: false,
              echoCancellation: false,
              googAutoGainControl: false,
              noiseSuppression: false,
              sampleRate: 48_000,
            },
            video: true,
            systemAudio: 'exclude',
            preferCurrentTab: true,
            selfBrowserSurface: 'include',
            surfaceSwitching: 'include',
            monitorTypeSurfaces: 'include',
          });
          const audioStream = new MediaStream();

          for (const track of stream.getAudioTracks()) {
            audioStream.addTrack(track);
          }

          const mediaRecorder = new MediaRecorder(audioStream);

          mediaRecorder.ondataavailable = onDataAvailable;
          mediaRecorder.onstop = onStopRecording;

          setMediaRecorder(mediaRecorder);
        } catch (error) {
          console.log('Error on get outputstream', error);
          setRecording(false);
        }
      }
    }

    if (!initialized) {
      initMediaRecorder();
    }
  }, [initialized, mediaRecorder, onDataAvailable, onStopRecording, setRecording]);


  useEffect(() => {
    if (!initialized && !locked.current) {
      locked.current = true;
      setInitialized(true);
      initMediaStream();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const start = useCallback(async () => {
    try {
      audioBlobs.current = [];
      setBlob(null);
      setRecording(true);
      mediaRecorder.start();
    } catch (error) {
      console.log('RecorderProvider::Error on get outputstream', error);
      setRecording(false);
    }
  }, [mediaRecorder, setRecording]);

  useEffect(() => {
    if (startRecording) {
      start();
      setStartRecording(false);
    }
  }, [mediaRecorder, start, startRecording]);

  const stop = useCallback(() => {
    setRecording(false);
    mediaRecorder.stop();
  }, [mediaRecorder, setRecording]);

  useEffect(() => {
    if (stopRecording) {
      stop();
      setStopRecording(false);
    }
  }, [stop, stopRecording]);

  const resetBlob = () => {
    setBlob(null);
  };

  const context = useMemo(
    () => ({
      initMediaStream,
      stopRecording,
      blob,
      recording,
      setStartRecording,
      setStopRecording,
      resetBlob,
    }),
    [blob, initMediaStream, recording, stopRecording],
  );

  return (
    <RecorderContext.Provider value={context}>
      {children}
    </RecorderContext.Provider>
  );
};

export const useRecorder = () => useContext(getRecorderContext());

export default RecorderProvider;
