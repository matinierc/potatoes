import React, { useState, useEffect } from "react";
import { usePotatoes } from "../providers/PotatoesProvider";

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
  const [controller, setController] = useState<SpotifyEmbedController>();
  const [recording, setRecording] = useState<boolean>()
  const [playBackData, setPlayBackData] = useState<PlayBackData>()

  useEffect(() => {
    if (playBackData) {
      const { isPaused } = playBackData;
      if (isPaused && !recording) {
        setRecording(true);
      }
    }
  }, [playBackData, recording]);
  
  const onReady = (EmbedController) => {
    setController(EmbedController);
    EmbedController.addListener('ready', (data) => {
      console.log('>>> ready', data);
    });
    EmbedController.addListener('error', (data) => {
      console.log('>>> error', data);
    });

    EmbedController.addListener('playback_update', ({ data}: { data: PlayBackData}) => {
      setPlayBackData(data);
    });
  };

  (window as any).onSpotifyIframeApiReady = (IFrameAPI) => {
    const element = document.getElementById('embed-iframe');
    IFrameAPI.createController(element, {}, onReady);
  };

  useEffect(() => {
    if (currentTrack) {
      if (controller) {
        console.log('>>> SpotifyPlayer:play', currentTrack);
        // controller.loadUri(`spotify:track:${currentTrack.id}`);
        // controller.play();
      }
    }
  }, [controller, currentTrack]);

  return (
    <div id='SpotifyPlayer' />
  )
}

export default SpotifyPlayer;