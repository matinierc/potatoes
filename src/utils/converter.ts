import { RECORD_STATUS } from "./constants";
import { SpotifyTrack, Track } from "./interfaces";

export const convertSpotifyTrack = (track: SpotifyTrack): Track => ({
    imageUrl: track?.track?.album?.images?.find(({ height }) => height === 300)?.url || '',
    artist: track?.track?.artists[0]?.name,
    id: track?.track?.id,
    name: track?.track?.name,
    status: RECORD_STATUS.PENDING,
});

export const convertSpotifyPlaylist = (playlist: SpotifyTrack[]): Track[] => (
    playlist.map(convertSpotifyTrack)
);