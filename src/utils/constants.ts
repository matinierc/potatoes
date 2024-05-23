export const SPOTIFY_URLS = {
    SPOTIFY_DND: 'https://open.spotify.com/playlist/',
    TOKEN: 'https://accounts.spotify.com/api/token',
    PLAYLIST: 'https://api.spotify.com/v1/playlists/playlistId/tracks?fields=next,items(track(id,name,track_number,duration_ms,album(name,images,release_date),artists(name,id)))',
    TRACK: 'https://api.spotify.com/v1/tracks/',
    PLAYER: 'https://api.spotify.com/v1/me/player',
};

export const RECORD_STATUS = {
    PENDING: 'PENDING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
}