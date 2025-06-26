import axios from 'axios';

const API_URL = 'http://localhost/Grupo3_Multimedios/vista/API/';
const reservacionEndpoint = 'reservaciones.php';

export const obtenerReservaciones = () => {
    return axios.get(`${API_URL}${reservacionEndpoint}`);
};

export const obtenerReservacionPorId = (id_reservacion) => {
    return axios.get(`${API_URL}${reservacionEndpoint}?id_reservacion=${id_reservacion}`);
};

export const agregarReservacion = (datos) => {
    return axios.post(`${API_URL}${reservacionEndpoint}`, datos);
};

export const actualizarReservacion = (id_reservacion, datos) => {
    console.log(`Actualizando reservación con ID: ${id_reservacion}`, datos);
    return axios.put(`${API_URL}${reservacionEndpoint}?id_reservacion=${id_reservacion}`, datos);
};

export const eliminarReservacion = (id_reservacion) => {
    return axios.delete(`${API_URL}${reservacionEndpoint}?id_reservacion=${id_reservacion}`);
};