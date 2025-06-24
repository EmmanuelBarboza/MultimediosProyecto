import { useEffect, useState } from 'react';
import { 
  obtenerCategorias, 
  agregarCategoria, 
  actualizarCategoria, 
  eliminarCategoria 
} from '../../services/categoriaService';

const CategoriaPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el modal
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState({
    id_categoria: null,
    nombre_categoria: '',
    descripcion: ''
  });

  // Cargar categorías
  const cargarCategorias = () => {
    setCargando(true);
    setError(null);
    obtenerCategorias()
      .then((respuesta) => {
        setCategorias(respuesta.data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al cargar categorías:', err);
        const errorMessage = err.response?.data?.mensaje || 
                            err.response?.data?.message || 
                            'No se pudieron cargar las categorías';
        setError(errorMessage);
        setCargando(false);
      });
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // Manejadores para el modal
  const handleAddCategoria = () => {
    setIsEditing(false);
    setCurrentCategoria({
      id_categoria: null,
      nombre_categoria: '',
      descripcion: ''
    });
    setShowModal(true);
  };

  const handleEditCategoria = (categoria) => {
    setIsEditing(true);
    setCurrentCategoria({
      id_categoria: categoria.id_categoria,
      nombre_categoria: categoria.nombre_categoria,
      descripcion: categoria.descripcion
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setError(null);
  };

  // Manejador de cambios en el formulario
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategoria(prev => ({ ...prev, [name]: value }));
  };

  // Manejador para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (isEditing) {
        await actualizarCategoria(currentCategoria.id_categoria, currentCategoria);
      } else {
        await agregarCategoria(currentCategoria);
      }
      handleCloseModal();
      cargarCategorias();
    } catch (err) {
      console.error(`Error al ${isEditing ? 'actualizar' : 'crear'} categoría:`, err);
      const errorMessage = err.response?.data?.mensaje || 
                          err.response?.data?.message || 
                          `Error al ${isEditing ? 'actualizar' : 'crear'} la categoría`;
      setError(errorMessage);
    }
  };

  // Manejador para eliminar categoría
  const handleDeleteCategoria = async (id) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría con ID: ${id}?`)) {
      try {
        await eliminarCategoria(id);
        cargarCategorias();
      } catch (err) {
        console.error('Error al eliminar categoría:', err);
        const errorMessage = err.response?.data?.mensaje || 
                            err.response?.data?.message || 
                            'Error al eliminar la categoría';
        setError(errorMessage);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2>Listado de Categorías</h2>

      <button className="btn btn-primary mb-3" onClick={handleAddCategoria}>
        <i className="bi bi-plus-circle me-2"></i>
        Añadir Nueva Categoría
      </button>

      {cargando && (
        <div className="d-flex justify-content-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <span className="ms-2">Cargando categorías...</span>
        </div>
      )}

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <button 
            type="button" 
            className="btn-close" 
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {!cargando && !error && (
        categorias.length > 0 ? (
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categorias.map((categoria) => (
                  <tr key={categoria.id_categoria}>
                    <td>{categoria.id_categoria}</td>
                    <td>{categoria.nombre_categoria}</td>
                    <td>{categoria.descripcion || 'N/A'}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleEditCategoria(categoria)}
                      >
                        <i className="bi bi-pencil-square me-1"></i>
                        Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteCategoria(categoria.id_categoria)}
                      >
                        <i className="bi bi-trash me-1"></i>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="alert alert-info">
            <i className="bi bi-info-circle-fill me-2"></i>
            No hay categorías disponibles
          </div>
        )
      )}

      {/* Modal para Añadir/Editar Categoría */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {isEditing ? 'Editar Categoría' : 'Añadir Nueva Categoría'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={handleCloseModal}
                  aria-label="Close"
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && (
                    <div className="alert alert-danger">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {error}
                    </div>
                  )}
                  <div className="mb-3">
                    <label htmlFor="nombre_categoria" className="form-label">
                      Nombre <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre_categoria"
                      name="nombre_categoria"
                      value={currentCategoria.nombre_categoria}
                      onChange={handleFormChange}
                      required
                      maxLength="50"
                    />
                    <div className="form-text">Máximo 50 caracteres</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      id="descripcion"
                      name="descripcion"
                      value={currentCategoria.descripcion}
                      onChange={handleFormChange}
                      rows="3"
                      maxLength="255"
                    />
                    <div className="form-text">Máximo 255 caracteres</div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseModal}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {isEditing ? (
                      <>
                        <i className="bi bi-save me-2"></i>
                        Guardar Cambios
                      </>
                    ) : (
                      <>
                        <i className="bi bi-plus-circle me-2"></i>
                        Añadir Categoría
                      </>
                    )}
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

export default CategoriaPage;