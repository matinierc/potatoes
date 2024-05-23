import React, { useCallback, useEffect, useState } from 'react';
import { useRecorder } from "../providers/RecorderProvider";
import {
    saveOriginalTrack,
    saveTracks,
    convertTracks,
    deleteTemps,
} from '../api/server';
import { usePotatoes } from '../providers/PotatoesProvider';
import { updateTrackStatus } from '../utils/playlist';
import { RECORD_STATUS } from '../utils/constants';

const Recorder = () => {
    const { playlist, playTrack, currentTrack, loadPlaylist } = usePotatoes();
    const { recording, blob, resetBlob } = useRecorder();
    const [processing, setProcessing] = useState<boolean>(false);

    const onStart = () => {
        resetBlob();
        playTrack();
    };

    const onConvert = async () => {
        setProcessing(true);
        await convertTracks();
        setProcessing(false);
    };

    const onClean = async () => {
        setProcessing(true);
        await deleteTemps();
        setProcessing(false);
    };

    // track save and next
    const saveFileAndNext = useCallback(async (blob: Blob) => {
        let file = null;
        let recordStatus = RECORD_STATUS.FAILED;
        try {
            const { fileName, status }: any = await saveOriginalTrack(blob, currentTrack)
            file = fileName;
            recordStatus = status;
            resetBlob();
        } catch (error) {
            console.log('>>> ERROR File saved', error);
        } finally {
            const updatedPlaylist = updateTrackStatus({
                ...currentTrack,
                file,
                status: recordStatus,
            },
                playlist,
            );
            await saveTracks(updatedPlaylist);
            await loadPlaylist();
            await playTrack(updatedPlaylist);
        }
    }, [currentTrack, loadPlaylist, playTrack, playlist, resetBlob]);

    useEffect(() => {
        if (blob) {
            saveFileAndNext(blob);
        }
    }, [blob, saveFileAndNext]);

    return (
        <div id='Recorder'>
            <button onClick={onStart} disabled={recording}>Start</button>
            <div />
            <button onClick={onConvert} disabled={recording || processing}>Convert</button>
            <button onClick={onClean} disabled={recording || processing}>Clean</button>
        </div>
    )
}

export default Recorder;