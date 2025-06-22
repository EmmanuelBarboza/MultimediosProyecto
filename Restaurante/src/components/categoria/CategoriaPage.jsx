import { useEffect, useState } from 'react';
import { obtenerCategorias, agregarCategoria, eliminarCategoria } from '../../services/categoriaService';

export function Categoria() {
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState({
    nombre_categoria: '',
    descripcion: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarCategorias();
  }, []);

  const cargarCategorias = async () => {
    try {
      const response = await obtenerCategorias();
      setCategorias(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    setNuevaCategoria({
      ...nuevaCategoria,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await agregarCategoria(nuevaCategoria);
      setNuevaCategoria({ nombre_categoria: '', descripcion: '' });
      cargarCategorias();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarCategoria(id);
      cargarCategorias();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="categoria-container">
      <h2>Gestión de Categorías</h2>
      
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre_categoria"
            value={nuevaCategoria.nombre_categoria}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={nuevaCategoria.descripcion}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Agregar Categoría</button>
      </form>

      <div className="lista-categorias">
        <h3>Lista de Categorías</h3>
        <ul>
          {categorias.map(cat => (
            <li key={cat.id_categoria}>
              <strong>{cat.nombre_categoria}</strong>
              <p>{cat.descripcion}</p>
              <button onClick={() => handleEliminar(cat.id_categoria)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}