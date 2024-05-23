import { RECORD_STATUS } from "./constants";
import { SpotifyTrack, Track } from "./interfaces";

export const convertSpotifyTrack = ({ track }: SpotifyTrack): Track => ({
    imageUrl: track?.album?.images?.find(({ height }) => height === 300)?.url || '',
    artist: track?.artists.map((artist) => artist.name).join(', '),
    id: track?.id,
    name: track?.name,
    date: track?.album?.release_date,
    album: track?.album?.name,
    number: track?.track_number,
    duration: track?.duration_ms,
    status: RECORD_STATUS.PENDING,
});

export const convertSpotifyPlaylist = (playlist: SpotifyTrack[]): Track[] => (
    playlist.map(convertSpotifyTrack)
);