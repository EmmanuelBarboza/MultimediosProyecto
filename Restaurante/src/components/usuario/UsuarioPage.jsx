// src/components/usuario/UsuarioPage.jsx
import { useEffect, useState } from 'react';
import { obtenerUsuarios } from '../../services/usuarioService'; // Asegúrate de que esta ruta sea correcta

const UsuarioPage = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null); // Estado para manejar errores

  useEffect(() => {
    obtenerUsuarios()
      .then((respuesta) => {
        console.log('Respuesta de la API de usuarios:', respuesta.data); 
        setUsuarios(respuesta.data); 
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al cargar usuarios:', err);
        setError('No se pudieron cargar los usuarios. Intenta de nuevo más tarde.'); 
        setCargando(false); 
      });
  }, []); 

  return (
    <div className="container mt-4">
      <h2>Listado de Usuarios</h2>

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
                // LA LÍNEA CRÍTICA: Asegúrate de que no haya espacios en blanco
                // o saltos de línea DIRECTAMENTE entre <tr> y <td>,
                // ni entre el último </td> y </tr>.
                // Colocarlo todo en una línea es la forma más segura de evitar el error.
                <tr key={usuario.id_usuario}><td>{usuario.id_usuario}</td><td>{usuario.nombre}</td><td>{usuario.correo}</td><td>{usuario.tipo_usuario}</td><td>{usuario.id_rol === null ? 'N/A' : usuario.id_rol}</td><td>{new Date(usuario.fecha_creacion).toLocaleDateString()}</td><td>{usuario.estado}</td><td><button className="btn btn-sm btn-info me-2">Editar</button><button className="btn btn-sm btn-danger">Eliminar</button></td></tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No hay usuarios disponibles.</p> 
        )
      )}
    </div>
  );
};

export default UsuarioPage;