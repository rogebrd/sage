import React, { useState } from 'react';
import './styles/App.scss';
import './styles/svg.scss';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';

export const App = () => {
  const [page, setPage] = useState("LOGIN");

  return (
    <>
      {
        (page === "LOGIN") ? (<LoginPage setPage={setPage} />) : null
      }
      {
        (page === "HOME") ? (<HomePage />) : null
      }
    </>
  );
}

export default App;
