import { useEffect, useState } from 'react';
import { 
  obtenerPlatillos,
  eliminarPlatillo 
} from '../../services/platilloService';

const PlatilloPage = () => {
  const [platillos, setPlatillos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarPlatillos();
  }, []);

  const cargarPlatillos = async () => {
    try {
      const { data } = await obtenerPlatillos();
      setPlatillos(data);
      setCargando(false);
    } catch (error) {
      console.error('Error al cargar platillos:', error);
      setCargando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (confirm('¿Estás seguro de eliminar este platillo?')) {
      try {
        await eliminarPlatillo(id);
        cargarPlatillos(); // Recargar la lista
      } catch (error) {
        console.error('Error al eliminar platillo:', error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Listado de Platillos</h2>

      {cargando ? (
        <div className="alert alert-info">Cargando...</div>
      ) : (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {platillos.length > 0 ? (
              platillos.map((item) => (
                <tr key={item.id_platillo}>
                  <td>{item.id_platillo}</td>
                  <td>{item.nombre_platillo}</td>
                  <td>{item.descripcion}</td>
                  <td>${parseFloat(item.precio).toFixed(2)}</td>
                  <td>{item.id_categoria}</td>
                  <td>
                    <span className={`badge ${item.estado === '1' ? 'bg-success' : 'bg-secondary'}`}>
                      {item.estado === '1' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    {item.imagen_url && (
                      <img 
                        src={item.imagen_url} 
                        alt={item.nombre_platillo} 
                        style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        className="img-thumbnail"
                      />
                    )}
                  </td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2">
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleEliminar(item.id_platillo)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No hay platillos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PlatilloPage;