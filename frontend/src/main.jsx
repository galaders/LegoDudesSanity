// React og ReactDOM import
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Hovedkomponenten for appen
import App from './App.jsx'

// BrowserRouter fra react-router for klient-side routing
import { BrowserRouter } from 'react-router-dom'

// Finn root-elementet i HTML og mount React-appen der
createRoot(document.getElementById('root')).render(
  /*
    BrowserRouter pakker App slik at react-router fungerer.
    Hvis du vil bruke StrictMode for ekstra utviklingssjekker,
    kan du wrappe BrowserRouter med <StrictMode> her.
  */
  <BrowserRouter>
    <App />
  </BrowserRouter>,
)
