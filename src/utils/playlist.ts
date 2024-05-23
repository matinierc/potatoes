import { Track } from "./interfaces";

export const updateTrackStatus = (savedTrack: Track, playlist: Track[]): Track[] => playlist.map((current) => {
    if (current.id === savedTrack.id) {
        return {
            ...savedTrack,
        }
    }
    return current;
});

