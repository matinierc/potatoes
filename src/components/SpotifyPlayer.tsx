import React, { useState, useEffect, useCallback } from "react";
import { usePotatoes } from "../providers/PotatoesProvider";
import {useRecorder} from "../providers/RecorderProvider";

type SpotifyEmbedController = {
  loadUri: (string) => void;
  play: () => void;
};
type PlayBackData = {
  duration: number;
  isBuffering: boolean;
  isPaused: boolean;
  position: number;
}

const SpotifyPlayer = () => {
  const { currentTrack } = usePotatoes();
  const { setStartRecording, setStopRecording } = useRecorder();
  const [controller, setController] = useState<SpotifyEmbedController>();
  const [playBackData, setPlayBackData] = useState<PlayBackData>()

  useEffect(() => {
    if (playBackData) {
      const { isPaused } = playBackData;
      if (isPaused) {
        setStopRecording(true);
      }
    }
  }, [playBackData, setStopRecording]);
  
  const onReady = useCallback((EmbedController) => {
    setController(EmbedController);
    EmbedController.addListener('ready', (data) => {
      setStartRecording(true);
    });
    EmbedController.addListener('error', (data) => {
      console.log('>>> SpotifyPlayer::error', data);
    });

    EmbedController.addListener('playback_update', ({ data}: { data: PlayBackData}) => {
      setPlayBackData(data);
    });
  }, [setStartRecording]);

  (window as any).onSpotifyIframeApiReady = (IFrameAPI) => {
    const element = document.getElementById('embed-iframe');
    IFrameAPI.createController(element, {}, onReady);
  };

  useEffect(() => {
    if (currentTrack) {
      if (controller) {
        controller.loadUri(`spotify:track:${currentTrack.id}`);
        controller.play();
      } else {
        console.log('>>> SpotifyPlayer:play NO CONTROLLER !!!');
      }
    }
  }, [controller, currentTrack]);

  return (
    <div id='SpotifyPlayer' />
  )
}

export default SpotifyPlayer;