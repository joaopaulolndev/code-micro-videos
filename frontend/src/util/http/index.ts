import axios from 'axios';

export const httpVideo = axios.create({
  baseURL: process.env.REACT_APP_MICROSERVICE_VIDEOS_API_URL,
});
