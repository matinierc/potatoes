
export interface SpotifyTrack {
    track: {
        album: {
            images: [{ height: number, url: string }]
        },
        artists: [{ name: string }],
        id: string,
        name: string,
    }
};

export interface Track {
    imageUrl: string,
    artist: string,
    id: string,
    name: string,
    status: string,
};