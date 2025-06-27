import { useEffect, useState } from 'react';
import {
    obtenerIngredientes,
    agregarIngrediente,
    actualizarIngrediente,
    eliminarIngrediente,
    obtenerIngredientePorId
} from '../../services/ingredienteService';

const IngredientePage = () => {
    const [ingredientes, setIngredientes] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentIngrediente, setCurrentIngrediente] = useState({
        id_ingrediente: null,
        nombre_ingrediente: '',
        descripcion: '',
        cantidad_stock: '',
        unidad: ''
    });

  
    const getApiError = (err, defaultMsg) => {
        if (err.response?.data?.mensaje) return err.response.data.mensaje;
        if (err.response?.data?.message) return err.response.data.message;
        if (err.message) return err.message;
        return defaultMsg;
    };

    const cargarIngredientes = async () => {
        setCargando(true);
        setError(null);
        try {
            const { data } = await obtenerIngredientes();
            setIngredientes(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error al cargar ingredientes:', err);
            setError(getApiError(err, 'No se pudieron cargar los ingredientes. Intenta de nuevo más tarde.'));
            setIngredientes([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarIngredientes();
    }, []);

    const handleAddIngrediente = () => {
        setIsEditing(false);
        setCurrentIngrediente({
            id_ingrediente: null,
            nombre_ingrediente: '',
            descripcion: '',
            cantidad_stock: '',
            unidad: ''
        });
        setShowModal(true);
    };

    const handleEditIngrediente = async (id) => {
        setError(null);
        try {
            const { data } = await obtenerIngredientePorId(id);
            if (!data || typeof data !== 'object') {
                throw new Error('Datos de ingrediente no válidos');
            }
            setCurrentIngrediente({
                id_ingrediente: data.id_ingrediente,
                nombre_ingrediente: data.nombre_ingrediente,
                descripcion: data.descripcion,
                cantidad_stock: data.cantidad_stock,
                unidad: data.unidad
            });
            setIsEditing(true);
            setShowModal(true);
        } catch (err) {
            console.error('Error al cargar ingrediente:', err);
            setError(getApiError(err, 'No se pudo cargar el ingrediente para editar.'));
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setError(null);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCurrentIngrediente(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (isEditing) {
                await actualizarIngrediente(currentIngrediente);
            } else {
                await agregarIngrediente(currentIngrediente);
            }
            handleCloseModal();
            await cargarIngredientes();
        } catch (err) {
            console.error('Error al guardar ingrediente:', err);
            setError(getApiError(err, 'Error al guardar el ingrediente'));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este ingrediente?')) {
            setError(null);
            try {
                await eliminarIngrediente(id);
                await cargarIngredientes();
            } catch (err) {
                console.error('Error al eliminar ingrediente:', err);
                setError(getApiError(err, 'Error al eliminar el ingrediente'));
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Listado de Ingredientes</h2>

            <button className="btn btn-primary mb-3" onClick={handleAddIngrediente}>
                Añadir Nuevo Ingrediente
            </button>

            {/* Mensaje de error general */}
            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {cargando && (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p>Cargando ingredientes...</p>
                </div>
            )}

            {/* La tabla siempre se muestra aunque haya error */}
            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Stock</th>
                            <th>Unidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ingredientes.length > 0 ? (
                            ingredientes.map((ingrediente) => (
                                <tr key={ingrediente.id_ingrediente}>
                                    <td>{ingrediente.id_ingrediente}</td>
                                    <td>{ingrediente.nombre_ingrediente}</td>
                                    <td>{ingrediente.descripcion}</td>
                                    <td>{ingrediente.cantidad_stock}</td>
                                    <td>{ingrediente.unidad}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEditIngrediente(ingrediente.id_ingrediente)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(ingrediente.id_ingrediente)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">No hay ingredientes registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Editar Ingrediente' : 'Añadir Nuevo Ingrediente'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {/* Mensaje de error específico del modal */}
                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Nombre</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="nombre_ingrediente"
                                                value={currentIngrediente.nombre_ingrediente}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Unidad</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="unidad"
                                                value={currentIngrediente.unidad}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Cantidad en Stock</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="cantidad_stock"
                                                value={currentIngrediente.cantidad_stock}
                                                onChange={handleFormChange}
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>

                                        <div className="col-md-12 mb-3">
                                            <label className="form-label">Descripción</label>
                                            <textarea
                                                className="form-control"
                                                name="descripcion"
                                                value={currentIngrediente.descripcion}
                                                onChange={handleFormChange}
                                                rows="3"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {isEditing ? 'Guardar Cambios' : 'Añadir Ingrediente'}
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

export default IngredientePage;