import axios from 'axios';

const API_URL = 'http://localhost/Grupo3_Multimedios/vista/API/';
const pedidoEndpoint = 'pedido.php';

export const obtenerPedidos = () => {
    return axios.get(`${API_URL}${pedidoEndpoint}`);
};

export const agregarPedidos = (datos) => {
    return axios.post(`${API_URL}${pedidoEndpoint}`, datos);
};

export const actualizarPedidos = (id_pedido, datos) => {
    return axios.put(`${API_URL}${pedidoEndpoint}?id_pedido=${id_pedido}`, datos);
};

export const eliminarPedidos = (id_pedido) => {
    return axios.delete(`${API_URL}${pedidoEndpoint}?id_pedido=${id_pedido}`);
};

export const obtenerPedidoPorId = (id_pedido) => {
    return axios.get(`${API_URL}${pedidoEndpoint}?id_pedido=${id_pedido}`);
};
