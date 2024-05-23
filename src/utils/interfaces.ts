
export interface SpotifyTrack {
    track: {
        album: {
            images: [{ height: number, url: string }],
            release_date: string,
            name: string,
        },
        artists: [{ name: string }],
        id: string,
        name: string,
        track_number: number,
        duration_ms: number,
    }
};

export interface Track {
    imageUrl: string,
    artist: string,
    id: string,
    name: string,
    date: string,
    album: string,
    number: number,
    duration: number,
    status: string,
    file?: string,
};