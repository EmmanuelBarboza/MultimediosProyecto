import axios from 'axios';
const API_URL = 'http://localhost/Grupo3/Grupo3_Multimedios/vista/API/';//cambiarlo segun donde tengan guardado el proyecto
const obtenerAPI = 'ingredientes.php';
const agregarAPI = 'ingredientes_insertar.php';
const actualizarAPI = 'ingredientes_actualizar.php';
const eliminarAPI = 'ingredientes_eliminar.php';

export const obtenerIngredientes = () => axios.get(`${API_URL}${obtenerAPI}`);

export const agregarIngrediente = (datos) =>
  axios.post(`${API_URL}${agregarAPI}`, datos);

export const actualizarIngrediente = (datos) =>
  axios.post(`${API_URL}${actualizarAPI}`, datos);

export const eliminarIngrediente = (id) =>
  axios.post(`${API_URL}${eliminarAPI}`, { id_ingrediente: id });
