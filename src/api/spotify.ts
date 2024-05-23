import axios from 'axios';
import { SPOTIFY_URLS } from '../utils/constants';
import { serialize } from '../utils/authentification';

export interface TokenReponse {
    token?: string;
    expiresIn?: number;
}

export const getToken = async (clientId, clientSecret): Promise<TokenReponse> => axios
.post(
    SPOTIFY_URLS.TOKEN,
    serialize({ grant_type: 'client_credentials' }),
    { headers: { 'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)}}
).then(response => {
    const { access_token: token, expires_in: expiresIn } = response?.data;
    return { token, expiresIn };
}).catch(err => {
    console.log(err);
    return {};
});

export const getPlaylist = async (token: string, url: string) => axios
.get(
    url,
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

