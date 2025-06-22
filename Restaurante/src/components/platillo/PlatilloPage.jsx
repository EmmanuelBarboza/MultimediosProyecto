/*import { useEffect, useState } from 'react';
import { obtenerPlatillos, agregarPlatillo, eliminarPlatillo } from '../../services/platilloService';
import { obtenerCategorias } from '../../services/categoriaService';

export function Platillo() {
  const [platillos, setPlatillos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nuevoPlatillo, setNuevoPlatillo] = useState({
    nombre_platillo: '',
    descripcion: '',
    precio: 0,
    id_categoria: '',
    estado: 1,
    imagen_url: ''
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [platillosRes, categoriasRes] = await Promise.all([
        obtenerPlatillos(),
        obtenerCategorias()
      ]);
      setPlatillos(platillosRes.data);
      setCategorias(categoriasRes.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoPlatillo({
      ...nuevoPlatillo,
      [name]: name === 'precio' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await agregarPlatillo(nuevoPlatillo);
      setNuevoPlatillo({
        nombre_platillo: '',
        descripcion: '',
        precio: 0,
        id_categoria: '',
        estado: 1,
        imagen_url: ''
      });
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarPlatillo(id);
      cargarDatos();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="platillo-container">
      <h2>Gestión de Platillos</h2>
      
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="nombre_platillo"
            value={nuevoPlatillo.nombre_platillo}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={nuevoPlatillo.descripcion}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Precio:</label>
          <input
            type="number"
            name="precio"
            value={nuevoPlatillo.precio}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            required
          />
        </div>
        <div>
          <label>Categoría:</label>
          <select
            name="id_categoria"
            value={nuevoPlatillo.id_categoria}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map(cat => (
              <option key={cat.id_categoria} value={cat.id_categoria}>
                {cat.nombre_categoria}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Estado:</label>
          <select
            name="estado"
            value={nuevoPlatillo.estado}
            onChange={handleInputChange}
          >
            <option value={1}>Activo</option>
            <option value={0}>Inactivo</option>
          </select>
        </div>
        <div>
          <label>URL de Imagen:</label>
          <input
            type="text"
            name="imagen_url"
            value={nuevoPlatillo.imagen_url}
            onChange={handleInputChange}
          />
        </div>
        <button type="submit">Agregar Platillo</button>
      </form>

      <div className="lista-platillos">
        <h3>Lista de Platillos</h3>
        <ul>
          {platillos.map(plat => (
            <li key={plat.id_platillo}>
              <div>
                <strong>{plat.nombre_platillo}</strong>
                <p>{plat.descripcion}</p>
                <p>Precio: ${plat.precio.toFixed(2)}</p>
                <p>Categoría: {categorias.find(c => c.id_categoria === plat.id_categoria)?.nombre_categoria}</p>
                <p>Estado: {plat.estado ? 'Activo' : 'Inactivo'}</p>
                {plat.imagen_url && <img src={plat.imagen_url} alt={plat.nombre_platillo} width="100" />}
              </div>
              <button onClick={() => handleEliminar(plat.id_platillo)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}