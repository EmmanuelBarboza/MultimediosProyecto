import { useEffect, useState } from 'react';
import { 
  obtenerPlatillos,
  agregarPlatillo,
  actualizarPlatillo,
  eliminarPlatillo,
  obtenerPlatilloPorId
} from '../../services/platilloService';

const PlatilloPage = () => {
  const [platillos, setPlatillos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlatillo, setCurrentPlatillo] = useState({
    id_platillo: null,
    nombre_platillo: '',
    descripcion: '',
    precio: '',
    id_categoria: '',
    estado: '1' // 1 para activo, 0 para inactivo
  });

  // Cargar platillos
  const cargarPlatillos = async () => {
    setCargando(true);
    setError(null);
    try {
      const { data } = await obtenerPlatillos();
      setPlatillos(data);
    } catch (error) {
      console.error('Error al cargar platillos:', error);
      setError('No se pudieron cargar los platillos. Intenta de nuevo más tarde.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPlatillos();
  }, []);

  // Manejadores para el modal
  const handleAddPlatillo = () => {
    setIsEditing(false);
    setCurrentPlatillo({
      id_platillo: null,
      nombre_platillo: '',
      descripcion: '',
      precio: '',
      id_categoria: '',
      estado: '1'
    });
    setShowModal(true);
  };

  const handleEditPlatillo = async (id) => {
    try {
      const { data } = await obtenerPlatilloPorId(id);
      setCurrentPlatillo({
        id_platillo: data.id_platillo,
        nombre_platillo: data.nombre_platillo,
        descripcion: data.descripcion,
        precio: data.precio,
        id_categoria: data.id_categoria,
        estado: data.estado.toString() // Asegurar que es string para el select
      });
      setIsEditing(true);
      setShowModal(true);
    } catch (error) {
      console.error('Error al cargar platillo:', error);
      setError('No se pudo cargar el platillo para editar.');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
  };

  // Manejador de cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentPlatillo(prev => ({ ...prev, [name]: value }));
  };

  // Manejador para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditing) {
        await actualizarPlatillo(currentPlatillo.id_platillo, currentPlatillo);
      } else {
        await agregarPlatillo(currentPlatillo);
      }
      handleCloseModal();
      cargarPlatillos();
    } catch (error) {
      console.error('Error al guardar platillo:', error);
      setError(error.response?.data?.message || 'Error al guardar el platillo');
    }
  };

  // Manejador para eliminar platillo
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este platillo?')) {
      try {
        await eliminarPlatillo(id);
        cargarPlatillos();
      } catch (error) {
        console.error('Error al eliminar platillo:', error);
        setError('Error al eliminar el platillo');
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Listado de Platillos</h2>

      {/* Botón para añadir nuevo platillo */}
      <button className="btn btn-primary mb-3" onClick={handleAddPlatillo}>
        Añadir Nuevo Platillo
      </button>

      {cargando && <div className="alert alert-info">Cargando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!cargando && !error && (
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Categoría</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {platillos.length > 0 ? (
              platillos.map((platillo) => (
                <tr key={platillo.id_platillo}>
                  <td>{platillo.id_platillo}</td>
                  <td>{platillo.nombre_platillo}</td>
                  <td>{platillo.descripcion}</td>
                  <td>${parseFloat(platillo.precio).toFixed(2)}</td>
                  <td>{platillo.id_categoria}</td>
                  <td>
                    <span className={`badge ${platillo.estado === '1' ? 'bg-success' : 'bg-secondary'}`}>
                      {platillo.estado === '1' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-warning btn-sm me-2"
                      onClick={() => handleEditPlatillo(platillo.id_platillo)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(platillo.id_platillo)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  No hay platillos registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal para Añadir/Editar Platillo */}
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
                  {isEditing ? 'Editar Platillo' : 'Añadir Nuevo Platillo'}
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
                    <label className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre_platillo"
                      value={currentPlatillo.nombre_platillo}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      name="descripcion"
                      value={currentPlatillo.descripcion}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Precio</label>
                    <input
                      type="number"
                      className="form-control"
                      name="precio"
                      value={currentPlatillo.precio}
                      onChange={handleFormChange}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">ID Categoría</label>
                    <input
                      type="number"
                      className="form-control"
                      name="id_categoria"
                      value={currentPlatillo.id_categoria}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Estado</label>
                    <select
                      className="form-select"
                      name="estado"
                      value={currentPlatillo.estado}
                      onChange={handleFormChange}
                      required
                    >
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
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
                    {isEditing ? 'Guardar Cambios' : 'Añadir Platillo'}
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

export default PlatilloPage;