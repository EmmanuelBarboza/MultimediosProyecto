import { useEffect, useState } from 'react';

import { 
  obtenerUsuarios, 
  agregarUsuarios,    
  actualizarUsuarios, 
  eliminarUsuarios    
} from '../../services/usuarioService'; 

import { obtenerRoles } from '../../services/rolService'; 

const UsuarioPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]); // Estado para almacenar los roles
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null); 
  
  // Estado para el modal de añadir/editar
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // true si estamos editando, false si estamos creando
  const [currentUsuario, setCurrentUsuario] = useState({ 
    id_usuario: null, 
    nombre: '',
    correo: '',
    password: '', 
    tipo_usuario: '', // Este campo se llenará con el nombre del rol seleccionado
    id_rol: '', // Este será el ID del rol seleccionado
    fecha_creacion: new Date().toISOString().slice(0, 10), 
    estado: 'activo'
  });

  // Función para cargar los roles
  const cargarRoles = () => {
    obtenerRoles()
      .then((respuesta) => {
        if (Array.isArray(respuesta.data)) {
          setRoles(respuesta.data);
        } else {
          console.warn("La API de roles no devolvió un array:", respuesta.data);
          setRoles([]); 
        }
      })
      .catch((err) => {
        console.error('Error al cargar roles para el formulario:', err.response ? err.response.data : err.message);
        // Si no se pueden cargar los roles, el combobox estará vacío, lo cual es manejable.
      });
  };

  // Función para cargar los usuarios (se usa en useEffect y después de CUD)
  const cargarUsuarios = () => {
    setCargando(true);
    setError(null);
    obtenerUsuarios()
      .then((respuesta) => {
        console.log('Respuesta de la API de usuarios:', respuesta.data); 
        if (Array.isArray(respuesta.data)) {
            setUsuarios(respuesta.data); 
        } else {
            console.warn("La API de usuarios no devolvió un array:", respuesta.data);
            setUsuarios([]); 
        }
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al cargar usuarios:', err.response ? err.response.data : err.message);
        setError('No se pudieron cargar los usuarios. Intenta de nuevo más tarde.'); 
        setUsuarios([]);
        setCargando(false); 
      });
  };

  useEffect(() => {
    cargarUsuarios(); 
    cargarRoles();    // Carga los roles al montar el componente para el combobox
  }, []); 

  // Manejador para abrir el modal de crear usuario
  const handleAddUser = () => {
    setIsEditing(false);
    setCurrentUsuario({
      id_usuario: null, 
      nombre: '',
      correo: '',
      password: '', 
      tipo_usuario: '', 
      id_rol: '', 
      fecha_creacion: new Date().toISOString().slice(0, 10), 
      estado: 'activo'
    });
    setShowModal(true);
  };

  // Manejador para abrir el modal para editar usuario
  const handleEditUser = (usuario) => {
    setIsEditing(true);
    setCurrentUsuario({ 
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      password: '', 
      tipo_usuario: usuario.tipo_usuario, 
      id_rol: (usuario.id_rol === null || usuario.id_rol === 0) ? '' : String(usuario.id_rol), 
      fecha_creacion: usuario.fecha_creacion, 
      estado: usuario.estado
    }); 
    setShowModal(true);
  };

  // Manejador para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
    setError(null); 
  };

  // Manejador para los cambios en el formulario del modal
  const handleFormChange = (e) => {
    const { name, value } = e.target;

    if (name === 'id_rol') {
      const selectedRol = roles.find(rol => String(rol.id_rol) === value);
      setCurrentUsuario(prev => ({ 
        ...prev, 
        id_rol: value, 
        tipo_usuario: selectedRol ? selectedRol.nombre_rol : '' // Se actualiza tipo_usuario con el nombre del rol
      }));
    } else {
      setCurrentUsuario(prev => ({ ...prev, [name]: value }));
    }
  };

  // Manejador para enviar el formulario (crear o actualizar)
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); 

    const usuarioToSend = { ...currentUsuario };

    if (usuarioToSend.id_rol === '') {
      usuarioToSend.id_rol = null;
      usuarioToSend.tipo_usuario = ''; // También limpia tipo_usuario si el rol es nulo
    } else {
      usuarioToSend.id_rol = Number(usuarioToSend.id_rol); 
    }

    if (isEditing && usuarioToSend.password === '') {
        delete usuarioToSend.password; 
    }

    if (isEditing) {
      actualizarUsuarios(usuarioToSend.id_usuario, usuarioToSend)
        .then(() => {
          handleCloseModal();
          cargarUsuarios(); 
        })
        .catch((err) => {
          console.error('Error al actualizar usuario:', err.response ? err.response.data : err.message);
          setError('Error al actualizar el usuario. Verifica los datos e intenta de nuevo.');
        });
    } else {
      const { id_usuario, ...newUsuarioData } = usuarioToSend; 
      agregarUsuarios(newUsuarioData)
        .then(() => {
          handleCloseModal();
          cargarUsuarios(); 
        })
        .catch((err) => {
          console.error('Error al crear usuario:', err.response ? err.response.data : err.message);
          setError('Error al crear el usuario. Verifica los datos e intenta de nuevo.');
        });
    }
  };

  // Manejador para eliminar usuario
  const handleDeleteUser = (id) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar el usuario con ID: ${id}?`)) {
      eliminarUsuarios(id)
        .then(() => {
          cargarUsuarios(); 
        })
        .catch((err) => {
          console.error('Error al eliminar usuario:', err.response ? err.response.data : err.message);
          setError('Error al eliminar el usuario.');
        });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Listado de Usuarios</h2>

      <button className="btn btn-primary mb-3" onClick={handleAddUser}>
        Añadir Nuevo Usuario
      </button>

      {cargando && <p>Cargando usuarios...</p>}
      {error && <div className="alert alert-danger" role="alert">{error}</div>} 

      {!cargando && !error && (
        usuarios.length > 0 ? ( 
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Tipo de Usuario</th>
                <th>Rol</th> {/* Columna ahora se llama "Rol" */}
                <th>Fecha de Creación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => {
                // Buscar el nombre del rol usando el id_rol del usuario
                // Si usuario.id_rol es null o 0, find devolverá undefined, y 'N/A' será el fallback
                const rolNombre = roles.find(rol => rol.id_rol === usuario.id_rol)?.nombre_rol || 'N/A';
                return (
                  <tr key={usuario.id_usuario}>
                    <td>{usuario.id_usuario}</td>
                    <td>{usuario.nombre}</td>
                    <td>{usuario.correo}</td>
                    <td>{usuario.tipo_usuario}</td> {/* Muestra el tipo_usuario que viene de la API */}
                    <td>{rolNombre}</td> {/* Muestra el nombre del rol basado en la lista de roles */}
                    <td>{new Date(usuario.fecha_creacion).toLocaleDateString()}</td>
                    <td>{usuario.estado}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleEditUser(usuario)}
                      >
                        Editar
                      </button>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteUser(usuario.id_usuario)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>No hay usuarios disponibles.</p> 
        )
      )}

      {/* Modal para Añadir/Editar Usuario */}
      {showModal && (
        <div 
          className="modal fade show d-block" 
          tabIndex="-1" 
          aria-labelledby="usuarioModalLabel" 
          aria-hidden="true"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} 
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="usuarioModalLabel">
                  {isEditing ? 'Editar Usuario' : 'Añadir Nuevo Usuario'}
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
                  {error && <div className="alert alert-danger">{error}</div>} 
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="nombre" 
                      name="nombre" 
                      value={currentUsuario.nombre} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="correo" className="form-label">Correo</label>
                    <input 
                      type="email" 
                      className="form-control" 
                      id="correo" 
                      name="correo" 
                      value={currentUsuario.correo} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Contraseña</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      id="password" 
                      name="password" 
                      value={currentUsuario.password} 
                      onChange={handleFormChange} 
                      required={!isEditing} 
                    />
                    {!isEditing && <div className="form-text">La contraseña es requerida para nuevos usuarios.</div>}
                    {isEditing && <div className="form-text">Deja en blanco para no cambiar la contraseña.</div>}
                  </div>
                  {/* Campo de selección para "Tipo Usuario" */}
                  <div className="mb-3">
                    <label htmlFor="tipo_usuario" className="form-label">Tipo de Usuario</label>
                    <select 
                      className="form-select" 
                      id="tipo_usuario" 
                      name="tipo_usuario" 
                      value={currentUsuario.tipo_usuario} 
                      onChange={handleFormChange} 
                      required
                    >
                      <option value="">Selecciona un tipo</option> 
                      {roles.map((rol) => (
                        <option key={rol.id_rol} value={rol.id_rol}>
                          {rol.nombre_rol}
                         
                        </option>
                        
                      ))}
                    </select>
                  </div>
                  
                  {/* Campo de selección para "Rol de Usuario" */}
                  <div className="mb-3">
                    <label htmlFor="id_rol" className="form-label">Rol de Usuario</label>
                    <select 
                      className="form-select" 
                      id="id_rol" 
                      name="id_rol" 
                      value={currentUsuario.id_rol} 
                      onChange={handleFormChange} 
                      required
                    >
                      <option value="">Selecciona un rol</option> 
                      {roles.map((rol) => (
                        <option key={rol.id_rol} value={rol.id_rol}>
                          {rol.nombre_rol}
                        </option>
                        
                      ))}
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="fecha_creacion" className="form-label">Fecha de Creación</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      id="fecha_creacion" 
                      name="fecha_creacion" 
                      value={currentUsuario.fecha_creacion} 
                      onChange={handleFormChange} 
                      required
                    />
                    <div className="form-text">Formato: AAAA-MM-DD</div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="estado" className="form-label">Estado</label>
                    <select 
                      className="form-select" 
                      id="estado" 
                      name="estado" 
                      value={currentUsuario.estado} 
                      onChange={handleFormChange} 
                      required
                    >
                      <option value="activo">activo</option>
                      <option value="inactivo">inactivo</option>
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
                    {isEditing ? 'Guardar Cambios' : 'Añadir Usuario'}
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

export default UsuarioPage;