import { useEffect, useState } from 'react';
import {
    obtenerMesas,
    agregarMesa,
    actualizarMesa,
    eliminarMesa,
    obtenerMesaPorId
} from '../../services/mesaService';
const MesaPage = () => {
    const [mesas, setMesas] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMesa, setCurrentMesa] = useState({
        id_mesa: null,
        numero_mesa: '',
        capacidad: '',
        ubicacion: '',
        estado: ''
    });

    const cargarMesas = async () => {
        setCargando(true);
        setError(null);
        try {
            const { data } = await obtenerMesas();
            setMesas(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al cargar mesas:', error);
            setError('No se pudieron cargar los mesas. Intenta de nuevo más tarde.');
            setMesas([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarMesas();
    }, []);

    const handleAddMesa = () => {
        setIsEditing(false);
        setCurrentMesa({
            id_mesa: null,
            numero_mesa: '',
            capacidad: '',
            ubicacion: '',
            estado: ''
        });
        setShowModal(true);
    };

    const handleEditMesa = async (id) => {
        try {
            const { data } = await obtenerMesaPorId(id);
            console.log('Datos recibidos para edición:', data);

            if (!data || typeof data !== 'object') {
                throw new Error('Datos de mesa no válidos');
            }

            setCurrentMesa({
                id_mesa: data.id_mesa,
                numero_mesa: data.numero_mesa,
                capacidad: data.capacidad,
                ubicacion: data.ubicacion,
                estado: data.estado
            });

            setIsEditing(true);
            setShowModal(true);
        } catch (error) {
            console.error('Error al cargar mesa:', error);
            setError('No se pudo cargar el mesa para editar: ' + error.message);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setError(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCurrentMesa(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (isEditing) {
                await actualizarMesa(currentMesa);
            } else {
                await agregarMesa(currentMesa);
            }
            handleCloseModal();
            await cargarMesas();
        } catch (error) {
            console.error('Error al guardar mesa:', error);
            setError(error.response?.data?.message || 'Error al guardar el mesa');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta mesa?')) {
            try {
                await eliminarMesa(id);
                await cargarMesas();
            } catch (error) {
                console.error('Error al eliminar mesa:', error);
                setError('Error al eliminar el mesa');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Listado de Mesas</h2>

            <button className="btn btn-primary mb-3" onClick={handleAddMesa}>
                Añadir Nuevo Mesa
            </button>

            {cargando && (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p>Cargando mesas...</p>
                </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            {!cargando && !error && (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Numero de mesa</th>
                                <th>Capacidad</th>
                                <th>Ubicacion</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mesas.length > 0 ? (
                                mesas.map((mesa) => (
                                    <tr key={mesa.id_mesa}>
                                        <td>{mesa.id_mesa}</td>
                                        <td>{mesa.numero_mesa}</td>
                                        <td>{mesa.capacidad}</td>
                                        <td>{mesa.ubicacion}</td>
                                        <td>{mesa.estado}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => handleEditMesa(mesa.id_mesa)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(mesa.id_mesa)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No hay mesas registrados</td>
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
                                <h5 className="modal-title">{isEditing ? 'Editar Mesa' : 'Añadir Nueva Mesa'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Número de Mesa</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="numero_mesa"
                                                value={currentMesa.numero_mesa}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Capacidad</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="capacidad"
                                                value={currentMesa.capacidad}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Ubicación</label>
                                            <select
                                                className="form-control"
                                                name="ubicacion"
                                                value={currentMesa.ubicacion}
                                                onChange={handleFormChange}
                                                required
                                            >
                                                <option value="">Seleccione una ubicación</option>
                                                <option value="Interior">Interior</option>
                                                <option value="Terraza">Terraza</option>
                                                <option value="Patio">Patio</option>
                                                <option value="Balcón">Balcón</option>
                                            </select>
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Estado</label>
                                            <select
                                                className="form-control"
                                                name="estado"
                                                value={currentMesa.estado}
                                                onChange={handleFormChange}
                                                required
                                            >
                                                <option value="">Seleccione un estado</option>
                                                <option value="Disponible">Disponible</option>
                                                <option value="Ocupada">Ocupada</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {isEditing ? 'Guardar Cambios' : 'Añadir Mesa'}
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

export default MesaPage;