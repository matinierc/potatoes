import React, { useEffect, useState } from "react";
import ToggleButton from 'react-toggle-button';

import PlaylistWrapper from "./PlaylistWrapper";
import SpotifyPlayer from "./SpotifyPlayer";
import Recorder from "./Recorder";
import { usePotatoes } from "../providers/PotatoesProvider";
import { RECORD_STATUS } from "../utils/constants";
import { useRecorder } from "../providers/RecorderProvider";
import { Track } from "../utils/interfaces";

const Controls = () => {
    const {
        currentTrack,
        playlist,
        stopAfter,
        setStopAfter,
    } = usePotatoes();
    const {
        recording,
    } = useRecorder();
    const [status, setStatus] = useState<string>('Not ready');
    const [progressValue, setProgressValue] = useState<number>(0);
    const [percentage, setPercentage] = useState<number>(0);
    const [remaingTime, setRemaingTime] = useState<string>();
    const [progressMax, setProgressMax] = useState<number>(0);

    useEffect(() => {
        if (recording) {
            setStatus('Recording...');
        } else {
            setStatus('Ready');
        }
    }, [recording]);

    useEffect(() => {
        if (playlist) {
            setProgressMax(playlist.length);
        };
    }, [playlist]);

    useEffect(() => {
        if (playlist) {
            const dowloaded: Track[] = playlist.filter(({ status }) => status !== RECORD_STATUS.PENDING);
            const pending: Track[] = playlist.filter(({ status }) => status === RECORD_STATUS.PENDING);
            setProgressValue(dowloaded.length);
            setPercentage(Math.round((dowloaded.length * 100)/playlist.length));
            const millis = pending.reduce((acc, { duration}) => acc += duration, 0);
            const hour = Math.floor(millis/1000/60/60);
            const minutes = Math.floor((millis/1000/60/60 - hour)*60);
            const seconds = Math.floor(((millis/1000/60/60 - hour)*60 - minutes)*60);
            setRemaingTime(`${hour<10?'0'+hour:hour}:${minutes<10?'0'+minutes:minutes}:${seconds<10?'0'+seconds:seconds}`);
        }
    }, [currentTrack, playlist]);

    return (
        <div id='Controls'>
            <PlaylistWrapper />
            <SpotifyPlayer />
            <Recorder />
            <div style={{ display: 'inline-flex' }}>
                <span className="text">Stop after:</span>
                <ToggleButton
                    value={stopAfter || false}
                    onToggle={() => {
                        setStopAfter(!stopAfter)
                    }} />

            </div>
            <div className="text">
                <span>Status: {status}</span>
            </div>
            <div className="text">
                <span>Current: {currentTrack?.name || 'no track'}</span>
            </div>
            <progress value={progressValue} max={progressMax} />
            <span className="text"> {progressValue}/{progressMax}</span>
            <span className="text"> {percentage}%</span>
            <span className="text"> {remaingTime}</span>
        </div>
    )
}

export default Controls;