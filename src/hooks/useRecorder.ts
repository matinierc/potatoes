import { useCallback, useRef, useState } from "react";
import { usePotatoes } from "../providers/PotatoesProvider";

interface RecordOuput {
    initMediaStream: () => void;
    startRecording: () => void;
    stopRecording: () => void;
    blobUrl: string;
    blob: Blob;
}

const useRecorder = (): RecordOuput => {
    const { setInitialized, initialized, setRecording } = usePotatoes();
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>(null);
    const [blobUrl, setBlobUrl] = useState<string>();
    const [blob, setBlob] = useState<Blob>();
    const audioBlobs = useRef([]);

    const onDataAvailable = useCallback((event) => {
        audioBlobs.current.push(event.data);
    }, []);

    const onStopRecording = useCallback((event) => {
        const cblob = new Blob(audioBlobs.current, { type: event.srcElement.mimeType});
        setBlob(cblob);
        setBlobUrl(URL.createObjectURL(cblob));
    }, []);

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
                    setInitialized(true);
                    console.log('>>> Recorder::MediaStream initialized',)
                } catch (error) {
                    console.log('Error on get outputstream', error);
                    setRecording(false);
                }
            }
        }

        if (!initialized) {
            initMediaRecorder();
        }
    }, [initialized, mediaRecorder, onDataAvailable, onStopRecording, setInitialized, setRecording]);

    const startRecording = useCallback(async () => {
        try {
            audioBlobs.current = [];
            setRecording(true);
            mediaRecorder.start();
        } catch (error) {
            console.log('Error on get outputstream', error);
            setRecording(false);
        }
    }, [mediaRecorder, setRecording]);

    const stopRecording = useCallback(() => {
        setRecording(false);
        mediaRecorder.stop();
    }, [mediaRecorder, setRecording]);

    return {
        initMediaStream,
        startRecording,
        stopRecording,
        blobUrl,
        blob,
    }

};

export default useRecorder;