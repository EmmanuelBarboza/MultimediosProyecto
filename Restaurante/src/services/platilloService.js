import axios from 'axios';

const API_URL = 'http://localhost/Grupo3_Multimedios/vista/API/';
const platilloEndpoint = 'platillos.php'; // Usando un único endpoint RESTful

export const obtenerPlatillos = () => {
    return axios.get(`${API_URL}${platilloEndpoint}`);
};

export const obtenerPlatilloPorId = (id_platillo) => {
    return axios.get(`${API_URL}${platilloEndpoint}?id_platillo=${id_platillo}`);
};

export const agregarPlatillo = (datos) => {
    return axios.post(`${API_URL}${platilloEndpoint}`, datos);
};

export const actualizarPlatillo = (id_platillo, datos) => {
    return axios.put(`${API_URL}${platilloEndpoint}?id_platillo=${id_platillo}`, datos);
};

export const eliminarPlatillo = (id_platillo) => {
    return axios.delete(`${API_URL}${platilloEndpoint}?id_platillo=${id_platillo}`);
};