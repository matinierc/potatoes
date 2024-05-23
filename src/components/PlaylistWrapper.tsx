import React, { useState } from "react";

import { getPlaylist } from "../api/spotify";
import { saveTracks } from "../api/server";
import { usePotatoes } from "../providers/PotatoesProvider";
import { convertSpotifyPlaylist } from "../utils/converter";
import { SPOTIFY_URLS } from "../utils/constants";
import { Track } from "../utils/interfaces";
import { useRecorder } from "../providers/RecorderProvider";

const PlaylistWrapper = () => {
    const { token, setPlaylist, setPlaylistLoading } = usePotatoes();
    const { recording } = useRecorder();
    // const [playlistId, setPlaylistId] = useState('7GFokuC11oDyhnXyt1Cc0t');
    const [playlistId, setPlaylistId] = useState('4MrgUxsMsrgtCvddsQaDno');

    const onClick = async () => {
        setPlaylistLoading(true);
        let { data: { items, next }}: any = await getPlaylist(token || '', SPOTIFY_URLS.PLAYLIST.replace('playlistId', playlistId));
        let tracks: Track[] = [];

        if (items) {
            tracks = tracks.concat(convertSpotifyPlaylist(items));

            while(next) {
                ({ data: { items, next } } = (await getPlaylist(token || '', next)) as any);
                tracks = tracks.concat(convertSpotifyPlaylist(items));
            }

            setPlaylist(tracks);
            await saveTracks(tracks);
        }
        setPlaylistLoading(false);
        setPlaylistId('');
    };

    const onChange = (event) => {
        setPlaylistId(null);
        setPlaylistId(event.target.value.replace(SPOTIFY_URLS.SPOTIFY_DND, ''));
    };

    return (
        <div id="PlaylistWrapper">
            <input value={playlistId} onChange={onChange} />
            <button onClick={onClick} disabled={!playlistId || recording}>
                Read playlist data
            </button>
        </div>
    )
}

export default PlaylistWrapper;