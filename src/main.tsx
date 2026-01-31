import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PortfolioPage from './App';
import DetailingHubPage from './pages/DetailingHubPage';
import DentalEcosystemPage from './pages/DentalEcosystemPage';
import BarbershopGridPage from './pages/BarbershopGridPage';
import Layout from './components/Layout';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<PortfolioPage />} />
          <Route path="detailing-hub" element={<DetailingHubPage />} />
          <Route path="dental-ecosystem" element={<DentalEcosystemPage />} />
          <Route path="barbershop-grid" element={<BarbershopGridPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);