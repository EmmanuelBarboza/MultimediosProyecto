import { useEffect, useState } from 'react';
import { 
  obtenerHistorialInventarios,
  agregarHistorialInv,
  eliminarHistorialInv,
  obtenerHistorialInvPorId
} from '../../services/HistorialInventarioService';

const HistorialInventarioPage = () => {

  const [historialI, setHistorialInventarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
  
    // Cargar Historial del inventario
      const cargarHistorialInventarios = async () => {
        setCargando(true);
        setError(null);
        try {
          const { data } = await obtenerHistorialInventarios();
          setHistorialInventarios(data);
        } catch (error) {
          console.error('Error al cargar historial:', error);
          setError('No se pudo cargar el historial. Intenta de nuevo más tarde.');
        } finally {
          setCargando(false);
        }
      };
  
      useEffect(() => {
      cargarHistorialInventarios();
       }, []);
  
      return (
        <div className="container"> 
          <h4>Lista de Historial de Inventarios</h4>
  
  
          {cargando && <div className="alert alert-info">Cargando...</div>}
          {error && <div className="alert alert-danger">{error}</div>}
  
           {!cargando && !error && (
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>ID Historial</th>
                <th>ID Inventario</th>
                <th>ID Ingrediente</th>
                <th>Cambio Stock</th>
                <th>Fecha </th>
                <th>Tipo de Cambio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {historialI.length > 0 ? (
                historialI.map((historial) => (
                  <tr key={historial.id_historial_inventario}>
                     <td>{historial.id_historial_inventario}</td>
                     <td>{historial.id_inventario}</td>
                    <td>{historial.ingrediente_id}</td>
                    <td>{historial.cambio_stock}</td>
                    <td>{historial.fecha}</td>
                    <td>{historial.tipo_cambio}</td>
                    {/* <td>
                      <span className={`badge ${estado_entrega.estado === '1' ? 'bg-success' : 'bg-secondary'}`}>
                        {platillo.estado === '1' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td> */}
                    <td>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(historial.id_historial_inventario)}
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
  
        </div>
      );
};

export default HistorialInventarioPage;