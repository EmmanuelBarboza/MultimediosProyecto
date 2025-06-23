import React from 'react'; 
import './App.css'; 
import { Routes, Route, Link, NavLink } from 'react-router-dom';

// Importar los componentes de página
import UsuarioPage from './components/usuario/UsuarioPage';
import CategoriaPage from './components/categoria/CategoriaPage';
import IngredientePage from './components/ingrediente/IngredientePage';
import PlatilloPage from './components/platillo/PlatilloPage';

function App() {
  return (
    <div className="restaurante-theme">
      {/* Navbar con tema de restaurante */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-danger shadow-sm">
        <div className="container">
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <span className="logo-icon me-2">🍽️</span>
            <span className="fw-bold">Sabores del Chef</span>
          </Link> 
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav" 
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item mx-1">
                <NavLink 
                  className={({ isActive }) => 
                    isActive ? "nav-link active fw-bold" : "nav-link"
                  } 
                  to="/platillos"
                >
                  <span className="nav-icon">🍲</span> Menú
                </NavLink>
              </li>
              <li className="nav-item mx-1">
                <NavLink 
                  className={({ isActive }) => 
                    isActive ? "nav-link active fw-bold" : "nav-link"
                  } 
                  to="/categorias"
                >
                  <span className="nav-icon">📋</span> Categorías
                </NavLink>
              </li>
              <li className="nav-item mx-1">
                <NavLink 
                  className={({ isActive }) => 
                    isActive ? "nav-link active fw-bold" : "nav-link"
                  } 
                  to="/ingredientes"
                >
                  <span className="nav-icon">🥕</span> Ingredientes
                </NavLink>
              </li>
              <li className="nav-item mx-1">
                <NavLink 
                  className={({ isActive }) => 
                    isActive ? "nav-link active fw-bold" : "nav-link"
                  } 
                  to="/usuarios"
                >
                  <span className="nav-icon">👨‍🍳</span> Personal
                </NavLink>
              </li>
            </ul>
            
            <div className="d-flex">
              <button className="btn btn-outline-light btn-sm">
                <span className="me-1">🛒</span> Órdenes
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container my-4">
        <div className="bg-white rounded-3 shadow-sm p-4">
          <Routes>
            <Route path="/" element={<PlatilloPage />} /> 
            <Route path="/usuarios" element={<UsuarioPage />} />
            <Route path="/categorias" element={<CategoriaPage />} />
            <Route path="/ingredientes" element={<IngredientePage />} />
            <Route path="/platillos" element={<PlatilloPage />} />
            <Route path="*" element={
              <div className="text-center py-5">
                <h1 className="display-1 text-danger">404</h1>
                <h2 className="mb-4">Página no encontrada</h2>
                <p className="lead">El platillo que buscas no está en nuestro menú</p>
                <Link to="/" className="btn btn-danger mt-3 px-4">
                  Volver al Menú Principal
                </Link>
              </div>
            } />
          </Routes>
        </div>
      </main>

      <footer className="bg-dark text-white py-4 mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h5 className="fw-bold mb-3">🍽️ Sabores del Chef</h5>
              <p className="small">Administración del restaurante</p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="small mb-0">
                © {new Date().getFullYear()} Todos los derechos reservados
              </p>
              <p className="small mb-0">
                <a href="#!" className="text-white-50">Términos y condiciones</a> | 
                <a href="#!" className="text-white-50 ms-2">Contacto</a>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;