// src/components/rol/RolPage.jsx
import { useEffect, useState } from 'react';

// Importa las funciones del servicio de roles
import { 
  obtenerRoles, 
  agregarRol,    
  actualizarRol, 
  eliminarRol    
} from '../../services/rolService'; 

const RolPage = () => {
  const [roles, setRoles] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null); 
  
  // Estado para el modal de añadir/editar
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // true si estamos editando, false si estamos creando
  const [currentRol, setCurrentRol] = useState({ 
    id_rol: null, // Será el ID si editamos, null si creamos
    nombre_rol: '',
    descripcion: ''
  });

  // Función para cargar los roles (se usa en useEffect y después de CUD)
  const cargarRoles = () => {
    setCargando(true);
    setError(null);
    obtenerRoles()
      .then((respuesta) => {
        console.log('Respuesta de la API de roles:', respuesta.data); 
        // Es crucial verificar que respuesta.data sea un array, como discutimos antes
        if (Array.isArray(respuesta.data)) {
            setRoles(respuesta.data); 
        } else {
            console.warn("La API de roles no devolvió un array. Tipo recibido:", typeof respuesta.data, "Contenido:", respuesta.data);
            setRoles([]); // Asegurarse de que 'roles' sea un array vacío
            setError("Formato de datos inesperado de la API de roles.");
        }
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al cargar roles:', err.response ? err.response.data : err.message);
        setError('No se pudieron cargar los roles. Intenta de nuevo más tarde.'); 
        setRoles([]); // Asegurarse de que 'roles' sea un array vacío en caso de error
        setCargando(false); 
      });
  };

  // Carga roles al montar el componente
  useEffect(() => {
    cargarRoles(); 
  }, []); 

  // Manejador para abrir el modal de crear rol
  const handleAddRol = () => {
    setIsEditing(false);
    setCurrentRol({
      id_rol: null, 
      nombre_rol: '',
      descripcion: ''
    });
    setShowModal(true);
  };

  // Manejador para abrir el modal para editar rol
  const handleEditRol = (rol) => {
    setIsEditing(true);
    setCurrentRol({ 
      id_rol: rol.id_rol,
      nombre_rol: rol.nombre_rol,
      descripcion: rol.descripcion
    }); 
    setShowModal(true);
  };

  // Manejador para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setError(null); // Limpiar errores del formulario al cerrar
  };

  // Manejador para los cambios en el formulario del modal
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setCurrentRol(prev => ({ ...prev, [name]: value }));
  };

  // Manejador para enviar el formulario (crear o actualizar)
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    if (isEditing) {
      // Para ACTUALIZAR (PUT):
      actualizarRol(currentRol.id_rol, currentRol)
        .then(() => {
          handleCloseModal();
          cargarRoles(); // Recargar roles después de la actualización exitosa
        })
        .catch((err) => {
          console.error('Error al actualizar rol:', err.response ? err.response.data : err.message);
          setError('Error al actualizar el rol. Verifica los datos e intenta de nuevo.');
        });
    } else {
      // Para AGREGAR (POST): Datos en el cuerpo, sin id_rol
      // Creamos una copia del currentRol y extraemos 'id_rol' ya que es null para la creación
      const { id_rol, ...newRolData } = currentRol; 
      agregarRol(newRolData)
        .then(() => {
          handleCloseModal();
          cargarRoles(); // Recargar roles después de la creación exitosa
        })
        .catch((err) => {
          console.error('Error al crear rol:', err.response ? err.response.data : err.message);
          setError('Error al crear el rol. Verifica los datos e intenta de nuevo.');
        });
    }
  };

  // Manejador para eliminar rol
  const handleDeleteRol = (id) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el rol con ID: ${id}?`)) {
      eliminarRol(id)
        .then(() => {
          cargarRoles(); // Recargar roles después de la eliminación exitosa
        })
        .catch((err) => {
          console.error('Error al eliminar rol:', err.response ? err.response.data : err.message);
          setError('Error al eliminar el rol.');
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Listado de Roles</h2>

      {/* Botón para añadir nuevo rol */}
      <button className="btn btn-primary mb-3" onClick={handleAddRol}>
        Añadir Nuevo Rol
      </button>

      {cargando && <p>Cargando roles...</p>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>} 

      {!cargando && !error && (
        roles.length > 0 ? ( 
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre del Rol</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((rol) => ( 
                <tr key={rol.id_rol}>
                  <td>{rol.id_rol}</td>
                  <td>{rol.nombre_rol}</td>
                  <td>{rol.descripcion}</td>
                  <td>
                    {/* Botón Editar */}
                    <button 
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleEditRol(rol)}
                    >
                      Editar
                    </button>
                    {/* Botón Eliminar */}
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteRol(rol.id_rol)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay roles disponibles.</p> 
        )
      )}

      {/* Modal para Añadir/Editar Rol */}
      {showModal && (
        <div 
          className="modal fade show d-block" // Clases de Bootstrap para mostrar el modal
          tabIndex="-1" 
          aria-labelledby="rolModalLabel" 
          aria-hidden="true"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} // Fondo oscuro para el modal
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="rolModalLabel">
                  {isEditing ? 'Editar Rol' : 'Añadir Nuevo Rol'}
                </h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  aria-label="Close" 
                  onClick={handleCloseModal}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger">{error}</div>} {/* Mostrar errores del formulario */}
                  <div className="mb-3">
                    <label htmlFor="nombre_rol" className="form-label">Nombre del Rol</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="nombre_rol" 
                      name="nombre_rol" 
                      value={currentRol.nombre_rol} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="descripcion" 
                      name="descripcion" 
                      value={currentRol.descripcion} 
                      onChange={handleFormChange} 
                      required 
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
                    {isEditing ? 'Guardar Cambios' : 'Añadir Rol'}
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

export default RolPage;