import { useEffect, useState } from 'react';
import { obtenerIngredientes } from '../../services/ingredienteService';

const IngredientePage = () => {
  const [ingredientes, setIngredientes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    obtenerIngredientes()
      .then((respuesta) => {
        console.log(respuesta.data); // Verifica si es un array directamente
        setIngredientes(respuesta.data); // Ajusta si es data.data
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al cargar ingredientes:', error);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h2>Listado de Ingredientes</h2>

      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <table className="table table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Stock</th>
              <th>Unidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ingredientes.map((item) => (
              <tr key={item.id_ingrediente}>
                <td>{item.id_ingrediente}</td>
                <td>{item.nombre_ingrediente}</td>
                <td>{item.descripcion}</td>
                <td>{item.cantidad_stock}</td>
                <td>{item.unidad}</td>
                <td>Editar | Eliminar</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default IngredientePage;
