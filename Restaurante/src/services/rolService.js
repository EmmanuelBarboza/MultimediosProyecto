import axios from 'axios';

const API_URL = 'http://localhost/Grupo3_Multimedios/vista/API/';
// Endpoint específico para la API de roles
const rolEndpoint = 'rol.php'; 

// Función para obtener todos los roles
export const obtenerRoles = () => {
    return axios.get(`${API_URL}${rolEndpoint}`);
};

// Función para AGREGAR (POST): Los datos del nuevo rol se envían en el cuerpo de la solicitud.
export const agregarRol = (datos) => {
    return axios.post(`${API_URL}${rolEndpoint}`, datos);
};

// Función para ACTUALIZAR (PUT): El ID del rol se envía en la URL y los datos actualizados en el cuerpo.
export const actualizarRol = (id_rol, datos) => {
    return axios.put(`${API_URL}${rolEndpoint}?id_rol=${id_rol}`, datos);
};

// Función para ELIMINAR (DELETE): El ID del rol se envía en la URL.
export const eliminarRol = (id_rol) => {
    return axios.delete(`${API_URL}${rolEndpoint}?id_rol=${id_rol}`);
};

// Función para obtener un rol específico por su ID
export const obtenerRolPorId = (id_rol) => {
    return axios.get(`${API_URL}${rolEndpoint}?id_rol=${id_rol}`);
};