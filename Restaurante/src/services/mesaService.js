import axios from 'axios';

const API_URL = 'http://localhost/Grupo3_Multimedios/vista/API/';
const mesaEndpoint = 'mesas.php';

export const obtenerMesas = () => {
    return axios.get(`${API_URL}${mesaEndpoint}`);
};

export const obtenerMesaPorId = (id_mesa) => {
    return axios.get(`${API_URL}${mesaEndpoint}?id_mesa=${id_mesa}`);
};

export const agregarMesa = (datos) => {
    return axios.post(`${API_URL}${mesaEndpoint}`, datos, {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const actualizarMesa = (datos) => {
    return axios.put(`${API_URL}${mesaEndpoint}?id_mesa=${datos.id_mesa}`, datos, {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const eliminarMesa = (id_mesa) => {
    return axios.delete(`${API_URL}${mesaEndpoint}?id_mesa=${id_mesa}`, {
        headers: { 'Content-Type': 'application/json' }
    });
};
