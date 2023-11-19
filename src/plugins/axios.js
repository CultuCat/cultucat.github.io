
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://cultucat.hemanuelpc.es',
});

export default {
    install: (app) => {
        app.config.globalProperties.$axios = instance;
    },
  };