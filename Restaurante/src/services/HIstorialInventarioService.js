import axios from 'axios';

const API_URL = 'http://localhost/Grupo3_Multimedios/vista/API/';
const HistorialInventarioEndpoint = 'HistorialInventario.php'; 

export const obtenerCategorias = () => {
    return axios.get(`${API_URL}${HistorialInventarioEndpoint}`);
};

// Para AGREGAR (POST): Los datos del historial del inventario en el cuerpo
export const agregarHistorialInv = (datos) => {
    return axios.post(`${API_URL}${HistorialInventarioEndpoint}`, datos);
};

// Para ELIMINAR (DELETE): El ID del historial del invenatio en la URL
export const eliminarCategoria = (id_historial_inventario) => {
    return axios.delete(`${API_URL}${HistorialInventarioEndpoint}?id_historial_inventario=${id_historial_inventario}`);
};

// (Opcional) Para obtener el historial del inventario por ID del inventario
export const obtenerCategoriaPorId = (id_inventario) => {
    return axios.get(`${API_URL}${HistorialInventarioEndpoint}?id_inventario=${id_inventario}`);
};