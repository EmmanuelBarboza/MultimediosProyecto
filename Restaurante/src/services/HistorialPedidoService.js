import axios from 'axios';

const API_URL = 'http://localhost/Grupo3_Multimedios/vista/API/';
const HistorialPedidoEndpoint = 'HistorialPedido.php'; 

//Obtener la lista de los Hitoriales de pedidos
export const obtenerHistorialPedidos = () => {
    return axios.get(`${API_URL}${HistorialPedidoEndpoint}`);
};

// Para AGREGAR (POST): Los datos del historial del pedido en el cuerpo
export const agregarHistorialPed = (datos) => {
    return axios.post(`${API_URL}${HistorialPedidoEndpoint}`, datos);
};

// Para ELIMINAR (DELETE): El ID del historial del pedido en la URL
export const eliminarHistorialPed = (id_historial_pedido) => {
    return axios.delete(`${API_URL}${HistorialPedidoEndpoint}?id_historial_pedido=${id_historial_pedido}`);
};

// Para ACTUALIZAR (PUT): El ID en la URL y el estado actualizado del pedido en el cuerpo
export const actualizarHistorialPed = (id_categoria, datos) => {
    return axios.put(`${API_URL}${HistorialPedidoEndpoint}?id_historial_pedido=${id_historial_pedido}`, datos);
};

// (Opcional) Para obtener el historial del pedido por ID del pedido
export const obtenerhistorialPorIdPedido = (id_pedido) => {
    return axios.get(`${API_URL}${HistorialPedidoEndpoint}?id_inventario=${id_inventario}`);
};