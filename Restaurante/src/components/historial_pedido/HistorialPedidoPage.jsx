import { useEffect, useState } from 'react';
import { 
  obtenerHistorialPedidos,
  agregarHistorialPed,
  actualizarHistorialPed,
  eliminarHistorialPed,
  obtenerhistorialPorId
} from '../../services/HistorialPedidoService';

const HistorialPedidoPage = () => {

  const [historialP, setHistorialPedidos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentHistorialP, setCurrentHistorialP] = useState({
    id_historial_pedido: null,
    pedido_id: '',
    fecha_entrega: '',
    estado_entrega: ''
  });

  // Cargar historial de pedidos
    const cargarHistorialPedidos = async () => {
      setCargando(true);
      setError(null);
      try {
        const { data } = await obtenerHistorialPedidos();
        setHistorialPedidos(data);
      } catch (error) {
        console.error('Error al cargar historial:', error);
        setError('No se pudo cargar el historial. Intenta de nuevo más tarde.');
      } finally {
        setCargando(false);
      }
    };

    useEffect(() => {
    cargarHistorialPedidos();
     }, []);

    // Manejadores para el modal
    
      const handleEditHistorialPedido = async (id) => {
        try {
          const { data } = await obtenerhistorialPorId(id);
          setCurrentHistorialP({
            id_historial_pedido: data.id_historial_pedido,
            pedido_id: data.pedido_id,
            fecha_entrega: data.fecha_entrega,
            estado_entrega: data.estado_entrega
          });
          console.log(data);
          setIsEditing(true);
          setShowModal(true);
        } catch (error) {
          
          console.error('Error al cargar historial del pedido:', error);
          setError('No se pudo cargar el historial del pedido para editar.');
        }
      };
    
      const handleCloseModal = () => {
        setShowModal(false);
        setError(null);
      };
    
      // Manejador de cambios en el formulario
      const handleFormChange = (e) => {
        const { name, value } = e.target;
        setCurrentHistorialP(prev => ({ ...prev, [name]: value }));
      };
    
      
      // Manejador para enviar el formulario
      const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
    
        try {
          if (isEditing) {
            await actualizarHistorialPed(currentHistorialP.id_historial_pedido, currentHistorialP);
            console.log(currentHistorialP)
          } else {
            await agregarHistorialPed(currentHistorialP);
          }
          handleCloseModal();
          cargarHistorialPedidos();
        } catch (error) {
          console.error('Error al guardar el historial del pedido:', error);
          setError(error.response?.data?.message || 'Error al guardar el el historial del pedido');
        }
      };
    
      // Manejador para eliminar Historial
      const handleDeleteHistorialP = async (id) => {
        if (window.confirm('¿Estás seguro de eliminar el historial de este pedido?')) {
          try {
            await eliminarHistorialPed(id);
            cargarHistorialPedidos();
            console.log(id);
          } catch (error) {
            console.log(id);
            console.error('Error al eliminar historial de este pedido:', error);
            setError('Error al eliminar el historial de este pedido');
          }
        }
      };

    return (
      <div className="container"> 
        <h4>Lista de Historial de Pedidos</h4>

        {cargando && <div className="alert alert-info">Cargando...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

         {!cargando && !error && (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID Historial</th>
              <th>ID Pedido</th>
              <th>Fecha Entrega</th>
              <th>Estado Entrega</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {historialP.length > 0 ? (
              historialP.map((historial) => (
                <tr key={historial.id_historial_pedido}>
                   <td>{historial.id_historial_pedido}</td>
                  <td>{historial.pedido_id}</td>
                  <td>{historial.fecha_entrega}</td>
                  <td>{historial.estado_entrega}</td>
                  <td>
                    <button 
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEditHistorialPedido(historial.id_historial_pedido, historial)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteHistorialP(historial.id_historial_pedido)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No hay historial registrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal para Añadir/Editar Historial */}
      {showModal && (
        <div 
          className="modal fade show d-block" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditing ? 'Editar Historial' : 'Añadir Nuevo Platillo'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger">{error}</div>}
                  
                  <div className="mb-3">
                    <label className="form-label">Estado Entrega</label>
                    <select
                      className="form-select"
                      name="estado_entrega"
                      value={historialP.estado_entrega}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseModal}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? 'Guardar Cambios' : 'Añadir Historial'}
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

export default HistorialPedidoPage;