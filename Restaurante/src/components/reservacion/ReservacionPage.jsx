import { useEffect, useState } from 'react';
import {
    obtenerReservaciones,
    agregarReservacion,
    actualizarReservacion,
    eliminarReservacion,
    obtenerReservacionPorId
} from '../../services/reservacionService';

const ESTADOS = {
  ACTIVA: 'activa',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada'
};

const ReservacionPage = () => {
    const [reservaciones, setReservaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [errors, setErrors] = useState({});

    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentReservacion, setCurrentReservacion] = useState({
        id_reservacion: null,
        cliente_id: '',
        mesa_id: '',
        fecha_reserva: '',
        hora_reserva: '',
        cantidad_personas: '',
        estado: ESTADOS.ACTIVA
    });

    const cargarReservaciones = async () => {
        setCargando(true);
        setError(null);
        try {
            const { data } = await obtenerReservaciones();
            setReservaciones(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error al cargar reservaciones:', error);
            setError('No se pudieron cargar las reservaciones. Intenta de nuevo más tarde.');
            setReservaciones([]);
        } finally {
            setCargando(false);
        }
    };

    useEffect(() => {
        cargarReservaciones();
    }, []);

    const handleAddReservacion = () => {
        setIsEditing(false);
        setErrors({});
        setCurrentReservacion({
            id_reservacion: null,
            cliente_id: '',
            mesa_id: '',
            fecha_reserva: '',
            hora_reserva: '',
            cantidad_personas: '',
            estado: ESTADOS.ACTIVA
        });
        setShowModal(true);
    };

    const handleEditReservacion = async (id) => {
        try {
            const { data } = await obtenerReservacionPorId(id);
            if (!data || typeof data !== 'object') throw new Error('Datos de reservación no válidos');

            setCurrentReservacion({
                id_reservacion: data.id_reservacion,
                cliente_id: data.cliente_id,
                mesa_id: data.mesa_id,
                fecha_reserva: data.fecha_reserva.split('T')[0],
                hora_reserva: data.hora_reserva,
                cantidad_personas: data.cantidad_personas,
                estado: data.estado || ESTADOS.ACTIVA
            });

            setErrors({});
            setIsEditing(true);
            setShowModal(true);
        } catch (error) {
            console.error('Error al cargar reservación:', error);
            setError('No se pudo cargar la reservación para editar: ' + error.message);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setError(null);
        setErrors({});
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCurrentReservacion(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: null })); // Limpia el error del campo modificado
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const newErrors = {};

        if (!currentReservacion.cliente_id) newErrors.cliente_id = 'Este campo es requerido';
        if (!currentReservacion.mesa_id) newErrors.mesa_id = 'Este campo es requerido';
        if (!currentReservacion.fecha_reserva) newErrors.fecha_reserva = 'Este campo es requerido';
        if (!currentReservacion.hora_reserva) newErrors.hora_reserva = 'Este campo es requerido';
        if (!currentReservacion.cantidad_personas) newErrors.cantidad_personas = 'Este campo es requerido';
        if (!currentReservacion.estado) newErrors.estado = 'Debe seleccionar un estado';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            if (isEditing) {
                await actualizarReservacion(currentReservacion.id_reservacion, currentReservacion);
            } else {
                await agregarReservacion(currentReservacion);
            }
            handleCloseModal();
            await cargarReservaciones();
        } catch (error) {
            console.error('Error al guardar reservación:', error);
            setError(error.response?.data?.message || 'Error al guardar la reservación');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar esta reservación?')) {
            try {
                await eliminarReservacion(id);
                await cargarReservaciones();
            } catch (error) {
                console.error('Error al eliminar reservación:', error);
                setError('Error al eliminar la reservación');
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Listado de Reservaciones</h2>

            <button className="btn btn-primary mb-3" onClick={handleAddReservacion}>
                Añadir Nueva Reservación
            </button>

            {cargando && (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p>Cargando reservaciones...</p>
                </div>
            )}

            {error && <div className="alert alert-danger">{error}</div>}

            {!cargando && !error && (
                <div className="table-responsive">
                    <table className="table table-bordered table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Cliente ID</th>
                                <th>Mesa ID</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Personas</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservaciones.length > 0 ? (
                                reservaciones.map((r) => (
                                    <tr key={r.id_reservacion}>
                                        <td>{r.id_reservacion}</td>
                                        <td>{r.cliente_id}</td>
                                        <td>{r.mesa_id}</td>
                                        <td>{new Date(r.fecha_reserva).toLocaleDateString()}</td>
                                        <td>{r.hora_reserva}</td>
                                        <td>{r.cantidad_personas}</td>
                                        <td>
                                            <span className={`badge ${
                                                r.estado === ESTADOS.ACTIVA ? 'bg-primary' :
                                                r.estado === ESTADOS.COMPLETADA ? 'bg-success' :
                                                'bg-danger'
                                            }`}>
                                                {r.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditReservacion(r.id_reservacion)}>
                                                Editar
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id_reservacion)}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="8" className="text-center">No hay reservaciones registradas</td></tr>
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
                                <h5 className="modal-title">{isEditing ? 'Editar Reservación' : 'Añadir Nueva Reservación'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="modal-body">
                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">ID Cliente</label>
                                            <input
                                                type="number"
                                                className={`form-control ${errors.cliente_id ? 'is-invalid' : ''}`}
                                                name="cliente_id"
                                                value={currentReservacion.cliente_id}
                                                onChange={handleFormChange}
                                                min="1"
                                                disabled={isEditing} // <-- Deshabilita en edición
                                            />
                                            {errors.cliente_id && <div className="invalid-feedback">{errors.cliente_id}</div>}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">ID Mesa</label>
                                            <input
                                                type="number"
                                                className={`form-control ${errors.mesa_id ? 'is-invalid' : ''}`}
                                                name="mesa_id"
                                                value={currentReservacion.mesa_id}
                                                onChange={handleFormChange}
                                                min="1"
                                                disabled={isEditing} // <-- Deshabilita en edición
                                            />
                                            {errors.mesa_id && <div className="invalid-feedback">{errors.mesa_id}</div>}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Fecha</label>
                                            <input
                                                type="date"
                                                className={`form-control ${errors.fecha_reserva ? 'is-invalid' : ''}`}
                                                name="fecha_reserva"
                                                value={currentReservacion.fecha_reserva}
                                                onChange={handleFormChange}
                                            />
                                            {errors.fecha_reserva && <div className="invalid-feedback">{errors.fecha_reserva}</div>}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Hora</label>
                                            <input
                                                type="time"
                                                className={`form-control ${errors.hora_reserva ? 'is-invalid' : ''}`}
                                                name="hora_reserva"
                                                value={currentReservacion.hora_reserva}
                                                onChange={handleFormChange}
                                            />
                                            {errors.hora_reserva && <div className="invalid-feedback">{errors.hora_reserva}</div>}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Cantidad de Personas</label>
                                            <input
                                                type="number"
                                                className={`form-control ${errors.cantidad_personas ? 'is-invalid' : ''}`}
                                                name="cantidad_personas"
                                                value={currentReservacion.cantidad_personas}
                                                onChange={handleFormChange}
                                                min="1"
                                            />
                                            {errors.cantidad_personas && <div className="invalid-feedback">{errors.cantidad_personas}</div>}
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Estado</label>
                                            <select
                                                className={`form-select ${errors.estado ? 'is-invalid' : ''}`}
                                                name="estado"
                                                value={currentReservacion.estado}
                                                onChange={handleFormChange}
                                            >
                                                <option value="">Seleccione un estado</option>
                                                <option value={ESTADOS.ACTIVA}>Activa</option>
                                                <option value={ESTADOS.COMPLETADA}>Completada</option>
                                                <option value={ESTADOS.CANCELADA}>Cancelada</option>
                                            </select>
                                            {errors.estado && <div className="invalid-feedback">{errors.estado}</div>}
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {isEditing ? 'Guardar Cambios' : 'Añadir Reservación'}
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

export default ReservacionPage;
