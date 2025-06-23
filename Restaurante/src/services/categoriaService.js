import axios from 'axios';

const API_URL = 'http://localhost/Grupo3_Multimedios/vista/API/';
const categoriaEndpoint = 'categorias.php'; 

export const obtenerCategorias = () => {
    return axios.get(`${API_URL}${categoriaEndpoint}`);
};

// Para AGREGAR (POST): Los datos de la nueva categoría en el cuerpo
export const agregarCategoria = (datos) => {
    return axios.post(`${API_URL}${categoriaEndpoint}`, datos);
};

// Para ACTUALIZAR (PUT): El ID en la URL y los datos de la categoría en el cuerpo
export const actualizarCategoria = (id_categoria, datos) => {
    return axios.put(`${API_URL}${categoriaEndpoint}?id_categoria=${id_categoria}`, datos);
};

// Para ELIMINAR (DELETE): El ID en la URL
export const eliminarCategoria = (id_categoria) => {
    return axios.delete(`${API_URL}${categoriaEndpoint}?id_categoria=${id_categoria}`);
};

// (Opcional) Para obtener una categoría por ID
export const obtenerCategoriaPorId = (id_categoria) => {
    return axios.get(`${API_URL}${categoriaEndpoint}?id_categoria=${id_categoria}`);
};