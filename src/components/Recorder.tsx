import React, { useEffect } from 'react';
import useRecorder from "../hooks/useRecorder";
import { saveFile } from '../api/server';
import { usePotatoes } from '../providers/PotatoesProvider';
import { RECORD_STATUS } from '../utils/constants';
import { Track } from '../utils/interfaces';

const Recorder = () => {
    const { initialized, recording, playlist, setCurrentTrack } = usePotatoes();
    const {
        startRecording,
        stopRecording,
        initMediaStream,
        blob,
    } = useRecorder();

    const onStart = () => {
        // Get next track
        const track: Track = playlist.find(({ status }) => status === RECORD_STATUS.PENDING);
        console.log('>>> Next track', track);
        if (track) {
            setCurrentTrack(track);
            // Launch player;
        }
        // startRecording();
    };
    const onStop = () => {
        stopRecording();
    };
    const onInit = () => {
        initMediaStream();
    };

    useEffect(() => {
        if (blob) {
            saveFile(blob);
        }
    }, [blob]);
      
    return (
        <div id='Recorder'>
            <button onClick={onInit} disabled={initialized}>Init</button>
            <button onClick={onStart} disabled={!initialized || recording}>Start</button>
            <button onClick={onStop} disabled={!initialized || !recording}>Stop</button>
        </div>
    )
}

export default Recorder;