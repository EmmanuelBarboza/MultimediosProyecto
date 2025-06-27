import axios from 'axios';

const API_URL = 'http://localhost/Grupo3_Multimedios/vista/API/';
const pedidoEndpoint = 'pedido.php';

export const obtenerPedidos = () => {
    return axios.get(`${API_URL}${pedidoEndpoint}`);
};

export const obtenerPedidoPorId = (id_pedido) => {
    return axios.get(`${API_URL}${pedidoEndpoint}?id_pedido=${id_pedido}`);
};

export const agregarPedido = (datos) => {
    return axios.post(`${API_URL}${pedidoEndpoint}`, datos);
};

export const actualizarPedido = (datos) => {
    return axios.put(`${API_URL}${pedidoEndpoint}?id_pedido=${datos.id_pedido}`, datos);
};

export const eliminarPedido = (id_pedido) => {
    return axios.delete(`${API_URL}${pedidoEndpoint}?id_pedido=${id_pedido}`);
};

export const obtenerDetallesPedido = (id_pedido) => {
    return axios.get(`${API_URL}detalle_pedido.php?id_pedido=${id_pedido}`);
};

export const agregarDetallePedido = (datos) => {
    return axios.post(`${API_URL}detalle_pedido.php`, datos);
};

export const actualizarDetallePedido = (datos) => {
    return axios.put(`${API_URL}detalle_pedido.php?id_detalle=${datos.id_detalle}`, datos);
};

export const eliminarDetallePedido = (id_detalle) => {
    return axios.delete(`${API_URL}detalle_pedido.php?id_detalle=${id_detalle}`);
};