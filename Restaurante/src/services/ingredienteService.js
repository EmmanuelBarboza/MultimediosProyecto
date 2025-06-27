import axios from 'axios';

const API_URL = 'http://localhost/Grupo3_Multimedios/vista/API/';
const ingredienteEndpoint = 'ingredientes.php';

export const obtenerIngredientes = () => {
    return axios.get(`${API_URL}${ingredienteEndpoint}`);
};

export const obtenerIngredientePorId = (id_ingrediente) => {
    return axios.get(`${API_URL}${ingredienteEndpoint}?id_ingrediente=${id_ingrediente}`);
};

export const agregarIngrediente = (datos) => {
    return axios.post(`${API_URL}${ingredienteEndpoint}`, datos);
};

export const actualizarIngrediente = (datos) => {
    console.log(`Actualizando ingrediente con ID: ${datos.id_ingrediente}`, datos);
    return axios.put(`${API_URL}${ingredienteEndpoint}?id_ingrediente=${datos.id_ingrediente}`, datos);
};

export const eliminarIngrediente = (id_ingrediente) => {
    return axios.delete(`${API_URL}${ingredienteEndpoint}?id_ingrediente=${id_ingrediente}`);
};