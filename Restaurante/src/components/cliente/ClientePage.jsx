import { useEffect, useState } from 'react';
import {
    obtenerClientes,
    agregarCliente,
    actualizarCliente,
    eliminarCliente,
    obtenerClientePorId
} from '../../services/clienteService';
const ClientePage = () => {
    const [clientes, setClientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentCliente, setCurrentCliente] = useState({
        id_cliente: null,
        nombre: '',
        telefono: '',
        correo: '',
        direccion: '',
        fecha_registro: '',
        estado: ''
    });

    const cargarClientes = async () => {
        setCargando(true);
        setError(null);
        try {
            const { data } = await obtenerClientes();
            setClientes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al cargar clientes:', error);
            setError('No se pudieron cargar los clientes. Intenta de nuevo más tarde.');
            setClientes([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarClientes();
    }, []);

    const handleAddCliente = () => {
        setIsEditing(false);
        setCurrentCliente({
            id_cliente: null,
            nombre: '',
            telefono: '',
            correo: '',
            direccion: '',
            fecha_registro: '',
            estado: ''
        });
        setShowModal(true);
    };

    const handleEditCliente = async (id) => {
        try {
            const { data } = await obtenerClientePorId(id);
            console.log('Datos recibidos para edición:', data);

            if (!data || typeof data !== 'object') {
                throw new Error('Datos de cliente no válidos');
            }

            setCurrentCliente({
                id_cliente: data.id_cliente,
                nombre: data.nombre,
                telefono: data.telefono,
                correo: data.correo,
                direccion: data.direccion,
                fecha_registro: data.fecha_registro,
                estado: data.estado
            });

            setIsEditing(true);
            setShowModal(true);
        } catch (error) {
            console.error('Error al cargar cliente:', error);
            setError('No se pudo cargar el cliente para editar: ' + error.message);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setError(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCurrentCliente(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (isEditing) {
                await actualizarCliente(currentCliente);
            } else {
                await agregarCliente(currentCliente);
            }
            handleCloseModal();
            await cargarClientes();
        } catch (error) {
            console.error('Error al guardar cliente:', error);
            setError(error.response?.data?.message || 'Error al guardar el cliente');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
            try {
                await eliminarCliente(id);
                await cargarClientes();
            } catch (error) {
                console.error('Error al eliminar cliente:', error);
                setError('Error al eliminar el cliente');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Listado de Clientes</h2>

            <button className="btn btn-primary mb-3" onClick={handleAddCliente}>
                Añadir Nuevo Cliente
            </button>

            {cargando && (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p>Cargando clientes...</p>
                </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            {!cargando && !error && (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Telefono</th>
                                <th>Correo</th>
                                <th>Direccion</th>
                                <th>Fecha</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.length > 0 ? (
                                clientes.map((cliente) => (
                                    <tr key={cliente.id_cliente}>
                                        <td>{cliente.id_cliente}</td>
                                        <td>{cliente.nombre}</td>
                                        <td>{cliente.telefono}</td>
                                        <td>{cliente.correo}</td>
                                        <td>{cliente.direccion}</td>
                                        <td>{cliente.fecha_registro}</td>
                                        <td>{cliente.estado}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => handleEditCliente(cliente.id_cliente)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(cliente.id_cliente)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No hay clientes registrados</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Editar cliente' : 'Añadir Nuevo cliente'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Nombre</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="nombre"
                                                value={currentCliente.nombre}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Teléfono</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="telefono"
                                                value={currentCliente.telefono}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Correo</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="correo"
                                                value={currentCliente.correo}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Dirección</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="direccion"
                                                value={currentCliente.direccion}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Fecha de Registro</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="fecha_registro"
                                                value={currentCliente.fecha_registro}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Estado</label>
                                            <select
                                                className="form-control"
                                                name="estado"
                                                value={currentCliente.estado}
                                                onChange={handleFormChange}
                                                required
                                            >
                                                <option value="">Seleccione un estado</option>
                                                <option value="Activo">Activo</option>
                                                <option value="Inactivo">Inactivo</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {isEditing ? 'Guardar Cambios' : 'Añadir Cliente'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default ClientePage;