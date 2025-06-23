
import axios from 'axios';

const API_URL = 'http://localhost/Grupo3_Multimedios/vista/API/';
const usuarioEndpoint = 'usuarios.php'; 

export const obtenerUsuarios = () => {
    return axios.get(`${API_URL}${usuarioEndpoint}`);
};

// Para AGREGAR (POST): Los datos del nuevo usuario en el cuerpo.
export const agregarUsuarios = (datos) => {
    return axios.post(`${API_URL}${usuarioEndpoint}`, datos);
};

// Para ACTUALIZAR (PUT): El ID en la URL y los datos del usuario en el cuerpo.
export const actualizarUsuarios = (id_usuario, datos) => {
    return axios.put(`${API_URL}${usuarioEndpoint}?id_usuario=${id_usuario}`, datos);
};

// Para ELIMINAR (DELETE): El ID en la URL.
export const eliminarUsuarios = (id_usuario) => {
    return axios.delete(`${API_URL}${usuarioEndpoint}?id_usuario=${id_usuario}`);
};

// (Opcional) Para obtener un usuario por ID (si tu UI lo necesita en el futuro)
export const obtenerUsuarioPorId = (id_usuario) => {
    return axios.get(`${API_URL}${usuarioEndpoint}?id_usuario=${id_usuario}`);
};