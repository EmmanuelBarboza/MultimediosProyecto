import axios from 'axios';

const API_URL = 'http://localhost/Grupo3_Multimedios/vista/API/';//cambiarlo segun donde tengan guardado el proyecto
const obtenerAPI = 'platillos.php';
const agregarAPI = 'platillos_insertar.php';
const actualizarAPI = 'platillos_actualizar.php';
const eliminarAPI = 'platillos_eliminar.php';

export const obtenerPlatillos = () => axios.get(`${API_URL}${obtenerAPI}`);

export const agregarPlatillo = (datos) =>
  axios.post(`${API_URL}${agregarAPI}`, datos);

export const actualizarPlatillo = (datos) =>
  axios.post(`${API_URL}${actualizarAPI}`, datos);

export const eliminarPlatillo = (id) =>
  axios.post(`${API_URL}${eliminarAPI}`, { id_platillo: id });