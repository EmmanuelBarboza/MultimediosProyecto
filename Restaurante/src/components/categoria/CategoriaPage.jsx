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
        setError('No se pudieron cargar las categorías');
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
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (isEditing) {
      actualizarCategoria(currentCategoria.id_categoria, currentCategoria)
        .then(() => {
          handleCloseModal();
          cargarCategorias();
        })
        .catch((err) => {
          console.error('Error al actualizar categoría:', err);
          setError('Error al actualizar la categoría');
        });
    } else {
      agregarCategoria(currentCategoria)
        .then(() => {
          handleCloseModal();
          cargarCategorias();
        })
        .catch((err) => {
          console.error('Error al crear categoría:', err);
          setError('Error al crear la categoría');
        });
    }
  };

  // Manejador para eliminar categoría
  const handleDeleteCategoria = (id) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría con ID: ${id}?`)) {
      eliminarCategoria(id)
        .then(() => {
          cargarCategorias();
        })
        .catch((err) => {
          console.error('Error al eliminar categoría:', err);
          setError('Error al eliminar la categoría');
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Listado de Categorías</h2>

      <button className="btn btn-primary mb-3" onClick={handleAddCategoria}>
        Añadir Nueva Categoría
      </button>

      {cargando && <p>Cargando categorías...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {!cargando && !error && (
        categorias.length > 0 ? (
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
                      Editar
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteCategoria(categoria.id_categoria)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay categorías disponibles</p>
        )
      )}

      {/* Modal para Añadir/Editar Categoría */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditing ? 'Editar Categoría' : 'Añadir Nueva Categoría'}
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
                    <label htmlFor="nombre_categoria" className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre_categoria"
                      name="nombre_categoria"
                      value={currentCategoria.nombre_categoria}
                      onChange={handleFormChange}
                      required
                    />
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
                    />
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
                    {isEditing ? 'Guardar Cambios' : 'Añadir Categoría'}
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