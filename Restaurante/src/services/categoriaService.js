import axios from 'axios';

const API_URL = 'http://localhost/vista/API/';
const obtenerAPI = 'categorias.php';
const agregarAPI = 'categorias_insertar.php';
const actualizarAPI = 'categorias_actualizar.php';
const eliminarAPI = 'categorias_eliminar.php';

export const obtenerCategorias = () => axios.get(`${API_URL}${obtenerAPI}`);

export const agregarCategoria = (datos) => 
  axios.post(`${API_URL}${agregarAPI}`, datos);

export const actualizarCategoria = (datos) => 
  axios.post(`${API_URL}${actualizarAPI}`, datos);

export const eliminarCategoria = (id) => 
  axios.post(`${API_URL}${eliminarAPI}`, { id_categoria: id });
