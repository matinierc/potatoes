import React, { useState } from "react";

import { getPlaylist } from "../api/spotify";
import { saveTracks } from "../api/server";
import { usePotatoes } from "../providers/PotatoesProvider";
import { convertSpotifyPlaylist } from "../utils/converter";
import { SPOTIFY_URLS } from "../utils/constants";

const PlaylistWrapper = () => {
    const { token, setPlaylist } = usePotatoes();
    const [playlistId, setPlaylistId] = useState('7GFokuC11oDyhnXyt1Cc0t');

    const onClick = async () => {
        let result: any = await getPlaylist(token || '', playlistId);
        if (result?.data?.tracks?.items) {
            const tracks = convertSpotifyPlaylist(result?.data?.tracks?.items);
            setPlaylist(tracks);
            await saveTracks(tracks);
        }
    };

    const onChange = (event) => {
        console.log('>>> ON CHANGE', event.target.value);
        setPlaylistId(event.target.value.replace(SPOTIFY_URLS.SPOTIFY_DND, ''));
    };

    return (
        <div id="PlaylistWrapper">
            <input value={playlistId} onChange={onChange} />
            <button onClick={onClick} disabled={!playlistId}>
                Read playlist data
            </button>
        </div>
    )
}

export default PlaylistWrapper;