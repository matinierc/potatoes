import axios from 'axios';
import { Track } from '../utils/interfaces';

export const saveFile = async (blob: Blob) => {
    console.log('>>> blob', blob)
    const data = {
      "user" : "test",
    };
    let file = new File([blob], 'recording.ogg');
  
    const formData = new FormData();
    formData.append('files.file', file);
    formData.append('data', JSON.stringify(data));

    return axios
        .post(
            '/save',
            formData
        ).then(response => {
            return response;
        }).catch(err => {
            console.log(err);
        });
};

export const saveTracks = async (playlist: Track[]) => {
    const formData = new FormData();
    formData.append('playlist', JSON.stringify(playlist));

    return axios
        .post(
            '/saveTracks'
            , JSON.stringify(playlist)
            , { headers: {'Content-Type': 'application/json' }},
        ).then(response => {
            return response;
        }).catch(err => {
            console.log(err);
        });
};

