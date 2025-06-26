import { useEffect, useState } from 'react';
import {
    obtenerReservaciones,
    agregarReservacion,
    actualizarReservacion,
    eliminarReservacion,
    obtenerReservacionPorId
} from '../../services/reservacionService';

// Definimos constantes para los estados que coinciden con el ENUM de la base de datos
const ESTADOS = {
  ACTIVA: 'activa',
  COMPLETADA: 'completada',
  CANCELADA: 'cancelada'
};

const ReservacionPage = () => {
    const [reservaciones, setReservaciones] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

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
            console.log('Datos recibidos para edición:', data);

            if (!data || typeof data !== 'object') {
                throw new Error('Datos de reservación no válidos');
            }

            setCurrentReservacion({
                id_reservacion: data.id_reservacion,
                cliente_id: data.cliente_id,
                mesa_id: data.mesa_id,
                fecha_reserva: data.fecha_reserva.split('T')[0],
                hora_reserva: data.hora_reserva,
                cantidad_personas: data.cantidad_personas,
                estado: data.estado || ESTADOS.ACTIVA
            });

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
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCurrentReservacion(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!currentReservacion.estado) {
            setError('Por favor seleccione un estado válido');
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
                                reservaciones.map((reservacion) => (
                                    <tr key={reservacion.id_reservacion}>
                                        <td>{reservacion.id_reservacion}</td>
                                        <td>{reservacion.cliente_id}</td>
                                        <td>{reservacion.mesa_id}</td>
                                        <td>{new Date(reservacion.fecha_reserva).toLocaleDateString()}</td>
                                        <td>{reservacion.hora_reserva}</td>
                                        <td>{reservacion.cantidad_personas}</td>
                                        <td>
                                            <span className={`badge ${
                                                reservacion.estado === ESTADOS.ACTIVA ? 'bg-primary' : 
                                                reservacion.estado === ESTADOS.COMPLETADA ? 'bg-success' : 
                                                'bg-danger'
                                            }`}>
                                                {reservacion.estado}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => handleEditReservacion(reservacion.id_reservacion)}
                                            >
                                                Editar
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(reservacion.id_reservacion)}
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center">No hay reservaciones registradas</td>
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
                                                className="form-control"
                                                name="cliente_id"
                                                value={currentReservacion.cliente_id}
                                                onChange={handleFormChange}
                                                required
                                                min="1"
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">ID Mesa</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="mesa_id"
                                                value={currentReservacion.mesa_id}
                                                onChange={handleFormChange}
                                                required
                                                min="1"
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Fecha</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="fecha_reserva"
                                                value={currentReservacion.fecha_reserva}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Hora</label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                name="hora_reserva"
                                                value={currentReservacion.hora_reserva}
                                                onChange={handleFormChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Cantidad de Personas</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="cantidad_personas"
                                                value={currentReservacion.cantidad_personas}
                                                onChange={handleFormChange}
                                                required
                                                min="1"
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Estado</label>
                                            <select
                                                className="form-select"
                                                name="estado"
                                                value={currentReservacion.estado}
                                                onChange={handleFormChange}
                                                required
                                            >
                                                <option value="">Seleccione un estado</option>
                                                <option value={ESTADOS.ACTIVA}>Activa</option>
                                                <option value={ESTADOS.COMPLETADA}>Completada</option>
                                                <option value={ESTADOS.CANCELADA}>Cancelada</option>
                                            </select>
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