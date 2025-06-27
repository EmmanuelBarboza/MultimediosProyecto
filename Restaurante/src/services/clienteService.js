import axios from 'axios';

const API_URL = 'http://localhost/Grupo3_Multimedios/vista/API/';
const clienteEndpoint = 'clientes.php';

export const obtenerClientes = () => {
    return axios.get(`${API_URL}${clienteEndpoint}`);
};

export const obtenerClientePorId = (id_cliente) => {
    return axios.get(`${API_URL}${clienteEndpoint}?id_cliente=${id_cliente}`);
};

export const agregarCliente = (datos) => {
    return axios.post(`${API_URL}${clienteEndpoint}`, datos, {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const actualizarCliente = (datos) => {
    return axios.put(`${API_URL}${clienteEndpoint}?id_cliente=${datos.id_cliente}`, datos, {
        headers: { 'Content-Type': 'application/json' }
    });
};

export const eliminarCliente = (id_cliente) => {
    return axios.delete(`${API_URL}${clienteEndpoint}?id_cliente=${id_cliente}`, {
        headers: { 'Content-Type': 'application/json' }
    });
};
