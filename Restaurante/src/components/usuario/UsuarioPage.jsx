import { useEffect, useState } from 'react';

import { 
  obtenerUsuarios, 
  agregarUsuarios,    
  actualizarUsuarios, 
  eliminarUsuarios    
} from '../../services/usuarioService'; 

const UsuarioPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null); 
  
  // Estado para el modal de añadir/editar
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // true si estamos editando, false si estamos creando
  const [currentUsuario, setCurrentUsuario] = useState({ 
    id_usuario: null, // Será el ID si editamos, null si creamos
    nombre: '',
    correo: '',
    password: '', 
    tipo_usuario: '',
    id_rol: '', 
    fecha_creacion: new Date().toISOString().slice(0, 10), // Formato YYYY-MM-DD
    estado: 'activo'
  });

  // Función para cargar los usuarios (se usa en useEffect y después de CUD)
  const cargarUsuarios = () => {
    setCargando(true);
    setError(null);
    obtenerUsuarios()
      .then((respuesta) => {
        console.log('Respuesta de la API de usuarios:', respuesta.data); 
        setUsuarios(respuesta.data); 
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al cargar usuarios:', err.response ? err.response.data : err.message);
        setError('No se pudieron cargar los usuarios. Intenta de nuevo más tarde.'); 
        setCargando(false); 
      });
  };

  useEffect(() => {
    cargarUsuarios(); // Carga usuarios al montar el componente
  }, []); 

  // Manejador para abrir el modal de crear usuario
  const handleAddUser = () => {
    setIsEditing(false);
    setCurrentUsuario({
      id_usuario: null, 
      nombre: '',
      correo: '',
      password: '', // Siempre vacío al abrir para añadir
      tipo_usuario: '',
      id_rol: '', 
      fecha_creacion: new Date().toISOString().slice(0, 10), // Fecha actual para nuevo usuario
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
      password: '', // NO precargar la contraseña existente por seguridad
      tipo_usuario: usuario.tipo_usuario,
      // Convertir null o 0 a cadena vacía para el input, o mantener el valor
      id_rol: (usuario.id_rol === null || usuario.id_rol === 0) ? '' : usuario.id_rol, 
      fecha_creacion: usuario.fecha_creacion, // Usar la fecha existente para edición
      estado: usuario.estado
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
    const newValue = (name === 'id_rol' && value !== '') ? Number(value) : value;
    setCurrentUsuario(prev => ({ ...prev, [name]: newValue }));
  };

  // Manejador para enviar el formulario (crear o actualizar)
  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null); // Limpiar errores previos

    // Crear una copia del usuario para enviar y ajustar `id_rol` y `password`
    const usuarioToSend = { ...currentUsuario };

    // Ajustar id_rol: si está vacío en el formulario, enviarlo como null
    if (usuarioToSend.id_rol === '') {
      usuarioToSend.id_rol = null;
    }

    
    if (isEditing && usuarioToSend.password === '') {
        delete usuarioToSend.password; // Elimina el campo si no se modificó para que PHP lo ignore
    }
    // creando la password está vacía, el `required` del input ya debería forzarla.


    if (isEditing) {
      // Para ACTUALIZAR (PUT):
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
      // Para AGREGAR (POST): Datos en el cuerpo, sin id_usuario
      const { id_usuario, ...newUsuarioData } = usuarioToSend; // Extraer id_usuario
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
      // Para ELIMINAR (DELETE): ID en la URL
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

      {/* Botón para añadir nuevo usuario */}
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
                <th>Rol</th>
                <th>Fecha de Creación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => ( 
                <tr key={usuario.id_usuario}>
                  <td>{usuario.id_usuario}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.correo}</td>
                  <td>{usuario.tipo_usuario}</td>
                  {/* Si id_rol es null o 0, mostrar 'N/A' */}
                  <td>{usuario.id_rol === null || usuario.id_rol === 0 ? 'N/A' : usuario.id_rol}</td> 
                  {/* Asegúrate de que fecha_creacion se formatea correctamente */}
                  <td>{new Date(usuario.fecha_creacion).toLocaleDateString()}</td>
                  <td>{usuario.estado}</td>
                  <td>
                    {/* Botón Editar */}
                    <button 
                      className="btn btn-sm btn-info me-2"
                      onClick={() => handleEditUser(usuario)}
                    >
                      Editar
                    </button>
                    {/* Botón Eliminar */}
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteUser(usuario.id_usuario)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
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
                      required={!isEditing} // Solo requerida al crear
                    />
                    {!isEditing && <div className="form-text">La contraseña es requerida para nuevos usuarios.</div>}
                    {isEditing && <div className="form-text">Deja en blanco para no cambiar la contraseña.</div>}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="tipo_usuario" className="form-label">Tipo de Usuario</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      id="tipo_usuario" 
                      name="tipo_usuario" 
                      value={currentUsuario.tipo_usuario} 
                      onChange={handleFormChange} 
                      required 
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="id_rol" className="form-label">ID Rol</label>
                    <input 
                      type="number" 
                      className="form-control" 
                      id="id_rol" 
                      name="id_rol" 
                      value={currentUsuario.id_rol} 
                      onChange={handleFormChange} 
                      placeholder="Ej: 1 o 2" 
                    />
                    <div className="form-text">Deja en blanco si no aplica o es nulo (se enviará como `null`).</div>
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