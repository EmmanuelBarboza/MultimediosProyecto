import { useEffect, useState } from 'react';
import {
    obtenerPedidos,
    agregarPedido,
    actualizarPedido,
    eliminarPedido,
    obtenerPedidoPorId,
    obtenerDetallesPedido,
    agregarDetallePedido,
    actualizarDetallePedido,
    eliminarDetallePedido
} from '../../services/pedidosService';

const PedidosPage = () => {
    const [pedidos, setPedidos] = useState([]);
    const [detallesPedido, setDetallesPedido] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [showModalPedido, setShowModalPedido] = useState(false);
    const [showModalDetalle, setShowModalDetalle] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentPedido, setCurrentPedido] = useState({
        id_pedido: null,
        cliente_id: '',
        mesa_id: '',
        fecha_pedido: new Date().toISOString().split('T')[0],
        hora_pedido: new Date().toTimeString().substring(0, 5),
        total: 0,
        estado: 'pendiente',
        metodo_pago: 'efectivo'
    });

    const [currentDetalle, setCurrentDetalle] = useState({
        id_detalle: null,
        id_pedido: null,
        id_platillo: '',
        cantidad: 1,
        subtotal: 0
    });

    const getApiError = (err, defaultMsg) => {
        if (err.response?.data?.mensaje) return err.response.data.mensaje;
        if (err.response?.data?.message) return err.response.data.message;
        if (err.message) return err.message;
        return defaultMsg;
    };

    const cargarPedidos = async () => {
        setCargando(true);
        setError(null);
        try {
            const { data } = await obtenerPedidos();
            setPedidos(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error al cargar pedidos:', err);
            setError(getApiError(err, 'No se pudieron cargar los pedidos. Intenta de nuevo más tarde.'));
            setPedidos([]);
        } finally {
            setCargando(false);
        }
    };

    const cargarDetallesPedido = async (id_pedido) => {
        try {
            const { data } = await obtenerDetallesPedido(id_pedido);
            setDetallesPedido(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error al cargar detalles del pedido:', err);
            setError(getApiError(err, 'No se pudieron cargar los detalles del pedido.'));
            setDetallesPedido([]);
        }
    };

    useEffect(() => {
        cargarPedidos();
    }, []);

    const handleAddPedido = () => {
        setIsEditing(false);
        setCurrentPedido({
            id_pedido: null,
            cliente_id: '',
            mesa_id: '',
            fecha_pedido: new Date().toISOString().split('T')[0],
            hora_pedido: new Date().toTimeString().substring(0, 5),
            total: 0,
            estado: 'pendiente',
            metodo_pago: 'efectivo'
        });
        setShowModalPedido(true);
    };

    const handleEditPedido = async (id) => {
        setError(null);
        try {
            const { data } = await obtenerPedidoPorId(id);
            if (!data || typeof data !== 'object') {
                throw new Error('Datos de pedido no válidos');
            }
            setCurrentPedido({
                id_pedido: data.id_pedido,
                cliente_id: data.cliente_id,
                mesa_id: data.mesa_id,
                fecha_pedido: data.fecha_pedido.split(' ')[0],
                hora_pedido: data.hora_pedido,
                total: data.total,
                estado: data.estado,
                metodo_pago: data.metodo_pago
            });
            setIsEditing(true);
            setShowModalPedido(true);
            await cargarDetallesPedido(id);
        } catch (err) {
            console.error('Error al cargar pedido:', err);
            setError(getApiError(err, 'No se pudo cargar el pedido para editar.'));
        }
    };

    const handleAddDetalle = (id_pedido) => {
        setCurrentDetalle({
            id_detalle: null,
            id_pedido: id_pedido,
            id_platillo: '',
            cantidad: 1,
            subtotal: 0
        });
        setShowModalDetalle(true);
    };

    const handleEditDetalle = (detalle) => {
        setCurrentDetalle(detalle);
        setShowModalDetalle(true);
    };

    const handleCloseModal = () => {
        setShowModalPedido(false);
        setShowModalDetalle(false);
        setError(null);
    };

    const handlePedidoChange = (e) => {
        const { name, value } = e.target;
        setCurrentPedido(prev => ({ ...prev, [name]: value }));
    };

    const handleDetalleChange = (e) => {
        const { name, value } = e.target;
        setCurrentDetalle(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmitPedido = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (isEditing) {
                await actualizarPedido(currentPedido);
            } else {
                await agregarPedido(currentPedido);
            }
            handleCloseModal();
            await cargarPedidos();
        } catch (err) {
            console.error('Error al guardar pedido:', err);
            setError(getApiError(err, 'Error al guardar el pedido'));
        }
    };

    const handleSubmitDetalle = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            if (currentDetalle.id_detalle) {
                await actualizarDetallePedido(currentDetalle);
            } else {
                await agregarDetallePedido(currentDetalle);
            }
            handleCloseModal();
            await cargarDetallesPedido(currentDetalle.id_pedido);
        } catch (err) {
            console.error('Error al guardar detalle:', err);
            setError(getApiError(err, 'Error al guardar el detalle del pedido'));
        }
    };

    const handleDeletePedido = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este pedido y todos sus detalles?')) {
            setError(null);
            try {
                await eliminarPedido(id);
                await cargarPedidos();
            } catch (err) {
                console.error('Error al eliminar pedido:', err);
                setError(getApiError(err, 'Error al eliminar el pedido'));
            }
        }
    };

    const handleDeleteDetalle = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar este detalle del pedido?')) {
            setError(null);
            try {
                await eliminarDetallePedido(id);
                await cargarDetallesPedido(currentDetalle.id_pedido);
            } catch (err) {
                console.error('Error al eliminar detalle:', err);
                setError(getApiError(err, 'Error al eliminar el detalle del pedido'));
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2>Listado de Pedidos</h2>

            <button className="btn btn-primary mb-3" onClick={handleAddPedido}>
                Añadir Nuevo Pedido
            </button>

            {error && (
                <div className="alert alert-danger">{error}</div>
            )}

            {cargando && (
                <div className="text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p>Cargando pedidos...</p>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Cliente</th>
                            <th>Mesa</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Método Pago</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pedidos.length > 0 ? (
                            pedidos.map((pedido) => (
                                <tr key={pedido.id_pedido}>
                                    <td>{pedido.id_pedido}</td>
                                    <td>{pedido.cliente_id}</td>
                                    <td>{pedido.mesa_id}</td>
                                    <td>{pedido.fecha_pedido}</td>
                                    <td>{pedido.hora_pedido}</td>
                                    <td>${pedido.total}</td>
                                    <td>{pedido.estado}</td>
                                    <td>{pedido.metodo_pago}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEditPedido(pedido.id_pedido)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm me-2"
                                            onClick={() => handleDeletePedido(pedido.id_pedido)}
                                        >
                                            Eliminar
                                        </button>
                                        <button
                                            className="btn btn-info btn-sm"
                                            onClick={() => {
                                                handleEditPedido(pedido.id_pedido);
                                                cargarDetallesPedido(pedido.id_pedido);
                                            }}
                                        >
                                            Detalles
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center">No hay pedidos registrados</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModalPedido && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{isEditing ? 'Editar Pedido' : 'Añadir Nuevo Pedido'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmitPedido}>
                                <div className="modal-body">
                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">ID Cliente</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="cliente_id"
                                                value={currentPedido.cliente_id}
                                                onChange={handlePedidoChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">ID Mesa</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="mesa_id"
                                                value={currentPedido.mesa_id}
                                                onChange={handlePedidoChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Fecha</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="fecha_pedido"
                                                value={currentPedido.fecha_pedido}
                                                onChange={handlePedidoChange}
                                                required
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Hora</label>
                                            <input
                                                type="time"
                                                className="form-control"
                                                name="hora_pedido"
                                                value={currentPedido.hora_pedido}
                                                onChange={handlePedidoChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Total</label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="total"
                                                value={currentPedido.total}
                                                onChange={handlePedidoChange}
                                                required
                                                min="0"
                                                step="0.01"
                                            />
                                        </div>

                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Estado</label>
                                            <select
                                                className="form-select"
                                                name="estado"
                                                value={currentPedido.estado}
                                                onChange={handlePedidoChange}
                                                required
                                            >
                                                <option value="pendiente">Pendiente</option>
                                                <option value="en proceso">En proceso</option>
                                                <option value="completado">Completado</option>
                                                <option value="cancelado">Cancelado</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Método de Pago</label>
                                        <select
                                            className="form-select"
                                            name="metodo_pago"
                                            value={currentPedido.metodo_pago}
                                            onChange={handlePedidoChange}
                                            required
                                        >
                                            <option value="efectivo">Efectivo</option>
                                            <option value="tarjeta">Tarjeta</option>
                                            <option value="transferencia">Transferencia</option>
                                            <option value="otros">Otros</option>
                                        </select>
                                    </div>

                                    {isEditing && (
                                        <div className="mt-4">
                                            <h5>Detalles del Pedido</h5>
                                            <button 
                                                type="button" 
                                                className="btn btn-success btn-sm mb-3"
                                                onClick={() => handleAddDetalle(currentPedido.id_pedido)}
                                            >
                                                Añadir Detalle
                                            </button>

                                            <div className="table-responsive">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>Platillo</th>
                                                            <th>Cantidad</th>
                                                            <th>Subtotal</th>
                                                            <th>Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {detallesPedido.length > 0 ? (
                                                            detallesPedido.map((detalle) => (
                                                                <tr key={detalle.id_detalle}>
                                                                    <td>{detalle.id_platillo}</td>
                                                                    <td>{detalle.cantidad}</td>
                                                                    <td>${detalle.subtotal.toFixed(2)}</td>
                                                                    <td>
                                                                        <button
                                                                            className="btn btn-warning btn-sm me-2"
                                                                            onClick={() => handleEditDetalle(detalle)}
                                                                        >
                                                                            Editar
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-danger btn-sm"
                                                                            onClick={() => handleDeleteDetalle(detalle.id_detalle)}
                                                                        >
                                                                            Eliminar
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan="4" className="text-center">No hay detalles para este pedido</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {isEditing ? 'Guardar Cambios' : 'Añadir Pedido'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showModalDetalle && (
                <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {currentDetalle.id_detalle ? 'Editar Detalle' : 'Añadir Detalle'}
                                </h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleSubmitDetalle}>
                                <div className="modal-body">
                                    {error && <div className="alert alert-danger">{error}</div>}

                                    <div className="mb-3">
                                        <label className="form-label">ID Platillo</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="id_platillo"
                                            value={currentDetalle.id_platillo}
                                            onChange={handleDetalleChange}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Cantidad</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="cantidad"
                                            value={currentDetalle.cantidad}
                                            onChange={handleDetalleChange}
                                            required
                                            min="1"
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Subtotal</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="subtotal"
                                            value={currentDetalle.subtotal}
                                            onChange={handleDetalleChange}
                                            required
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                                        Cancelar
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        {currentDetalle.id_detalle ? 'Guardar Cambios' : 'Añadir Detalle'}
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

export default PedidosPage;