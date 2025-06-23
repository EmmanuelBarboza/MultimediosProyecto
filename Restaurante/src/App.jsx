import React from 'react'; 
import './App.css'; 

import { Routes, Route, Link, NavLink } from 'react-router-dom';

// Importar los componentes de página
import UsuarioPage from './components/usuario/UsuarioPage';
import CategoriaPage from './components/categoria/CategoriaPage';
import IngredientePage from './components/ingrediente/IngredientePage';

function App() {
  return (
    <div>
      {/* Navbar de Bootstrap */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          {/* Usa Link para navegación interna */}
          <Link className="navbar-brand" to="/">Mi Restaurante Admin</Link> 
          
          {/* Botón para colapsar el menú en móviles  */}
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
            aria-controls="navbarNav" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Contenido del menú colapsable */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {/* NavLink para enlaces de navegación con clase 'active' */}
              <li className="nav-item">
                <NavLink 
                  className={({ isActive }) => 
                    isActive ? "nav-link active" : "nav-link"
                  } 
                  to="/usuarios"
                >
                  Usuarios
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  className={({ isActive }) => 
                    isActive ? "nav-link active" : "nav-link"
                  } 
                  to="/categorias"
                >
                  Categorías
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink 
                  className={({ isActive }) => 
                    isActive ? "nav-link active" : "nav-link"
                  } 
                  to="/ingredientes"
                >
                  Ingredientes
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Contenedor principal donde se renderizará el componente de la ruta actual */}
      <main className="container mt-4">
        {/* Aquí defines tus rutas */}
        <Routes>
          {/* Ruta por defecto para la URL raíz */}
          <Route path="/" element={<UsuarioPage />} /> 
          {/* Rutas específicas para cada sección */}
          <Route path="/usuarios" element={<UsuarioPage />} />
          <Route path="/categorias" element={<CategoriaPage />} />
          <Route path="/ingredientes" element={<IngredientePage />} />
          {/* Ruta 404 (para URLs no coincidentes) */}
          <Route path="*" element={
            <div className="alert alert-warning text-center" role="alert">
              <h1>404: Página no encontrada</h1>
              <p>Lo sentimos, la dirección a la que intentas acceder no existe.</p>
              <Link to="/" className="btn btn-primary mt-3">Volver a Inicio</Link>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
}

export default App;