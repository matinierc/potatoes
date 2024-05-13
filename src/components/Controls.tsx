import React, { useCallback, useEffect, useState } from "react";
import PlaylistWrapper from "./PlaylistWrapper";
import SpotifyPlayer from "./SpotifyPlayer";
import Recorder from "./Recorder";
import { usePotatoes } from "../providers/PotatoesProvider";

const Controls = () => {
    const { currentTrack, recording, initialized } = usePotatoes();
    const [status, setStatus] = useState<string>('Not ready');

    useEffect(()=> {
        if (initialized) {
            if (recording) {
                setStatus('Recording...');
            } else {
                setStatus('Ready');
            }
        } else {
            setStatus('Not ready');
        }
    }, [initialized, recording]);

    return (
        <div id='Controls'>
            <PlaylistWrapper />
            <SpotifyPlayer />
            <Recorder />
            <div className="text">
                <span>Status: {status}</span>
            </div>

            <span className="text">Current: {currentTrack?.name || 'no track'}</span>
        </div>
    )
}

export default Controls;