import axios from 'axios';
const BASE_URL = 'http://localhost:9090/donar';

export const signUp = () =>
{
   return axios.get(`${BASE_URL}/donar/1`);
}