import axios from 'axios';
import { SPOTIFY_URLS } from '../utils/constants';
import { serialize } from '../utils/authentification';

// TODO Store in file
const client_id = 'bffdd70b9890448ab87275d0ec196e40';
const client_secret = '63146780a2684308bf1b0897bcaab505';

export interface TokenReponse {
    token?: string;
    expiresIn?: number;
}

export const getToken = async (): Promise<TokenReponse> => axios
.post(
    SPOTIFY_URLS.TOKEN,
    serialize({ grant_type: 'client_credentials' }),
    { headers: { 'Authorization': 'Basic ' + btoa(client_id + ':' + client_secret)}}
).then(response => {
    const { access_token: token, expires_in: expiresIn } = response?.data;
    return { token, expiresIn };
}).catch(err => {
    console.log(err);
    return {};
});

export const getPlaylist = async (token: string, playlistId: string) => axios
.get(
    SPOTIFY_URLS.PLAYLIST + playlistId,
    { headers: { 'Authorization': 'Bearer ' +token}}
).then(response => {
    return response;
}).catch(err => {
    console.log(err);
});

export const getTrack = async (token: string, trackId: string) => axios
.get(
    SPOTIFY_URLS.TRACK + trackId,
    { headers: { 'Authorization': 'Bearer ' +token}}
).then(response => {
    return response;
}).catch(err => {
    console.log(err);
});

export const getPlayer = async (token: string) => axios
.get(
    SPOTIFY_URLS.PLAYER,
    { headers: { 'Authorization': 'Bearer ' +token}}
).then(response => {
    return response;
}).catch(err => {
    console.log(err);
});

