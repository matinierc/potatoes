import axios from 'axios';
import { Track } from '../utils/interfaces';
import { RECORD_STATUS } from '../utils/constants';

export const saveOriginalTrack = async (blob: Blob, track: Track) => {
    const fileName = `${track.id}.ogg`;
    const file = new File([blob], fileName);
    const formData = new FormData();

    formData.append('files.file', file);

    return axios.post('/saveOriginalTrack', formData
    ).then(() => {
        return {
            fileName, status: RECORD_STATUS.SUCCESS,
        };
    }).catch(err => {
        console.log(err);
        return {
            status: RECORD_STATUS.FAILED,
        };
    });
};

export const saveTracks = async (playlist: Track[]) => {
    const formData = new FormData();
    formData.append('playlist', JSON.stringify(playlist));

    return axios
        .post(
            '/saveTracks'
            , JSON.stringify(playlist)
            , { headers: { 'Content-Type': 'application/json' } },
        ).then(response => response)
        .catch(err => console.log(err));
};

export const getTracks = async () => {
    return axios
        .get('/tracks')
        .then(response => response?.data)
        .catch(err => console.log(err));
}

export const checkTracks = async () => {
    return axios
        .get('/check')
        .then(response => response?.data)
        .catch(err => console.log(err));
}

export const getCredentials = async () => {
    return axios
        .get('/credentials')
        .then(response => response?.data)
        .catch(err => console.log(err));
}

export const convertTracks = async () => {
    return axios
        .get('/convertTracks')
        .then(response => response?.data)
        .catch(err => console.log(err));
}

export const deleteTemps = async () => {
    return axios
        .get('/deleteTemps')
        .then(response => response?.data)
        .catch(err => console.log(err));
}

