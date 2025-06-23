import axios from 'axios';

const API_URL = 'http://localhost/Grupo3/Grupo3_Multimedios/vista/API/';//cambiarlo segun donde tengan guardado el proyecto
const obtenerAPI = 'usuarios.php';
const agregarAPI = 'platillos_insertar.php';
const actualizarAPI = 'platillos_actualizar.php';
const eliminarAPI = 'platillos_eliminar.php';

export const obtenerUsuarios = () => axios.get(`${API_URL}${obtenerAPI}`);

export const agregarUsuarios = (datos) =>
  axios.post(`${API_URL}${obtenerAPI}`, datos);

export const actualizarUsuarios = (datos) =>
  axios.post(`${API_URL}${obtenerAPI}`, datos);

export const eliminarUsuarios = (id) =>
  axios.post(`${API_URL}${obtenerAPI}`, { id_usuario: id });