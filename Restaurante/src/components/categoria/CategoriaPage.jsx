import { useEffect, useState } from 'react';
import { obtenerCategorias } from '../../services/categoriaService';

const CategoriaPage = () => {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerCategorias()
      .then((respuesta) => {
        console.log(respuesta.data); // Verifica la estructura de respuesta
        setCategorias(respuesta.data); // Asume que respuesta.data es el array directo
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al cargar categorías:', error);
        setCargando(false);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2>Listado de Categorías</h2>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categorias.map((item) => (
              <tr key={item.id_categoria}>
                <td>{item.id_categoria}</td>
                <td>{item.nombre_categoria}</td>
                <td>{item.descripcion}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2">
                    Editar
                  </button>
                  <button className="btn btn-danger btn-sm">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CategoriaPage;