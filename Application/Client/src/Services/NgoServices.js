import axios from 'axios';
const BASE_URL = 'http://localhost:9090/donar';

export const addToNgoPending = () =>
{
   return axios.get(`${BASE_URL}/c/1`);
}