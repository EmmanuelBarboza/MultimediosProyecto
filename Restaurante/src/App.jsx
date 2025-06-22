import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import IngredientePage from './components/ingrediente/IngredientePage';
import Categoria from './components/categoria/CategoriaPage';
import Platillo from './components/platillo/PlatilloPage';

function App() {
  return (
    <div>
      
      <Categoria/>
      <Platillo/>
    </div>
  );
}

export default App
